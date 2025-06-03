from pydantic import BaseModel
from app.domain.schemas.user import UserResponse
from app.domain.schemas.device import DeviceResponse
from app.domain.schemas.access import AccessResponse

class AllDataResponse(BaseModel):
  user: list[UserResponse]
  devices: list[DeviceResponse]
  access: list[AccessResponse]
  
  class Config:
    from_attributes = True
