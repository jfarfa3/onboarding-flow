from fastapi import APIRouter, Depends, HTTPException
from starlette.status import HTTP_204_NO_CONTENT
from app.infrastructure.database.database import get_db
from app.domain.schemas.state_request import StateRequestCreate, StateRequestUpdate, StateRequestResponse
from app.application.use_cases.state_request_use_case import (
    create_state_request_use_case, get_all_state_requests_use_case,
    get_state_request_by_id_use_case, update_state_request_use_case, delete_state_request_use_case
)
from app.config.logger import get_logger

logger = get_logger("routers.state_request")

router = APIRouter(prefix="/state-requests", tags=["State Requests"])

@router.post("/", response_model=StateRequestResponse, description="Add a new state request")
def add_state_request(state_request_data: StateRequestCreate, db=Depends(get_db)):
    try:
        return create_state_request_use_case(db, state_request_data)
    except Exception as e:
        logger.error(f"Error adding state request: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=list[StateRequestResponse], description="Get all state requests")
def get_state_requests(db=Depends(get_db)):
    try:
        return get_all_state_requests_use_case(db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{state_request_id}", response_model=StateRequestResponse, description="Get a state request by id")
def get_state_request(state_request_id: str, db=Depends(get_db)):
    try:
        return get_state_request_by_id_use_case(db, state_request_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{state_request_id}", response_model=StateRequestResponse, description="Update a state request")
def update_state_request(state_request_id: str, state_request_data: StateRequestUpdate, db=Depends(get_db)):
    try:
        return update_state_request_use_case(db, state_request_id, state_request_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{state_request_id}", description="Delete a state request", status_code=HTTP_204_NO_CONTENT)
def delete_state_request(state_request_id: str, db=Depends(get_db)):
    try:
        delete_state_request_use_case(db, state_request_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))