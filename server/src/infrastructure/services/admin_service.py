from sqlalchemy.orm import Session
from sqlalchemy import or_
from fastapi import HTTPException, status
from typing import Optional
from ..models.admin import Admin
from ..domain.user.user_entity import User
from ..schemas.admin_schema import AdminCreate, AdminUpdate
from ..auth.jwt import hash_password

class AdminService:
    
    @staticmethod
    def create_admin(db: Session, admin_data: AdminCreate):
        # Kiểm tra email đã tồn tại
        existing_user = db.query(User).filter(User.email == admin_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Tạo user
        hashed_pwd = hash_password(admin_data.password)
        new_user = User(
            email=admin_data.email,
            password=hashed_pwd,
            full_name=admin_data.full_name,
            phone_number=admin_data.phone_number,
            role="admin",
            is_active=True
        )
        db.add(new_user)
        db.flush()
        
        # Tạo admin profile
        new_admin = Admin(
            user_id=new_user.id,
            department=admin_data.department,
            permissions=admin_data.permissions,
            is_super_admin=admin_data.is_super_admin
        )
        db.add(new_admin)
        db.commit()
        db.refresh(new_admin)
        
        return new_admin
    
    @staticmethod
    def get_admins(db: Session, skip: int = 0, limit: int = 10, search: Optional[str] = None):
        query = db.query(Admin).join(User)
        
        if search:
            query = query.filter(
                or_(
                    User.email.ilike(f"%{search}%"),
                    User.full_name.ilike(f"%{search}%")
                )
            )
        
        total = query.count()
        admins = query.offset(skip).limit(limit).all()
        
        return {"total": total, "admins": admins}
    
    @staticmethod
    def get_admin_by_id(db: Session, admin_id: int):
        admin = db.query(Admin).filter(Admin.id == admin_id).first()
        if not admin:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Admin not found"
            )
        return admin
    
    @staticmethod
    def update_admin(db: Session, admin_id: int, admin_data: AdminUpdate):
        admin = AdminService.get_admin_by_id(db, admin_id)
        user = admin.user
        
        # Update user fields
        if admin_data.full_name:
            user.full_name = admin_data.full_name
        if admin_data.phone_number:
            user.phone_number = admin_data.phone_number
        if admin_data.is_active is not None:
            user.is_active = admin_data.is_active
        
        # Update admin fields
        if admin_data.department:
            admin.department = admin_data.department
        if admin_data.permissions:
            admin.permissions = admin_data.permissions
        if admin_data.is_super_admin is not None:
            admin.is_super_admin = admin_data.is_super_admin
        
        db.commit()
        db.refresh(admin)
        return admin
    
    @staticmethod
    def delete_admin(db: Session, admin_id: int):
        admin = AdminService.get_admin_by_id(db, admin_id)
        user = admin.user
        
        db.delete(admin)
        db.delete(user)
        db.commit()
        
        return {"message": "Admin deleted successfully"}