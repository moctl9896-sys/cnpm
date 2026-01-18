from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# Schema cho tạo admin
class AdminCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone_number: Optional[str] = None
    department: Optional[str] = None
    permissions: Optional[str] = None
    is_super_admin: bool = False

# Schema cho cập nhật admin
class AdminUpdate(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    department: Optional[str] = None
    permissions: Optional[str] = None
    is_super_admin: Optional[bool] = None
    is_active: Optional[bool] = None

# Schema response
class AdminResponse(BaseModel):
    id: int
    user_id: int
    email: str
    full_name: str
    phone_number: Optional[str]
    department: Optional[str]
    permissions: Optional[str]
    is_super_admin: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Schema cho danh sách admin
class AdminList(BaseModel):
    total: int
    page: int
    page_size: int
    admins: list[AdminResponse]