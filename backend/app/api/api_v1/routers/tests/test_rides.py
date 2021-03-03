def test_get_peloton_rides(client):
    response = client.get("/api/v1/rides/init")
    rides = response.json()
    assert response.status_code == 200
    assert len(rides) == 10
