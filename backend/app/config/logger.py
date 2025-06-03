import logging
import sys
from datetime import datetime
from pathlib import Path
from typing import Optional


class CustomFormatter(logging.Formatter):
    """Formateador personalizado con colores para diferentes niveles de log"""
    
    # Códigos de colores ANSI
    COLORS = {
        'DEBUG': '\033[36m',     # Cyan
        'INFO': '\033[32m',      # Verde
        'WARNING': '\033[33m',   # Amarillo
        'ERROR': '\033[31m',     # Rojo
        'CRITICAL': '\033[35m',  # Magenta
        'RESET': '\033[0m'       # Reset
    }
    
    def format(self, record):
        # Formato base del mensaje
        log_format = "%(asctime)s | %(name)s | %(levelname)s | %(message)s"
        
        # Agregar color si es para consola
        if hasattr(record, 'color') and record.color:
            color = self.COLORS.get(record.levelname, self.COLORS['RESET'])
            log_format = f"{color}{log_format}{self.COLORS['RESET']}"
        
        formatter = logging.Formatter(
            log_format,
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        
        return formatter.format(record)


def setup_logger(
    name: str = "onboarding_flow",
    level: str = "INFO",
    log_file: Optional[str] = None,
    console_output: bool = True
) -> logging.Logger:
    """
    Configura y retorna un logger estándar para la aplicación
    
    Args:
        name: Nombre del logger
        level: Nivel de logging (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        log_file: Ruta del archivo de log (opcional)
        console_output: Si mostrar logs en consola
    
    Returns:
        Logger configurado
    """
    
    # Crear logger
    logger = logging.getLogger(name)
    logger.setLevel(getattr(logging, level.upper()))
    
    # Evitar duplicar handlers si el logger ya existe
    if logger.handlers:
        return logger
    
    # Handler para consola
    if console_output:
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(getattr(logging, level.upper()))
        
        # Formatter con colores para consola
        console_formatter = CustomFormatter()
        console_handler.setFormatter(console_formatter)
        
        # Agregar atributo para identificar que es consola
        console_handler.addFilter(lambda record: setattr(record, 'color', True) or True)
        
        logger.addHandler(console_handler)
    
    # Handler para archivo
    if log_file:
        # Crear directorio si no existe
        log_path = Path(log_file)
        log_path.parent.mkdir(parents=True, exist_ok=True)
        
        file_handler = logging.FileHandler(log_file, encoding='utf-8')
        file_handler.setLevel(getattr(logging, level.upper()))
        
        # Formatter sin colores para archivo
        file_formatter = CustomFormatter()
        file_handler.setFormatter(file_formatter)
        
        # Sin colores para archivo
        file_handler.addFilter(lambda record: setattr(record, 'color', False) or True)
        
        logger.addHandler(file_handler)
    
    return logger


def get_logger(name: str = None) -> logging.Logger:
    """
    Obtiene un logger hijo del logger principal
    
    Args:
        name: Nombre específico del logger (se agregará al nombre base)
    
    Returns:
        Logger configurado
    """
    base_name = "onboarding_flow"
    if name:
        full_name = f"{base_name}.{name}"
    else:
        full_name = base_name
    
    return logging.getLogger(full_name)


# Configuración por defecto
def configure_default_logger():
    """Configura el logger por defecto de la aplicación"""
    
    # Crear directorio de logs
    log_dir = Path(__file__).parent.parent.parent / "logs"
    log_file = log_dir / f"app_{datetime.now().strftime('%Y%m%d')}.log"
    
    return setup_logger(
        name="onboarding_flow",
        level="INFO",
        log_file=str(log_file),
        console_output=True
    )


# Logger principal de la aplicación
app_logger = configure_default_logger()

