from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from ..infrastructure.databases.postgres import get_db
from ..middleware.role_checker import require_admin
from ..services.student_service import StudentService
from ..schemas.student_schema import StudentCreate, StudentUpdate, StudentResponse, StudentList

router = APIRouter(prefix="/api/students", tags=["Student Management"])

@router.post("/", response_model=StudentResponse, dependencies=[Depends(require_admin)])
def create_student(
    student_data: StudentCreate,
    db: Session = Depends(get_db)
):
    """
    Tạo student mới
    """
    student = StudentService.create_student(db, student_data)
    return {
        "id": student.id,
        "user_id": student.user_id,
        "email": student.user.email,
        "full_name": student.user.full_name,
        "phone_number": student.user.phone_number,
        "student_code": student.student_code,
        "university": student.university,
        "major": student.major,
        "year_of_study": student.year_of_study,
        "gpa": student.gpa,
        "skills": student.skills,
        "cv_url": student.cv_url,
        "is_active": student.user.is_active,
        "created_at": student.created_at,
        "updated_at": student.updated_at
    }

@router.get("/", response_model=StudentList, dependencies=[Depends(require_admin)])
def get_students(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách students với phân trang và tìm kiếm
    """
    skip = (page - 1) * page_size
    result = StudentService.get_students(db, skip=skip, limit=page_size, search=search)
    
    student_list = []
    for student in result["students"]:
        student_list.append({
            "id": student.id,
            "user_id": student.user_id,
            "email": student.user.email,
            "full_name": student.user.full_name,
            "phone_number": student.user.phone_number,
            "student_code": student.student_code,
            "university": student.university,
            "major": student.major,
            "year_of_study": student.year_of_study,
            "gpa": student.gpa,
            "skills": student.skills,
            "cv_url": student.cv_url,
            "is_active": student.user.is_active,
            "created_at": student.created_at,
            "updated_at": student.updated_at
        })
    
    return {
        "total": result["total"],
        "page": page,
        "page_size": page_size,
        "students": student_list
    }

@router.get("/{student_id}", response_model=StudentResponse, dependencies=[Depends(require_admin)])
def get_student(
    student_id: int,
    db: Session = Depends(get_db)
):
    """
    Lấy thông tin chi tiết student
    """
    student = StudentService.get_student_by_id(db, student_id)
    return {
        "id": student.id,
        "user_id": student.user_id,
        "email": student.user.email,
        "full_name": student.user.full_name,
        "phone_number": student.user.phone_number,
        "student_code": student.student_code,
        "university": student.university,
        "major": student.major,
        "year_of_study": student.year_of_study,
        "gpa": student.gpa,
        "skills": student.skills,
        "cv_url": student.cv_url,
        "is_active": student.user.is_active,
        "created_at": student.created_at,
        "updated_at": student.updated_at
    }

@router.put("/{student_id}", response_model=StudentResponse, dependencies=[Depends(require_admin)])
def update_student(
    student_id: int,
    student_data: StudentUpdate,
    db: Session = Depends(get_db)
):
    """
    Cập nhật thông tin student
    """
    student = StudentService.update_student(db, student_id, student_data)
    return {
        "id": student.id,
        "user_id": student.user_id,
        "email": student.user.email,
        "full_name": student.user.full_name,
        "phone_number": student.user.phone_number,
        "student_code": student.student_code,
        "university": student.university,
        "major": student.major,
        "year_of_study": student.year_of_study,
        "gpa": student.gpa,
        "skills": student.skills,
        "cv_url": student.cv_url,
        "is_active": student.user.is_active,
        "created_at": student.created_at,
        "updated_at": student.updated_at
    }

@router.delete("/{student_id}", dependencies=[Depends(require_admin)])
def delete_student(
    student_id: int,
    db: Session = Depends(get_db)
):
    """
    Xóa student
    """
    return StudentService.delete_student(db, student_id)