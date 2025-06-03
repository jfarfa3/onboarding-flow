from pydantic import BaseModel
from uuid import UUID as UUIDType
from datetime import datetime
from typing import Optional
from app.domain.schemas.state_request import StateRequestResponse  # Assuming StateRequestResponse is defined elsewhere


class DeviceBase(BaseModel):
    serial_number: Optional[str] = None
    model: Optional[str] = None
    system_operating: Optional[str] = None
    user_id: UUIDType
    state_request_id: Optional[UUIDType] = None

class DeviceCreate(DeviceBase):
    pass

class DevicePatch(BaseModel):
    serial_number: Optional[str] = None
    model: Optional[str] = None
    system_operating: Optional[str] = None
    user_id: Optional[UUIDType] = None
    state_request_id: Optional[UUIDType] = None

class DeviceUpdate(DevicePatch):
    pass

class DeviceResponse(DeviceBase):
    id: UUIDType
    created_at: datetime
    updated_at: datetime
    state_request: StateRequestResponse

    class Config:
        from_attributes = True