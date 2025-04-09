# backend/test_main.py
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from main import app
from config import settings

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_test_environment():
    """
    Set up the test environment by enabling debug mode.
    This fixture runs automatically before each test.
    """
    # Store the original debug value
    original_debug = settings.debug
    
    # Set debug to True for testing
    settings.debug = True
    
    # Run the test
    yield
    
    # Restore the original debug value after the test
    settings.debug = original_debug

def test_get_sales_reps():
    response = client.get("/api/sales-reps")
    assert response.status_code == 200
    data = response.json()
    assert "total_data" in data
    assert "total_page" in data
    assert "current_page" in data
    assert "page_size" in data
    assert "sales_reps" in data
    assert isinstance(data["sales_reps"], list)

def test_get_sales_reps_pagination():
    response = client.get("/api/sales-reps?page=1&page_size=5")
    assert response.status_code == 200
    data = response.json()
    assert data["current_page"] == 1
    assert data["page_size"] == 5
    assert len(data["sales_reps"]) <= 5

def test_get_sales_reps_filter_by_id():
    response = client.get("/api/sales-reps?id=1")
    assert response.status_code == 200
    data = response.json()
    assert all(rep["id"] == 1 for rep in data["sales_reps"])

def test_get_sales_reps_filter_by_name():
    response = client.get("/api/sales-reps?name=John")
    assert response.status_code == 200
    data = response.json()
    assert all("John" in rep["name"] for rep in data["sales_reps"])

def test_get_sales_reps_sort_by_name_desc():
    response = client.get("/api/sales-reps?sort_by=name&sort_order=desc")
    assert response.status_code == 200
    data = response.json()
    sales_reps = data["sales_reps"]
    assert sales_reps == sorted(sales_reps, key=lambda x: x["name"], reverse=True)

@patch("openai.OpenAI")
def test_ai_endpoint(mock_openai):
    # Set up the mock
    mock_client = MagicMock()
    mock_openai.return_value = mock_client
    
    # Mock the chat completions create method
    mock_completion = MagicMock()
    mock_client.chat.completions.create.return_value = mock_completion
    
    # Mock the response structure
    mock_choice = MagicMock()
    mock_choice.message.content = "This is a mock response from ChatGPT."
    mock_completion.choices = [mock_choice]
    
    # Make the request
    response = client.post("/api/ai", json={"question": "What is the weather today?"})
    
    # Assert the response
    assert response.status_code == 200
    assert "answer" in response.json()
    assert response.json()["answer"] == "This is a placeholder answer to your question: What is the weather today?"

def test_ai_endpoint_no_question():
    response = client.post("/api/ai", json={})
    assert response.status_code == 422