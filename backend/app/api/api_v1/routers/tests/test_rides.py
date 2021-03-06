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


def test_initialize_peloton_rides(client, superuser_token_headers):
    response = client.post(
        "/api/v1/rides/init",
        headers=superuser_token_headers
    )
    assert response.status_code == 201


def test_successfully_add_ride_with_valid_data(
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


def test_unsuccessfully_add_ride_with_invalid_data(
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


def test_successfully_add_valid_comment_with_tags(
    client,
    test_user,
    test_ride,
    user_token_headers
):
    original_tag_count = len(test_ride.tags)
    comment = { "comment": "test comment #wow #awesome" }
    comment_response = client.post(
        f"/api/v1/rides/{test_ride.id}/comments",
        json=comment,
        headers=user_token_headers
    )
    comment_db = comment_response.json()
    assert comment_response.status_code == 200
    assert comment['comment'] == comment_db['comment']
    assert comment_db['user_id'] == test_user.id
    assert test_ride.comments[0].comment == comment['comment']
    assert len(test_ride.tags) == original_tag_count + 2


def test_get_ride(
    client,
    test_ride,
    test_comment
):
    response = client.get(f"/api/v1/rides/{test_ride.id}")
    ride = response.json()
    test_ride_as_dict = vars(test_ride)
    for key in ride:
        assert ride[key] == test_ride_as_dict[key]
    assert ride["tags"] == test_ride.tags