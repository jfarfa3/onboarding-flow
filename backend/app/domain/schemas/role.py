from typing import Optional
from uuid import UUID as UUIDType
from datetime import datetime
from pydantic import BaseModel

class RoleBase(BaseModel):
    name: str
    label: str
    
class RoleCreate(RoleBase):
    pass

class RolePatch(BaseModel):
    name: Optional[str] = None
    label: Optional[str] = None
    
class RoleUpdate(RolePatch):
    pass

class RoleResponse(RoleBase):
    id: UUIDType
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
