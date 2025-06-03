import os
from typing import Union, Optional
from app.config.logger import get_logger

logger = get_logger("config")


def get_env_str(key: str) -> str:
    value = os.getenv(key)
    if value is None:
        logger.warning(f"Variable de entorno {key} no encontrada y no tiene valor por defecto")
        raise ValueError(f"Variable de entorno {key} no encontrada")
    return value

DATABASE_URL = get_env_str("DATABASE_URL")

