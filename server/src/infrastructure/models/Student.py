
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from ..infrastructure.databases.postgres import Base

class Student(Base):
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    student_code = Column(String(50), unique=True, nullable=False)
    university = Column(String(200), nullable=True)
    major = Column(String(100), nullable=True)
    year_of_study = Column(Integer, nullable=True)
    gpa = Column(String(10), nullable=True)
    skills = Column(Text, nullable=True)  # JSON string
    cv_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    user = relationship("User", back_populates="student_profile")
    
    def __repr__(self):
        return f"<Student {self.student_code}>"