from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.donation import DonationCreate, DonationResponse
from app.services.donation_service import donate_to_campaign
from app.core.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/donations", tags=["Donations"])


@router.post("/", response_model=DonationResponse)
def donate(data: DonationCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return donate_to_campaign(db, user.id, data)
from app.services.donation_service import donate_to_campaign, get_user_donations


# 📄 Get my donations
@router.get("/me", response_model=list[DonationResponse])
def my_donations(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return get_user_donations(db, user.id)