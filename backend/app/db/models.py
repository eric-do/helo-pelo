from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    String,
    Float,
    ForeignKey,
    DateTime,
    Table
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .session import Base

# ride_tag_association_table = Table('ride_tags', Base.metadata,
#     Column('ride_id', Integer, ForeignKey('ride.id')),
#     Column('tag_id', Integer, ForeignKey('tag.id'))
# )

class RideTagAssociation(Base):
    __tablename__ = 'ride_tag'

    ride_id = Column(Integer, ForeignKey('ride.id'), primary_key=True)
    tag_id = Column(Integer, ForeignKey('tag.id'), primary_key=True)
    tag_count = Column(Integer, default=1)
    ride = relationship("Ride", back_populates="tags")
    tag = relationship("Tag", back_populates="rides")


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    comments = relationship("Comment", back_populates="user")


class Instructor(Base):
    __tablename__ = "instructor"

    id = Column(Integer, primary_key=True, index=True)
    instructor_id = Column(String, index=True, unique=True)
    bio = Column(String)
    short_bio = Column(String)
    background = Column(String)
    username = Column(String)
    name = Column(String)
    first_name = Column(String)
    last_name = Column(String)
    user_id = Column(String)
    life_style_image_url = Column(String)
    image_url = Column(String)
    instructor_hero_image_url = Column(String)


class Comment(Base):
    __tablename__ = "comment"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=func.now())
    comment = Column(String)
    ride_id = Column(Integer, ForeignKey('ride.id'))
    ride = relationship("Ride", back_populates="comments")
    user_id = Column(Integer, ForeignKey('user.id'))
    user = relationship("User", back_populates="comments")


class Ride(Base):
    __tablename__ = "ride"

    id = Column(Integer, primary_key=True, index=True)
    ride_id = Column(String, index=True, unique=True)
    description = Column(String)
    difficulty_estimate = Column(Float)
    duration = Column(Integer)
    fitness_discipline_display_name = Column(String)
    image_url = Column(String)
    instructor_id = Column(String)
    title = Column(String)
    original_air_time = Column(DateTime)
    scheduled_start_time = Column(DateTime)
    comments = relationship(
        "Comment",
        back_populates="ride",
        order_by=Comment.created_at.desc()
    )
    tags = relationship(
        "RideTagAssociation",
        back_populates="ride",
        order_by=RideTagAssociation.tag_count.desc()
    )


class Tag(Base):
    __tablename__ = "tag"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, unique=True)
    rides = relationship(
        "RideTagAssociation",
        back_populates="tag"
    )

