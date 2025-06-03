from sqlalchemy import Column, Integer, String, Boolean, Text
from sqlalchemy.dialects.postgresql import JSONB
from app.infrastructure.database.database import Base
from app.domain.models.base import TimestampMixin

class Software(Base, TimestampMixin):
    __tablename__ = 'software'

    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    roles_required = Column(JSONB, nullable=False, default=list)

    def __repr__(self):
        return f"<Software(id={self.id}, name='{self.name}', is_active={self.is_active})>"