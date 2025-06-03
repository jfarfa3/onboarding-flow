import logging
import sys
from datetime import datetime
from pathlib import Path
from typing import Optional


class CustomFormatter(logging.Formatter):

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
        log_format = "%(asctime)s | %(name)s | %(levelname)s | %(message)s"

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
    logger = logging.getLogger(name)
    logger.setLevel(getattr(logging, level.upper()))

    if logger.handlers:
        return logger

    if console_output:
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(getattr(logging, level.upper()))

        console_formatter = CustomFormatter()
        console_handler.setFormatter(console_formatter)

        console_handler.addFilter(
            lambda record: setattr(record, 'color', True) or True)

        logger.addHandler(console_handler)

    if log_file:
        log_path = Path(log_file)
        log_path.parent.mkdir(parents=True, exist_ok=True)

        file_handler = logging.FileHandler(log_file, encoding='utf-8')
        file_handler.setLevel(getattr(logging, level.upper()))

        file_formatter = CustomFormatter()
        file_handler.setFormatter(file_formatter)

        file_handler.addFilter(lambda record: setattr(
            record, 'color', False) or True)

        logger.addHandler(file_handler)

    return logger


def get_logger(name: str = None) -> logging.Logger:
    base_name = "onboarding_flow"
    if name:
        full_name = f"{base_name}.{name}"
    else:
        full_name = base_name

    return logging.getLogger(full_name)


def configure_default_logger():
    log_dir = Path(__file__).parent.parent.parent / "logs"
    log_file = log_dir / f"app_{datetime.now().strftime('%Y%m%d')}.log"

    return setup_logger(
        name="onboarding_flow",
        level="INFO",
        log_file=str(log_file),
        console_output=True
    )


app_logger = configure_default_logger()
