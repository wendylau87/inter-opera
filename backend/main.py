# backend/main.py
from fastapi import FastAPI, HTTPException, Request, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import openai
from utils import load_dummy_data
from config import settings
from pydantic import BaseModel

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

# Configure OpenAI client
client = openai.OpenAI(api_key=settings.openai_api_key)

DUMMY_DATA = load_dummy_data(settings.data_file_path)

class AIRequest(BaseModel):
    question: str

@app.get("/api/sales-reps", summary="Get Sales Representatives", response_description="List of sales representatives")
async def get_sales_reps(
    page: int = 1,
    page_size: int = 10,
    sort_by: str = "id",
    sort_order: str = "asc",
    id: Optional[int] = None,
    name: Optional[str] = None,
    role: Optional[str] = None,
    region: Optional[str] = None
):
    """
    Retrieve a list of sales representatives with pagination, filtering, and sorting.

    - **page**: Page number for pagination.
    - **page_size**: Number of items per page.
    - **sort_by**: Column to sort by (id, name, role, region).
    - **sort_order**: Sort order (asc or desc).
    - **id**: Filter by sales rep ID.
    - **name**: Filter by sales rep name.
    - **role**: Filter by sales rep role.
    - **region**: Filter by sales rep region.
    """
    sales_reps = DUMMY_DATA.get("salesReps", [])

    # Filtering
    if id is not None:
        sales_reps = [rep for rep in sales_reps if rep["id"] == id]
    if name is not None:
        sales_reps = [rep for rep in sales_reps if name.lower() in rep["name"].lower()]
    if role is not None:
        sales_reps = [rep for rep in sales_reps if role.lower() in rep["role"].lower()]
    if region is not None:
        sales_reps = [rep for rep in sales_reps if region.lower() in rep["region"].lower()]

    # Sorting
    reverse = sort_order.lower() == "desc"
    sales_reps.sort(key=lambda x: x.get(sort_by, ""), reverse=reverse)

    # Calculate total data and total pages
    total_data = len(sales_reps)
    total_page = (total_data + page_size - 1) // page_size  # Ceiling division

    # Pagination
    start = (page - 1) * page_size
    end = start + page_size
    paginated_sales_reps = sales_reps[start:end]

    return {
        "total_data": total_data,
        "total_page": total_page,
        "current_page": page,
        "page_size": page_size,
        "sales_reps": paginated_sales_reps
    }

@app.post("/api/ai", summary="AI Interaction", response_description="AI response to user question")
async def ai_endpoint(request: AIRequest):
    """
    Interact with the AI endpoint.

    This endpoint accepts a user question and returns a response from OpenAI's ChatGPT.

    - **request body**: JSON object with a `question` field.
    - **returns**: A JSON object with an `answer` field.
    """
    try:
        user_question = request.question
        
        # For testing or when OpenAI API key is not available
        if settings.debug:
            return {"answer": f"This is a placeholder answer to your question: {user_question}"}
        
        # Make a request to OpenAI's ChatGPT
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant for a sales dashboard application."},
                {"role": "user", "content": user_question}
            ],
            max_tokens=150,
            temperature=0.7,
        )
        
        # Extract the response text
        answer = response.choices[0].message.content.strip()
        
        return {"answer": answer}
    
    except Exception as e:
        # Log the exception for debugging
        import traceback
        traceback.print_exc()
        # Return a more detailed error message
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")