from sqlalchemy.orm import Session, joinedload
from app.domain.models.software import Software
from app.domain.schemas.software import SoftwareUpdate

def create_software(db: Session, software: Software):
    db.add(software)
    db.commit()
    db.refresh(software)
    return software

def get_all_software(db: Session):
    return db.query(Software).all()

def get_software_by_id(db: Session, software_id: str):
    return (
        db.query(Software)
        .options(joinedload(Software.roles))
        .filter(Software.id == software_id)
        .first()
    )

def update_software(db: Session, software_id: str, software_data: SoftwareUpdate):
    software = get_software_by_id(db, software_id)
    if not software:
        return None
    for field, value in software_data.dict(exclude_unset=True).items():
        setattr(software, field, value)
    db.commit()
    db.refresh(software)
    return software

def delete_software(db: Session, software_id: str):
    software = get_software_by_id(db, software_id)
    if not software:
        return False
    db.delete(software)
    db.commit()
    return True