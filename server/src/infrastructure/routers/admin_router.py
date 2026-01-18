from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from ..infrastructure.databases.postgres import get_db
from ..middleware.role_checker import require_admin
from ..services.admin_service import AdminService
from ..schemas.admin_schema import AdminCreate, AdminUpdate, AdminResponse, AdminList

router = APIRouter(prefix="/api/admins", tags=["Admin Management"])

@router.post("/", response_model=AdminResponse, dependencies=[Depends(require_admin)])
def create_admin(
    admin_data: AdminCreate,
    db: Session = Depends(get_db)
):
    """
    Tạo admin mới (chỉ admin mới được tạo)
    """
    admin = AdminService.create_admin(db, admin_data)
    return {
        "id": admin.id,
        "user_id": admin.user_id,
        "email": admin.user.email,
        "full_name": admin.user.full_name,
        "phone_number": admin.user.phone_number,
        "department": admin.department,
        "permissions": admin.permissions,
        "is_super_admin": admin.is_super_admin,
        "is_active": admin.user.is_active,
        "created_at": admin.created_at,
        "updated_at": admin.updated_at
    }

@router.get("/", response_model=AdminList, dependencies=[Depends(require_admin)])
def get_admins(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách admins với phân trang và tìm kiếm
    """
    skip = (page - 1) * page_size
    result = AdminService.get_admins(db, skip=skip, limit=page_size, search=search)
    
    admin_list = []
    for admin in result["admins"]:
        admin_list.append({
            "id": admin.id,
            "user_id": admin.user_id,
            "email": admin.user.email,
            "full_name": admin.user.full_name,
            "phone_number": admin.user.phone_number,
            "department": admin.department,
            "permissions": admin.permissions,
            "is_super_admin": admin.is_super_admin,
            "is_active": admin.user.is_active,
            "created_at": admin.created_at,
            "updated_at": admin.updated_at
        })
    
    return {
        "total": result["total"],
        "page": page,
        "page_size": page_size,
        "admins": admin_list
    }

@router.get("/{admin_id}", response_model=AdminResponse, dependencies=[Depends(require_admin)])
def get_admin(
    admin_id: int,
    db: Session = Depends(get_db)
):
    """
    Lấy thông tin chi tiết admin
    """
    admin = AdminService.get_admin_by_id(db, admin_id)
    return {
        "id": admin.id,
        "user_id": admin.user_id,
        "email": admin.user.email,
        "full_name": admin.user.full_name,
        "phone_number": admin.user.phone_number,
        "department": admin.department,
        "permissions": admin.permissions,
        "is_super_admin": admin.is_super_admin,
        "is_active": admin.user.is_active,
        "created_at": admin.created_at,
        "updated_at": admin.updated_at
    }

@router.put("/{admin_id}", response_model=AdminResponse, dependencies=[Depends(require_admin)])
def update_admin(
    admin_id: int,
    admin_data: AdminUpdate,
    db: Session = Depends(get_db)
):
    """
    Cập nhật thông tin admin
    """
    admin = AdminService.update_admin(db, admin_id, admin_data)
    return {
        "id": admin.id,
        "user_id": admin.user_id,
        "email": admin.user.email,
        "full_name": admin.user.full_name,
        "phone_number": admin.user.phone_number,
        "department": admin.department,
        "permissions": admin.permissions,
        "is_super_admin": admin.is_super_admin,
        "is_active": admin.user.is_active,
        "created_at": admin.created_at,
        "updated_at": admin.updated_at
    }

@router.delete("/{admin_id}", dependencies=[Depends(require_admin)])
def delete_admin(
    admin_id: int,
    db: Session = Depends(get_db)
):
    """
    Xóa admin
    """
    return AdminService.delete_admin(db, admin_id)