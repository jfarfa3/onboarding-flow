import os
from typing import Union, Optional
from app.config.logger import get_logger

logger = get_logger("config")


def get_env_str(key: str, default: Optional[str] = None) -> str:
    value = os.getenv(key, default)
    if value is None:
        logger.warning(f"Variable de entorno {key} no encontrada y no tiene valor por defecto")
        return ""
    return value

DATABASE_URL = get_env_str("DATABASE_URL", "postgresql://postgres:password@localhost:5436/onboarding_flow")

