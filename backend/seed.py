import os
import sys
from sqlalchemy.orm import Session

# Add the parent directory to sys.path to import app
sys.path.append(os.getcwd())

from app.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.campaign import Campaign
from app.core.security import hash_password

def seed_db():
    db: Session = SessionLocal()
    
    # Drop and create tables to ensure fresh schema
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    print("Seeding database...")

    # 1. Create Users
    admin = User(
        name="Admin User",
        email="admin@carechain.org",
        password=hash_password("admin123"),
        role="admin",
        verified=True
    )
    
    donor = User(
        name="John Donor",
        email="john@example.com",
        password=hash_password("password123"),
        role="donor",
        verified=True
    )
    
    beneficiary = User(
        name="Asha Foundation",
        email="asha@ngo.org",
        password=hash_password("ngo12345"),
        role="beneficiary",
        verified=True
    )

    db.add_all([admin, donor, beneficiary])
    db.commit()
    db.refresh(beneficiary)

    # 2. Create Campaigns
    c1 = Campaign(
        title="Emergency Flood Relief 2024",
        description="Providing food, clean water, and medical supplies to 500+ families affected by the recent floods in Kerala. Every contribution goes towards survival kits and temporary shelters.",
        category="Disaster Relief",
        goal_amount=500000,
        raised_amount=125000,
        status="approved",
        beneficiary_id=beneficiary.id
    )

    c2 = Campaign(
        title="Critical Heart Surgery for Aryan",
        description="8-year-old Aryan needs urgent open-heart surgery. His family is unable to afford the astronomical medical costs. Join us in giving Aryan a second chance at life.",
        category="Medical",
        goal_amount=800000,
        raised_amount=450000,
        status="approved",
        beneficiary_id=beneficiary.id
    )

    c3 = Campaign(
        title="Laptops for Rural Students",
        description="Bridge the digital divide by providing refurbished laptops to meritorious students in rural Karnataka. Help them continue their education in the digital age.",
        category="Education",
        goal_amount=300000,
        raised_amount=50000,
        status="active",
        beneficiary_id=beneficiary.id
    )

    c4 = Campaign(
        title="Pending Water Project",
        description="A new project waiting for admin approval.",
        category="Infrastructure",
        goal_amount=100000,
        raised_amount=0,
        status="pending",
        beneficiary_id=beneficiary.id
    )

    db.add_all([c1, c2, c3, c4])
    db.commit()

    print("Seeding completed successfully!")
    db.close()

if __name__ == "__main__":
    seed_db()
