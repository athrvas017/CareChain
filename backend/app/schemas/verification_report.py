from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class VerificationReportBase(BaseModel):
    campaign_id: int
    status: str
    findings: str
    recommendation: str
    image_url: Optional[str] = None

class VerificationReportCreate(VerificationReportBase):
    pass

class VerificationReportResponse(VerificationReportBase):
    id: int
    field_worker_id: int
    created_at: datetime

    class Config:
        from_attributes = True
