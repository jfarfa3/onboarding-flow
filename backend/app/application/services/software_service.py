from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.domain.schemas.software import SoftwareCreate, SoftwareCreateRequest, SoftwareUpdate
from app.application.use_cases.software_use_case import create_software_use_case, update_software_use_case, get_software_by_id_use_case
from app.application.use_cases.software_roles_use_case import assign_role_to_software_use_case, remove_role_from_software_use_case
from app.application.use_cases.role_use_case import get_role_by_id_use_case
from app.config.logger import get_logger
from typing import List, Set

logger = get_logger("services.software_service")


def _validate_role_exists(db: Session, role_id: str):
    """Valida que un rol exista en la base de datos"""
    logger.info(f"Verificando existencia del rol con ID: {role_id}")
    rol = get_role_by_id_use_case(db, role_id)
    if not rol:
        logger.error(f"Rol con ID {role_id} no encontrado en base de datos")
        raise HTTPException(status_code=404, detail=f"Rol con ID {role_id} no encontrado")
    
    logger.info(f"Rol encontrado - ID: {rol.id}, Label: {rol.label}")
    return rol


def _process_software_url(software_data_dict: dict) -> dict:
    """Procesa y convierte la URL del software si existe"""
    if "url" in software_data_dict and software_data_dict["url"]:
        original_url = software_data_dict["url"]
        software_data_dict["url"] = str(software_data_dict["url"])
        logger.info(f"URL del software procesada: {original_url} -> {software_data_dict['url']}")
    return software_data_dict


def _prepare_software_data_for_update(software_data: SoftwareCreateRequest) -> dict:
    """Prepara los datos del software para actualización, removiendo roles"""
    software_data_dict = software_data.dict()
    logger.info(f"Datos del software convertidos a dict: {software_data_dict}")
    
    # Procesar URL
    software_data_dict = _process_software_url(software_data_dict)
    
    # Remover roles de los datos del software
    software_data_dict.pop("roles_required", None)
    logger.info(f"Datos del software después de remover roles: {software_data_dict}")
    
    return software_data_dict


