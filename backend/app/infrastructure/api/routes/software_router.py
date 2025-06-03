from fastapi import APIRouter, Depends, HTTPException
from starlette.status import HTTP_204_NO_CONTENT
from app.infrastructure.database.database import get_db
from app.domain.schemas.software import SoftwareCreate, SoftwareUpdate, SoftwareResponse
from app.application.use_cases.software_use_case import (
    create_software_use_case, get_all_software_use_case,
    get_software_by_id_use_case, update_software_use_case, delete_software_use_case
)
from app.config.logger import get_logger

logger = get_logger("routers.software")

router = APIRouter(prefix="/software", tags=["Software"])

@router.post("/", response_model=SoftwareResponse, description="Add a new software")
def add_software(software_data: SoftwareCreate, db=Depends(get_db)):
    try:
        return create_software_use_case(db, software_data)
    except Exception as e:
        logger.error(f"Error adding software: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=list[SoftwareResponse], description="Get all software")
def get_software(db=Depends(get_db)):
    try:
        return get_all_software_use_case(db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{software_id}", response_model=SoftwareResponse, description="Get a software by id")
def get_software_by_id(software_id: str, db=Depends(get_db)):
    try:
        return get_software_by_id_use_case(db, software_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{software_id}", response_model=SoftwareResponse, description="Update a software")
def update_software(software_id: str, software_data: SoftwareUpdate, db=Depends(get_db)):
    try:
        return update_software_use_case(db, software_id, software_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{software_id}", description="Delete a software", status_code=HTTP_204_NO_CONTENT)
def delete_software(software_id: str, db=Depends(get_db)):
    try:
        delete_software_use_case(db, software_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))