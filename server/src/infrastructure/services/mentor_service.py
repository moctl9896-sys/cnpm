from sqlalchemy.orm import Session
from sqlalchemy import or_
from fastapi import HTTPException, status
from typing import Optional
from ..models.mentor import Mentor
from ..domain.user.user_entity import User
from ..schemas.mentor_schema import MentorCreate, MentorUpdate
from ..auth.jwt import hash_password

class MentorService:
    
    @staticmethod
    def create_mentor(db: Session, mentor_data: MentorCreate):
        # Kiểm tra email đã tồn tại
        existing_user = db.query(User).filter(User.email == mentor_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Tạo user
        hashed_pwd = hash_password(mentor_data.password)
        new_user = User(
            email=mentor_data.email,
            password=hashed_pwd,
            full_name=mentor_data.full_name,
            phone_number=mentor_data.phone_number,
            role="mentor",
            is_active=True
        )
        db.add(new_user)
        db.flush()
        
        # Tạo mentor profile
        new_mentor = Mentor(
            user_id=new_user.id,
            expertise=mentor_data.expertise,
            years_of_experience=mentor_data.years_of_experience,
            current_company=mentor_data.current_company,
            linkedin_url=mentor_data.linkedin_url,
            bio=mentor_data.bio,
            hourly_rate=mentor_data.hourly_rate
        )
        db.add(new_mentor)
        db.commit()
        db.refresh(new_mentor)
        
        return new_mentor
    
    @staticmethod
    def get_mentors(db: Session, skip: int = 0, limit: int = 10, search: Optional[str] = None):
        query = db.query(Mentor).join(User)
        
        if search:
            query = query.filter(
                or_(
                    User.email.ilike(f"%{search}%"),
                    User.full_name.ilike(f"%{search}%"),
                    Mentor.expertise.ilike(f"%{search}%"),
                    Mentor.current_company.ilike(f"%{search}%")
                )
            )
        
        total = query.count()
        mentors = query.offset(skip).limit(limit).all()
        
        return {"total": total, "mentors": mentors}
    
    @staticmethod
    def get_mentor_by_id(db: Session, mentor_id: int):
        mentor = db.query(Mentor).filter(Mentor.id == mentor_id).first()
        if not mentor:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Mentor not found"
            )
        return mentor
    
    @staticmethod
    def update_mentor(db: Session, mentor_id: int, mentor_data: MentorUpdate):
        mentor = MentorService.get_mentor_by_id(db, mentor_id)
        user = mentor.user
        
        # Update user fields
        if mentor_data.full_name:
            user.full_name = mentor_data.full_name
        if mentor_data.phone_number:
            user.phone_number = mentor_data.phone_number
        if mentor_data.is_active is not None:
            user.is_active = mentor_data.is_active
        
        # Update mentor fields
        if mentor_data.expertise:
            mentor.expertise = mentor_data.expertise
        if mentor_data.years_of_experience:
            mentor.years_of_experience = mentor_data.years_of_experience
        if mentor_data.current_company:
            mentor.current_company = mentor_data.current_company
        if mentor_data.linkedin_url:
            mentor.linkedin_url = mentor_data.linkedin_url
        if mentor_data.bio:
            mentor.bio = mentor_data.bio
        if mentor_data.hourly_rate:
            mentor.hourly_rate = mentor_data.hourly_rate
        if mentor_data.verified:
            mentor.verified = mentor_data.verified
        
        db.commit()
        db.refresh(mentor)
        return mentor
    
    @staticmethod
    def delete_mentor(db: Session, mentor_id: int):
        mentor = MentorService.get_mentor_by_id(db, mentor_id)
        user = mentor.user
        
        db.delete(mentor)
        db.delete(user)
        db.commit()
        
        return {"message": "Mentor deleted successfully"}