from sqlalchemy.orm import Session
from app.infrastructure.database.repositories.state_request_repository import (
    create_state_request, update_state_request, get_all_state_requests,
    get_state_request_by_id, delete_state_request
)
from app.domain.models.state_request import StateRequest
from app.domain.schemas.state_request import StateRequestCreate, StateRequestUpdate
from app.config.logger import get_logger

logger = get_logger("use_cases.state_request")

def create_state_request_use_case(db: Session, state_request_data: StateRequestCreate):
    logger.debug(f"create_state_request_use_case called with data: {state_request_data.dict()}")
    state_request = StateRequest(**state_request_data.dict())
    created = create_state_request(db, state_request)
    logger.info(f"StateRequest created - ID: {created.id}")
    return created

def update_state_request_use_case(db: Session, state_request_id: str, state_request_data: StateRequestUpdate):
    logger.debug(f"update_state_request_use_case called with id: {state_request_id}, data: {state_request_data.dict(exclude_unset=True)}")
    updated = update_state_request(db, state_request_id, state_request_data)
    if updated:
        logger.info(f"StateRequest updated - ID: {state_request_id}")
    else:
        logger.warning(f"StateRequest not found - ID: {state_request_id}")
    return updated

def get_all_state_requests_use_case(db: Session):
    logger.debug("get_all_state_requests_use_case called")
    states = get_all_state_requests(db)
    logger.info(f"Retrieved {len(states)} state requests")
    return states

def get_state_request_by_id_use_case(db: Session, state_request_id: str):
    logger.debug(f"get_state_request_by_id_use_case called with id: {state_request_id}")
    state = get_state_request_by_id(db, state_request_id)
    if state:
        logger.info(f"StateRequest found - ID: {state_request_id}")
    else:
        logger.warning(f"StateRequest not found - ID: {state_request_id}")
    return state

def delete_state_request_use_case(db: Session, state_request_id: str):
    logger.debug(f"delete_state_request_use_case called with id: {state_request_id}")
    success = delete_state_request(db, state_request_id)
    if success:
        logger.info(f"StateRequest deleted - ID: {state_request_id}")
    else:
        logger.warning(f"StateRequest not found for deletion - ID: {state_request_id}")
    return success