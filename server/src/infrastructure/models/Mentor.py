from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from ..infrastructure.databases.postgres import Base

class Mentor(Base):
    __tablename__ = "mentors"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    expertise = Column(String(200), nullable=True)
    years_of_experience = Column(Integer, nullable=True)
    current_company = Column(String(200), nullable=True)
    linkedin_url = Column(String(500), nullable=True)
    bio = Column(Text, nullable=True)
    hourly_rate = Column(Float, nullable=True)
    rating = Column(Float, default=0.0)
    total_sessions = Column(Integer, default=0)
    verified = Column(String(20), default="pending")  # pending, approved, rejected
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    user = relationship("User", back_populates="mentor_profile")
    
    def __repr__(self):
        return f"<Mentor {self.user.full_name}>"

