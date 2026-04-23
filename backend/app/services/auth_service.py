from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import hash_password, verify_password
from app.core.auth import create_access_token


# 🔐 Register User
def register_user(db: Session, user_data: UserCreate):
    
    # Check if user exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password
    hashed_pw = hash_password(user_data.password)

    # Create user
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password=hashed_pw,
        role=user_data.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# 🔑 Login User
def login_user(db: Session, email: str, password: str):

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    # Verify password
    if not verify_password(password, user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    # Create token
    token = create_access_token({
        "user_id": user.id,
        "role": user.role
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }