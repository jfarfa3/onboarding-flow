from sqlalchemy.orm import Session
from app.domain.models.state_request import StateRequest
from app.domain.schemas.state_request import StateRequestUpdate

def create_state_request(db: Session, state_request: StateRequest):
    db.add(state_request)
    db.commit()
    db.refresh(state_request)
    return state_request

def get_all_state_requests(db: Session):
    return db.query(StateRequest).all()

def get_state_request_by_id(db: Session, state_request_id: str):
    return db.query(StateRequest).filter(StateRequest.id == state_request_id).first()

def update_state_request(db: Session, state_request_id: str, state_request_data: StateRequestUpdate):
    state_request = get_state_request_by_id(db, state_request_id)
    if not state_request:
        return None
    for field, value in state_request_data.dict(exclude_unset=True).items():
        setattr(state_request, field, value)
    db.commit()
    db.refresh(state_request)
    return state_request

def delete_state_request(db: Session, state_request_id: str):
    state_request = get_state_request_by_id(db, state_request_id)
    if not state_request:
        return False
    db.delete(state_request)
    db.commit()
    return True