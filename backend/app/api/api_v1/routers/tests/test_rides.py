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

valid_ride_first = {
    "description": "This is a test description",
    "difficulty_estimate": 9.9,
    "duration": 180,
    "fitness_discipline_display_name": "Cycling",
    "image_url": "http://testdomain.com/image.png",
    "instructor_id": "234TestID",
    "title": "90 Hours of Hell",
    "original_air_time": 252352333,
    "scheduled_start_time": 23525211
}

valid_ride_second = {
    "description": "This is a test description",
    "difficulty_estimate": 9.9,
    "duration": 180,
    "fitness_discipline_display_name": "Strength",
    "image_url": "http://testdomain.com/image.png",
    "instructor_id": "234TestID",
    "title": "90 Hours of Hell",
    "original_air_time": 252352355,
    "scheduled_start_time": 23525211
}

valid_ride_third = {
    "description": "This is a test description",
    "difficulty_estimate": 9.9,
    "duration": 180,
    "fitness_discipline_display_name": "Yoga",
    "image_url": "http://testdomain.com/image.png",
    "instructor_id": "234TestID",
    "title": "90 Hours of Hell",
    "original_air_time": 252352300,
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


# def test_initialize_peloton_rides(client, superuser_token_headers):
#     response = client.post(
#         "/api/v1/rides/init",
#         headers=superuser_token_headers
#     )
#     assert response.status_code == 201


def test_get_rides(client, test_ride):
    response = client.get("/api/v1/rides/")
    rides = response.json()
    first_ride = rides[0]
    assert len(rides) > 0
    assert "description" in first_ride
    assert "difficulty_estimate" in first_ride
    assert "image_url" in first_ride
    assert "title" in first_ride
    assert "original_air_time" in first_ride
    assert "scheduled_start_time" in first_ride


def test_successfully_add_ride_with_valid_data(
    client,
    superuser_token_headers
):
    global valid_ride
    response = client.post(
        f"/api/v1/rides/",
        json=valid_ride,
        headers=superuser_token_headers
    )
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


def test_get_ride(
    client,
    test_ride,
    test_comment
):
    response = client.get(f"/api/v1/rides/{test_ride.id}")
    ride = response.json()
    assert ride["description"] == test_ride.description
    assert ride["title"] == test_ride.title
    assert ride["image_url"] == test_ride.image_url
    assert ride["tags"] == test_ride.tags


def test_successfully_add_valid_comment_with_tags(
    client,
    test_user,
    test_ride,
    user_token_headers
):
    original_tag_count = len(test_ride.tags)
    comment = { "comment": "test comment #wow #awesome" }
    post_response = client.post(
        f"/api/v1/rides/{test_ride.id}/comments",
        json=comment,
        headers=user_token_headers
    )
    get_response = client.get(
        f"/api/v1/rides/{test_ride.id}"
    )

    ride_db=get_response.json()
    comment_db = post_response.json()
    assert post_response.status_code == 200
    assert comment['comment'] == comment_db['comment']
    assert comment_db['user_id'] == test_user.id
    assert ride_db["comments"][0]["comment"] == comment['comment']
    assert len(ride_db["tags"]) == original_tag_count + 2
    assert next((t for t in ride_db["tags"] if t["tag"]["name"] == "wow"), None) is not None
    assert next((t for t in ride_db["tags"] if t["tag"]["name"] == "awesome"), None) is not None


def test_successfully_add_comment_with_duplicate_tags(
    client,
    test_user,
    test_ride,
    user_token_headers
):
    original_tag_count = len(test_ride.tags)
    comment = { "comment": "test comment #duplicate #duplicate" }
    comment_response = client.post(
        f"/api/v1/rides/{test_ride.id}/comments",
        json=comment,
        headers=user_token_headers
    )
    comment_db = comment_response.json()
    assert len(test_ride.tags) == original_tag_count + 1


def test_increment_tag_count_for_existing_tags(
    client,
    test_user,
    test_ride, # update with a ride with tags
    user_token_headers
):
    pass

