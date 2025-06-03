from pydantic import BaseModel, AnyHttpUrl
from uuid import UUID as UUIDType
from datetime import datetime
from typing import List, Optional
from app.domain.schemas.role import RoleResponse


class SoftwareBase(BaseModel):
    name: str
    description: Optional[str] = None
    is_active: bool = True


class SoftwareRequest(SoftwareBase):
    url: AnyHttpUrl
    roles_required: Optional[List[UUIDType]]


class SoftwareCreate(SoftwareBase):
    url: str


class SoftwarePatch(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    url: Optional[AnyHttpUrl] = None
    is_active: Optional[bool] = None
    roles_required: Optional[List[UUIDType]] = None


class SoftwareUpdate(SoftwarePatch):
    pass


class SoftwareResponse(SoftwareBase):
    id: UUIDType
    url: str
    roles: List[RoleResponse]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
