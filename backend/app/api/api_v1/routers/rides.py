from fastapi import (
    APIRouter,
    Request,
    Depends,
    Response,
    HTTPException,
    encoders
)
import typing as t

from app.db.session import get_db
from app.db.crud import (
    get_rides_from_peloton,
    add_rides_from_peloton
)
from app.db.schemas import Ride
from app.core.auth import get_current_active_user, get_current_active_superuser

rides_router = r = APIRouter()


@r.get(
    "/init",
    response_model=t.List[Ride],
    response_model_exclude_none=True,
)
async def initialize_rides(
    response: Response,
    limit: int = 10,
    db=Depends(get_db)
    # current_user=Depends(get_current_active_superuser),
):
    """
    Get rides from Peloton
    """
    try:
        rides = get_rides_from_peloton(limit)
        add_rides_from_peloton(db, rides)
        return rides
    except:
        raise HTTPException(status_code=404, detail="Error initializing data")
