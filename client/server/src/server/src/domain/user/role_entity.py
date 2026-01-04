from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from infrastructure.database import Base
from infrastructure.models.user_role import user_role

class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)

    users = relationship(
        "User",
        secondary=user_role,
        back_populates="roles"
    )
