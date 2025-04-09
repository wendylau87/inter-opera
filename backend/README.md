# Sales Dashboard Backend API

A robust FastAPI backend service that provides data for the Sales Dashboard application, including sales representatives information and AI-powered insights.

## Features

- **RESTful API**: Clean and well-structured API endpoints
- **Server-side Pagination**: Efficient handling of large datasets
- **Filtering & Sorting**: Advanced data filtering and sorting capabilities
- **AI Integration**: Natural language processing for sales data insights
- **Mock Data Generation**: Built-in mock data for development and testing
- **CORS Support**: Configured for cross-origin requests from the frontend
- **Swagger Documentation**: Auto-generated API documentation

## Tech Stack

- **FastAPI**: Modern, high-performance web framework for building APIs
- **Pydantic**: Data validation and settings management
- **Uvicorn**: ASGI server for serving the FastAPI application
- **Python 3.8+**: Modern Python features
- **OpenAI Integration**: For AI-powered insights (configurable)

## Getting Started

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Virtual environment (recommended)

### Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd backend
   ```
3. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
5. Create a `.env` file with the following variables (optional):
   ```
   OPENAI_API_KEY=your_openai_api_key  # Only needed if using real OpenAI integration
   ```

### Running the Server

Start the development server:

```
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at [http://localhost:8000](http://localhost:8000).

### API Documentation

Once the server is running, you can access the auto-generated Swagger documentation:

- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## API Endpoints

### Sales Representatives

- `GET /api/sales`: Get paginated list of sales representatives
  - Query Parameters:
    - `page`: Page number (default: 1)
    - `page_size`: Items per page (default: 10)
    - `sort_by`: Field to sort by
    - `sort_order`: Sort direction ('asc' or 'desc')
    - `id`: Filter by ID
    - `name`: Filter by name
    - `role`: Filter by role
    - `region`: Filter by region

- `GET /api/sales/{id}`: Get detailed information about a specific sales representative

### AI Insights

- `POST /api/ai`: Get AI-powered insights about sales data
  - Request Body:
    - `question`: Natural language question about sales data

## Project Structure

```
backend/
├── data/                # Mock data and data generation utilities
│   └── mock_data.py     # Mock data generation for sales representatives
├── models/              # Pydantic models for data validation
│   └── sales.py         # Models for sales representatives data
├── routes/              # API route handlers
│   ├── ai.py            # AI insights endpoint
│   └── sales.py         # Sales representatives endpoints
├── services/            # Business logic services
│   └── ai_service.py    # AI processing service
├── .env                 # Environment variables (not in repo)
├── .gitignore           # Git ignore file
├── main.py              # Application entry point
├── requirements.txt     # Project dependencies
└── README.md            # Project documentation
```

