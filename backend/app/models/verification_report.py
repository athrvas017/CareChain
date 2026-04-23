from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from datetime import datetime
from app.database import Base

class VerificationReport(Base):
    __tablename__ = "verification_reports"

    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(Integer, ForeignKey("campaigns.id"))
    field_worker_id = Column(Integer, ForeignKey("users.id"))
    
    status = Column(String) # verified, flagged, rejected
    findings = Column(Text)
    recommendation = Column(Text)
    image_url = Column(String, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
