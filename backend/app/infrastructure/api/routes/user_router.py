from fastapi import APIRouter, Depends, HTTPException
from starlette.status import HTTP_204_NO_CONTENT
from sqlalchemy.orm import Session
from app.infrastructure.database.database import get_db
from app.domain.schemas.user import UserCreate, UserUpdate, UserResponse
from app.application.use_cases.user_use_case import (
    create_user_use_case,
    get_all_users_use_case,
    get_user_by_id_use_case,
    update_user_use_case,
    delete_user_use_case,
)
from app.config.logger import get_logger

logger = get_logger("routers.user")

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=UserResponse, description="Add a new user")
def add_user(user_data: UserCreate, db: Session = Depends(get_db)):
    logger.debug(f"Route add_user called with data: {user_data.dict()}")
    try:
        logger.debug("Calling create_user_use_case")
        return create_user_use_case(db, user_data)
    except Exception as e:
        logger.error(f"Error adding user: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=list[UserResponse], description="Get all users")
def get_users(db: Session = Depends(get_db)):
    logger.debug("Route get_users called")
    try:
        logger.debug("Calling get_all_users_use_case")
        return get_all_users_use_case(db)
    except Exception as e:
        logger.error(f"Error getting users: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{user_id}", response_model=UserResponse, description="Get a user by id")
def get_user(user_id: str, db: Session = Depends(get_db)):
    logger.debug(f"Route get_user called with user_id: {user_id}")
    try:
        logger.debug("Calling get_user_by_id_use_case")
        return get_user_by_id_use_case(db, user_id)
    except Exception as e:
        logger.error(f"Error getting user by id: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{user_id}", response_model=UserResponse, description="Update a user")
def update_user(user_id: str, user_data: UserUpdate, db: Session = Depends(get_db)):
    logger.debug(f"Route update_user called with user_id: {user_id}, data: {user_data.dict(exclude_unset=True)}")
    try:
        logger.debug("Calling update_user_use_case")
        return update_user_use_case(db, user_id, user_data)
    except Exception as e:
        logger.error(f"Error updating user: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{user_id}", description="Delete a user", status_code=HTTP_204_NO_CONTENT)
def delete_user(user_id: str, db: Session = Depends(get_db)):
    logger.debug(f"Route delete_user called with user_id: {user_id}")
    try:
        logger.debug("Calling delete_user_use_case")
        delete_user_use_case(db, user_id)
    except Exception as e:
        logger.error(f"Error deleting user: {e}")
        raise HTTPException(status_code=400, detail=str(e))