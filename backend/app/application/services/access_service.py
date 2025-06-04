from sqlalchemy.orm import Session
from app.application.use_cases.access_use_case import get_access_by_id_use_case, update_access_use_case
from app.application.use_cases.state_request_use_case import get_state_request_by_id_use_case
from app.domain.schemas.access import AccessUpdate
from app.config.logger import get_logger

logger = get_logger("services.access_service")


def update_access_status_service(db: Session, access_id: str, new_status: str):
    logger.info(f"Iniciando actualización de estado de acceso - Access ID: {access_id}, Nuevo estado: {new_status}")
    
    try:
        logger.info(f"Verificando existencia del estado: {new_status}")
        status_request = get_state_request_by_id_use_case(db, new_status)
        if not status_request:
            logger.error(f"Estado con ID {new_status} no encontrado en la base de datos")
            raise ValueError(f"State request with id {new_status} does not exist.")
        
        logger.info(f"Estado encontrado: {status_request.label}")
        
        logger.info(f"Verificando existencia del acceso con ID: {access_id}")
        existing_access = get_access_by_id_use_case(db, access_id)
        if not existing_access:
            logger.error(f"Acceso con ID {access_id} no encontrado")
            raise ValueError(f"Access with id {access_id} does not exist.")
        
        logger.info(f"Acceso encontrado - Estado actual: {getattr(existing_access, 'status', 'N/A')}")
        
        access_data = AccessUpdate(state_request_id=status_request.id)
        logger.info(f"Datos de actualización preparados: {access_data}")

        logger.info(f"Ejecutando actualización de acceso en base de datos")
        updated_access = update_access_use_case(db, access_id, access_data)
        
        if not updated_access:
            logger.error(f"Fallo en la actualización del acceso con ID {access_id} - Resultado nulo")
            raise ValueError(f"Failed to update access with id {access_id}.")
        
        logger.info(f"Acceso actualizado exitosamente - ID: {access_id}, Nuevo estado: {updated_access.state_request_id}")
        logger.info(f"Proceso de actualización completado para acceso {access_id}")
        
        return updated_access
    
    except ValueError as ve:
        logger.error(f"Error de validación en actualización de acceso: {str(ve)}")
        raise
    except Exception as e:
        logger.error(f"Error inesperado durante la actualización del acceso {access_id}: {str(e)}")
        logger.exception("Detalles completos del error:")
        raise ValueError(f"Unexpected error occurred while updating access {access_id}: {str(e)}")
