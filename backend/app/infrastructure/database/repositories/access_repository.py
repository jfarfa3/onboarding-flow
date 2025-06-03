from sqlalchemy.orm import Session, joinedload
from app.domain.models.access import Access
from app.domain.schemas.access import AccessUpdate

def create_access(db: Session, access: Access):
    db.add(access)
    db.commit()
    db.refresh(access)
    return access

def get_all_accesses(db: Session):
    return db.query(Access).options(
        joinedload(Access.software),
        joinedload(Access.state_request),
    ).all()

def get_access_by_id(db: Session, access_id: str):
    return db.query(Access).filter(Access.id == access_id).first()

def update_access(db: Session, access_id: str, access_data: AccessUpdate):
    access = get_access_by_id(db, access_id)
    if not access:
        return None
    for field, value in access_data.dict(exclude_unset=True).items():
        setattr(access, field, value)
    db.commit()
    db.refresh(access)
    return access

def delete_access(db: Session, access_id: str):
    access = get_access_by_id(db, access_id)
    if not access:
        return False
    db.delete(access)
    db.commit()
    return True