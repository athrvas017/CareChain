from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.campaign import Campaign


# 📝 Create Campaign
def create_campaign(db: Session, data, user_id: int):
    new_campaign = Campaign(
        title=data.title,
        description=data.description,
        category=data.category,
        goal_amount=data.goal_amount,
        beneficiary_id=user_id
    )

    db.add(new_campaign)
    db.commit()
    db.refresh(new_campaign)

    return new_campaign


# 📄 Get all live campaigns
def get_campaigns(db: Session):
    return db.query(Campaign).filter(Campaign.status.in_(["approved", "active"])).all()


# 📄 Get all campaigns (for admin)
def get_all_campaigns(db: Session):
    return db.query(Campaign).all()


# 🛠️ Admin approve campaign
def approve_campaign(db: Session, campaign_id: int):
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()

    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    campaign.status = "active"
    db.commit()

    return {"message": "Campaign approved and is now active"}
def get_campaign_by_id(db: Session, campaign_id: int):
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()

    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    campaign.progress = (campaign.raised_amount / campaign.goal_amount) * 100 if campaign.goal_amount else 0

    return campaign