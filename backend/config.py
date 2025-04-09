# backend/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    data_file_path: str = "dummyData.json"
    allowed_origins: list = ["http://localhost:3000"]
    openai_api_key: str = ""
    debug: bool = False

    # Use SettingsConfigDict instead of ConfigDict
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        env_prefix="",  # No prefix for environment variables
        extra="ignore"
    )

settings = Settings()