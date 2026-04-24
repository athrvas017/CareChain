from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CampaignBase(BaseModel):
    title: str
    description: Optional[str]
    category: str
    city: Optional[str] = None
    goal_amount: float


class CampaignCreate(CampaignBase):
    pass


class CampaignResponse(CampaignBase):
    id: int
    raised_amount: float
    status: str
    beneficiary_id: int
    field_worker_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True