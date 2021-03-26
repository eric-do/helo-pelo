from pydantic import BaseModel
import typing as t
from datetime import datetime

class UserBase(BaseModel):
    email: str
    is_active: bool = True
    is_superuser: bool = False
    username: str = None


class UserOut(UserBase):
    id: int

    class Config:
        orm_mode = True


class UserCreate(UserBase):
    password: str

    class Config:
        orm_mode = True


class UserEdit(UserBase):
    password: t.Optional[str] = None

    class Config:
        orm_mode = True


class User(UserBase):
    id: int

    class Config:
        orm_mode = True


class UserProfile(BaseModel):
    user_id: int
    reddit_handle: str = None
    peloton_handle: str = None
    location: str = None
    avatar: str = None
    bio: str = None

    class Config:
        orm_mode = True


class UserProfileEdit(BaseModel):
    reddit_handle: str = None
    peloton_handle: str = None
    location: str = None
    avatar: str = None
    bio: str = None


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str = None
    permissions: str = "user"


class Tag(BaseModel):
    name: str
    tag_count: int = 0
    class Config:
        orm_mode = True


class RideTagAssociation(BaseModel):
    tag_id: int
    ride_id: int
    tag: Tag

    class Config:
        orm_mode = True


class CommentIn(BaseModel):
    comment: str


class CommentOut(CommentIn):
    id: int
    created_at: datetime
    comment: str
    user: UserOut

    class Config:
        orm_mode = True


class Ride(BaseModel):
    description: str
    ride_id: str = None
    difficulty_estimate: float
    duration: int
    fitness_discipline_display_name: str
    image_url: str = None
    instructor_id: str
    title: str
    original_air_time: int = None
    scheduled_start_time: int = None


class RideIn(Ride):
    class Config:
        orm_mode = True


class RideOut(Ride):
    id: int
    comments: t.List[CommentOut]
    tags: t.List[RideTagAssociation]
    class Config:
        orm_mode = True


class RideDB(Ride):
    id: int
    original_air_time: datetime
    scheduled_start_time: datetime
    class Config:
        orm_mode = True
