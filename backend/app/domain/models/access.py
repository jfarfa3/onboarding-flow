from sqlalchemy import Column, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.infrastructure.database.database import Base
from app.domain.models.base import TimestampMixin

class Access(Base, TimestampMixin):
    __tablename__ = 'access'

    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    software_id = Column(UUID(as_uuid=True), ForeignKey('software.id'), nullable=False)
    state_request_id = Column(UUID(as_uuid=True), ForeignKey('state_requests.id'), nullable=False)

    user = relationship("User", backref="accesses")
    software = relationship("Software", backref="accesses")
    state_request = relationship("StateRequest", backref="accesses")

    def __repr__(self):
        return f"<Access(id={self.id}, user_id={self.user_id}, software_id={self.software_id}, state_request_id={self.state_request_id})>"