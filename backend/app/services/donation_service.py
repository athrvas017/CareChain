from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.donation import Donation
from app.models.campaign import Campaign


from app.schemas.donation import DonationCreate

def donate_to_campaign(db: Session, user_id: int, data: DonationCreate):

    # Check campaign exists
    campaign = db.query(Campaign).filter(Campaign.id == data.campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    # Only allow approved/active campaigns
    if campaign.status not in ["approved", "active"]:
        raise HTTPException(status_code=400, detail="Campaign is not active for donations")

    # Create donation
    donation = Donation(
        amount=data.amount,
        donor_id=user_id,
        campaign_id=data.campaign_id,
        transaction_id=data.transaction_id,
        category=data.category,
        lat=data.lat,
        lng=data.lng,
        city=data.city
    )

    # Update campaign amount
    campaign.raised_amount += data.amount

    db.add(donation)
    db.commit()
    db.refresh(donation)

    return donation
def get_user_donations(db: Session, user_id: int):
    donations = db.query(Donation).filter(Donation.donor_id == user_id).all()
    for donation in donations:
        campaign = db.query(Campaign).filter(Campaign.id == donation.campaign_id).first()
        if campaign:
            donation.campaign_title = campaign.title
    return donations