from pydantic import BaseModel

from typing import Optional
from datetime import datetime

class DonationCreate(BaseModel):
    amount: float
    campaign_id: int
    transaction_id: Optional[str] = None
    category: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    city: Optional[str] = None


class DonationResponse(BaseModel):
    id: int
    amount: float
    campaign_id: int
    campaign_title: Optional[str] = None
    donor_id: int
    transaction_id: Optional[str]
    category: Optional[str]
    lat: Optional[float]
    lng: Optional[float]
    city: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True