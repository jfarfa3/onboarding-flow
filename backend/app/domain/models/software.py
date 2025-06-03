from sqlalchemy import Column, String, Boolean, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.infrastructure.database.database import Base
from app.domain.models.base import TimestampMixin
from app.domain.models.role import Role
from app.domain.models.software_roles import software_roles

class Software(Base, TimestampMixin):
    __tablename__ = 'software'

    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)

    roles = relationship(
        "Role",
        secondary=software_roles,
        back_populates="software"
    )

    def __repr__(self):
        return f"<Software(id={self.id}, name='{self.name}', is_active={self.is_active})>"