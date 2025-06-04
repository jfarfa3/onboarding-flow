from sqlalchemy.orm import Session
from app.application.use_cases.user_use_case import get_all_users_use_case
from app.application.use_cases.device_use_case import get_all_devices_use_case
from app.application.use_cases.access_use_case import get_all_accesses_use_case
from app.config.logger import get_logger

logger = get_logger("services.all_data")

def get_all_data_service(db: Session):
    logger.debug("Iniciando get_all_data_service")
    try:
        logger.debug("Obteniendo usuarios")
        users = get_all_users_use_case(db)
        logger.debug(f"Usuarios obtenidos: {len(users)} registros")

        logger.debug("Obteniendo dispositivos")
        devices = get_all_devices_use_case(db)
        logger.debug(f"Dispositivos obtenidos: {len(devices)} registros")

        logger.debug("Obteniendo accesos")
        access = get_all_accesses_use_case(db)
        logger.debug(f"Accesos obtenidos: {len(access)} registros")

        logger.info("get_all_data_service completado exitosamente")
        return {"user": users, "devices": devices, "access": access}
    except Exception as e:
        logger.error(f"Error en get_all_data_service: {e}")
        raise


