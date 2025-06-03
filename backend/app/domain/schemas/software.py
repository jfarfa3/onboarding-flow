from pydantic import BaseModel, AnyHttpUrl
from uuid import UUID as UUIDType
from datetime import datetime
from typing import List, Optional

class SoftwareBase(BaseModel):
    name: str
    description: Optional[str] = None
    url: Optional[AnyHttpUrl] = None
    is_active: bool = True
    roles_required: List[str]

class SoftwareCreate(SoftwareBase):
    pass

class SoftwarePatch(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    url: Optional[AnyHttpUrl] = None
    is_active: Optional[bool] = None
    roles_required: Optional[List[str]] = None

class SoftwareUpdate(SoftwarePatch):
    pass

class SoftwareResponse(SoftwareBase):
    id: UUIDType
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True