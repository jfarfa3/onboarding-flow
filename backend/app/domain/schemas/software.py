from pydantic import BaseModel, AnyHttpUrl
from uuid import UUID as UUIDType
from datetime import datetime
from typing import List, Optional
from app.domain.schemas.role import RoleResponse


class SoftwareBase(BaseModel):
    name: str
    description: Optional[str] = None
    is_active: bool = True


class SoftwareCreateRequest(SoftwareBase):
    url: AnyHttpUrl
    roles_required: Optional[List[UUIDType]]


class SoftwareUpdateRequest(SoftwareBase):
    url: Optional[AnyHttpUrl] = None
    roles_required: Optional[List[UUIDType]] = None


class SoftwareCreate(SoftwareBase):
    url: str


class SoftwarePatch(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None


class SoftwareUpdate(SoftwarePatch):
    url: str


class SoftwareResponse(SoftwareBase):
    id: UUIDType
    url: str
    roles: List[RoleResponse]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
