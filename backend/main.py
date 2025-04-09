# backend/main.py
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from utils import load_dummy_data
from config import settings

app = FastAPI(
    title="Sales Dashboard API",
    description="API for managing sales data and AI interactions",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DUMMY_DATA = load_dummy_data(settings.data_file_path)

@app.get("/api/sales-reps", summary="Get Sales Representatives", response_description="List of sales representatives")
async def get_sales_reps():
    """
    Retrieve a list of sales representatives.

    This endpoint returns a list of sales representatives with their details
    such as deals, status, and client information.

    - **returns**: A list of sales representatives.
    """
    return DUMMY_DATA.get("salesReps", [])

@app.post("/api/ai", summary="AI Interaction", response_description="AI response to user question")
async def ai_endpoint(request: Request):
    """
    Interact with the AI endpoint.

    This endpoint accepts a user question and returns a placeholder AI response.

    - **request body**: JSON object with a `question` field.
    - **returns**: A JSON object with an `answer` field.
    """
    body = await request.json()
    user_question = body.get("question", "")
    if not user_question:
        raise HTTPException(status_code=400, detail="Question is required")
    return {"answer": f"This is a placeholder answer to your question: {user_question}"}