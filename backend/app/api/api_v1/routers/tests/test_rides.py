from datetime import datetime, timedelta

valid_ride = {
    "description": "This is a test description",
    "difficulty_estimate": 9.9,
    "duration": 180,
    "fitness_discipline_display_name": "Cycling",
    "image_url": "http://testdomain.com/image.png",
    "instructor_id": "234TestID",
    "title": "90 Hours of Hell",
    "original_air_time": 252352353,
    "scheduled_start_time": 23525211
}

invalid_ride = {
    "description": "This is a test description",
    "difficulty_estimate": 9.9,
    "duration": 180,
    "fitness_discipline_display_name": "Cycling",
    "image_url": "http://testdomain.com/image.png",
    "instructor_id": "234TestID",
    "original_air_time": 252352353,
    "scheduled_start_time": 23525211
}


def test_init_peloton_rides(client, superuser_token_headers):
    response = client.post(
        "/api/v1/rides/init",
        headers=superuser_token_headers
    )
    assert response.status_code == 201


def test_add_ride_with_valid_data(
    client,
    test_superuser,
    superuser_token_headers
):
    global valid_ride
    response = client.post(
        f"/api/v1/rides/",
        json=valid_ride,
        headers=superuser_token_headers
    )
    ride_db = response.json()
    assert response.status_code == 201


def test_add_ride_with_invalid_data(
    client,
    test_superuser,
    superuser_token_headers
):
    global invalid_ride
    response = client.post(
        f"/api/v1/rides/",
        json=invalid_ride,
        headers=superuser_token_headers
    )
    assert response.status_code == 422


def test_add_comment(
    client,
    test_user,
    test_ride,
    user_token_headers
):
    global valid_ride
    comment = { "comment": "test comment #wow #awesome" }
    comment_response = client.post(
        f"/api/v1/rides/{test_ride.id}/comment",
        json=comment,
        headers=user_token_headers
    )
    comment_db = comment_response.json()
    assert comment_response.status_code == 200
    assert comment['comment'] == comment_db['comment']
    assert comment_db['user_id'] == test_user.id