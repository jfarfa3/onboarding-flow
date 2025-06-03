from fastapi import APIRouter, Depends, HTTPException
from starlette.status import HTTP_204_NO_CONTENT
from sqlalchemy.orm import Session
from app.infrastructure.database.database import get_db
from app.domain.schemas.access import AccessCreate, AccessUpdate, AccessResponse
from app.application.use_cases.access_use_case import (
    create_access_use_case, get_all_accesses_use_case,
    get_access_by_id_use_case, update_access_use_case, delete_access_use_case
)
from app.config.logger import get_logger

logger = get_logger("routers.access")

router = APIRouter(prefix="/access", tags=["Access"])

@router.post("/", response_model=AccessResponse, description="Add a new access record")
def add_access(access_data: AccessCreate, db: Session = Depends(get_db)):
    try:
        return create_access_use_case(db, access_data)
    except Exception as e:
        logger.error(f"Error adding access: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=list[AccessResponse], description="Get all access records")
def get_accesses(db: Session = Depends(get_db)):
    try:
        return get_all_accesses_use_case(db)
    except Exception as e:
        logger.error(f"Error getting accesses: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{access_id}", response_model=AccessResponse, description="Get an access record by id")
def get_access(access_id: str, db: Session = Depends(get_db)):
    try:
        return get_access_by_id_use_case(db, access_id)
    except Exception as e:
        logger.error(f"Error getting access by id: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{access_id}", response_model=AccessResponse, description="Update an access record")
def update_access(access_id: str, access_data: AccessUpdate, db: Session = Depends(get_db)):
    try:
        return update_access_use_case(db, access_id, access_data)
    except Exception as e:
        logger.error(f"Error updating access: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{access_id}", description="Delete an access record", status_code=HTTP_204_NO_CONTENT)
def delete_access(access_id: str, db: Session = Depends(get_db)):
    try:
        delete_access_use_case(db, access_id)
    except Exception as e:
        logger.error(f"Error deleting access: {e}")
        raise HTTPException(status_code=400, detail=str(e))