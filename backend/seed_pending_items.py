import sys
import os

# Add the app directory to sys.path so we can import app modules
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.database import SessionLocal
from app.models.user import User
from app.models.campaign import Campaign
from app.models.aid_request import AidRequest

def seed_pending_items():
    db = SessionLocal()
    
    # Gather beneficiary and worker accounts
    beneficiary = db.query(User).filter(User.email == "beneficiary@gmail.com").first()
    worker = db.query(User).filter(User.email == "worker@carechain.com").first()
    
    if not beneficiary:
        print("Beneficiary user not found. Please run seed_users.py first.")
        return

    # 1. Pending Campaigns (for the Campaign Verification Queue)
    pending_campaigns = [
        {
            "title": "Post-Flood Reconstruction: Ratnagiri",
            "category": "Disaster Relief",
            "description": "Rebuilding 15 community centers damaged by the heavy rainfall in Ratnagiri district. Needs verification of structural damage.",
            "goal_amount": 1500000.0,
            "status": "pending",
            "field_worker_id": worker.id if worker else None
        },
        {
            "title": "Tribal Health Outreach - Gadchiroli",
            "category": "Medical",
            "description": "Mobile health clinic project to serve 20 remote tribal hamlets. Funding needed for medical equipment and van conversion.",
            "goal_amount": 950000.0,
            "status": "pending",
            "field_worker_id": worker.id if worker else None
        },
        {
            "title": "Vocational Training for Orphanage Youth",
            "category": "Education",
            "description": "Setting up a computer lab and hiring trainers for skill development of 40 teenagers in the local state orphanage.",
            "goal_amount": 450000.0,
            "status": "pending"
        }
    ]

    for camp_data in pending_campaigns:
        existing = db.query(Campaign).filter(Campaign.title == camp_data["title"]).first()
        if not existing:
            new_camp = Campaign(**camp_data, beneficiary_id=beneficiary.id)
            db.add(new_camp)
            print(f"Created Pending Campaign: {camp_data['title']}")
        else:
            existing.status = "pending"
            print(f"Set status to pending for: {camp_data['title']}")

    # 2. Pending Aid Requests (for the Direct Assistance Requests Queue)
    pending_requests = [
        {
            "title": "Urgent Chemotherapy Session",
            "category": "Medical",
            "location": "Mumbai",
            "description": "I need help with my 4th chemotherapy session at Tata Memorial. My family has exhausted all savings.",
            "status": "pending"
        },
        {
            "title": "Bicycle for School Commute",
            "category": "Education",
            "location": "Satara Rural",
            "description": "My school is 8km away. A bicycle would help me stay in school instead of dropping out due to commute.",
            "status": "pending"
        }
    ]

    for req_data in pending_requests:
        existing = db.query(AidRequest).filter(AidRequest.title == req_data["title"]).first()
        if not existing:
            new_req = AidRequest(**req_data, user_id=beneficiary.id)
            db.add(new_req)
            print(f"Created Pending Aid Request: {req_data['title']}")
        else:
            existing.status = "pending"
            print(f"Set status to pending for request: {req_data['title']}")

    db.commit()
    db.close()
    print("Pending items seeding complete!")

if __name__ == "__main__":
    pending_campaigns = seed_pending_items()
