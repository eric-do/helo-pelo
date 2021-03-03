from fastapi import HTTPException, status
from sqlalchemy.orm import Session
import requests
import typing as t

from . import models, schemas
from app.core.security import get_password_hash

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
        first_name=user.first_name,
        last_name=user.last_name,
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
    rides: t.List[schemas.Ride]
):
    try:
        for ride in rides:
            ride_db = models.Ride(
                ride_id = ride['id'],
                description = ride['description'],
                difficulty_estimate = ride['difficulty_estimate'],
                duration = ride['duration'],
                fitness_discipline_display_name = ride['fitness_discipline_display_name'],
                image_url = ride['image_url'],
                instructor_id = ride['instructor_id'],
                title = ride['title'],
                original_air_time = ride['original_air_time'],
                scheduled_start_time = ride['scheduled_start_time']
            )
            db.merge(ride_db)
            db.commit()
    except Exception as e:
        print(e)
        db.rollback()
