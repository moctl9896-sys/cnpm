from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class RecruiterCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone_number: Optional[str] = None
    company_name: str
    company_website: Optional[str] = None
    position: Optional[str] = None
    industry: Optional[str] = None
    company_size: Optional[str] = None
    description: Optional[str] = None

class RecruiterUpdate(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    company_name: Optional[str] = None
    company_website: Optional[str] = None
    position: Optional[str] = None
    industry: Optional[str] = None
    company_size: Optional[str] = None
    description: Optional[str] = None
    verified: Optional[str] = None
    is_active: Optional[bool] = None

class RecruiterResponse(BaseModel):
    id: int
    user_id: int
    email: str
    full_name: str
    phone_number: Optional[str]
    company_name: str
    company_website: Optional[str]
    position: Optional[str]
    industry: Optional[str]
    company_size: Optional[str]
    description: Optional[str]
    verified: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class RecruiterList(BaseModel):
    total: int
    page: int
    page_size: int
    recruiters: list[RecruiterResponse]