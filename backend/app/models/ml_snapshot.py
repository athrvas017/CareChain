from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from app.database import Base

class MLHotspotSnapshot(Base):
    __tablename__ = "ml_hotspot_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    region = Column(String)  # City
    category = Column(String)
    
    total_campaigns = Column(Integer)
    active_campaigns = Column(Integer)
    total_goal_amount = Column(Float)
    total_raised_amount = Column(Float)
    
    fulfillment_ratio = Column(Float)  # raised / goal
    donation_count = Column(Integer)
    avg_donation_amount = Column(Float)
    
    # Target label for training
    is_hotspot = Column(Integer)  # 1 or 0
    
    created_at = Column(DateTime, default=datetime.utcnow)
