# Backend for Sales Dashboard

This backend is built using FastAPI and serves as the API layer for the Sales Dashboard application. It provides endpoints to fetch sales representatives data and a basic AI endpoint.

## Endpoints

### GET /api/sales-reps

- **Description**: Returns a list of sales representatives.
- **Response**: JSON array of sales representatives.

### POST /api/ai

- **Description**: Accepts a user question and returns a placeholder AI response.
- **Request Body**: JSON object with a `question` field.
- **Response**: JSON object with an `answer` field.

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/<your-username>/<repo-name>.git
   cd <repo-name>/backend
   ```

2. **Create a Virtual Environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Server**:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

5. **Run Tests**:
   ```bash
   pytest test_main.py
   ```

## Dependencies

- FastAPI
- Uvicorn

## Notes

- Ensure the `dummyData.json` file is located in the `backend` directory.
- The AI endpoint currently returns a placeholder response. You can integrate a real AI model or service as needed.
