import sys
import os

# Add the app directory to sys.path so we can import app modules
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.database import SessionLocal
from app.models.user import User
from app.models.campaign import Campaign

def seed_donor_campaigns():
    db = SessionLocal()
    
    # Gather beneficiary account
    beneficiary = db.query(User).filter(User.email == "beneficiary@gmail.com").first()
    if not beneficiary:
        print("Beneficiary user not found. Please run seed_users.py first.")
        return

    # Campaigns that will be visible to donors (status 'active' or 'approved')
    donor_visible_campaigns = [
        {
            "title": "Medical Aid for Pediatric Surgery",
            "category": "Medical",
            "description": "Urgent funding required for a group of children awaiting critical heart surgeries in Mumbai. Your support will cover hospital costs and post-operative care.",
            "goal_amount": 1200000.0,
            "raised_amount": 450000.0,
            "status": "active"
        },
        {
            "title": "Rural Literacy Program - Satara",
            "category": "Education",
            "description": "Providing digital tablets and e-learning resources to 5 villages in Satara. Empowering children with modern tools for a better future.",
            "goal_amount": 350000.0,
            "raised_amount": 120000.0,
            "status": "active"
        },
        {
            "title": "Monsoon Flood Relief 2024",
            "category": "Disaster Relief",
            "description": "Immediate relief for families affected by recent floods in coastal Maharashtra. Providing food kits, medicine, and hygiene supplies.",
            "goal_amount": 800000.0,
            "raised_amount": 600000.0,
            "status": "active"
        },
        {
            "title": "Zero Hunger Initiative - Thane",
            "category": "Food & Hunger",
            "description": "Setting up a community kitchen to provide 500 daily meals to underprivileged workers and children in industrial Thane.",
            "goal_amount": 200000.0,
            "raised_amount": 15000.0,
            "status": "active"
        },
        {
            "title": "Clean Energy for Primary Schools",
            "category": "Education",
            "description": "Installing solar panels on the roofs of 10 primary schools to ensure uninterrupted learning and reduce carbon footprint.",
            "goal_amount": 500000.0,
            "raised_amount": 340000.0,
            "status": "approved"
        }
    ]

    for camp_data in donor_visible_campaigns:
        existing = db.query(Campaign).filter(Campaign.title == camp_data["title"]).first()
        if not existing:
            new_camp = Campaign(**camp_data, beneficiary_id=beneficiary.id)
            db.add(new_camp)
            print(f"Created Donor Visible Campaign: {camp_data['title']}")
        else:
            # Update status if it exists but is different
            existing.status = camp_data["status"]
            print(f"Updated status for: {camp_data['title']}")

    db.commit()
    db.close()
    print("Donor campaigns seeding complete!")

if __name__ == "__main__":
    seed_donor_campaigns()
