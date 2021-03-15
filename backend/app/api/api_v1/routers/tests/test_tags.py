from app.db import models

def test_get_tag_counts(client, test_db):
    response = client.get(f"/api/v1/tags/?query=te")
    tags = response.json()
    assert response.status_code == 200

    tags = [
        models.Tag(name="test"),
        models.Tag(name="tent")
    ]