# backend/test_main.py
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_sales_reps():
    response = client.get("/api/sales-reps")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_ai_endpoint():
    response = client.post("/api/ai", json={"question": "What is the weather today?"})
    assert response.status_code == 200
    assert "answer" in response.json()

def test_ai_endpoint_no_question():
    response = client.post("/api/ai", json={})
    assert response.status_code == 400
    assert response.json() == {"detail": "Question is required"}