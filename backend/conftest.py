import pytest
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from sqlalchemy_utils import database_exists, create_database, drop_database
from fastapi.testclient import TestClient
import typing as t

from app.core import config, security
from app.db.session import Base, get_db
from app.db import models
from app.main import app


def get_test_db_url() -> str:
    return f"{config.SQLALCHEMY_DATABASE_URI}_test"


@pytest.fixture
def test_db():
    """
    Modify the db session to automatically roll back after each test.
    This is to avoid tests affecting the database state of other tests.
    """
    # Connect to the test database
    engine = create_engine(
        get_test_db_url(),
    )

    connection = engine.connect()
    trans = connection.begin()

    # Run a parent transaction that can roll back all changes
    test_session_maker = sessionmaker(
        autocommit=False, autoflush=False, bind=engine
    )
    test_session = test_session_maker()
    test_session.begin_nested()

    @event.listens_for(test_session, "after_transaction_end")
    def restart_savepoint(s, transaction):
        if transaction.nested and not transaction._parent.nested:
            s.expire_all()
            s.begin_nested()

    yield test_session

    # Roll back the parent transaction after the test is complete
    test_session.close()
    trans.rollback()
    connection.close()


@pytest.fixture(scope="session", autouse=True)
def create_test_db():
    """
    Create a test database and use it for the whole test session.
    """

    test_db_url = get_test_db_url()

    # Create the test database
    assert not database_exists(
        test_db_url
    ), "Test database already exists. Aborting tests."
    create_database(test_db_url)
    test_engine = create_engine(test_db_url)
    Base.metadata.create_all(test_engine)

    # Run the tests
    yield

    # Drop the test database
    drop_database(test_db_url)


@pytest.fixture
def client(test_db):
    """
    Get a TestClient instance that reads/write to the test database.
    """

    def get_test_db():
        yield test_db

    app.dependency_overrides[get_db] = get_test_db

    yield TestClient(app)


@pytest.fixture
def test_password() -> str:
    return "securepassword"


def get_password_hash() -> str:
    """
    Password hashing can be expensive so a mock will be much faster
    """
    return "supersecrethash"


@pytest.fixture
def test_user(test_db) -> models.User:
    """
    Make a test user in the database
    """

    user = models.User(
        email="fake@email.com",
        hashed_password=get_password_hash(),
        is_active=True,
    )
    test_db.add(user)
    test_db.commit()
    return user


@pytest.fixture
def test_superuser(test_db) -> models.User:
    """
    Superuser for testing
    """

    user = models.User(
        email="fakeadmin@email.com",
        username="test_user",
        hashed_password=get_password_hash(),
        is_superuser=True,
    )
    test_db.add(user)
    test_db.commit()
    return user


@pytest.fixture
def test_profile(test_db, test_user) -> models.UserProfile:
    """
    User profile for testing
    """
    profile = models.UserProfile(
        user_id=test_user.id,
        reddit_handle="reddit_test_handle",
        peloton_handle="peloton_test_handle",
        location="Fremont, CA",
        avatar="http://path.to.test/image.png",
        bio = "This is a short test bio about this test user"
    )
    test_db.add(profile)
    test_db.commit()
    return profile


@pytest.fixture
def test_ride(test_db) -> models.Ride:
    """
    Ride for testing
    """

    ride = models.Ride(
        ride_id = "TestRide123",
        description = "Test description",
        difficulty_estimate = 9.9,
        duration = 180,
        fitness_discipline_display_name = "Cycling",
        image_url = "http://testdomain.com/image.png",
        instructor_id = "Instructor1234",
        title = "90 minutes of hell",
        original_air_time = "2021-03-04 02:31:48",
        scheduled_start_time = "2021-03-04 02:31:48"
    )
    test_db.add(ride)
    test_db.commit()
    return ride


@pytest.fixture
def test_comment(
    test_db,
    test_ride,
    test_user,
) -> models.Comment:
    comment_db = models.Comment(
        comment = "This is a #test comment with #awesome tags",
        ride_id = test_ride.id,
        user_id = test_user.id
    )
    test_db.add(comment_db)
    test_db.commit()
    test_db.refresh(comment_db)
    return comment_db

def verify_password_mock(first: str, second: str) -> bool:
    return True


@pytest.fixture
def user_token_headers(
    client: TestClient, test_user, test_password, monkeypatch
) -> t.Dict[str, str]:
    monkeypatch.setattr(security, "verify_password", verify_password_mock)

    login_data = {
        "username": test_user.email,
        "password": test_password,
    }
    r = client.post("/api/token", data=login_data)
    tokens = r.json()
    a_token = tokens["access_token"]
    headers = {"Authorization": f"Bearer {a_token}"}
    return headers


@pytest.fixture
def superuser_token_headers(
    client: TestClient, test_superuser, test_password, monkeypatch
) -> t.Dict[str, str]:
    monkeypatch.setattr(security, "verify_password", verify_password_mock)

    login_data = {
        "username": test_superuser.email,
        "password": test_password,
    }
    r = client.post("/api/token", data=login_data)
    tokens = r.json()
    a_token = tokens["access_token"]
    headers = {"Authorization": f"Bearer {a_token}"}
    return headers
