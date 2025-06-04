from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.application.use_cases.device_use_case import (
    create_device_use_case,
    update_device_use_case,
    get_device_by_id_use_case
)
from app.domain.schemas.device import DeviceCreate, DeviceUpdate
from app.application.services.notification_service import notify_team_new_request, notify_user_request_update
from app.config.logger import get_logger

logger = get_logger("services.device_service")

def create_device_service(db: Session, device_data: DeviceCreate):
    logger.info(f"Entrando a create_device_service con datos: {device_data.dict()}")
    logger.debug(f"Iniciando el proceso de creación de device")
    
    try:
        device_created = create_device_use_case(db, device_data)
        if not device_created:
            logger.error("Fallo en la creación del dispositivo - Resultado nulo")
            raise HTTPException(status_code=500, detail="Error interno al crear el dispositivo")
        
        logger.info(f"Dispositivo creado - ID: {device_created.id}")
        
        logger.debug(f"Notificando equipo de TI sobre nueva solicitud de dispositivo")
        notify_team_new_request(
            db=db,
            team_type="it",
            request_data=device_created.__dict__,
            request_type="device"
        )
        
        logger.info(f"Proceso de creación de dispositivo completado - ID: {device_created.id}")
        return device_created
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error inesperado durante la creación del dispositivo: {str(e)}")
        logger.exception("Detalles completos del error:")
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")

def update_device_status_service(db: Session, device_id: str, device_data: DeviceUpdate):
    logger.info(f"Entrando a update_device_status_service con ID={device_id}")
    logger.debug(f"Iniciando actualización de estado de dispositivo - Device ID: {device_id}")
    
    try:
        logger.debug(f"Verificando existencia del dispositivo con ID: {device_id}")
        existing_device = get_device_by_id_use_case(db, device_id)
        if not existing_device:
            logger.warning(f"Dispositivo con ID {device_id} no encontrado")
            raise HTTPException(status_code=404, detail=f"Device with ID {device_id} not found")
        
        logger.debug(f"Dispositivo encontrado - ID: {device_id}")
        user_id = existing_device.user_id if hasattr(existing_device, 'user_id') else None
        
        if not user_id:
            logger.warning(f"Dispositivo {device_id} no tiene usuario asignado para notificación")
        
        logger.debug(f"Actualizando dispositivo en base de datos")
        updated_device = update_device_use_case(db, device_id, device_data)
        
        if not updated_device:
            logger.error(f"Fallo en la actualización del dispositivo con ID {device_id} - Resultado nulo")
            raise HTTPException(status_code=500, detail=f"Failed to update device with ID {device_id}")
        
        logger.info(f"Dispositivo actualizado exitosamente - ID: {device_id}")
        
        if user_id:
            logger.debug(f"Notificando usuario sobre actualización de dispositivo")
            notify_user_request_update(
                db=db,
                user_id=str(user_id),
                request_data=updated_device.__dict__,
                request_type="device"
            )
        
        logger.debug(f"Proceso de actualización completado para dispositivo {device_id}")
        return updated_device
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error inesperado durante la actualización del dispositivo {device_id}: {str(e)}")
        logger.exception("Detalles completos del error:")
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")
