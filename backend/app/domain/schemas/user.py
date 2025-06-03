from typing import Optional
from uuid import UUID as UUIDType
from datetime import datetime
from pydantic import BaseModel, EmailStr
from app.domain.schemas.role import RoleResponse

class UserBase(BaseModel):
    name: str
    email: EmailStr
    area: str
    team: str
    role_id: UUIDType
    is_active: bool = True
    last_login: Optional[datetime] = None

class UserCreate(UserBase):
    pass

class UserPatch(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    area: Optional[str] = None
    team: Optional[str] = None
    role_id: Optional[UUIDType] = None
    is_active: Optional[bool] = None
    last_login: Optional[datetime] = None

class UserUpdate(UserPatch):
    pass

class UserResponse(UserBase):
    id: UUIDType
    created_at: datetime
    updated_at: datetime
    role: RoleResponse

    class Config:
        from_attributes = True