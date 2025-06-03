import os
from typing import Union, Optional
from app.config.logger import get_logger

logger = get_logger("config")


def get_env_str(key: str, default: Optional[str] = None) -> str:
    """
    Obtiene una variable de entorno como string
    
    Args:
        key: Nombre de la variable de entorno
        default: Valor por defecto si no existe
    
    Returns:
        Valor de la variable de entorno
    """
    value = os.getenv(key, default)
    if value is None:
        logger.warning(f"Variable de entorno {key} no encontrada y no tiene valor por defecto")
        return ""
    return value


def get_env_bool(key: str, default: bool = False) -> bool:
    """
    Obtiene una variable de entorno como boolean
    
    Args:
        key: Nombre de la variable de entorno
        default: Valor por defecto si no existe
    
    Returns:
        Valor booleano de la variable de entorno
    """
    value = os.getenv(key)
    if value is None:
        logger.debug(f"Variable de entorno {key} no encontrada, usando valor por defecto: {default}")
        return default
    
    # Valores que se consideran True
    true_values = {"true", "1", "yes", "on", "enabled"}
    return value.lower().strip() in true_values


def get_env_int(key: str, default: int = 0) -> int:
    """
    Obtiene una variable de entorno como entero
    
    Args:
        key: Nombre de la variable de entorno
        default: Valor por defecto si no existe
    
    Returns:
        Valor entero de la variable de entorno
    """
    value = os.getenv(key)
    if value is None:
        logger.debug(f"Variable de entorno {key} no encontrada, usando valor por defecto: {default}")
        return default
    
    try:
        return int(value)
    except ValueError:
        logger.error(f"Error convirtiendo {key}='{value}' a entero, usando valor por defecto: {default}")
        return default


def get_env_float(key: str, default: float = 0.0) -> float:
    """
    Obtiene una variable de entorno como float
    
    Args:
        key: Nombre de la variable de entorno
        default: Valor por defecto si no existe
    
    Returns:
        Valor float de la variable de entorno
    """
    value = os.getenv(key)
    if value is None:
        logger.debug(f"Variable de entorno {key} no encontrada, usando valor por defecto: {default}")
        return default
    
    try:
        return float(value)
    except ValueError:
        logger.error(f"Error convirtiendo {key}='{value}' a float, usando valor por defecto: {default}")
        return default


# =============================================
# CONSTANTES DE CONFIGURACIÓN
# =============================================

# Configuración del entorno
DATABASE_URL = get_env_str("DATABASE_URL", "postgresql://postgres:password@localhost:5436/onboarding_flow")

