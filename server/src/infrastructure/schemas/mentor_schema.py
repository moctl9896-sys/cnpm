from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class MentorCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone_number: Optional[str] = None
    expertise: Optional[str] = None
    years_of_experience: Optional[int] = None
    current_company: Optional[str] = None
    linkedin_url: Optional[str] = None
    bio: Optional[str] = None
    hourly_rate: Optional[float] = None

class MentorUpdate(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    expertise: Optional[str] = None
    years_of_experience: Optional[int] = None
    current_company: Optional[str] = None
    linkedin_url: Optional[str] = None
    bio: Optional[str] = None
    hourly_rate: Optional[float] = None
    verified: Optional[str] = None
    is_active: Optional[bool] = None

class MentorResponse(BaseModel):
    id: int
    user_id: int
    email: str
    full_name: str
    phone_number: Optional[str]
    expertise: Optional[str]
    years_of_experience: Optional[int]
    current_company: Optional[str]
    linkedin_url: Optional[str]
    bio: Optional[str]
    hourly_rate: Optional[float]
    rating: float
    total_sessions: int
    verified: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class MentorList(BaseModel):
    total: int
    page: int
    page_size: int
    mentors: list[MentorResponse]