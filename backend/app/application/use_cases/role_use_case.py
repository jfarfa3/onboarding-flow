from sqlalchemy.orm import Session
from app.infrastructure.database.repositories.role_repository import (
    create_role, update_role, get_all_roles, get_role_by_id, delete_role
)
from app.domain.models.role import Role
from app.domain.schemas.role import RoleCreate, RoleUpdate

def create_role_use_case(db: Session, role_data: RoleCreate):
    role = Role(**role_data.dict())
    return create_role(db, role)

def update_role_use_case(db: Session, role_id: str, role_data: RoleUpdate):
    return update_role(db, role_id, role_data)

def get_all_roles_use_case(db: Session):
    return get_all_roles(db)

def get_role_by_id_use_case(db: Session, role_id: str):
    return get_role_by_id(db, role_id)

def delete_role_use_case(db: Session, role_id: str):
    return delete_role(db, role_id)