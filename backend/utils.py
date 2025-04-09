# backend/utils.py
import json
from fastapi import HTTPException

def load_dummy_data(file_path="dummyData.json"):
    """
    Loads dummy data from a JSON file.
    
    :param file_path: Path to the JSON file.
    :return: Parsed JSON data.
    :raises HTTPException: If the file is not found or JSON is invalid.
    """
    try:
        with open(file_path, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Data file not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error decoding JSON data")