def _assign_single_role_to_software(db: Session, software_id: str, role_id: str, software_name: str, current_count: int, total_count: int):
    """Asigna un solo rol a un software con manejo de errores y logging"""
    try:
        # Validar que el rol existe
        rol = _validate_role_exists(db, role_id)
        
        # Asignar rol al software
        assign_role_to_software_use_case(db, software_id, rol.id)
        logger.info(f"Rol '{rol.label}' asignado exitosamente al software '{software_name}' ({current_count}/{total_count})")
        return rol
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error al asignar rol {role_id} al software {software_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al asignar rol {role_id}")


def _remove_single_role_from_software(db: Session, software_id: str, role_id: str, current_count: int, total_count: int):
    """Elimina un solo rol de un software con manejo de errores y logging"""
    try:
        logger.info(f"Eliminando rol {role_id} del software {software_id}")
        remove_role_from_software_use_case(db, software_id, role_id)
        logger.info(f"Rol {role_id} eliminado exitosamente ({current_count}/{total_count})")
    except Exception as e:
        logger.error(f"Error al eliminar rol {role_id} del software {software_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al eliminar rol {role_id}")


def _assign_roles_to_software(db: Session, software_id: str, software_name: str, roles_required: List[str]) -> List:
    """Asigna múltiples roles a un software"""
    roles = []
    roles_assigned_count = 0
    logger.info(f"Iniciando asignación de {len(roles_required)} roles al software")
    
    for index, role_id in enumerate(roles_required, 1):
        logger.info(f"Procesando rol {index}/{len(roles_required)} - ID: {role_id}")
        
        rol = _assign_single_role_to_software(
            db, software_id, role_id, software_name, 
            index, len(roles_required)
        )
        roles_assigned_count += 1
        roles.append(rol)
    
    logger.info(f"Asignación completada - {roles_assigned_count} roles asignados al software '{software_name}'")
    return roles


def _update_software_roles(db: Session, software_id: str, current_roles: Set[str], new_roles_required: Set[str]) -> tuple:
    """Actualiza los roles del software comparando actuales vs nuevos"""
    # Identificar cambios necesarios
    roles_to_add = new_roles_required - current_roles
    roles_to_remove = current_roles - new_roles_required
    
    logger.info(f"Análisis de roles - A agregar: {len(roles_to_add)}, A eliminar: {len(roles_to_remove)}")
    logger.info(f"Roles a agregar: {roles_to_add}")
    logger.info(f"Roles a eliminar: {roles_to_remove}")
    
    # Eliminar roles obsoletos
    roles_removed_count = 0
    if roles_to_remove:
        logger.info(f"Iniciando eliminación de {len(roles_to_remove)} roles obsoletos")
        for index, role_id in enumerate(roles_to_remove, 1):
            _remove_single_role_from_software(db, software_id, role_id, index, len(roles_to_remove))
            roles_removed_count += 1
    
    # Agregar nuevos roles
    roles_added_count = 0
    if roles_to_add:
        logger.info(f"Iniciando asignación de {len(roles_to_add)} nuevos roles")
        for index, role_id in enumerate(roles_to_add, 1):
            logger.info(f"Procesando nuevo rol - ID: {role_id}")
            _assign_single_role_to_software(
                db, software_id, role_id, "software", 
                index, len(roles_to_add)
            )
            roles_added_count += 1
    
    return roles_removed_count, roles_added_count


def _log_operation_summary(operation: str, software_name: str, software_id: str, **kwargs):
    """Registra un resumen de la operación realizada"""
    logger.info(f"{operation} completada exitosamente:")
    logger.info(f"  - Software: {software_name} (ID: {software_id})")
    
    for key, value in kwargs.items():
        logger.info(f"  - {key}: {value}")


def _get_current_software_roles(current_software) -> Set[str]:
    """Obtiene los roles actuales de un software"""
    current_roles = set()
    if hasattr(current_software, 'roles') and current_software.roles:
        current_roles = {role.id for role in current_software.roles}
        logger.info(f"Roles actuales del software ({len(current_roles)}): {current_roles}")
    else:
        logger.info("El software no tiene roles asignados actualmente")
    return current_roles


def create_software_service(db: Session, software_data: SoftwareCreateRequest):
    logger.info(f"Iniciando el proceso de creación de software - Nombre: {getattr(software_data, 'name', 'N/A')}")
    logger.info(f"Datos de entrada del software: {software_data}")
    
    try:
        # Validar roles requeridos
        roles_required = software_data.roles_required
        if not roles_required:
            logger.error("No se proporcionaron roles requeridos para el software")
            raise HTTPException(status_code=400, detail="Debe proporcionar al menos un rol requerido")

        logger.info(f"Validación exitosa - Roles requeridos ({len(roles_required)}): {roles_required}")
        
        # Preparar datos del software
        software_data_dict = _prepare_software_data_for_update(software_data)
        
        # Crear software en base de datos
        logger.info("Preparando creación del software en base de datos")
        new_software = SoftwareCreate(**software_data_dict)   
        logger.info(f"Objeto SoftwareCreate preparado: {new_software}")
        
        logger.info("Ejecutando creación del software en base de datos")
        software_created = create_software_use_case(db, new_software)
        if not software_created:
            logger.error("Fallo en la creación del software - Resultado nulo")
            raise HTTPException(status_code=500, detail="Error interno al crear el software")
        
        logger.info(f"Software creado exitosamente - ID: {software_created.id}, Nombre: {software_created.name}")
        
        # Asignar roles al software
        roles = _assign_roles_to_software(db, software_created.id, software_created.name, roles_required)
        
        software_created.roles = roles
        _log_operation_summary(
            "Creación de software", 
            software_created.name, 
            software_created.id,
            roles_asignados=len(roles)
        )
        
        return software_created
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error inesperado durante la creación del software: {str(e)}")
        logger.exception("Detalles completos del error:")
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")


def update_software_service(db: Session, software_id: str, software_data: SoftwareCreateRequest):
    logger.info(f"Iniciando actualización de software - ID: {software_id}, Nombre: {getattr(software_data, 'name', 'N/A')}")
    logger.info(f"Datos de entrada para actualización: {software_data}")
    
    try:
        # Obtener el software actual con todas sus conexiones
        logger.info(f"Obteniendo software actual con ID: {software_id}")
        current_software = get_software_by_id_use_case(db, software_id)
        if not current_software:
            logger.error(f"Software con ID {software_id} no encontrado")
            raise HTTPException(status_code=404, detail=f"Software con ID {software_id} no encontrado")
        
        logger.info(f"Software encontrado - Nombre: {current_software.name}")
        
        # Obtener roles actuales del software
        current_roles = _get_current_software_roles(current_software)
        
        # Obtener nuevos roles requeridos
        new_roles_required = set(software_data.roles_required) if software_data.roles_required else set()
        logger.info(f"Nuevos roles requeridos ({len(new_roles_required)}): {new_roles_required}")
        
        # Preparar datos del software para actualización
        software_data_dict = _prepare_software_data_for_update(software_data)
        
        # Actualizar información básica del software
        logger.info("Actualizando información básica del software")
        software_update = SoftwareUpdate(**software_data_dict)
        updated_software = update_software_use_case(db, software_id, software_update)
        if not updated_software:
            logger.error("Fallo en la actualización del software - Resultado nulo")
            raise HTTPException(status_code=500, detail="Error interno al actualizar el software")
        
        logger.info(f"Información básica del software actualizada exitosamente")
        
        # Actualizar roles del software
        roles_removed_count, roles_added_count = _update_software_roles(
            db, software_id, current_roles, new_roles_required
        )
        
        # Obtener el software actualizado con todos los roles
        logger.info("Obteniendo software actualizado con roles finales")
        final_software = get_software_by_id_use_case(db, software_id)
        
        # Resumen de la operación
        total_roles_final = len(final_software.roles) if hasattr(final_software, 'roles') and final_software.roles else 0
        
        _log_operation_summary(
            "Actualización de software",
            final_software.name,
            software_id,
            roles_eliminados=roles_removed_count,
            roles_agregados=roles_added_count,
            total_roles_finales=total_roles_final
        )
        
        if hasattr(final_software, 'roles') and final_software.roles:
            final_role_labels = [r.label for r in final_software.roles]
            logger.info(f"Roles finales: {final_role_labels}")
        
        return final_software
        
    except HTTPException:
        # Re-raise HTTP exceptions without wrapping
        raise
    except Exception as e:
        logger.error(f"Error inesperado durante la actualización del software {software_id}: {str(e)}")
        logger.exception("Detalles completos del error:")
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")

