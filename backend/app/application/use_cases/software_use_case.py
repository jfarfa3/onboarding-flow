from sqlalchemy.orm import Session
from app.infrastructure.database.repositories.software_repository import (
    create_software, update_software, get_all_software, get_software_by_id, delete_software
)
from app.domain.models.software import Software
from app.domain.schemas.software import SoftwareCreate, SoftwareUpdate
from app.config.logger import get_logger

logger = get_logger("use_cases.software")

def create_software_use_case(db: Session, software_data: SoftwareCreate):
    logger.debug(f"create_software_use_case called with data: {software_data.dict()}")
    software = Software(**software_data.dict())
    created = create_software(db, software)
    logger.info(f"Software created - ID: {created.id}")
    return created

def update_software_use_case(db: Session, software_id: str, software_data: SoftwareUpdate):
    logger.debug(f"update_software_use_case called with id: {software_id}, data: {software_data.dict(exclude_unset=True)}")
    updated = update_software(db, software_id, software_data)
    if updated:
        logger.info(f"Software updated - ID: {software_id}")
    else:
        logger.warning(f"Software not found - ID: {software_id}")
    return updated

def get_all_software_use_case(db: Session):
    logger.debug("get_all_software_use_case called")
    list_sw = get_all_software(db)
    logger.info(f"Retrieved {len(list_sw)} software entries")
    return list_sw

def get_software_by_id_use_case(db: Session, software_id: str):
    logger.debug(f"get_software_by_id_use_case called with id: {software_id}")
    sw = get_software_by_id(db, software_id)
    if sw:
        logger.info(f"Software found - ID: {software_id}")
    else:
        logger.warning(f"Software not found - ID: {software_id}")
    return sw

def delete_software_use_case(db: Session, software_id: str):
    logger.debug(f"delete_software_use_case called with id: {software_id}")
    success = delete_software(db, software_id)
    if success:
        logger.info(f"Software deleted - ID: {software_id}")
    else:
        logger.warning(f"Software not found for deletion - ID: {software_id}")
    return success