from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.infrastructure.database.database import Base
from app.domain.models.base import TimestampMixin

class User(Base, TimestampMixin):
    __tablename__ = "users"

    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    area = Column(String, nullable=False)
    team = Column(String, nullable=False)
    role_id = Column(UUID(as_uuid=True), ForeignKey("roles.id"), nullable=False)
    last_login = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default="true", nullable=False)
    
    role = relationship("Role", backref="users")

    def __repr__(self):
        return (
            f"User(id={self.id}, name='{self.name}', email='{self.email}', "
            f"area='{self.area}', team='{self.team}', role_id={self.role_id}, "
            f"last_login={self.last_login}, is_active={self.is_active})"
        )

