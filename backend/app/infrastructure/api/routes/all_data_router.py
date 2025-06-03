from fastapi import APIRouter, Depends, HTTPException
from starlette.status import HTTP_204_NO_CONTENT
from sqlalchemy.orm import Session
from app.infrastructure.database.database import get_db
from app.domain.schemas.all_data import AllDataResponse
from app.application.services.all_data_service import (
    get_all_data_service
)
from app.config.logger import get_logger

logger = get_logger("routers.all_data")

router = APIRouter(prefix="/all-data")

@router.get("/", response_model=AllDataResponse, description="Get all data including users, devices, and accesses")
def get_all_data(db: Session = Depends(get_db)):
    try:
        return get_all_data_service(db)
    except Exception as e:
        logger.error(f"Error getting data: {e}")
        raise HTTPException(status_code=400, detail=str(e))

