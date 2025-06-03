from pydantic import BaseModel
from uuid import UUID as UUIDType
from datetime import datetime
from typing import Optional

class AccessBase(BaseModel):
    user_id: UUIDType
    software_id: UUIDType
    state_request_id: UUIDType

class AccessCreate(AccessBase):
    pass

class AccessPatch(BaseModel):
    user_id: Optional[UUIDType] = None
    software_id: Optional[UUIDType] = None
    state_request_id: Optional[UUIDType] = None

class AccessUpdate(AccessPatch):
    pass

class AccessResponse(AccessBase):
    id: UUIDType
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True