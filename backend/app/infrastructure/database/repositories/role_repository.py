from sqlalchemy.orm import Session
from app.domain.models.role import Role
from app.domain.schemas.role import RoleUpdate

def create_role(db: Session, role: Role):
    db.add(role)
    db.commit()
    db.refresh(role)
    return role

def get_all_roles(db: Session):
    return db.query(Role).all()

def get_role_by_id(db: Session, role_id: str):
    return db.query(Role).filter(Role.id == role_id).first()

def update_role(db: Session, role_id: str, role_data: RoleUpdate):
    role = get_role_by_id(db, role_id)
    if not role:
        return None
    for field, value in role_data.dict(exclude_unset=True).items():
        setattr(role, field, value)
    db.commit()
    db.refresh(role)
    return role

def delete_role(db: Session, role_id: str):
    role = get_role_by_id(db, role_id)
    if not role:
        return False
    db.delete(role)
    db.commit()
    return True