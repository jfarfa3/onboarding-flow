from pydantic import BaseModel
from uuid import UUID as UUIDType
from datetime import datetime
from typing import Optional

class StateRequestBase(BaseModel):
    label: str

class StateRequestCreate(StateRequestBase):
    pass

class StateRequestPatch(BaseModel):
    label: Optional[str] = None

class StateRequestUpdate(StateRequestPatch):
    pass

class StateRequestResponse(StateRequestBase):
    id: UUIDType
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True