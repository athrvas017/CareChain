import sys
import os

# Add the app directory to sys.path so we can import app modules
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.database import SessionLocal
from app.models.user import User
from app.models.campaign import Campaign

def seed_satara():
    db = SessionLocal()
    
    # Gather beneficiary account
    beneficiary = db.query(User).filter(User.email == "beneficiary@gmail.com").first()
    if not beneficiary:
        print("Beneficiary user not found. Please run seed_users.py first.")
        return

    # A campaign in Satara that is active but has very little funding
    # This will trigger the ML engine to flag it as a hotspot (high need)
    satara_campaign = {
        "title": "Satara Drought Relief: Village Wells",
        "category": "Disaster Relief",
        "description": "Critical water shortage in 3 villages near Satara. Funding needed to deepen existing wells and install manual pumps.",
        "goal_amount": 600000.0,
        "raised_amount": 5000.0,
        "status": "active",
        "city": "Satara"
    }

    existing = db.query(Campaign).filter(Campaign.title == satara_campaign["title"]).first()
    if not existing:
        new_camp = Campaign(**satara_campaign, beneficiary_id=beneficiary.id)
        db.add(new_camp)
        print(f"Created Satara Hotspot Campaign: {satara_campaign['title']}")
    else:
        existing.status = "active"
        existing.city = "Satara"
        existing.raised_amount = 5000.0
        print(f"Updated Satara campaign to be active hotspot.")

    db.commit()
    db.close()
    print("Satara hotspot seeding complete!")

if __name__ == "__main__":
    seed_satara()
