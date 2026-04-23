from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class AidRequestBase(BaseModel):
    title: str
    description: str
    category: str
    location: str
    image_url: Optional[str] = None

class AidRequestCreate(AidRequestBase):
    pass

class AidRequestResponse(AidRequestBase):
    id: int
    status: str
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
