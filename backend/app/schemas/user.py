from pydantic import BaseModel, EmailStr
from typing import Optional

from datetime import datetime

# 🔹 Base Schema (common fields)
class UserBase(BaseModel):
    name: str
    email: EmailStr


# 🔹 Request Schema (Register)
class UserCreate(UserBase):
    password: str
    role: Optional[str] = "donor"


# 🔹 Response Schema (SAFE)
class UserResponse(UserBase):
    id: int
    role: str
    verified: bool
    documents: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True