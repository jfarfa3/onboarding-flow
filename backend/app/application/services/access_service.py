from sqlalchemy.orm import Session
from app.application.use_cases.access_use_case import get_access_by_id_use_case, update_access_use_case, create_access_use_case
from app.application.use_cases.state_request_use_case import get_state_request_by_id_use_case
from app.domain.schemas.access import AccessUpdate, AccessCreate
from app.config.logger import get_logger
from fastapi import HTTPException
from app.application.services.notification_service import notify_team_new_request, notify_user_request_update

logger = get_logger("services.access_service")


def update_access_status_service(db: Session, access_id: str, new_status: str):
    logger.info(f"Entrando a update_access_status_service with access_id={access_id}, new_status={new_status}")
    logger.debug(f"Iniciando actualización de estado de acceso - Access ID: {access_id}, Nuevo estado: {new_status}")
    
    try:
        logger.debug(f"Verificando existencia del estado con ID: {new_status}")
        status_request = get_state_request_by_id_use_case(db, new_status)
        if not status_request:
            logger.warning(f"Estado con ID {new_status} no encontrado en la base de datos")
            raise ValueError(f"State request with id {new_status} does not exist.")
        
        logger.debug(f"Estado encontrado: {status_request.label}")
        
        logger.debug(f"Verificando existencia del acceso con ID: {access_id}")
        existing_access = get_access_by_id_use_case(db, access_id)
        if not existing_access:
            logger.warning(f"Acceso con ID {access_id} no encontrado")
            raise ValueError(f"Access with id {access_id} does not exist.")
        
        logger.debug(f"Acceso encontrado - Estado actual: {getattr(existing_access, 'status', 'N/A')}")
        
        user_id = str(existing_access.user_id) if hasattr(existing_access, 'user_id') else None
        if not user_id:
            logger.warning(f"Acceso {access_id} no tiene usuario asignado para notificación")
        
        access_data = AccessUpdate(state_request_id=status_request.id)
        logger.debug(f"Datos de actualización preparados: {access_data}")

        logger.debug(f"Ejecutando update_access_use_case en base de datos")
        updated_access = update_access_use_case(db, access_id, access_data)
        
        if not updated_access:
            logger.error(f"Fallo en la actualización del acceso con ID {access_id} - Resultado nulo")
            raise ValueError(f"Failed to update access with id {access_id}.")
        
        logger.info(f"Acceso actualizado exitosamente - ID: {access_id}, Nuevo estado: {updated_access.state_request_id}")
        
        if user_id:
            logger.debug(f"Notificando usuario {user_id} sobre actualización de estado de acceso")
            notify_user_request_update(
                db=db,
                user_id=user_id,
                request_data=updated_access.__dict__,
                request_type="access",
                new_status=status_request.label
            )
            logger.info(f"Usuario {user_id} notificado sobre la actualización de estado de acceso {access_id}")
        
        logger.debug(f"Proceso de actualización completado para acceso {access_id}")
        
        return updated_access
    
    except ValueError as ve:
        logger.error(f"Error de validación en actualización de acceso: {str(ve)}")
        raise
    except Exception as e:
        logger.error(f"Error inesperado durante la actualización del acceso {access_id}: {str(e)}")
        logger.exception("Detalles completos del error:")
        raise ValueError(f"Unexpected error occurred while updating access {access_id}: {str(e)}")


def create_access_service(db: Session, access_data: AccessCreate):
    logger.info(f"Entrando a create_access_service con datos: {access_data.dict()}")
    logger.debug(f"Iniciando el proceso de creación de solicitud de acceso")
    
    try:
        access_created = create_access_use_case(db, access_data)
        if not access_created:
            logger.error("Fallo en la creación de la solicitud de acceso - Resultado nulo")
            raise HTTPException(status_code=500, detail="Error interno al crear la solicitud de acceso")
        
        logger.info(f"Solicitud de acceso creada - ID: {access_created.id}")
        
        logger.debug(f"Notificando equipo de accesos sobre nueva solicitud")
        notify_team_new_request(
            db=db,
            team_type="access",
            request_data=access_created.__dict__,
            request_type="access"
        )
        
        logger.info(f"Proceso de creación de solicitud de acceso completado - ID: {access_created.id}")
        return access_created
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error inesperado durante la creación de la solicitud de acceso: {str(e)}")
        logger.exception("Detalles completos del error:")
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")
