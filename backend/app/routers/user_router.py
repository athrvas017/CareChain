from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.user import UserResponse
from app.core.auth import get_current_user, require_role
from app.models.user import User

router = APIRouter(prefix="/users", tags=["Users"])


# 👤 Get current logged-in user
@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


# 📤 Upload documents for verification
@router.post("/upload-documents")
def upload_docs(documents: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    user.documents = documents
    db.commit()
    return {"message": "Documents uploaded successfully. Pending verification."}


# 🛠️ Admin: Get all users
@router.get("/all", response_model=list[UserResponse])
def get_all_users(
    db: Session = Depends(get_db),
    admin: User = Depends(require_role(["admin"]))
):
    users = db.query(User).all()
    return users