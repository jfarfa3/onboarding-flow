from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.domain.schemas.software import SoftwareCreate, SoftwareRequest
from app.application.use_cases.software_use_case import create_software_use_case
from app.application.use_cases.software_roles_use_case import assign_role_to_software_use_case
from app.application.use_cases.role_use_case import get_role_by_id_use_case
from app.config.logger import get_logger

logger = get_logger("services.software_service")


def create_software_service(db: Session, software_data: SoftwareRequest):
    logger.info("Iniciando el proceso de creación de software")
    roles_required = software_data.roles_required
    if not roles_required:
        logger.error("No se proporcionaron roles requeridos")
        raise HTTPException(status_code=400, detail="Debe proporcionar al menos un rol requerido")

    logger.info(f"Roles requeridos: {roles_required}")
    software_data_dict = software_data.dict()
    if "url" in software_data_dict and software_data_dict["url"]:
        software_data_dict["url"] = str(software_data_dict["url"])
    logger.info(f"Datos del software: {software_data_dict}")
    software_data_dict.pop("roles_required")
    logger.info("Creando nuevo software")
    new_software = SoftwareCreate(**software_data_dict)   
    logger.info(f"Nuevo software a crear: {new_software}")     
    softare_created = create_software_use_case(db, new_software)
    logger.info(f"Software creado con ID: {softare_created.id}")
    
    roles = []
    logger.info("Asignando roles al software")
    for role_id in roles_required:
        logger.info(f"Asignando rol con ID: {role_id} al software con ID: {softare_created.id}")
        rol = get_role_by_id_use_case(db, role_id)
        if not rol:
            logger.error(f"Rol con ID {role_id} no encontrado")
            raise HTTPException(status_code=404, detail=f"Rol con ID {role_id} no encontrado")
        assign_role_to_software_use_case(db, softare_created.id, rol.id)
        logger.info(f"Rol {rol.label} asignado al software {softare_created.name}")
        roles.append(rol)
    
    softare_created.roles = roles
    
    return softare_created
        
