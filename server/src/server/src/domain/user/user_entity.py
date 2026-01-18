from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from infrastructure.database import Base
from infrastructure.models.user_role import user_role

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)

    roles = relationship(
        "Role",
        secondary=user_role,
        back_populates="users"
    )
    admin_profile = relationship("Admin", back_populates="user", uselist=False)
    student_profile = relationship("Student", back_populates="user", uselist=False)
    recruiter_profile = relationship("Recruiter", back_populates="user", uselist=False)
    mentor_profile = relationship("Mentor", back_populates="user", uselist=False)