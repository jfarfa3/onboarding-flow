from sqlalchemy.orm import Session
from sqlalchemy import insert, delete, select
from app.domain.models.software_roles import software_roles
from uuid import UUID

def add_role_to_software(db: Session, software_id: UUID, role_id: UUID):
    stmt = insert(software_roles).values(software_id=software_id, role_id=role_id)
    db.execute(stmt)
    db.commit()

def remove_role_from_software(db: Session, software_id: UUID, role_id: UUID):
    stmt = delete(software_roles).where(
        software_roles.c.software_id == software_id,
        software_roles.c.role_id == role_id
    )
    db.execute(stmt)
    db.commit()

def get_roles_by_software(db: Session, software_id: UUID):
    stmt = select(software_roles.c.role_id).where(software_roles.c.software_id == software_id)
    result = db.execute(stmt).scalars().all()
    return result

def get_software_by_role(db: Session, role_id: UUID):
    stmt = select(software_roles.c.software_id).where(software_roles.c.role_id == role_id)
    result = db.execute(stmt).scalars().all()
    return result