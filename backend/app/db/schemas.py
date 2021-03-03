from pydantic import BaseModel
import typing as t


class UserBase(BaseModel):
    email: str
    is_active: bool = True
    is_superuser: bool = False
    first_name: str = None
    last_name: str = None


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
    id: str
    description: str
    difficulty_estimate: float
    duration: int
    fitness_discipline_display_name: str
    image_url: str
    instructor_id: str
    title: str
    original_air_time: int
    scheduled_start_time: int

class RideOut(BaseModel):
    pass