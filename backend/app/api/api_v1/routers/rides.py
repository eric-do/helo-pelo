from fastapi import (
    APIRouter,
    Request,
    Depends,
    Response,
    HTTPException,
    encoders,
    status
)
import typing as t
from app.db.session import get_db
from app.db.crud import (
    get_rides_from_peloton,
    add_rides_from_peloton,
    create_ride,
    read_ride,
    get_rides as get_all_rides,
    add_comment_to_ride,
    add_multiple_tags_to_ride
)
from app.db.schemas import (
    RideIn,
    RideOut,
    RideDB,
    CommentIn,
    CommentOut
)
from app.db.helpers import parse_tags_from_text
from app.core.auth import get_current_active_user, get_current_active_superuser
from datetime import datetime

rides_router = r = APIRouter()

@r.post(
    "/init",
    response_model_exclude_none=True,
    status_code=status.HTTP_201_CREATED
)
async def initialize_rides(
    response: Response,
    limit: int = 10,
    db=Depends(get_db),
    current_user=Depends(get_current_active_superuser),
):
    """
    Insert rides from Peloton to DB. Must be a superuser.
    """
    try:
        rides = get_rides_from_peloton(limit)
        add_rides_from_peloton(db, rides)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=404, detail="Error initializing data")

@r.post(
    "/",
    response_model=RideOut,
    response_model_exclude_none=True,
    status_code=status.HTTP_201_CREATED
)
async def add_ride(
    response: Response,
    ride: RideIn,
    current_user=Depends(get_current_active_user),
    db=Depends(get_db)
):
    ride = create_ride(db, ride)
    ride.original_air_time = ride.original_air_time.timestamp()
    ride.scheduled_start_time = ride.scheduled_start_time.timestamp()
    return ride

@r.get(
    "/",
    response_model=t.List[RideDB],
    response_model_exclude_none=True,
    status_code=200
)
async def get_rides(
    response: Response,
    limit: int=100,
    skip: int=0,
    db=Depends(get_db)
):
    return get_all_rides(db, limit=limit, skip=skip)

@r.get(
    "/{ride_id}",
    response_model=RideOut,
    status_code=200
)
async def get_ride(
    response: Response,
    ride_id: int,
    db=Depends(get_db),
    response_model=RideOut
):
    ride = read_ride(db, ride_id)
    ride.original_air_time = ride.original_air_time.timestamp()
    ride.scheduled_start_time = ride.scheduled_start_time.timestamp()
    return ride

@r.post(
    "/{ride_id}/comments",
    response_model=CommentOut
)
async def create_comment(
    response: Response,
    comment: CommentIn,
    ride_id: int,
    current_user=Depends(get_current_active_user),
    db=Depends(get_db),
):
    comment = add_comment_to_ride(db, comment, ride_id, current_user)
    tags = parse_tags_from_text(comment.comment)
    add_multiple_tags_to_ride(db, tags, ride_id, current_user)
    return comment
