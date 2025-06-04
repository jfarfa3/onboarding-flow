from fastapi import APIRouter, Depends, HTTPException
from starlette.status import HTTP_204_NO_CONTENT
from sqlalchemy.orm import Session
from app.infrastructure.database.database import get_db
from app.domain.schemas.software import SoftwareCreateRequest, SoftwareUpdateRequest, SoftwareResponse
from app.application.services.software_service import (
    create_software_service,
    update_software_service
)
from app.application.use_cases.software_use_case import (
    get_all_software_use_case,
    get_software_by_id_use_case,
    delete_software_use_case,
)
from app.config.logger import get_logger

logger = get_logger("routers.software")

router = APIRouter(prefix="/software", tags=["Software"])

@router.post("/", response_model=SoftwareResponse, description="Add a new software")
def add_software(software_data: SoftwareCreateRequest, db: Session = Depends(get_db)):
    logger.debug(f"Route add_software called with data: {software_data.dict()}")
    try:
        logger.debug("Calling create_software_service")
        return create_software_service(db, software_data)
    except Exception as e:
        logger.error(f"Error adding software: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=list[SoftwareResponse], description="Get all software")
def get_software(db: Session = Depends(get_db)):
    logger.debug("Route get_software called")
    try:
        logger.debug("Calling get_all_software_use_case")
        return get_all_software_use_case(db)
    except Exception as e:
        logger.error(f"Error getting software: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{software_id}", response_model=SoftwareResponse, description="Get a software by id")
def get_software_by_id(software_id: str, db: Session = Depends(get_db)):
    logger.debug(f"Route get_software_by_id called with id: {software_id}")
    try:
        logger.debug("Calling get_software_by_id_use_case")
        return get_software_by_id_use_case(db, software_id)
    except Exception as e:
        logger.error(f"Error getting software by id: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{software_id}", response_model=SoftwareResponse, description="Update a software")
def update_software(software_id: str, software_data: SoftwareUpdateRequest, db: Session = Depends(get_db)):
    logger.debug(f"Route update_software called with id: {software_id}, data: {software_data.dict(exclude_unset=True)}")
    try:
        logger.debug("Calling update_software_service")
        return update_software_service(db, software_id, software_data)
    except Exception as e:
        logger.error(f"Error updating software: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{software_id}", description="Delete a software", status_code=HTTP_204_NO_CONTENT)
def delete_software(software_id: str, db: Session = Depends(get_db)):
    logger.debug(f"Route delete_software called with id: {software_id}")
    try:
        logger.debug("Calling delete_software_use_case")
        delete_software_use_case(db, software_id)
    except Exception as e:
        logger.error(f"Error deleting software: {e}")
        raise HTTPException(status_code=400, detail=str(e))