from sqlalchemy.orm import Session
from app.infrastructure.database.repositories.state_request_repository import (
    create_state_request, update_state_request, get_all_state_requests,
    get_state_request_by_id, delete_state_request
)
from app.domain.models.state_request import StateRequest
from app.domain.schemas.state_request import StateRequestCreate, StateRequestUpdate

def create_state_request_use_case(db: Session, state_request_data: StateRequestCreate):
    state_request = StateRequest(**state_request_data.dict())
    return create_state_request(db, state_request)

def update_state_request_use_case(db: Session, state_request_id: str, state_request_data: StateRequestUpdate):
    return update_state_request(db, state_request_id, state_request_data)

def get_all_state_requests_use_case(db: Session):
    return get_all_state_requests(db)

def get_state_request_by_id_use_case(db: Session, state_request_id: str):
    return get_state_request_by_id(db, state_request_id)

def delete_state_request_use_case(db: Session, state_request_id: str):
    return delete_state_request(db, state_request_id)