from fastapi import Depends, HTTPException, status, Header
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User

# 🔐 Create Simple Token (just returning user_id as a string for simplicity)
def create_access_token(data: dict):
    return str(data.get("user_id"))


# 🔍 Get current user from Header (X-User-ID)
def get_current_user(
    x_user_id: str = Header(None),
    db: Session = Depends(get_db)
):
    if not x_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User ID header missing",
        )

    user = db.query(User).filter(User.id == int(x_user_id)).first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid User",
        )

    return user


# 🔒 Role-based access
def require_role(allowed_roles: list[str], require_verified: bool = False):
    def role_checker(user: User = Depends(get_current_user)):
        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {allowed_roles}"
            )
        
        if require_verified and not user.verified:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account not verified. Please upload documents for verification."
            )
            
        return user
    return role_checker