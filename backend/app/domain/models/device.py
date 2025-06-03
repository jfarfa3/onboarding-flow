from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.infrastructure.database.database import Base
from app.domain.models.base import TimestampMixin

class Device(Base, TimestampMixin):
    __tablename__ = 'devices'

    serial_number = Column(String, nullable=True)
    model = Column(String, nullable=True)
    system_operating = Column(String, nullable=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    state_request_id = Column(UUID(as_uuid=True), ForeignKey('state_requests.id'), nullable=False)

    user = relationship("User", backref="devices")
    state_request = relationship("StateRequest", backref="devices")

    def __repr__(self):
        return f"<Device(id={self.id}, serial_number='{self.serial_number}', model='{self.model}', system_operating='{self.system_operating}', user_id={self.user_id}, state_request_id={self.state_request_id})>"