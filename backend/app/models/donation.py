from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime, String
from datetime import datetime
from app.database import Base

class Donation(Base):
    __tablename__ = "donations"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)

    donor_id = Column(Integer, ForeignKey("users.id"))
    campaign_id = Column(Integer, ForeignKey("campaigns.id"))

    transaction_id = Column(String, unique=True, nullable=True)
    category = Column(String, nullable=True)
    
    # Location data
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    city = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)