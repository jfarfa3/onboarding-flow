from fastapi import APIRouter, Depends, HTTPException
from starlette.status import HTTP_204_NO_CONTENT
from app.infrastructure.database.database import get_db
from app.domain.schemas.role import RoleCreate, RoleUpdate, RoleResponse
from app.application.use_cases.role_use_case import (
    create_role_use_case, get_all_roles_use_case,
    get_role_by_id_use_case, update_role_use_case, delete_role_use_case
)
from app.config.logger import get_logger

logger = get_logger("routers.role")

router = APIRouter(prefix="/roles", tags=["Roles"])

@router.post("/", response_model=RoleResponse, description="Add a new role")
def add_role(role_data: RoleCreate, db=Depends(get_db)):
    try:
        return create_role_use_case(db, role_data)
    except Exception as e:
        logger.error(f"Error adding role: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=list[RoleResponse], description="Get all roles")
def get_roles(db=Depends(get_db)):
    try:
        return get_all_roles_use_case(db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{role_id}", response_model=RoleResponse, description="Get a role by id")
def get_role(role_id: str, db=Depends(get_db)):
    try:
        return get_role_by_id_use_case(db, role_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{role_id}", response_model=RoleResponse, description="Update a role")
def update_role(role_id: str, role_data: RoleUpdate, db=Depends(get_db)):
    try:
        return update_role_use_case(db, role_id, role_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{role_id}", description="Delete a role", status_code=HTTP_204_NO_CONTENT)
def delete_role(role_id: str, db=Depends(get_db)):
    try:
        delete_role_use_case(db, role_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))