from sqlalchemy.orm import Session
from app.infrastructure.database.repositories.device_repository import (
    create_device, update_device, get_all_devices, get_device_by_id, delete_device
)
from app.domain.models.device import Device
from app.domain.schemas.device import DeviceCreate, DeviceUpdate
from app.config.logger import get_logger

logger = get_logger("use_cases.device")

def create_device_use_case(db: Session, device_data: DeviceCreate):
    logger.debug(f"create_device_use_case called with data: {device_data.dict()}")
    device = Device(**device_data.dict())
    created = create_device(db, device)
    logger.info(f"Device created successfully - ID: {created.id}")
    return created

def update_device_use_case(db: Session, device_id: str, device_data: DeviceUpdate):
    logger.debug(f"update_device_use_case called with id: {device_id}, data: {device_data.dict(exclude_unset=True)}")
    updated = update_device(db, device_id, device_data)
    if updated:
        logger.info(f"Device updated successfully - ID: {device_id}")
    else:
        logger.warning(f"Device not found - ID: {device_id}")
    return updated

def get_all_devices_use_case(db: Session):
    logger.debug("get_all_devices_use_case called")
    devices = get_all_devices(db)
    logger.info(f"Retrieved {len(devices)} devices")
    return devices

def get_device_by_id_use_case(db: Session, device_id: str):
    logger.debug(f"get_device_by_id_use_case called with id: {device_id}")
    device = get_device_by_id(db, device_id)
    if device:
        logger.info(f"Device found - ID: {device_id}")
    else:
        logger.warning(f"Device not found - ID: {device_id}")
    return device

def delete_device_use_case(db: Session, device_id: str):
    logger.debug(f"delete_device_use_case called with id: {device_id}")
    result = delete_device(db, device_id)
    if result:
        logger.info(f"Device deleted successfully - ID: {device_id}")
    else:
        logger.warning(f"Device not found for deletion - ID: {device_id}")
    return result