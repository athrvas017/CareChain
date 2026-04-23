from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.campaign import CampaignCreate, CampaignResponse
from app.services.campaign_service import create_campaign, get_campaigns, approve_campaign, get_all_campaigns, get_campaign_by_id
from app.core.auth import get_current_user, require_role
from app.models.user import User

router = APIRouter(prefix="/campaigns", tags=["Campaigns"])


# 📝 Create campaign (beneficiary only, must be verified)
@router.post("/", response_model=CampaignResponse)
def create(
    data: CampaignCreate, 
    db: Session = Depends(get_db), 
    user: User = Depends(require_role(["beneficiary"], require_verified=True))
):
    return create_campaign(db, data, user.id)


# 📄 Get all approved campaigns
@router.get("/", response_model=list[CampaignResponse])
def get_all(db: Session = Depends(get_db)):
    return get_campaigns(db)


# 👤 Get my campaigns
@router.get("/me", response_model=list[CampaignResponse])
def get_my_campaigns(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    from app.models.campaign import Campaign
    return db.query(Campaign).filter(Campaign.beneficiary_id == user.id).all()

# 🌍 Get assigned campaigns (Field Worker)
@router.get("/assigned", response_model=list[CampaignResponse])
def get_assigned_campaigns(db: Session = Depends(get_db), user: User = Depends(require_role(["field_worker"]))):
    from app.models.campaign import Campaign
    return db.query(Campaign).filter(Campaign.field_worker_id == user.id).all()

# 🛡️ Get all campaigns (Admin only)
@router.get("/admin/all", response_model=list[CampaignResponse])
def get_all_admin(db: Session = Depends(get_db), admin: User = Depends(require_role(["admin"]))):
    return get_all_campaigns(db)


# 🛠️ Approve campaign (admin only)
@router.put("/{campaign_id}/approve")
def approve(campaign_id: int, db: Session = Depends(get_db), admin: User = Depends(require_role(["admin"]))):
    return approve_campaign(db, campaign_id)

from app.services.campaign_service import get_campaign_by_id


@router.get("/{campaign_id}", response_model=CampaignResponse)
def get_one(campaign_id: int, db: Session = Depends(get_db)):
    return get_campaign_by_id(db, campaign_id)

