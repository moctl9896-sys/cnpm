from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from ..infrastructure.databases.postgres import get_db
from ..middleware.role_checker import require_admin
from ..services.mentor_service import MentorService
from ..schemas.mentor_schema import MentorCreate, MentorUpdate, MentorResponse, MentorList

router = APIRouter(prefix="/api/mentors", tags=["Mentor Management"])

@router.post("/", response_model=MentorResponse, dependencies=[Depends(require_admin)])
def create_mentor(
    mentor_data: MentorCreate,
    db: Session = Depends(get_db)
):
    mentor = MentorService.create_mentor(db, mentor_data)
    return {
        "id": mentor.id,
        "user_id": mentor.user_id,
        "email": mentor.user.email,
        "full_name": mentor.user.full_name,
        "phone_number": mentor.user.phone_number,
        "expertise": mentor.expertise,
        "years_of_experience": mentor.years_of_experience,
        "current_company": mentor.current_company,
        "linkedin_url": mentor.linkedin_url,
        "bio": mentor.bio,
        "hourly_rate": mentor.hourly_rate,
        "rating": mentor.rating,
        "total_sessions": mentor.total_sessions,
        "verified": mentor.verified,
        "is_active": mentor.user.is_active,
        "created_at": mentor.created_at,
        "updated_at": mentor.updated_at
    }

@router.get("/", response_model=MentorList, dependencies=[Depends(require_admin)])
def get_mentors(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    skip = (page - 1) * page_size
    result = MentorService.get_mentors(db, skip=skip, limit=page_size, search=search)
    
    mentor_list = []
    for mentor in result["mentors"]:
        mentor_list.append({
            "id": mentor.id,
            "user_id": mentor.user_id,
            "email": mentor.user.email,
            "full_name": mentor.user.full_name,
            "phone_number": mentor.user.phone_number,
            "expertise": mentor.expertise,
            "years_of_experience": mentor.years_of_experience,
            "current_company": mentor.current_company,
            "linkedin_url": mentor.linkedin_url,
            "bio": mentor.bio,
            "hourly_rate": mentor.hourly_rate,
            "rating": mentor.rating,
            "total_sessions": mentor.total_sessions,
            "verified": mentor.verified,
            "is_active": mentor.user.is_active,
            "created_at": mentor.created_at,
            "updated_at": mentor.updated_at
        })
    
    return {
        "total": result["total"],
        "page": page,
        "page_size": page_size,
        "mentors": mentor_list
    }

@router.get("/{mentor_id}", response_model=MentorResponse, dependencies=[Depends(require_admin)])
def get_mentor(
    mentor_id: int,
    db: Session = Depends(get_db)
):
    mentor = MentorService.get_mentor_by_id(db, mentor_id)
    return {
        "id": mentor.id,
        "user_id": mentor.user_id,
        "email": mentor.user.email,
        "full_name": mentor.user.full_name,
        "phone_number": mentor.user.phone_number,
        "expertise": mentor.expertise,
        "years_of_experience": mentor.years_of_experience,
        "current_company": mentor.current_company,
        "linkedin_url": mentor.linkedin_url,
        "bio": mentor.bio,
        "hourly_rate": mentor.hourly_rate,
        "rating": mentor.rating,
        "total_sessions": mentor.total_sessions,
        "verified": mentor.verified,
        "is_active": mentor.user.is_active,
        "created_at": mentor.created_at,
        "updated_at": mentor.updated_at
    }

@router.put("/{mentor_id}", response_model=MentorResponse, dependencies=[Depends(require_admin)])
def update_mentor(
    mentor_id: int,
    mentor_data: MentorUpdate,
    db: Session = Depends(get_db)
):
    mentor = MentorService.update_mentor(db, mentor_id, mentor_data)
    return {
        "id": mentor.id,
        "user_id": mentor.user_id,
        "email": mentor.user.email,
        "full_name": mentor.user.full_name,
        "phone_number": mentor.user.phone_number,
        "expertise": mentor.expertise,
        "years_of_experience": mentor.years_of_experience,
        "current_company": mentor.current_company,
        "linkedin_url": mentor.linkedin_url,
        "bio": mentor.bio,
        "hourly_rate": mentor.hourly_rate,
        "rating": mentor.rating,
        "total_sessions": mentor.total_sessions,
        "verified": mentor.verified,
        "is_active": mentor.user.is_active,
        "created_at": mentor.created_at,
        "updated_at": mentor.updated_at
    }

@router.delete("/{mentor_id}", dependencies=[Depends(require_admin)])
def delete_mentor(
    mentor_id: int,
    db: Session = Depends(get_db)
):
    return MentorService.delete_mentor(db, mentor_id)