from sqlalchemy.orm import Session
from app.infrastructure.database.repositories.user_repository import (
    create_user, update_user, get_all_users, get_user_by_id, delete_user
)
from app.domain.models.user import User
from app.domain.schemas.user import UserCreate, UserUpdate

def create_user_use_case(db: Session, user_data: UserCreate):
    user = User(**user_data.dict())
    return create_user(db, user)

def update_user_use_case(db: Session, user_id: str, user_data: UserUpdate):
    return update_user(db, user_id, user_data)

def get_all_users_use_case(db: Session):
    return get_all_users(db)

def get_user_by_id_use_case(db: Session, user_id: str):
    return get_user_by_id(db, user_id)

def delete_user_use_case(db: Session, user_id: str):
    return delete_user(db, user_id)