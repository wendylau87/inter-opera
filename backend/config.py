# backend/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    data_file_path: str = "dummyData.json"
    allowed_origins: list = ["http://localhost:3000"]
    debug: bool = True

    class Config:
        env_file = ".env"

settings = Settings()