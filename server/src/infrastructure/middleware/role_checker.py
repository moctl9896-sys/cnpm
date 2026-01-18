from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..auth.jwt import verify_token
from ..domain.user.user_entity import User
from ..infrastructure.databases.postgres import get_db

def get_current_user(token: str = Depends(verify_token), db: Session = Depends(get_db)):
    """
    Lấy thông tin user hiện tại từ token
    """
    user = db.query(User).filter(User.id == token["user_id"]).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    return user

def require_admin(current_user: User = Depends(get_current_user)):
    """
    Middleware yêu cầu user phải là admin
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

def require_super_admin(current_user: User = Depends(get_current_user)):
    """
    Middleware yêu cầu user phải là super admin
    """
    if current_user.role != "admin" or not current_user.admin_profile.is_super_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Super admin access required"
        )
    return current_user

def require_roles(allowed_roles: list):
    """
    Middleware cho phép nhiều roles
    Usage: Depends(require_roles(["admin", "mentor"]))
    """
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Allowed roles: {', '.join(allowed_roles)}"
            )
        return current_user
    return role_checker