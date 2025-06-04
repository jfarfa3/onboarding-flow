from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.infrastructure.database.database import Base
from app.domain.models.base import TimestampMixin
from app.domain.models.software_roles import software_roles

class Role(Base, TimestampMixin):
    __tablename__ = "roles"

    label = Column(String, nullable=False, unique=False)

    software = relationship(
        "Software",
        secondary=software_roles,
        back_populates="roles"
    )

    def __repr__(self):
        return f"Role(id={self.id}, name='{self.name}', label='{self.label}')"