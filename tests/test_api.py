from fastapi.testclient import TestClient
from carswiper.main import app

client = TestClient(app)

def test_register():
    response = client.post("/register", json={
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "testpass"
    })
    assert response.status_code == 200 or response.status_code == 400

def test_login():
    response = client.post("/login", json={
        "username": "testuser",
        "password": "testpass"
    })
    assert response.status_code == 200

def test_add_car():
    # First, login or register to ensure the user exists
    client.post("/register", json={
        "username": "testuser2",
        "email": "testuser2@example.com",
        "password": "testpass"
    })
    response = client.post("/cars/add?username=testuser2", json={
        "make": "Honda",
        "model": "Civic",
        "year": 2000,
        "image_url": "https://example.com/civic.jpg",
        "description": "A reliable car."
    })
    assert response.status_code == 200