from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.auth import require_role
from app.models.user import User
from app.models.campaign import Campaign
from app.models.donation import Donation
from app.schemas.user import UserResponse
from app.schemas.campaign import CampaignResponse
from app.schemas.donation import DonationResponse
from app.schemas.aid_request import AidRequestResponse

router = APIRouter(prefix="/admin", tags=["Admin"])

# 👥 User Management
@router.get("/users", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db), admin: User = Depends(require_role(["admin"]))):
    return db.query(User).all()

@router.put("/users/{user_id}/verify")
def verify_user(user_id: int, verified: bool, db: Session = Depends(get_db), admin: User = Depends(require_role(["admin"]))):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.verified = verified
    db.commit()
    return {"message": f"User {user_id} verification status set to {verified}"}

# 📋 Campaign Management
@router.get("/campaigns", response_model=list[CampaignResponse])
def get_all_campaigns(db: Session = Depends(get_db), admin: User = Depends(require_role(["admin"]))):
    return db.query(Campaign).all()

@router.put("/campaigns/{campaign_id}/status")
def update_campaign_status(campaign_id: int, status: str, db: Session = Depends(get_db), admin: User = Depends(require_role(["admin"]))):
    allowed_statuses = ["draft", "pending", "approved", "active", "completed", "rejected"]
    if status not in allowed_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {allowed_statuses}")
    
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
        
    campaign.status = status
    db.commit()
    return {"message": f"Campaign {campaign_id} status updated to {status}"}

# 💰 Transaction Monitoring
@router.get("/donations", response_model=list[DonationResponse])
def get_all_donations(db: Session = Depends(get_db), admin: User = Depends(require_role(["admin"]))):
    return (
        db.query(Donation)
        .join(Campaign, Donation.campaign_id == Campaign.id)
        .filter(Campaign.status != "rejected")
        .all()
    )

# 📊 Basic Insights
@router.get("/insights/summary")
def get_summary(db: Session = Depends(get_db), admin: User = Depends(require_role(["admin"]))):
    total_users = db.query(User).count()
    total_campaigns = db.query(Campaign).count()
    total_donations = db.query(Donation).count()
    total_raised = db.query(Campaign).with_entities(Campaign.raised_amount).all()
    sum_raised = sum([float(r[0]) for r in total_raised])
    
    return {
        "total_users": total_users,
        "total_campaigns": total_campaigns,
        "total_donations": total_donations,
        "total_raised": sum_raised
    }

# 📋 Aid Request Management
@router.get("/aid-requests", response_model=list[AidRequestResponse])
def get_all_aid_requests(db: Session = Depends(get_db), admin: User = Depends(require_role(["admin"]))):
    from app.models.aid_request import AidRequest
    return db.query(AidRequest).all()

@router.put("/aid-requests/{request_id}/status")
def update_aid_request_status(request_id: int, status: str, db: Session = Depends(get_db), admin: User = Depends(require_role(["admin"]))):
    from app.models.aid_request import AidRequest
    req = db.query(AidRequest).filter(AidRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    req.status = status
    db.commit()
    return {"message": "Status updated"}

# 👥 Field Worker Management
@router.get("/field-workers", response_model=list[UserResponse])
def get_field_workers(db: Session = Depends(get_db), admin: User = Depends(require_role(["admin"]))):
    return db.query(User).filter(User.role == "field_worker").all()

@router.put("/campaigns/{campaign_id}/assign/{worker_id}")
def assign_field_worker(campaign_id: int, worker_id: int, db: Session = Depends(get_db), admin: User = Depends(require_role(["admin"]))):
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    worker = db.query(User).filter(User.id == worker_id, User.role == "field_worker").first()
    if not worker:
        raise HTTPException(status_code=404, detail="Field Worker not found")
    
    campaign.field_worker_id = worker_id
    db.commit()
    return {"message": f"Assigned {worker.name} to campaign {campaign_id}"}
