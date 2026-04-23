from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.auth import require_role, get_current_user
from app.models.verification_report import VerificationReport
from app.models.user import User
from app.schemas.verification_report import VerificationReportCreate, VerificationReportResponse

router = APIRouter(prefix="/verifications", tags=["Verifications"])

@router.post("/", response_model=VerificationReportResponse)
def submit_report(
    data: VerificationReportCreate, 
    db: Session = Depends(get_db), 
    user: User = Depends(require_role(["field_worker"]))
):
    new_report = VerificationReport(
        campaign_id=data.campaign_id,
        field_worker_id=user.id,
        status=data.status,
        findings=data.findings,
        recommendation=data.recommendation,
        image_url=data.image_url
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return new_report

@router.get("/all", response_model=list[VerificationReportResponse])
def get_all_reports(
    db: Session = Depends(get_db), 
    admin: User = Depends(require_role(["admin"]))
):
    return db.query(VerificationReport).all()

@router.get("/campaign/{campaign_id}", response_model=list[VerificationReportResponse])
def get_campaign_reports(
    campaign_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return db.query(VerificationReport).filter(VerificationReport.campaign_id == campaign_id).all()
