from dotenv import load_dotenv
import os

# Load .env from ROOT (backend folder)
load_dotenv()

class Settings:
    DATABASE_URL = os.getenv("DATABASE_URL") or "sqlite:///./chaincare.db"
    SECRET_KEY = os.getenv("SECRET_KEY") or "fallbacksecret"
    ALGORITHM = os.getenv("ALGORITHM") or "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

settings = Settings()