from sqlalchemy.orm import Session
from app.infrastructure.database.repositories.role_repository import (
    create_role, update_role, get_all_roles, get_role_by_id, delete_role
)
from app.domain.models.role import Role
from app.domain.schemas.role import RoleCreate, RoleUpdate
from app.config.logger import get_logger

logger = get_logger("use_cases.role")

def create_role_use_case(db: Session, role_data: RoleCreate):
    logger.debug(f"create_role_use_case called with data: {role_data.dict()}")
    role = Role(**role_data.dict())
    created = create_role(db, role)
    logger.info(f"Role created - ID: {created.id}")
    return created

def update_role_use_case(db: Session, role_id: str, role_data: RoleUpdate):
    logger.debug(f"update_role_use_case called with id: {role_id}, data: {role_data.dict(exclude_unset=True)}")
    updated = update_role(db, role_id, role_data)
    if updated:
        logger.info(f"Role updated - ID: {role_id}")
    else:
        logger.warning(f"Role not found - ID: {role_id}")
    return updated

def get_all_roles_use_case(db: Session):
    logger.debug("get_all_roles_use_case called")
    roles = get_all_roles(db)
    logger.info(f"Retrieved {len(roles)} roles")
    return roles

def get_role_by_id_use_case(db: Session, role_id: str):
    logger.debug(f"get_role_by_id_use_case called with id: {role_id}")
    role = get_role_by_id(db, role_id)
    if role:
        logger.info(f"Role found - ID: {role_id}")
    else:
        logger.warning(f"Role not found - ID: {role_id}")
    return role

def delete_role_use_case(db: Session, role_id: str):
    logger.debug(f"delete_role_use_case called with id: {role_id}")
    success = delete_role(db, role_id)
    if success:
        logger.info(f"Role deleted - ID: {role_id}")
    else:
        logger.warning(f"Role not found for deletion - ID: {role_id}")
    return success