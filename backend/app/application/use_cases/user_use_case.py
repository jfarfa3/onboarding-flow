from sqlalchemy.orm import Session
from app.infrastructure.database.repositories.user_repository import (
    create_user, update_user, get_all_users, get_user_by_id, delete_user
)
from app.domain.models.user import User
from app.domain.schemas.user import UserCreate, UserUpdate
from app.config.logger import get_logger

logger = get_logger("use_cases.user")

def create_user_use_case(db: Session, user_data: UserCreate):
    logger.debug(f"create_user_use_case called with user_data: {user_data.dict()}")
    user = User(**user_data.dict())
    created = create_user(db, user)
    logger.info(f"User created successfully - ID: {created.id}")
    return created

def update_user_use_case(db: Session, user_id: str, user_data: UserUpdate):
    logger.debug(f"update_user_use_case called with user_id: {user_id}, user_data: {user_data.dict(exclude_unset=True)}")
    updated = update_user(db, user_id, user_data)
    if updated:
        logger.info(f"User updated successfully - ID: {user_id}")
    else:
        logger.warning(f"User not found for update - ID: {user_id}")
    return updated

def get_all_users_use_case(db: Session):
    logger.debug("get_all_users_use_case called")
    users = get_all_users(db)
    logger.info(f"Retrieved {len(users)} users")
    return users

def get_user_by_id_use_case(db: Session, user_id: str):
    logger.debug(f"get_user_by_id_use_case called with user_id: {user_id}")
    user = get_user_by_id(db, user_id)
    if user:
        logger.info(f"User found - ID: {user_id}")
    else:
        logger.warning(f"User not found - ID: {user_id}")
    return user

def delete_user_use_case(db: Session, user_id: str):
    logger.debug(f"delete_user_use_case called with user_id: {user_id}")
    success = delete_user(db, user_id)
    if success:
        logger.info(f"User deleted successfully - ID: {user_id}")
    else:
        logger.warning(f"User not found for deletion - ID: {user_id}")
    return success