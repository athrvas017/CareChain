from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text, DateTime
from datetime import datetime
from app.database import Base

class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    category = Column(String)
    city = Column(String, nullable=True)

    goal_amount = Column(Float, nullable=False)
    raised_amount = Column(Float, default=0)

    # draft, pending, approved, active, completed, rejected
    status = Column(String, default="pending") 

    beneficiary_id = Column(Integer, ForeignKey("users.id"))
    field_worker_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)