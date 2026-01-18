from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class StudentCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone_number: Optional[str] = None
    student_code: str
    university: Optional[str] = None
    major: Optional[str] = None
    year_of_study: Optional[int] = None
    gpa: Optional[str] = None
    skills: Optional[str] = None
    cv_url: Optional[str] = None

class StudentUpdate(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    university: Optional[str] = None
    major: Optional[str] = None
    year_of_study: Optional[int] = None
    gpa: Optional[str] = None
    skills: Optional[str] = None
    cv_url: Optional[str] = None
    is_active: Optional[bool] = None

class StudentResponse(BaseModel):
    id: int
    user_id: int
    email: str
    full_name: str
    phone_number: Optional[str]
    student_code: str
    university: Optional[str]
    major: Optional[str]
    year_of_study: Optional[int]
    gpa: Optional[str]
    skills: Optional[str]
    cv_url: Optional[str]
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class StudentList(BaseModel):
    total: int
    page: int
    page_size: int
    students: list[StudentResponse]