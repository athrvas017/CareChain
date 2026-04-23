from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, default="donor")
    verified = Column(Boolean, default=False)
    documents = Column(String, nullable=True)  # Store list of document paths/URLs as JSON string
    created_at = Column(DateTime, default=datetime.utcnow)