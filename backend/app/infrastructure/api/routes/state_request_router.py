from fastapi import APIRouter, Depends, HTTPException
from starlette.status import HTTP_204_NO_CONTENT
from sqlalchemy.orm import Session
from app.infrastructure.database.database import get_db
from app.domain.schemas.state_request import StateRequestCreate, StateRequestUpdate, StateRequestResponse
from app.application.use_cases.state_request_use_case import (
    create_state_request_use_case,
    get_all_state_requests_use_case,
    get_state_request_by_id_use_case,
    update_state_request_use_case,
    delete_state_request_use_case
)
from app.config.logger import get_logger

logger = get_logger("routers.state_request")

router = APIRouter(prefix="/state-requests", tags=["State Requests"])

@router.post("/", response_model=StateRequestResponse, description="Add a new state request")
def add_state_request(state_request_data: StateRequestCreate, db: Session = Depends(get_db)):
    logger.debug(f"Route add_state_request called with data: {state_request_data.dict()}")
    try:
        logger.debug("Calling create_state_request_use_case")
        return create_state_request_use_case(db, state_request_data)
    except Exception as e:
        logger.error(f"Error adding state request: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=list[StateRequestResponse], description="Get all state requests")
def get_state_requests(db: Session = Depends(get_db)):
    logger.debug("Route get_state_requests called")
    try:
        logger.debug("Calling get_all_state_requests_use_case")
        return get_all_state_requests_use_case(db)
    except Exception as e:
        logger.error(f"Error getting state requests: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{state_request_id}", response_model=StateRequestResponse, description="Get a state request by id")
def get_state_request(state_request_id: str, db: Session = Depends(get_db)):
    logger.debug(f"Route get_state_request called with id: {state_request_id}")
    try:
        logger.debug("Calling get_state_request_by_id_use_case")
        return get_state_request_by_id_use_case(db, state_request_id)
    except Exception as e:
        logger.error(f"Error getting state request by id: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{state_request_id}", response_model=StateRequestResponse, description="Update a state request")
def update_state_request(state_request_id: str, state_request_data: StateRequestUpdate, db: Session = Depends(get_db)):
    logger.debug(f"Route update_state_request called with id: {state_request_id}, data: {state_request_data.dict(exclude_unset=True)}")
    try:
        logger.debug("Calling update_state_request_use_case")
        return update_state_request_use_case(db, state_request_id, state_request_data)
    except Exception as e:
        logger.error(f"Error updating state request: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{state_request_id}", description="Delete a state request", status_code=HTTP_204_NO_CONTENT)
def delete_state_request(state_request_id: str, db: Session = Depends(get_db)):
    logger.debug(f"Route delete_state_request called with id: {state_request_id}")
    try:
        logger.debug("Calling delete_state_request_use_case")
        delete_state_request_use_case(db, state_request_id)
    except Exception as e:
        logger.error(f"Error deleting state request: {e}")
        raise HTTPException(status_code=400, detail=str(e))