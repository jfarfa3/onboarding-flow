from fastapi import APIRouter, Depends, HTTPException
from starlette.status import HTTP_204_NO_CONTENT
from sqlalchemy.orm import Session
from app.infrastructure.database.database import get_db
from app.domain.schemas.access import AccessCreate, AccessUpdate, AccessResponse
from app.application.use_cases.access_use_case import (
    create_access_use_case, get_all_accesses_use_case,
    get_access_by_id_use_case, update_access_use_case, delete_access_use_case
)
from app.application.services.access_service import update_access_status_service, create_access_service
from app.config.logger import get_logger

logger = get_logger("routers.access")

router = APIRouter(prefix="/access", tags=["Access"])

@router.post("/", response_model=AccessResponse, description="Add a new access record")
def add_access(access_data: AccessCreate, db: Session = Depends(get_db)):
    logger.debug(f"Route add_access called with data: {access_data.dict()}")
    try:
        logger.debug("Calling create_access_service")
        return create_access_service(db, access_data)
    except Exception as e:
        logger.error(f"Error adding access: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=list[AccessResponse], description="Get all access records")
def get_accesses(db: Session = Depends(get_db)):
    logger.debug("Route get_accesses called")
    try:
        logger.debug("Calling get_all_accesses_use_case")
        return get_all_accesses_use_case(db)
    except Exception as e:
        logger.error(f"Error getting accesses: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{access_id}", response_model=AccessResponse, description="Get an access record by id")
def get_access(access_id: str, db: Session = Depends(get_db)):
    logger.debug(f"Route get_access called with id: {access_id}")
    try:
        logger.debug("Calling get_access_by_id_use_case")
        return get_access_by_id_use_case(db, access_id)
    except Exception as e:
        logger.error(f"Error getting access by id: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{access_id}", response_model=AccessResponse, description="Update an access record")
def update_access(access_id: str, access_data: AccessUpdate, db: Session = Depends(get_db)):
    logger.debug(f"Route update_access called with id: {access_id}, data: {access_data.dict(exclude_unset=True)}")
    try:
        logger.debug("Calling update_access_use_case")
        return update_access_use_case(db, access_id, access_data)
    except Exception as e:
        logger.error(f"Error updating access: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{access_id}", description="Delete an access record", status_code=HTTP_204_NO_CONTENT)
def delete_access(access_id: str, db: Session = Depends(get_db)):
    logger.debug(f"Route delete_access called with id: {access_id}")
    try:
        logger.debug("Calling delete_access_use_case")
        delete_access_use_case(db, access_id)
    except Exception as e:
        logger.error(f"Error deleting access: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    
@router.patch("/{access_id}/{new_status}", response_model=AccessResponse, description="Update the status of an access record")
def update_access_status(access_id: str, new_status: str, db: Session = Depends(get_db)):
    logger.debug(f"Route update_access_status called with id: {access_id}, new_status: {new_status}")
    try:
        logger.debug("Calling update_access_status_service")
        return update_access_status_service(db, access_id, new_status)
         
    except Exception as e:
        logger.error(f"Error updating access status: {e}")
        raise HTTPException(status_code=400, detail=str(e))