from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from ..infrastructure.databases.postgres import get_db
from ..middleware.role_checker import require_admin
from ..services.recruiter_service import RecruiterService
from ..schemas.recruiter_schema import RecruiterCreate, RecruiterUpdate, RecruiterResponse, RecruiterList

router = APIRouter(prefix="/api/recruiters", tags=["Recruiter Management"])

@router.post("/", response_model=RecruiterResponse, dependencies=[Depends(require_admin)])
def create_recruiter(
    recruiter_data: RecruiterCreate,
    db: Session = Depends(get_db)
):
    recruiter = RecruiterService.create_recruiter(db, recruiter_data)
    return {
        "id": recruiter.id,
        "user_id": recruiter.user_id,
        "email": recruiter.user.email,
        "full_name": recruiter.user.full_name,
        "phone_number": recruiter.user.phone_number,
        "company_name": recruiter.company_name,
        "company_website": recruiter.company_website,
        "position": recruiter.position,
        "industry": recruiter.industry,
        "company_size": recruiter.company_size,
        "description": recruiter.description,
        "verified": recruiter.verified,
        "is_active": recruiter.user.is_active,
        "created_at": recruiter.created_at,
        "updated_at": recruiter.updated_at
    }

@router.get("/", response_model=RecruiterList, dependencies=[Depends(require_admin)])
def get_recruiters(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    skip = (page - 1) * page_size
    result = RecruiterService.get_recruiters(db, skip=skip, limit=page_size, search=search)
    
    recruiter_list = []
    for recruiter in result["recruiters"]:
        recruiter_list.append({
            "id": recruiter.id,
            "user_id": recruiter.user_id,
            "email": recruiter.user.email,
            "full_name": recruiter.user.full_name,
            "phone_number": recruiter.user.phone_number,
            "company_name": recruiter.company_name,
            "company_website": recruiter.company_website,
            "position": recruiter.position,
            "industry": recruiter.industry,
            "company_size": recruiter.company_size,
            "description": recruiter.description,
            "verified": recruiter.verified,
            "is_active": recruiter.user.is_active,
            "created_at": recruiter.created_at,
            "updated_at": recruiter.updated_at
        })
    
    return {
        "total": result["total"],
        "page": page,
        "page_size": page_size,
        "recruiters": recruiter_list
    }

@router.get("/{recruiter_id}", response_model=RecruiterResponse, dependencies=[Depends(require_admin)])
def get_recruiter(
    recruiter_id: int,
    db: Session = Depends(get_db)
):
    recruiter = RecruiterService.get_recruiter_by_id(db, recruiter_id)
    return {
        "id": recruiter.id,
        "user_id": recruiter.user_id,
        "email": recruiter.user.email,
        "full_name": recruiter.user.full_name,
        "phone_number": recruiter.user.phone_number,
        "company_name": recruiter.company_name,
        "company_website": recruiter.company_website,
        "position": recruiter.position,
        "industry": recruiter.industry,
        "company_size": recruiter.company_size,
        "description": recruiter.description,
        "verified": recruiter.verified,
        "is_active": recruiter.user.is_active,
        "created_at": recruiter.created_at,
        "updated_at": recruiter.updated_at
    }

@router.put("/{recruiter_id}", response_model=RecruiterResponse, dependencies=[Depends(require_admin)])
def update_recruiter(
    recruiter_id: int,
    recruiter_data: RecruiterUpdate,
    db: Session = Depends(get_db)
):
    recruiter = RecruiterService.update_recruiter(db, recruiter_id, recruiter_data)
    return {
        "id": recruiter.id,
        "user_id": recruiter.user_id,
        "email": recruiter.user.email,
        "full_name": recruiter.user.full_name,
        "phone_number": recruiter.user.phone_number,
        "company_name": recruiter.company_name,
        "company_website": recruiter.company_website,
        "position": recruiter.position,
        "industry": recruiter.industry,
        "company_size": recruiter.company_size,
        "description": recruiter.description,
        "verified": recruiter.verified,
        "is_active": recruiter.user.is_active,
        "created_at": recruiter.created_at,
        "updated_at": recruiter.updated_at
    }

@router.delete("/{recruiter_id}", dependencies=[Depends(require_admin)])
def delete_recruiter(
    recruiter_id: int,
    db: Session = Depends(get_db)
):
    return RecruiterService.delete_recruiter(db, recruiter_id)