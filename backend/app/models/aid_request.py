from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from datetime import datetime
from app.database import Base

class AidRequest(Base):
    __tablename__ = "aid_requests"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    category = Column(String)
    location = Column(String)
    image_url = Column(String, nullable=True)
    status = Column(String, default="pending") # pending, verified, fulfilled, rejected
    
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
