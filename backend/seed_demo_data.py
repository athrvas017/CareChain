import sys
import os

# Add the app directory to sys.path so we can import app modules
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.campaign import Campaign
from app.models.aid_request import AidRequest
from app.models.verification_report import VerificationReport

def seed_demo():
    db = SessionLocal()
    
    # 1. Gather our test accounts
    admin = db.query(User).filter(User.email == "admin@carechain.com").first()
    donor = db.query(User).filter(User.email == "donor@gmail.com").first()
    beneficiary = db.query(User).filter(User.email == "beneficiary@gmail.com").first()
    worker = db.query(User).filter(User.email == "worker@carechain.com").first()

    if not all([admin, donor, beneficiary, worker]):
        print("Missing base users. Please run seed_users.py first.")
        return

    # 2. Seed some Aid Requests (for Admin Dashboard)
    requests = [
        {"title": "Emergency Dialysis Help", "category": "Medical", "location": "Pune, Maharashtra", "description": "Need urgent funds for my father's 3rd dialysis session this week.", "status": "pending"},
        {"title": "Textbooks for Rural School", "category": "Education", "location": "Satara", "description": "Support for 50 students in a local govt school for science kits.", "status": "pending"},
        {"title": "Temporary Shelter after Fire", "category": "Disaster Relief", "location": "Dharavi, Mumbai", "description": "Small fire destroyed 3 shacks, needing immediate tarp and food.", "status": "pending"}
    ]

    for req in requests:
        existing = db.query(AidRequest).filter(AidRequest.title == req["title"]).first()
        if not existing:
            new_req = AidRequest(**req, user_id=beneficiary.id)
            db.add(new_req)
            print(f"Created Aid Request: {req['title']}")

    # 3. Create/Assign Campaigns (for Field Worker Dashboard)
    campaigns = [
        {"title": "Global Oxygen Drive", "category": "Medical", "description": "Setting up oxygen plants in remote distrcits.", "goal_amount": 500000.0, "status": "pending", "field_worker_id": worker.id},
        {"title": "Clean Water Satara", "category": "Disaster Relief", "description": "Installing solar-powered water filtration units.", "goal_amount": 250000.0, "status": "pending", "field_worker_id": worker.id}
    ]

    for camp_data in campaigns:
        existing = db.query(Campaign).filter(Campaign.title == camp_data["title"]).first()
        if not existing:
            new_camp = Campaign(**camp_data, beneficiary_id=beneficiary.id)
            db.add(new_camp)
            print(f"Created/Assigned Campaign: {camp_data['title']}")

    # 4. Create some Verification Reports (for Admin verification table)
    reports = [
        {
            "campaign_id": 1, # This is a guess, but ually CMP-1 is the first one
            "field_worker_id": worker.id,
            "status": "verified",
            "findings": "Verified site. Beneficiary has proper documentation. On-ground construction has started.",
            "recommendation": "Release first milestone payment.",
            "image_url": "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=400"
        },
        {
            "campaign_id": 2,
            "field_worker_id": worker.id,
            "status": "flagged",
            "findings": "Vendor for filtration units seems to be charging higher than market rate. Identity verified but budget needs review.",
            "recommendation": "Hold payment until alternate quote is received.",
            "image_url": "https://images.unsplash.com/photo-1541888941255-250281b24c82?auto=format&fit=crop&q=80&w=400"
        }
    ]

    # Try to find campaigns to link properly if ID 1/2 don't exist
    c1 = db.query(Campaign).first()
    if c1:
        for r in reports:
            r["campaign_id"] = c1.id
            db.add(VerificationReport(**r))
            print(f"Created Verification Report for Campaign {c1.id}")
            break # Just one for now to avoid duplicates

    db.commit()
    db.close()
    print("Demo data seeding complete!")

if __name__ == "__main__":
    seed_demo()
