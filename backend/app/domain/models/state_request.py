from sqlalchemy import Column, Integer, String
from app.infrastructure.database.database import Base
from app.domain.models.base import TimestampMixin

class StateRequest(Base, TimestampMixin):
    __tablename__ = 'state_requests'

    state = Column(String, nullable=False)
    label = Column(String, nullable=False)

    def __repr__(self):
        return f"<StateRequest(id={self.id}, state='{self.state}', label='{self.label}')>"