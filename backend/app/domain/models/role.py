from sqlalchemy import Column, Integer, String
from app.infrastructure.database.database import Base
from app.domain.models.base import TimestampMixin

class Role(Base, TimestampMixin):
    __tablename__ = "roles"

    name = Column(String, nullable=False, unique=True)
    label = Column(String, nullable=False, unique=False)

    def __repr__(self):
        return f"Role(id={self.id}, name='{self.name}', label='{self.label}')"