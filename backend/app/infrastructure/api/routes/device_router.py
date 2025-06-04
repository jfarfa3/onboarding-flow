from fastapi import APIRouter, Depends, HTTPException
from starlette.status import HTTP_204_NO_CONTENT
from sqlalchemy.orm import Session
from app.infrastructure.database.database import get_db
from app.domain.schemas.device import DeviceCreate, DeviceUpdate, DeviceResponse
from app.application.use_cases.device_use_case import (
    create_device_use_case,
    get_all_devices_use_case,
    get_device_by_id_use_case,
    update_device_use_case,
    delete_device_use_case,
)
from app.config.logger import get_logger

logger = get_logger("routers.device")

router = APIRouter(prefix="/devices", tags=["Devices"])

@router.post("/", response_model=DeviceResponse, description="Add a new device")
def add_device(device_data: DeviceCreate, db: Session = Depends(get_db)):
    logger.debug(f"Route add_device called with data: {device_data.dict()}")
    try:
        logger.debug("Calling create_device_use_case")
        return create_device_use_case(db, device_data)
    except Exception as e:
        logger.error(f"Error adding device: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=list[DeviceResponse], description="Get all devices")
def get_devices(db: Session = Depends(get_db)):
    logger.debug("Route get_devices called")
    try:
        logger.debug("Calling get_all_devices_use_case")
        return get_all_devices_use_case(db)
    except Exception as e:
        logger.error(f"Error getting devices: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{device_id}", response_model=DeviceResponse, description="Get a device by id")
def get_device(device_id: str, db: Session = Depends(get_db)):
    logger.debug(f"Route get_device called with id: {device_id}")
    try:
        logger.debug("Calling get_device_by_id_use_case")
        return get_device_by_id_use_case(db, device_id)
    except Exception as e:
        logger.error(f"Error getting device by id: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{device_id}", response_model=DeviceResponse, description="Update a device")
def update_device(device_id: str, device_data: DeviceUpdate, db: Session = Depends(get_db)):
    logger.debug(f"Route update_device called with id: {device_id}, data: {device_data.dict(exclude_unset=True)}")
    try:
        logger.debug("Calling update_device_use_case")
        return update_device_use_case(db, device_id, device_data)
    except Exception as e:
        logger.error(f"Error updating device: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{device_id}", description="Delete a device", status_code=HTTP_204_NO_CONTENT)
def delete_device(device_id: str, db: Session = Depends(get_db)):
    logger.debug(f"Route delete_device called with id: {device_id}")
    try:
        logger.debug("Calling delete_device_use_case")
        delete_device_use_case(db, device_id)
    except Exception as e:
        logger.error(f"Error deleting device: {e}")
        raise HTTPException(status_code=400, detail=str(e))