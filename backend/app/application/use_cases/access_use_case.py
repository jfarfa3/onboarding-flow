from sqlalchemy.orm import Session
from app.infrastructure.database.repositories.access_repository import (
    create_access, update_access, get_all_accesses, get_access_by_id, delete_access
)
from app.domain.models.access import Access
from app.domain.schemas.access import AccessCreate, AccessUpdate

def create_access_use_case(db: Session, access_data: AccessCreate):
    access = Access(**access_data.dict())
    return create_access(db, access)

def update_access_use_case(db: Session, access_id: str, access_data: AccessUpdate):
    return update_access(db, access_id, access_data)

def get_all_accesses_use_case(db: Session):
    return get_all_accesses(db)

def get_access_by_id_use_case(db: Session, access_id: str):
    return get_access_by_id(db, access_id)

def delete_access_use_case(db: Session, access_id: str):
    return delete_access(db, access_id)