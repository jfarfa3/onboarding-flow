from sqlalchemy.orm import Session
from app.infrastructure.database.repositories.device_repository import (
    create_device, update_device, get_all_devices, get_device_by_id, delete_device
)
from app.domain.models.device import Device
from app.domain.schemas.device import DeviceCreate, DeviceUpdate

def create_device_use_case(db: Session, device_data: DeviceCreate):
    device = Device(**device_data.dict())
    return create_device(db, device)

def update_device_use_case(db: Session, device_id: str, device_data: DeviceUpdate):
    return update_device(db, device_id, device_data)

def get_all_devices_use_case(db: Session):
    return get_all_devices(db)

def get_device_by_id_use_case(db: Session, device_id: str):
    return get_device_by_id(db, device_id)

def delete_device_use_case(db: Session, device_id: str):
    return delete_device(db, device_id)