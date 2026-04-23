from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.auth import require_role
from app.ml.hotspot_engine import predict_hotspots, train_hotspot_model
from app.models.user import User

router = APIRouter(prefix="/admin/ml", tags=["Admin ML"])

@router.get("/hotspots")
def get_ml_hotspots(
    db: Session = Depends(get_db), 
    admin: User = Depends(require_role(["admin"]))
):
    """
    Returns a list of campaigns with their predicted hotspot scores.
    High scores indicate regions/categories that are critically underfunded.
    """
    return predict_hotspots(db)

@router.post("/retrain")
def retrain_model(admin: User = Depends(require_role(["admin"]))):
    """
    Triggers a manual retrain of the ML model.
    """
    return train_hotspot_model()
