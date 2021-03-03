from pydantic import BaseModel
import typing as t


class UserBase(BaseModel):
    email: str
    is_active: bool = True
    is_superuser: bool = False
    username: str = None


class UserOut(UserBase):
    pass


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


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str = None
    permissions: str = "user"

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
    scheduled_start_time: int

class RideIn(Ride):
    pass


class RideOut(Ride):
    id: int

    class Config:
        orm_mode = True


class CommentIn(BaseModel):
    comment: str


class CommentOut(CommentIn):
    created_at: int
    username: str

    class Config:
        orm_mode = True

# class RideOut(Ride):
#     id: int
#     ride_id: str
#     comments: t.List[CommentOut]

#     class Config:
#         orm_mode = True