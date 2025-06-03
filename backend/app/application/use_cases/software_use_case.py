from sqlalchemy.orm import Session
from app.infrastructure.database.repositories.software_repository import (
    create_software, update_software, get_all_software, get_software_by_id, delete_software
)
from app.domain.models.software import Software
from app.domain.schemas.software import SoftwareCreate, SoftwareUpdate

def create_software_use_case(db: Session, software_data: SoftwareCreate):
    software = Software(**software_data.dict())
    return create_software(db, software)

def update_software_use_case(db: Session, software_id: str, software_data: SoftwareUpdate):
    return update_software(db, software_id, software_data)

def get_all_software_use_case(db: Session):
    return get_all_software(db)

def get_software_by_id_use_case(db: Session, software_id: str):
    return get_software_by_id(db, software_id)

def delete_software_use_case(db: Session, software_id: str):
    return delete_software(db, software_id)