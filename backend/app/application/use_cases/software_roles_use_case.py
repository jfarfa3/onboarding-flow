from sqlalchemy.orm import Session
from uuid import UUID
from app.infrastructure.database.repositories.software_roles_repository import (
    add_role_to_software,
    remove_role_from_software,
    get_roles_by_software
)
from app.domain.models.role import Role

def assign_role_to_software_use_case(db: Session, software_id: UUID, role_id: UUID):
    add_role_to_software(db, software_id, role_id)

def remove_role_from_software_use_case(db: Session, software_id: UUID, role_id: UUID):
    remove_role_from_software(db, software_id, role_id)

def get_roles_of_software_use_case(db: Session, software_id: UUID):
    role_ids = get_roles_by_software(db, software_id)
    roles = db.query(Role).filter(Role.id.in_(role_ids)).all()
    return roles