from app.db import models


def test_get_users(client, test_superuser, superuser_token_headers):
    response = client.get("/api/v1/users", headers=superuser_token_headers)
    assert response.status_code == 200
    assert response.json() == [
        {
            "id": test_superuser.id,
            "username": test_superuser.username,
            "email": test_superuser.email,
            "is_active": test_superuser.is_active,
            "is_superuser": test_superuser.is_superuser,
        }
    ]


def test_delete_user(client, test_superuser, test_db, superuser_token_headers):
    response = client.delete(
        f"/api/v1/users/{test_superuser.id}", headers=superuser_token_headers
    )
    assert response.status_code == 200
    assert test_db.query(models.User).all() == []


def test_delete_user_not_found(client, superuser_token_headers):
    response = client.delete(
        "/api/v1/users/4321", headers=superuser_token_headers
    )
    assert response.status_code == 404


def test_edit_user(client, test_superuser, superuser_token_headers):
    new_user = {
        "email": "newemail@email.com",
        "is_active": False,
        "is_superuser": True,
        "username": "joe_user",
        "password": "new_password",
    }

    response = client.put(
        f"/api/v1/users/{test_superuser.id}",
        json=new_user,
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    new_user["id"] = test_superuser.id
    new_user.pop("password")
    assert response.json() == new_user


def test_edit_user_not_found(client, test_db, superuser_token_headers):
    new_user = {
        "email": "newemail@email.com",
        "is_active": False,
        "is_superuser": False,
        "password": "new_password",
    }
    response = client.put(
        "/api/v1/users/1234", json=new_user, headers=superuser_token_headers
    )
    assert response.status_code == 404


def test_get_user(
    client,
    test_user,
    superuser_token_headers,
):
    response = client.get(
        f"/api/v1/users/{test_user.id}", headers=superuser_token_headers
    )
    assert response.status_code == 200
    assert response.json() == {
        "id": test_user.id,
        "email": test_user.email,
        "is_active": bool(test_user.is_active),
        "is_superuser": test_user.is_superuser,
    }


def test_user_not_found(client, superuser_token_headers):
    response = client.get("/api/v1/users/123", headers=superuser_token_headers)
    assert response.status_code == 404


def test_authenticated_user_me(client, user_token_headers):
    response = client.get("/api/v1/users/me", headers=user_token_headers)
    assert response.status_code == 200


def test_unauthenticated_routes(client):
    response = client.get("/api/v1/users/me")
    assert response.status_code == 401
    response = client.get("/api/v1/users")
    assert response.status_code == 401
    response = client.get("/api/v1/users/123")
    assert response.status_code == 401
    response = client.put("/api/v1/users/123")
    assert response.status_code == 401
    response = client.delete("/api/v1/users/123")
    assert response.status_code == 401


def test_unauthorized_routes(client, user_token_headers):
    response = client.get("/api/v1/users", headers=user_token_headers)
    assert response.status_code == 403
    response = client.get("/api/v1/users/123", headers=user_token_headers)
    assert response.status_code == 403


def test_get_user_profile(client, test_user, test_profile):
    profile_attributes = [
        "user_id",
        "reddit_handle",
        "peloton_handle",
        "location",
        "avatar",
        "bio"
    ]

    response = client.get(f"/api/v1/users/{test_user.id}/profile")
    assert response.status_code == 200

    profile = response.json()
    for attribute in profile_attributes:
        assert attribute in profile


def test_update_user_profile(
    client,
    test_user,
    test_profile,
    user_token_headers):

    profile = dict(
        reddit_handle="reddit_update",
        location="Fremont, CA",
        avatar="http://path.to.test/image_update.png",
        bio = "This is a short test that has been changed"
    )

    response = client.put(
        f"/api/v1/users/{test_user.id}/profile",
        json=profile,
        headers=user_token_headers
    )
    assert response.status_code == 200

    response = client.get(f"/api/v1/users/{test_user.id}/profile")
    updated_profile = response.json()
    print(updated_profile)
    for key in profile:
        assert profile[key] == updated_profile[key]


def test_userid_and_current_user_must_match(
    client,
    test_user,
    user_token_headers
):
    profile = dict(
        reddit_handle="test_attribute",
    )

    response = client.put(
        f"/api/v1/users/{test_user.id + 1}/profile",
        json=profile,
        headers=user_token_headers
    )

    assert response.status_code == 401