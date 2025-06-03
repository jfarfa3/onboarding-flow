from sqlalchemy.orm import Session, joinedload
from app.domain.models.device import Device
from app.domain.schemas.device import DeviceUpdate

def create_device(db: Session, device: Device):
    db.add(device)
    db.commit()
    db.refresh(device)
    return device

def get_all_devices(db: Session):
    return db.query(Device).options(
        joinedload(Device.state_request),
    ).all()

def get_device_by_id(db: Session, device_id: str):
    return db.query(Device).filter(Device.id == device_id).first()

def update_device(db: Session, device_id: str, device_data: DeviceUpdate):
    device = get_device_by_id(db, device_id)
    if not device:
        return None
    for field, value in device_data.dict(exclude_unset=True).items():
        setattr(device, field, value)
    db.commit()
    db.refresh(device)
    return device

def delete_device(db: Session, device_id: str):
    device = get_device_by_id(db, device_id)
    if not device:
        return False
    db.delete(device)
    db.commit()
    return True