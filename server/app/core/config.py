import json
import os
from typing import List
from dotenv import load_dotenv

# Load .env from current directory or server directory
load_dotenv()

class Settings:
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "Mishaki E-Commerce API")
    API_V1_STR: str = os.getenv("API_V1_STR", "/api/v1")
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql+psycopg2://postgres:postgres@localhost:5432/mishaki_db"
    )

    @property
    def cors_origins(self) -> List[str]:
        raw = os.getenv("BACKEND_CORS_ORIGINS", '["http://localhost:3000", "http://127.0.0.1:3000"]')
        try:
            return json.loads(raw)
        except Exception:
            return [origin.strip() for origin in raw.split(",") if origin.strip()]

settings = Settings()
