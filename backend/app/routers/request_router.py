from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.aid_request import AidRequest
from app.schemas.aid_request import AidRequestCreate, AidRequestResponse
from app.core.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/aid-requests", tags=["Aid Requests"])

@router.post("/", response_model=AidRequestResponse)
def create_request(
    data: AidRequestCreate, 
    db: Session = Depends(get_db), 
    user: User = Depends(get_current_user)
):
    """
    Creates a new assistace request in the database.
    """
    new_request = AidRequest(
        title=data.title,
        description=data.description,
        category=data.category,
        location=data.location,
        image_url=data.image_url,
        user_id=user.id
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    return new_request

@router.get("/me", response_model=list[AidRequestResponse])
def get_my_requests(
    db: Session = Depends(get_db), 
    user: User = Depends(get_current_user)
):
    return db.query(AidRequest).filter(AidRequest.user_id == user.id).all()

@router.get("/", response_model=list[AidRequestResponse])
def get_all_requests(db: Session = Depends(get_db)):
    """
    Returns only verified aid requests for the public/donors.
    """
    return db.query(AidRequest).filter(AidRequest.status == "verified").all()
