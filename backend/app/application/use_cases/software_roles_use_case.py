from sqlalchemy.orm import Session
from uuid import UUID
from app.infrastructure.database.repositories.software_roles_repository import (
    add_role_to_software,
    remove_role_from_software,
    get_roles_by_software
)
from app.domain.models.role import Role
from app.config.logger import get_logger

logger = get_logger("use_cases.software_roles")

def assign_role_to_software_use_case(db: Session, software_id: UUID, role_id: UUID):
    logger.debug(f"assign_role_to_software_use_case called with software_id: {software_id}, role_id: {role_id}")
    add_role_to_software(db, software_id, role_id)
    logger.info(f"Role {role_id} assigned to software {software_id}")

def remove_role_from_software_use_case(db: Session, software_id: UUID, role_id: UUID):
    logger.debug(f"remove_role_from_software_use_case called with software_id: {software_id}, role_id: {role_id}")
    remove_role_from_software(db, software_id, role_id)
    logger.info(f"Role {role_id} removed from software {software_id}")

def get_roles_of_software_use_case(db: Session, software_id: UUID):
    logger.debug(f"get_roles_of_software_use_case called with software_id: {software_id}")
    role_ids = get_roles_by_software(db, software_id)
    roles = db.query(Role).filter(Role.id.in_(role_ids)).all()
    logger.info(f"Retrieved {len(roles)} roles for software {software_id}")
    return roles