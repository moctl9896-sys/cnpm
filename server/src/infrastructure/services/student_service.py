from sqlalchemy.orm import Session
from sqlalchemy import or_
from fastapi import HTTPException, status
from typing import Optional
from ..models.student import Student
from ..domain.user.user_entity import User
from ..schemas.student_schema import StudentCreate, StudentUpdate
from ..auth.jwt import hash_password

class StudentService:
    
    @staticmethod
    def create_student(db: Session, student_data: StudentCreate):
        # Kiểm tra email đã tồn tại
        existing_user = db.query(User).filter(User.email == student_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Kiểm tra student_code đã tồn tại
        existing_student = db.query(Student).filter(
            Student.student_code == student_data.student_code
        ).first()
        if existing_student:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Student code already exists"
            )
        
        # Tạo user
        hashed_pwd = hash_password(student_data.password)
        new_user = User(
            email=student_data.email,
            password=hashed_pwd,
            full_name=student_data.full_name,
            phone_number=student_data.phone_number,
            role="student",
            is_active=True
        )
        db.add(new_user)
        db.flush()
        
        # Tạo student profile
        new_student = Student(
            user_id=new_user.id,
            student_code=student_data.student_code,
            university=student_data.university,
            major=student_data.major,
            year_of_study=student_data.year_of_study,
            gpa=student_data.gpa,
            skills=student_data.skills,
            cv_url=student_data.cv_url
        )
        db.add(new_student)
        db.commit()
        db.refresh(new_student)
        
        return new_student
    
    @staticmethod
    def get_students(db: Session, skip: int = 0, limit: int = 10, search: Optional[str] = None):
        query = db.query(Student).join(User)
        
        if search:
            query = query.filter(
                or_(
                    User.email.ilike(f"%{search}%"),
                    User.full_name.ilike(f"%{search}%"),
                    Student.student_code.ilike(f"%{search}%"),
                    Student.university.ilike(f"%{search}%")
                )
            )
        
        total = query.count()
        students = query.offset(skip).limit(limit).all()
        
        return {"total": total, "students": students}
    
    @staticmethod
    def get_student_by_id(db: Session, student_id: int):
        student = db.query(Student).filter(Student.id == student_id).first()
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student not found"
            )
        return student
    
    @staticmethod
    def update_student(db: Session, student_id: int, student_data: StudentUpdate):
        student = StudentService.get_student_by_id(db, student_id)
        user = student.user
        
        # Update user fields
        if student_data.full_name:
            user.full_name = student_data.full_name
        if student_data.phone_number:
            user.phone_number = student_data.phone_number
        if student_data.is_active is not None:
            user.is_active = student_data.is_active
        
        # Update student fields
        if student_data.university:
            student.university = student_data.university
        if student_data.major:
            student.major = student_data.major
        if student_data.year_of_study:
            student.year_of_study = student_data.year_of_study
        if student_data.gpa:
            student.gpa = student_data.gpa
        if student_data.skills:
            student.skills = student_data.skills
        if student_data.cv_url:
            student.cv_url = student_data.cv_url
        
        db.commit()
        db.refresh(student)
        return student
    
    @staticmethod
    def delete_student(db: Session, student_id: int):
        student = StudentService.get_student_by_id(db, student_id)
        user = student.user
        
        db.delete(student)
        db.delete(user)
        db.commit()
        
        return {"message": "Student deleted successfully"}