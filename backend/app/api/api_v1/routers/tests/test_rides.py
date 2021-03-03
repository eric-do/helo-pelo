def test_get_peloton_rides(client, superuser_token_headers):
    response = client.get(
        "/api/v1/rides/init",
        headers=superuser_token_headers
    )
    rides = response.json()
    assert response.status_code == 200
    assert len(rides) == 10

def test_add_ride(
    client,
    test_superuser,
    superuser_token_headers
):
    ride = {
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

    response = client.post(
        f"/api/v1/rides/",
        json=ride,
        headers=superuser_token_headers
    )
    print(response)
    assert response.status_code == 201

def test_add_comment(
    client,
    test_user,
    user_token_headers
):
    comment = { "comment": "test comment" }

    response = client.post(
        f"/api/v1/rides/1/comment",
        json=comment,
        headers=user_token_headers
    )

    assert response.status_code == 200
    assert comment["comment"] == response.comment