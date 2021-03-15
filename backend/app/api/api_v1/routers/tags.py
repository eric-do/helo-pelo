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
    get_tag_counts
)

tags_router = r = APIRouter()

@r.get(
    "/",
    status_code=200
)
async def get_tags(
    db=Depends(get_db),
    query: str = '',
    limit: int = 10
):
    return get_tag_counts(db, query, limit)