import sys
import os

# Add the app directory to sys.path so we can import app modules
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.database import SessionLocal, engine, Base
from app.models.user import User
from app.core.security import hash_password

def seed_users():
    db = SessionLocal()
    
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)

    # Define the 4 role accounts
    test_users = [
        {"name": "System Admin", "email": "admin@carechain.com", "password": "password123", "role": "admin", "verified": True},
        {"name": "Demo Donor", "email": "donor@gmail.com", "password": "password123", "role": "donor", "verified": True},
        {"name": "Local Beneficiary", "email": "beneficiary@gmail.com", "password": "password123", "role": "beneficiary", "verified": True},
        {"name": "Field Worker One", "email": "worker@carechain.com", "password": "password123", "role": "field_worker", "verified": True}
    ]

    for user_data in test_users:
        # Check if user already exists
        existing = db.query(User).filter(User.email == user_data["email"]).first()
        if not existing:
            new_user = User(
                name=user_data["name"],
                email=user_data["email"],
                password=hash_password(user_data["password"]),
                role=user_data["role"],
                verified=user_data["verified"]
            )
            db.add(new_user)
            print(f"Created user: {user_data['email']} ({user_data['role']})")
        else:
            print(f"User {user_data['email']} already exists, skipping.")
    
    db.commit()
    db.close()
    print("Seeding complete!")

if __name__ == "__main__":
    seed_users()
