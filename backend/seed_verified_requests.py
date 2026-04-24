import sys
import os

# Add the app directory to sys.path so we can import app modules
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.database import SessionLocal
from app.models.user import User
from app.models.aid_request import AidRequest

def seed_verified_requests():
    db = SessionLocal()
    
    # Gather beneficiary account
    beneficiary = db.query(User).filter(User.email == "beneficiary@gmail.com").first()
    if not beneficiary:
        print("Beneficiary user not found. Please run seed_users.py first.")
        return

    # Aid Requests that will be visible to donors (status 'verified')
    verified_requests = [
        {
            "title": "Emergency Medicine for Elderly",
            "category": "Medical",
            "location": "Mumbai",
            "description": "Providing chronic medication for 50 elderly residents in a low-income housing colony.",
            "status": "verified"
        },
        {
            "title": "School Supplies for Slum Children",
            "category": "Education",
            "location": "Thane",
            "description": "Notebooks, bags, and stationery kits for 100 students starting the new academic year.",
            "status": "verified"
        },
        {
            "title": "Community Kitchen Support",
            "category": "Food & Hunger",
            "location": "Nagpur",
            "description": "Raw materials and cooking gas for a local kitchen serving daily meals to homeless people.",
            "status": "verified"
        }
    ]

    for req_data in verified_requests:
        existing = db.query(AidRequest).filter(AidRequest.title == req_data["title"]).first()
        if not existing:
            new_req = AidRequest(**req_data, user_id=beneficiary.id)
            db.add(new_req)
            print(f"Created Verified Aid Request: {req_data['title']}")
        else:
            existing.status = req_data["status"]
            print(f"Updated status for request: {req_data['title']}")

    db.commit()
    db.close()
    print("Verified aid requests seeding complete!")

if __name__ == "__main__":
    seed_verified_requests()
