from sqlalchemy.orm import Session
from sqlalchemy import or_
from fastapi import HTTPException, status
from typing import Optional
from ..models.recruiter import Recruiter
from ..domain.user.user_entity import User
from ..schemas.recruiter_schema import RecruiterCreate, RecruiterUpdate
from ..auth.jwt import hash_password

class RecruiterService:
    
    @staticmethod
    def create_recruiter(db: Session, recruiter_data: RecruiterCreate):
        # Kiểm tra email đã tồn tại
        existing_user = db.query(User).filter(User.email == recruiter_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Tạo user
        hashed_pwd = hash_password(recruiter_data.password)
        new_user = User(
            email=recruiter_data.email,
            password=hashed_pwd,
            full_name=recruiter_data.full_name,
            phone_number=recruiter_data.phone_number,
            role="recruiter",
            is_active=True
        )
        db.add(new_user)
        db.flush()
        
        # Tạo recruiter profile
        new_recruiter = Recruiter(
            user_id=new_user.id,
            company_name=recruiter_data.company_name,
            company_website=recruiter_data.company_website,
            position=recruiter_data.position,
            industry=recruiter_data.industry,
            company_size=recruiter_data.company_size,
            description=recruiter_data.description
        )
        db.add(new_recruiter)
        db.commit()
        db.refresh(new_recruiter)
        
        return new_recruiter
    
    @staticmethod
    def get_recruiters(db: Session, skip: int = 0, limit: int = 10, search: Optional[str] = None):
        query = db.query(Recruiter).join(User)
        
        if search:
            query = query.filter(
                or_(
                    User.email.ilike(f"%{search}%"),
                    User.full_name.ilike(f"%{search}%"),
                    Recruiter.company_name.ilike(f"%{search}%")
                )
            )
        
        total = query.count()
        recruiters = query.offset(skip).limit(limit).all()
        
        return {"total": total, "recruiters": recruiters}
    
    @staticmethod
    def get_recruiter_by_id(db: Session, recruiter_id: int):
        recruiter = db.query(Recruiter).filter(Recruiter.id == recruiter_id).first()
        if not recruiter:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Recruiter not found"
            )
        return recruiter
    
    @staticmethod
    def update_recruiter(db: Session, recruiter_id: int, recruiter_data: RecruiterUpdate):
        recruiter = RecruiterService.get_recruiter_by_id(db, recruiter_id)
        user = recruiter.user
        
        # Update user fields
        if recruiter_data.full_name:
            user.full_name = recruiter_data.full_name
        if recruiter_data.phone_number:
            user.phone_number = recruiter_data.phone_number
        if recruiter_data.is_active is not None:
            user.is_active = recruiter_data.is_active
        
        # Update recruiter fields
        if recruiter_data.company_name:
            recruiter.company_name = recruiter_data.company_name
        if recruiter_data.company_website:
            recruiter.company_website = recruiter_data.company_website
        if recruiter_data.position:
            recruiter.position = recruiter_data.position
        if recruiter_data.industry:
            recruiter.industry = recruiter_data.industry
        if recruiter_data.company_size:
            recruiter.company_size = recruiter_data.company_size
        if recruiter_data.description:
            recruiter.description = recruiter_data.description
        if recruiter_data.verified:
            recruiter.verified = recruiter_data.verified
        
        db.commit()
        db.refresh(recruiter)
        return recruiter
    
    @staticmethod
    def delete_recruiter(db: Session, recruiter_id: int):
        recruiter = RecruiterService.get_recruiter_by_id(db, recruiter_id)
        user = recruiter.user
        
        db.delete(recruiter)
        db.delete(user)
        db.commit()
        
        return {"message": "Recruiter deleted successfully"}