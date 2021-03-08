from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import exists
import requests
import typing as t
from . import models, schemas, helpers
from app.core.security import get_password_hash
from datetime import datetime, timedelta
from time import time
from types import SimpleNamespace

def get_user(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def get_user_by_email(db: Session, email: str) -> schemas.UserBase:
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(
    db: Session, skip: int = 0, limit: int = 100
) -> t.List[schemas.UserOut]:
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        is_active=user.is_active,
        is_superuser=user.is_superuser,
        hashed_password=hashed_password,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def delete_user(db: Session, user_id: int):
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="User not found")
    db.delete(user)
    db.commit()
    return user


def edit_user(
    db: Session, user_id: int, user: schemas.UserEdit
) -> schemas.User:
    db_user = get_user(db, user_id)
    if not db_user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="User not found")
    update_data = user.dict(exclude_unset=True)

    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(user.password)
        del update_data["password"]

    for key, value in update_data.items():
        setattr(db_user, key, value)

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_rides_from_peloton(limit):
    try:
        rides = []
        rides_info = requests.get(f'https://api.onepeloton.com/api/v3/ride/live?limit={limit}')
        ride_metadata = rides_info.json().get('data')
        rides_details = [requests.get(f'https://api.onepeloton.com/api/ride/{ride["ride_id"]}/details') for ride in ride_metadata]
        rides = [ride.json().get('ride') for ride in rides_details]
    except:
        raise HTTPException(status_code=404, detail="Item not found")
    finally:
        return rides


def add_rides_from_peloton(
    db: Session,
    rides: t.List[schemas.RideIn]
):
    for ride in rides:
        create_ride(db, SimpleNamespace(**ride))


def create_ride(
    db: Session,
    ride: schemas.RideIn
):
    ride_db = models.Ride(
        description=ride.description,
        difficulty_estimate=ride.difficulty_estimate,
        duration=ride.duration,
        fitness_discipline_display_name=ride.fitness_discipline_display_name,
        image_url=ride.image_url,
        instructor_id=ride.instructor_id,
        title=ride.title,
        original_air_time=helpers.convert_epoch_to_datetime(ride.original_air_time),
        scheduled_start_time=helpers.convert_epoch_to_datetime(ride.scheduled_start_time)
    )
    db.add(ride_db)
    db.commit()
    db.refresh(ride_db)
    return ride_db


def read_ride(
    db: Session,
    ride_id: int
):
    ride = db.query(models.Ride).filter_by(id=ride_id).first()
    print(ride.comments)
    return ride


def add_comment_to_ride(
    db: Session,
    comment: schemas.CommentIn,
    ride_id: int,
    current_user: schemas.User
):

    comment_db = models.Comment(
        comment=comment.comment,
        ride_id=ride_id,
        user_id=current_user.id
    )
    db.add(comment_db)
    db.commit()
    db.refresh(comment_db)
    # comment_db.created_at = int(comment_db.created_at.timestamp())
    return comment_db


def add_multiple_tags_to_ride(
    db: Session,
    tags: t.List[str],
    ride_id: int,
    current_user: schemas.User
):
    unique_tags = set(tags)
    ride_db: schemas.Ride = db.query(models.Ride).filter(models.Ride.id == ride_id).first()
    for tag in unique_tags:
        existing_db_tag = db.query(models.Tag).filter(models.Tag.name == tag).first()
        if existing_db_tag:
            existing_ride_tag = next((t for t in ride_db.tags if t.tag.name == tag), None)
            if existing_ride_tag:
                _update_ride_tag_association(db, ride_db, existing_db_tag)
            else:
                _create_new_ride_tag_association(db, ride_db, existing_tag=existing_db_tag)
        else:
            _create_new_ride_tag_association(db, ride_db, tag_name=tag)


def _update_ride_tag_association(db, ride, tag) -> None:
    '''Update exisiting ride/tag association

    If a ride has already been tagged with a particular tag, the count of that
    tag associated with the ride is simply incremented.
    '''
    association = db.query(models.RideTagAssociation).filter_by(
        ride_id=ride.id,
        tag_id=tag.id
    ).first()
    association.tag_count = association.tag_count + 1
    db.commit()


def _create_new_ride_tag_association(db, ride, tag_name=None, existing_tag=None):
    '''Create a new ride/tag association

    If a tag exists in the DB, it's used in the new association. Otherwise a new DB tag
    is created and associated to the ride.
    '''
    association = models.RideTagAssociation()
    association.tag = existing_tag if existing_tag else models.Tag(name=tag_name)
    ride.tags.append(association)
    db.commit()