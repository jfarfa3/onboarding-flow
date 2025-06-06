#!/bin/bash

# Script avanzado para inicializar nuevos proyectos desde el template
# Autor: GitHub Copilot
# Fecha: 6 de junio de 2025

# Colores para mensajes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Banner
echo -e "${BLUE}╔═════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                                     ║${NC}"
echo -e "${BLUE}║  ${YELLOW}Inicializador Avanzado de Proyectos FastAPI + React + TypeScript${BLUE}  ║${NC}"
echo -e "${BLUE}║                                                                     ║${NC}"
echo -e "${BLUE}╚═════════════════════════════════════════════════════════════════════╝${NC}"

# Importar funciones de utilidad
source "$(dirname "$0")/utils-creator.sh"

# Validación inicial
if [ "$#" -lt 1 ]; then
    echo -e "${RED}Error: Debes proporcionar un nombre para el proyecto${NC}"
    echo -e "${YELLOW}Uso: $0 nombre-del-proyecto [opciones]${NC}"
    echo -e "${YELLOW}Opciones disponibles:${NC}"
    echo -e "  ${GREEN}--no-react${NC}       Solo generar backend (FastAPI)"
    echo -e "  ${GREEN}--no-fastapi${NC}     Solo generar frontend (React)"
    echo -e "  ${GREEN}--minimal${NC}        Versión mínima del proyecto (sin módulos adicionales)"
    exit 1
fi

PROJECT_NAME=$1
shift  # Eliminar el nombre del proyecto de los argumentos

# Opciones por defecto
INCLUDE_BACKEND=true
INCLUDE_FRONTEND=true
MINIMAL_VERSION=true

# Procesar opciones
for arg in "$@"
do
    case $arg in
        --help)
        echo -e "${YELLOW}Uso: $0 nombre-del-proyecto [opciones]${NC}"
        echo -e "${YELLOW}Opciones disponibles:${NC}"
        echo -e "  ${GREEN}--no-react${NC}       Solo generar backend (FastAPI)"
        echo -e "  ${GREEN}--no-fastapi${NC}     Solo generar frontend (React)"
        echo -e "  ${GREEN}--minimal${NC}        Versión mínima del proyecto (sin módulos adicionales)"
        exit 0
        ;;
        --no-react)
        INCLUDE_FRONTEND=false
        ;;
        --no-fastapi)
        INCLUDE_BACKEND=false
        ;;
        --minimal)
        MINIMAL_VERSION=true
        ;;
    esac
done

BASE_DIR=$(pwd)
TEMPLATE_DIR="$BASE_DIR"
TARGET_DIR="$BASE_DIR/../$PROJECT_NAME"

echo -e "${BLUE}Inicializando nuevo proyecto: ${GREEN}$PROJECT_NAME${NC}"

# Cargar configuración del template
if [ -f "$TEMPLATE_DIR/template-config.env" ]; then
    source "$TEMPLATE_DIR/template-config.env"
    echo -e "${BLUE}Configuración cargada desde template-config.env${NC}"
else
    echo -e "${YELLOW}No se encontró template-config.env, usando valores por defecto${NC}"
fi

# Crear estructura base del proyecto
mkdir -p "$TARGET_DIR"

# Función para copiar directorios con exclusiones
copy_dir_with_exclusion() {
    local source_dir=$1
    local target_dir=$2
    local exclude_pattern=$3
    
    if [ -z "$exclude_pattern" ]; then
        cp -r "$source_dir" "$target_dir"
    else
        rsync -a --exclude="$exclude_pattern" "$source_dir/" "$target_dir/"
    fi
}

# Copiar estructura del backend
if [ "$INCLUDE_BACKEND" = true ]; then
    echo -e "${YELLOW}Configurando backend FastAPI...${NC}"
    mkdir -p "$TARGET_DIR/backend"
    
    # Copiar estructura base
    cp -r "$TEMPLATE_DIR/backend/app" "$TARGET_DIR/backend/"
    cp "$TEMPLATE_DIR/backend/Dockerfile" "$TARGET_DIR/backend/"
    cp "$TEMPLATE_DIR/backend/requirements.txt" "$TARGET_DIR/backend/"
    
    # Eliminar scripts y datos iniciales que no necesitamos
    rm -rf "$TARGET_DIR/backend/app/infrastructure/database/scripts" 2>/dev/null || :
    rm -rf "$TARGET_DIR/backend/app/infrastructure/database/init_data" 2>/dev/null || :
    rm -f "$TARGET_DIR/backend/app/infrastructure/database/init_data.py" 2>/dev/null || :
    rm -f "$TARGET_DIR/backend/app/infrastructure/database/seed.py" 2>/dev/null || :
    rm -rf "$TARGET_DIR/backend/app/infrastructure/database/repositories" 2>/dev/null || :
    
    # Limpiar archivos Python compilados y archivos no deseados
    find "$TARGET_DIR/backend" -name "*.pyc" -delete
    find "$TARGET_DIR/backend" -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || :
    
    # Asegurarse de que la estructura de directorios básica existe
    mkdir -p "$TARGET_DIR/backend/app/application/services"
    mkdir -p "$TARGET_DIR/backend/app/application/use_cases"
    mkdir -p "$TARGET_DIR/backend/app/domain/models"
    mkdir -p "$TARGET_DIR/backend/app/domain/schemas"
    mkdir -p "$TARGET_DIR/backend/app/infrastructure/api/routes"
    mkdir -p "$TARGET_DIR/backend/app/infrastructure/repositories"
    mkdir -p "$TARGET_DIR/backend/app/infrastructure/database"
    mkdir -p "$TARGET_DIR/backend/app/config"
    
    # Crear archivos __init__.py en todos los directorios
    find "$TARGET_DIR/backend/app" -type d -exec touch {}/__init__.py \; 2>/dev/null || :
    
    # Configuración específica según opciones
    if [ "$MINIMAL_VERSION" = true ]; then
        echo -e "${YELLOW}Aplicando configuración minimalista para backend...${NC}"
        # Limpiar directorios sin eliminar completamente la estructura
        find "$TARGET_DIR/backend/app/application/services" -type f -not -name "__init__.py" -delete
        find "$TARGET_DIR/backend/app/application/use_cases" -type f -not -name "__init__.py" -delete
        find "$TARGET_DIR/backend/app/domain/schemas" -type f -not -name "__init__.py" -delete
        find "$TARGET_DIR/backend/app/infrastructure/api/routes" -type f -not -name "__init__.py" -delete
        find "$TARGET_DIR/backend/app/infrastructure/repositories" -type f -not -name "__init__.py" -delete
        
        # Limpiar completamente y recrear la estructura básica de models
        rm -rf "$TARGET_DIR/backend/app/domain/models"
        mkdir -p "$TARGET_DIR/backend/app/domain/models"
        
        # Crear archivo __init__.py vacío 
        touch "$TARGET_DIR/backend/app/domain/models/__init__.py"
        
        # Crear archivo base.py con TimestampMixin
        echo '
import uuid
from sqlalchemy import Column, DateTime, func
from sqlalchemy.dialects.postgresql import UUID

class TimestampMixin:
    """Mixin para agregar campos de id y timestamps a los modelos"""
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
' > "$TARGET_DIR/backend/app/domain/models/base.py"

        # Asegurar que los directorios necesarios existan
        mkdir -p "$TARGET_DIR/backend/app/application/services"
        mkdir -p "$TARGET_DIR/backend/app/application/use_cases"
        mkdir -p "$TARGET_DIR/backend/app/domain/models"
        mkdir -p "$TARGET_DIR/backend/app/domain/schemas"
        mkdir -p "$TARGET_DIR/backend/app/infrastructure/api/routes"
        mkdir -p "$TARGET_DIR/backend/app/infrastructure/repositories"
        
        # Crear archivos mínimos
        touch "$TARGET_DIR/backend/app/application/services/__init__.py"
        touch "$TARGET_DIR/backend/app/application/use_cases/__init__.py"
        touch "$TARGET_DIR/backend/app/domain/models/__init__.py"
        touch "$TARGET_DIR/backend/app/domain/schemas/__init__.py"
        touch "$TARGET_DIR/backend/app/infrastructure/repositories/__init__.py"
        
        # Crear modelo básico de Item como ejemplo
        echo '
from sqlalchemy import Column, String, Text
from app.infrastructure.database.database import Base
from app.domain.models.base import TimestampMixin

class Item(Base, TimestampMixin):
    __tablename__ = "items"

    name = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    category = Column(String, nullable=True)

    def __repr__(self):
        return f"Item(id={self.id}, name='{self.name}', category='{self.category}')"
' > "$TARGET_DIR/backend/app/domain/models/item.py"

        # Crear esquema para Item
        echo '
from pydantic import BaseModel, UUID4
from typing import Optional
from datetime import datetime

class ItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: Optional[str] = None

class ItemCreate(ItemBase):
    pass

class ItemUpdate(ItemBase):
    name: Optional[str] = None

class ItemResponse(ItemBase):
    id: UUID4
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
' > "$TARGET_DIR/backend/app/domain/schemas/item.py"

        # Crear repositorio para Items
        echo '
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from app.domain.models.item import Item

class ItemRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, skip: int = 0, limit: int = 100) -> List[Item]:
        return self.db.query(Item).offset(skip).limit(limit).all()

    def get_by_id(self, item_id: UUID) -> Optional[Item]:
        return self.db.query(Item).filter(Item.id == item_id).first()

    def create(self, name: str, description: Optional[str] = None, category: Optional[str] = None) -> Item:
        db_item = Item(name=name, description=description, category=category)
        self.db.add(db_item)
        self.db.commit()
        self.db.refresh(db_item)
        return db_item

    def update(self, item_id: UUID, data: dict) -> Optional[Item]:
        db_item = self.get_by_id(item_id)
        if db_item:
            for key, value in data.items():
                if hasattr(db_item, key) and value is not None:
                    setattr(db_item, key, value)
            self.db.commit()
            self.db.refresh(db_item)
        return db_item

    def delete(self, item_id: UUID) -> bool:
        db_item = self.get_by_id(item_id)
        if db_item:
            self.db.delete(db_item)
            self.db.commit()
            return True
        return False
' > "$TARGET_DIR/backend/app/infrastructure/repositories/item_repository.py"

        # Crear servicio para Items
        echo '
from typing import List, Optional, Dict, Any
from uuid import UUID
from app.infrastructure.repositories.item_repository import ItemRepository
from app.domain.schemas.item import ItemCreate, ItemUpdate

class ItemService:
    def __init__(self, repository: ItemRepository):
        self.repository = repository

    def get_all_items(self, skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
        items = self.repository.get_all(skip, limit)
        return [self._item_to_dict(item) for item in items]

    def get_item(self, item_id: UUID) -> Optional[Dict[str, Any]]:
        item = self.repository.get_by_id(item_id)
        if item:
            return self._item_to_dict(item)
        return None

    def create_item(self, item_data: ItemCreate) -> Dict[str, Any]:
        item = self.repository.create(
            name=item_data.name,
            description=item_data.description,
            category=item_data.category
        )
        return self._item_to_dict(item)

    def update_item(self, item_id: UUID, item_data: ItemUpdate) -> Optional[Dict[str, Any]]:
        data = item_data.model_dump(exclude_unset=True)
        item = self.repository.update(item_id, data)
        if item:
            return self._item_to_dict(item)
        return None

    def delete_item(self, item_id: UUID) -> bool:
        return self.repository.delete(item_id)

    def _item_to_dict(self, item) -> Dict[str, Any]:
        return {
            "id": str(item.id),
            "name": item.name,
            "description": item.description,
            "category": item.category,
            "created_at": item.created_at,
            "updated_at": item.updated_at
        }
' > "$TARGET_DIR/backend/app/application/services/item_service.py"

        # Crear caso de uso para Items
        echo '
from typing import List, Optional, Dict, Any
from uuid import UUID
from sqlalchemy.orm import Session
from app.application.services.item_service import ItemService
from app.infrastructure.repositories.item_repository import ItemRepository
from app.domain.schemas.item import ItemCreate, ItemUpdate

class ItemUseCase:
    def __init__(self, db: Session):
        self.item_service = ItemService(ItemRepository(db))

    def get_items(self, skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
        return self.item_service.get_all_items(skip, limit)

    def get_item(self, item_id: UUID) -> Optional[Dict[str, Any]]:
        return self.item_service.get_item(item_id)

    def create_item(self, item_data: ItemCreate) -> Dict[str, Any]:
        return self.item_service.create_item(item_data)

    def update_item(self, item_id: UUID, item_data: ItemUpdate) -> Optional[Dict[str, Any]]:
        return self.item_service.update_item(item_id, item_data)

    def delete_item(self, item_id: UUID) -> bool:
        return self.item_service.delete_item(item_id)
' > "$TARGET_DIR/backend/app/application/use_cases/item_use_case.py"

        # Crear archivo logger.py en config
        echo '
import logging
import sys
from datetime import datetime
from pathlib import Path
from typing import Optional


class CustomFormatter(logging.Formatter):

    COLORS = {
        "DEBUG": "\\033[36m",
        "INFO": "\\033[32m",
        "WARNING": "\\033[33m",
        "ERROR": "\\033[31m", 
        "CRITICAL": "\\033[35m",
        "RESET": "\\033[0m"
    }

    def format(self, record):
        log_format = "%(asctime)s | %(name)s | %(levelname)s | %(message)s"

        if hasattr(record, "color") and record.color:
            color = self.COLORS.get(record.levelname, self.COLORS["RESET"])
            log_format = color + log_format + self.COLORS["RESET"]

        formatter = logging.Formatter(
            log_format,
            datefmt="%Y-%m-%d %H:%M:%S"
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
            lambda record: setattr(record, "color", True) or True)

        logger.addHandler(console_handler)

    if log_file:
        log_path = Path(log_file)
        log_path.parent.mkdir(parents=True, exist_ok=True)

        file_handler = logging.FileHandler(log_file, encoding="utf-8")
        file_handler.setLevel(getattr(logging, level.upper()))

        file_formatter = CustomFormatter()
        file_handler.setFormatter(file_formatter)

        file_handler.addFilter(lambda record: setattr(
            record, "color", False) or True)

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
    today = datetime.now().strftime("%Y%m%d")
    log_file = log_dir / ("app_" + today + ".log")

    return setup_logger(
        name="onboarding_flow",
        level="INFO",
        log_file=str(log_file),
        console_output=True
    )


app_logger = configure_default_logger()
' > "$TARGET_DIR/backend/app/config/logger.py"

        # Crear router para Items API
        echo '
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.infrastructure.database.database import get_db
from app.application.use_cases.item_use_case import ItemUseCase
from app.domain.schemas.item import ItemCreate, ItemResponse, ItemUpdate

router = APIRouter(
    prefix="/items",
    tags=["items"],
    responses={404: {"description": "Not found"}}
)

@router.get("/", response_model=List[ItemResponse])
async def get_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all items"""
    use_case = ItemUseCase(db)
    return use_case.get_items(skip=skip, limit=limit)

@router.get("/{item_id}", response_model=ItemResponse)
async def get_item(item_id: UUID, db: Session = Depends(get_db)):
    """Get an item by its ID"""
    use_case = ItemUseCase(db)
    item = use_case.get_item(item_id)
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return item

@router.post("/", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
async def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    """Create a new item"""
    use_case = ItemUseCase(db)
    return use_case.create_item(item)

@router.put("/{item_id}", response_model=ItemResponse)
async def update_item(item_id: UUID, item: ItemUpdate, db: Session = Depends(get_db)):
    """Update an existing item"""
    use_case = ItemUseCase(db)
    updated_item = use_case.update_item(item_id, item)
    if updated_item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return updated_item

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(item_id: UUID, db: Session = Depends(get_db)):
    """Delete an item"""
    use_case = ItemUseCase(db)
    if not use_case.delete_item(item_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return None
' > "$TARGET_DIR/backend/app/infrastructure/api/routes/item_router.py"

        # Crear un router básico para la ruta raíz
        echo '
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def root():
    """Root endpoint"""
    return {"message": "API is working, check /docs for more information"}
' > "$TARGET_DIR/backend/app/infrastructure/api/routes/base_router.py"

        # Crear router para healthcheck
        echo '
from fastapi import APIRouter
from datetime import datetime

router = APIRouter(prefix="/health", tags=["health"])

@router.get("/")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }
' > "$TARGET_DIR/backend/app/infrastructure/api/routes/health_router.py"

        # Actualizar init.py para importar los routers
        echo '
from app.infrastructure.api.routes.base_router import router as base_router
from app.infrastructure.api.routes.item_router import router as item_router
from app.infrastructure.api.routes.health_router import router as health_router
' > "$TARGET_DIR/backend/app/infrastructure/api/routes/__init__.py"

        # Crear un nuevo main.py desde cero en lugar de tratar de editar el existente
        echo '
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.config.logger import get_logger
from app.infrastructure.database.database import init_db
from app.infrastructure.api.routes import base_router, item_router, health_router

logger = get_logger("main")

# Cargar variables de entorno
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

app = FastAPI(title="'$PROJECT_NAME' API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    init_db()

# Registrar rutas
app.include_router(base_router)
app.include_router(health_router)
app.include_router(item_router)
' > "$TARGET_DIR/backend/app/main.py"

        # Crear un nuevo database.py desde cero
        echo '
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Crear una base para todos los modelos
Base = declarative_base()

# URL de conexión a la base de datos
DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql://postgres:password@localhost:5436/test_db"
)

# Crear engine y session
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """Devuelve una sesión de base de datos"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Inicializa la base de datos creando todas las tablas definidas en los modelos"""
    # Importar todos los modelos aquí
    import app.domain.models.item
    
    # Crear tablas
    Base.metadata.create_all(bind=engine)
' > "$TARGET_DIR/backend/app/infrastructure/database/database.py"
        
        # Asegurarse de que el directorio de repositorios existe
        mkdir -p "$TARGET_DIR/backend/app/infrastructure/repositories"
        touch "$TARGET_DIR/backend/app/infrastructure/repositories/__init__.py"
    fi
    

    
    # Personalizar nombre del proyecto en configuraciones
    sed -i '' "s/title=\"[^\"]*\"/title=\"$PROJECT_NAME API\"/g" "$TARGET_DIR/backend/app/main.py"
    
    # Crear archivo .env para el backend
    # Usar guiones bajos en lugar de guiones medios para el nombre de la BD en la URL
    DB_NAME=$(echo "$PROJECT_NAME" | tr '-' '_')
    echo "
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5436/$DB_NAME

# Application
APP_NAME=$PROJECT_NAME
ENVIRONMENT=dev
DEBUG=True

# CORS
CORS_ORIGINS=http://localhost:5001,http://localhost:3000
" > "$TARGET_DIR/backend/app/.env"

    # Crear directorio para logs
    mkdir -p "$TARGET_DIR/backend/app/logs"
fi

# Copiar estructura del frontend
if [ "$INCLUDE_FRONTEND" = true ]; then
    echo -e "${YELLOW}Configurando frontend React + TypeScript...${NC}"
    mkdir -p "$TARGET_DIR/frontend"
    
    # Copiar estructura base
    cp -r "$TEMPLATE_DIR/frontend/public" "$TARGET_DIR/frontend/"
    cp -r "$TEMPLATE_DIR/frontend/src" "$TARGET_DIR/frontend/"
    cp "$TEMPLATE_DIR/frontend/Dockerfile" "$TARGET_DIR/frontend/"
    cp "$TEMPLATE_DIR/frontend/nginx.conf" "$TARGET_DIR/frontend/"
    cp "$TEMPLATE_DIR/frontend/package.json" "$TARGET_DIR/frontend/"
    cp "$TEMPLATE_DIR/frontend/tsconfig.json" "$TARGET_DIR/frontend/"
    cp "$TEMPLATE_DIR/frontend/tsconfig.app.json" "$TARGET_DIR/frontend/"
    cp "$TEMPLATE_DIR/frontend/tsconfig.node.json" "$TARGET_DIR/frontend/"
    cp "$TEMPLATE_DIR/frontend/vite.config.ts" "$TARGET_DIR/frontend/"
    cp "$TEMPLATE_DIR/frontend/index.html" "$TARGET_DIR/frontend/"
    cp "$TEMPLATE_DIR/frontend/eslint.config.js" "$TARGET_DIR/frontend/"
    
    # Configuración específica según opciones
    if [ "$MINIMAL_VERSION" = true ]; then
        echo -e "${YELLOW}Aplicando configuración minimalista para frontend...${NC}"
        # Preservar componentes útiles pero eliminar contenido específico del proyecto
        
        # Guardar los componentes reutilizables que queremos conservar
        mkdir -p "$TARGET_DIR/temp/components/molecules"
        mkdir -p "$TARGET_DIR/temp/components/atoms"
        mkdir -p "$TARGET_DIR/temp/components/organism"
        mkdir -p "$TARGET_DIR/temp/types"
        
        # Copiar componentes reutilizables a directorio temporal
        if [ -f "$TARGET_DIR/frontend/src/components/molecules/DynamicTable.tsx" ]; then
            cp "$TARGET_DIR/frontend/src/components/molecules/DynamicTable.tsx" "$TARGET_DIR/temp/components/molecules/"
        fi
        if [ -f "$TARGET_DIR/frontend/src/components/molecules/DynamicForm.tsx" ]; then
            cp "$TARGET_DIR/frontend/src/components/molecules/DynamicForm.tsx" "$TARGET_DIR/temp/components/molecules/"
        fi
        if [ -f "$TARGET_DIR/frontend/src/components/molecules/DynamicFilterForm.tsx" ]; then
            cp "$TARGET_DIR/frontend/src/components/molecules/DynamicFilterForm.tsx" "$TARGET_DIR/temp/components/molecules/"
        fi
        if [ -f "$TARGET_DIR/frontend/src/components/molecules/StatCard.tsx" ]; then
            cp "$TARGET_DIR/frontend/src/components/molecules/StatCard.tsx" "$TARGET_DIR/temp/components/molecules/"
        fi
        if [ -f "$TARGET_DIR/frontend/src/components/organism/DynamicFilterTable.tsx" ]; then
            cp "$TARGET_DIR/frontend/src/components/organism/DynamicFilterTable.tsx" "$TARGET_DIR/temp/components/organism/"
        fi
        if [ -f "$TARGET_DIR/frontend/src/types/dynamicTable.ts" ]; then
            cp "$TARGET_DIR/frontend/src/types/dynamicTable.ts" "$TARGET_DIR/temp/types/"
        fi
        if [ -f "$TARGET_DIR/frontend/src/types/dynamicForm.ts" ]; then
            cp "$TARGET_DIR/frontend/src/types/dynamicForm.ts" "$TARGET_DIR/temp/types/"
        fi
        if [ -f "$TARGET_DIR/frontend/src/types/input.ts" ]; then
            cp "$TARGET_DIR/frontend/src/types/input.ts" "$TARGET_DIR/temp/types/"
        fi
        
        # Limpiar directorios para configuración mínima
        rm -rf "$TARGET_DIR/frontend/src/components/"*
        rm -rf "$TARGET_DIR/frontend/src/hooks/"*
        rm -rf "$TARGET_DIR/frontend/src/services/"*
        rm -rf "$TARGET_DIR/frontend/src/store/"*
        rm -rf "$TARGET_DIR/frontend/src/types/"*
        rm -rf "$TARGET_DIR/frontend/src/mocks"
        
        # Crear estructura básica
        mkdir -p "$TARGET_DIR/frontend/src/components/pages"
        mkdir -p "$TARGET_DIR/frontend/src/components/molecules"
        mkdir -p "$TARGET_DIR/frontend/src/components/atoms"
        mkdir -p "$TARGET_DIR/frontend/src/components/organism"
        mkdir -p "$TARGET_DIR/frontend/src/components/examples"
        mkdir -p "$TARGET_DIR/frontend/src/hooks"
        mkdir -p "$TARGET_DIR/frontend/src/services"
        mkdir -p "$TARGET_DIR/frontend/src/store"
        mkdir -p "$TARGET_DIR/frontend/src/types"
        
        # Crear componentes básicos
        # Restaurar los componentes reutilizables que guardamos
        if [ -f "$TARGET_DIR/temp/components/molecules/DynamicTable.tsx" ]; then
            cp "$TARGET_DIR/temp/components/molecules/DynamicTable.tsx" "$TARGET_DIR/frontend/src/components/molecules/"
        fi
        if [ -f "$TARGET_DIR/temp/components/molecules/DynamicForm.tsx" ]; then
            cp "$TARGET_DIR/temp/components/molecules/DynamicForm.tsx" "$TARGET_DIR/frontend/src/components/molecules/"
        fi
        if [ -f "$TARGET_DIR/temp/components/molecules/DynamicFilterForm.tsx" ]; then
            cp "$TARGET_DIR/temp/components/molecules/DynamicFilterForm.tsx" "$TARGET_DIR/frontend/src/components/molecules/"
        fi
        if [ -f "$TARGET_DIR/temp/components/molecules/StatCard.tsx" ]; then
            cp "$TARGET_DIR/temp/components/molecules/StatCard.tsx" "$TARGET_DIR/frontend/src/components/molecules/"
        fi
        if [ -f "$TARGET_DIR/temp/components/organism/DynamicFilterTable.tsx" ]; then
            cp "$TARGET_DIR/temp/components/organism/DynamicFilterTable.tsx" "$TARGET_DIR/frontend/src/components/organism/"
        fi
        if [ -f "$TARGET_DIR/temp/types/dynamicTable.ts" ]; then
            cp "$TARGET_DIR/temp/types/dynamicTable.ts" "$TARGET_DIR/frontend/src/types/"
        fi
        if [ -f "$TARGET_DIR/temp/types/dynamicForm.ts" ]; then
            cp "$TARGET_DIR/temp/types/dynamicForm.ts" "$TARGET_DIR/frontend/src/types/"
        fi
        if [ -f "$TARGET_DIR/temp/types/input.ts" ]; then
            cp "$TARGET_DIR/temp/types/input.ts" "$TARGET_DIR/frontend/src/types/"
        fi
        
        # Limpiar directorio temporal
        rm -rf "$TARGET_DIR/temp"
        
        # Crear archivos de utilidades necesarios para los componentes
        create_utils_files "$TARGET_DIR"
        
        # Crear un archivo básico de utilidades para JWT
        mkdir -p "$TARGET_DIR/frontend/src/utils"
        echo '
// Basic JWT utility functions (fake implementation for demo purposes)
// In a real application, replace with proper JWT handling

export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  
  try {
    // In a real implementation, you would verify the token properly
    // This is just a simple check
    const parts = token.split(".");
    return parts.length === 3;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
};

export const getTokenData = (token: string | null): any => {
  if (!token) return null;
  
  try {
    // In a real implementation, you would verify the token
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function(c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
' > "$TARGET_DIR/frontend/src/utils/jwt.ts"
        
        # Copiar ejemplos de uso de componentes
        if [ -f "$TEMPLATE_DIR/frontend/src/components/examples/FilterTableExample.tsx" ]; then
            cp "$TEMPLATE_DIR/frontend/src/components/examples/FilterTableExample.tsx" "$TARGET_DIR/frontend/src/components/examples/"
            echo -e "${BLUE}Se ha copiado el componente de ejemplo de tabla dinámica${NC}"
        fi
        
        # Crear un Input básico para que los componentes funcionen
        mkdir -p "$TARGET_DIR/frontend/src/components/atoms"
        echo '
import React from "react";
import { type FieldConfig } from "@/types/input";

interface InputProps {
  field: FieldConfig;
  onInput: (name: string, value: string) => void;
  onBlur: (name: string, value: string) => void;
  onFocus: (name: string) => void;
}

const Input: React.FC<InputProps> = ({ field, onInput, onBlur, onFocus }) => {
  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onInput(field.name, e.target.value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    onBlur(field.name, e.target.value);
  };

  const handleFocus = () => {
    onFocus(field.name);
  };

  const inputClasses = `block w-full rounded-md border py-1.5 px-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm sm:leading-6
    ${field.state === "error" ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
    ${field.state === "success" ? "border-green-500 focus:border-green-500 focus:ring-green-500" : ""}
    ${field.state === "default" || !field.state ? "border-gray-300" : ""}`;

  const renderField = () => {
    switch (field.type) {
      case "select":
        return (
          <select
            id={field.id}
            name={field.name}
            className={inputClasses}
            value={field.value || ""}
            onChange={handleInput}
            onBlur={handleBlur}
            onFocus={handleFocus}
            required={field.required}
            disabled={field.disabled}
          >
            <option value="">{field.placeholder || "Select an option..."}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <input
            type={field.type}
            id={field.id}
            name={field.name}
            className={inputClasses}
            value={field.value || ""}
            placeholder={field.placeholder}
            onChange={handleInput}
            onBlur={handleBlur}
            onFocus={handleFocus}
            required={field.required}
            disabled={field.disabled}
            min={field.min}
            max={field.max}
          />
        );
    }
  };

  return (
    <div>
      <label htmlFor={field.id} className="block text-sm font-medium leading-6 text-gray-900">
        {field.label} {field.required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-2">
        {renderField()}
      </div>
      {field.state === "error" && field.validationMessage && (
        <p className="mt-1 text-sm text-red-500">{field.validationMessage}</p>
      )}
    </div>
  );
};

export default Input;
' > "$TARGET_DIR/frontend/src/components/atoms/Input.tsx"

        # Crear una página de inicio simple con ejemplos de los componentes reutilizables
        echo '
import React from "react";
import StatCard from "../molecules/StatCard";
import DynamicTable from "../molecules/DynamicTable";
import { ArrowUp, BarChart2, Users, Server } from "lucide-react";
import type { DynamicColumns } from "@/types/dynamicTable";

interface ExampleData {
  id: number;
  name: string;
  email: string;
  role: string;
}

const HomePage: React.FC = () => {
  const exampleData: ExampleData[] = [
    { id: 1, name: "User 1", email: "user1@example.com", role: "Admin" },
    { id: 2, name: "User 2", email: "user2@example.com", role: "User" },
    { id: 3, name: "User 3", email: "user3@example.com", role: "Developer" },
  ];

  const columns: DynamicColumns<ExampleData>[] = [
    { header: "ID", accessor: "id" as keyof ExampleData },
    { header: "Name", accessor: "name" as keyof ExampleData },
    { header: "Email", accessor: "email" as keyof ExampleData },
    { header: "Role", accessor: "role" as keyof ExampleData },
  ];

  const chartData = [
    { value: 10 },
    { value: 15 },
    { value: 7 },
    { value: 12 },
    { value: 18 },
    { value: 5 },
    { value: 10 },
  ];

  return (
    <div className="container mx-auto p-4 text-black">
      <h1 className="text-2xl font-bold mb-4">Welcome to '${PROJECT_NAME}'</h1>
      <p className="mb-8">This template includes reusable components for your app.</p>
      
      <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
        <h3 className="text-lg font-semibold mb-2">📘 Componentes Reutilizables</h3>
        <p>Este proyecto incluye componentes reutilizables listos para usar:</p>
        <ul className="list-disc ml-6 mt-2">
          <li>Tablas dinámicas con filtrado y ordenación</li>
          <li>Formularios dinámicos generados desde configuración</li>
          <li>Tarjetas de estadísticas con gráficos</li>
        </ul>
        <p className="mt-2">Para más información, consulta el archivo <code className="bg-gray-100 px-1 py-0.5 rounded">REUSABLE_COMPONENTS.md</code> en la raíz del proyecto.</p>
        <p className="mt-2">También puedes ver un ejemplo completo en <code className="bg-gray-100 px-1 py-0.5 rounded">src/components/examples/FilterTableExample.tsx</code></p>
      </div>
      
      <h2 className="text-xl font-bold mb-4">Stat Cards Example</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 text-gray-900">
        <StatCard 
          title="Total Users" 
          value="2,845" 
          icon={<Users className="opacity-20 text-blue-500" />}
          percentageChange="+12.5%" 
          trendIcon={<ArrowUp className="text-green-500" />}
          chartData={chartData}
          chartColor="#3b82f6"
          className="bg-white"
        />
        
        <StatCard 
          title="Active Projects" 
          value="16" 
          icon={<BarChart2 className="opacity-20 text-purple-500" />}
          percentageChange="+3.2%" 
          trendIcon={<ArrowUp className="text-green-500" />}
          chartData={chartData}
          chartColor="#8b5cf6"
          className="bg-white"
        />
        
        <StatCard 
          title="Server Uptime" 
          value="99.98%" 
          icon={<Server className="opacity-20 text-green-500" />}
          chartData={chartData}
          chartColor="#22c55e"
          className="bg-white"
        />
      </div>
      
      <h2 className="text-xl font-bold mb-4">Dynamic Table Example</h2>
      <DynamicTable 
        data={exampleData} 
        columns={columns} 
        actions={(item) => (
          <button 
            className="text-blue-500 hover:text-blue-700"
            onClick={() => console.log("View item:", item)}
          >
            View
          </button>
        )}
      />
    </div>
  );
};

export default HomePage;
' > "$TARGET_DIR/frontend/src/components/pages/HomePage.tsx"

        # Actualizar App.tsx con soporte para componentes reutilizables
        # Copiar y personalizar App.tsx desde la plantilla
        if [ -f "$TEMPLATE_DIR/frontend/src/AppTemplate.tsx" ]; then
            cp "$TEMPLATE_DIR/frontend/src/AppTemplate.tsx" "$TARGET_DIR/frontend/src/App.tsx"
            sed -i '' "s/APP_NAME_PLACEHOLDER/'${PROJECT_NAME}'/g" "$TARGET_DIR/frontend/src/App.tsx"
            echo -e "${BLUE}Se ha configurado App.tsx con navegación a ejemplos${NC}"
        else
            # Fallback si no existe la plantilla
            echo '
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Router>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow">
            <div className="container mx-auto px-4 py-4">
              <h1 className="text-2xl font-bold text-gray-900">'${PROJECT_NAME}'</h1>
            </div>
          </header>
          <main className="container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<HomePage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </>
  );
}

export default App;
' > "$TARGET_DIR/frontend/src/App.tsx"
        fi
    fi
    

    
    # Personalizar nombre del proyecto en package.json
    sed -i '' "s/\"name\": \"frontend\"/\"name\": \"$PROJECT_NAME-frontend\"/g" "$TARGET_DIR/frontend/package.json"
    
    # Remover dependencias innecesarias para la versión mínima
    if [ "$MINIMAL_VERSION" = true ]; then
        # Remover jose si existe (usado por mocks/jwt.ts)
        sed -i '' '/\"jose\":/d' "$TARGET_DIR/frontend/package.json"
    fi
    
    # Personalizar título en index.html
    sed -i '' "s/<title>Vite + React + TS<\/title>/<title>$PROJECT_NAME<\/title>/g" "$TARGET_DIR/frontend/index.html"
fi

# Copiar archivos de configuración del proyecto
echo -e "${YELLOW}Configurando archivos del proyecto...${NC}"

# Copiar guía de componentes reutilizables si existe
if [ -f "$TEMPLATE_DIR/REUSABLE_COMPONENTS.md" ]; then
    cp "$TEMPLATE_DIR/REUSABLE_COMPONENTS.md" "$TARGET_DIR/"
    echo -e "${BLUE}Se ha copiado la documentación de componentes reutilizables${NC}"
fi

# Docker compose
if [ "$INCLUDE_BACKEND" = true ] || [ "$INCLUDE_FRONTEND" = true ]; then
    cp "$TEMPLATE_DIR/docker-compose.yml" "$TARGET_DIR/"
    
    # Personalizar docker-compose.yml
    # Reemplazar el nombre del proyecto con guiones bajos para la base de datos
    DB_NAME=$(echo "$PROJECT_NAME" | tr '-' '_')
    sed -i '' "s/onboarding_flow/$DB_NAME/g" "$TARGET_DIR/docker-compose.yml"
    sed -i '' "s/onboarding-network/$PROJECT_NAME-network/g" "$TARGET_DIR/docker-compose.yml"
    
    # Ajustar docker-compose según componentes incluidos
    if [ "$INCLUDE_BACKEND" = false ]; then
        # Eliminar sección de backend
        sed -i '' '/backend:/,/onboarding-network/d' "$TARGET_DIR/docker-compose.yml"
    else
        # Asegurarnos de que la URL de la base de datos en el docker-compose también use guiones bajos
        sed -i '' "s/DATABASE_URL=postgresql:\\/\\/postgres:password@db:5432\\/[^[:space:]]*/DATABASE_URL=postgresql:\\/\\/postgres:password@db:5432\\/$DB_NAME/g" "$TARGET_DIR/docker-compose.yml"
    fi
    
    if [ "$INCLUDE_FRONTEND" = false ]; then
        # Eliminar sección de frontend
        sed -i '' '/frontend:/,/onboarding-network/d' "$TARGET_DIR/docker-compose.yml"
    fi
    
    # Base de datos
    if [ "$INCLUDE_BACKEND" = true ]; then
        cp "$TEMPLATE_DIR/init-db.sql" "$TARGET_DIR/"
        # Usar guiones bajos en lugar de guiones medios para el nombre de la BD
        DB_NAME=$(echo "$PROJECT_NAME" | tr '-' '_')
        sed -i '' "s/onboarding_flow/$DB_NAME/g" "$TARGET_DIR/init-db.sql"
    fi
fi

# Generar README.md personalizado
cat > "$TARGET_DIR/README.md" << EOF
# 🚀 $PROJECT_NAME

Proyecto generado a partir del template Full-Stack (FastAPI + React + TypeScript).

## 📁 Estructura del Proyecto
EOF

if [ "$INCLUDE_BACKEND" = true ] && [ "$INCLUDE_FRONTEND" = true ]; then
cat >> "$TARGET_DIR/README.md" << EOF

\`\`\`
$PROJECT_NAME/
├── docker-compose.yml          # Configuración de Docker para todos los servicios
EOF
    if [ "$INCLUDE_BACKEND" = true ]; then
cat >> "$TARGET_DIR/README.md" << EOF
├── init-db.sql                # Script de inicialización de la base de datos
├── backend/                   # API Backend (FastAPI + Python)
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py           # Punto de entrada de la aplicación
│       ├── application/      # Lógica de negocio (casos de uso y servicios)
│       ├── domain/          # Modelos y esquemas de datos
│       ├── infrastructure/  # Infraestructura (API, base de datos)
│       └── config/         # Configuración y logging
EOF
    fi
    if [ "$INCLUDE_FRONTEND" = true ]; then
cat >> "$TARGET_DIR/README.md" << EOF
├── frontend/                # Interfaz de Usuario (React + TypeScript)
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── components/     # Componentes reutilizables
│       ├── hooks/         # Custom hooks de React
│       ├── services/      # Servicios para consumir la API
│       ├── store/         # Estado global con Zustand
│       ├── types/         # Tipos de TypeScript
│       └── utils/         # Utilidades y helpers
EOF
    fi
cat >> "$TARGET_DIR/README.md" << EOF
└── README.md
\`\`\`

## 🚀 Comenzando

### Requisitos previos
- Docker y Docker Compose
EOF
    if [ "$INCLUDE_FRONTEND" = true ]; then
cat >> "$TARGET_DIR/README.md" << EOF
- Node.js y npm (para desarrollo local del frontend)
EOF
    fi
    if [ "$INCLUDE_BACKEND" = true ]; then
cat >> "$TARGET_DIR/README.md" << EOF
- Python 3.9+ (para desarrollo local del backend)
EOF
    fi

cat >> "$TARGET_DIR/README.md" << EOF

### Iniciar el proyecto con Docker

\`\`\`bash
docker-compose up -d
\`\`\`

### Acceso a las aplicaciones
EOF
    if [ "$INCLUDE_FRONTEND" = true ]; then
cat >> "$TARGET_DIR/README.md" << EOF
- **Frontend**: http://localhost:5001
EOF
    fi
    if [ "$INCLUDE_BACKEND" = true ]; then
cat >> "$TARGET_DIR/README.md" << EOF
- **Backend API**: http://localhost:5002
- **Documentación API (Swagger)**: http://localhost:5002/docs
- **Base de datos PostgreSQL**: localhost:5436
EOF
    fi

cat >> "$TARGET_DIR/README.md" << EOF

## 🛠️ Tecnologías
EOF
    if [ "$INCLUDE_BACKEND" = true ]; then
cat >> "$TARGET_DIR/README.md" << EOF
- **Backend**: FastAPI, SQLAlchemy, Pydantic, PostgreSQL
EOF
    fi
    if [ "$INCLUDE_FRONTEND" = true ]; then
cat >> "$TARGET_DIR/README.md" << EOF
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Zustand
EOF
    fi

cat >> "$TARGET_DIR/README.md" << EOF

## 🧑‍💻 Desarrollo
EOF
    if [ "$INCLUDE_FRONTEND" = true ]; then
cat >> "$TARGET_DIR/README.md" << EOF

### Frontend (Desarrollo local)
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
EOF
    fi
    if [ "$INCLUDE_BACKEND" = true ]; then
cat >> "$TARGET_DIR/README.md" << EOF

### Backend (Desarrollo local)
\`\`\`bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
\`\`\`
EOF
    fi
fi

cat >> "$TARGET_DIR/README.md" << EOF

## 📄 Personalización
Este proyecto es un template que puedes modificar según tus necesidades.
EOF

# Mensaje final
echo -e "${GREEN}¡Proyecto $PROJECT_NAME creado con éxito!${NC}"
echo -e "${BLUE}Configuración:${NC}"
echo -e "  - Backend: $([ "$INCLUDE_BACKEND" = true ] && echo "${GREEN}Incluido${NC}" || echo "${RED}No incluido${NC}")"
echo -e "  - Frontend: $([ "$INCLUDE_FRONTEND" = true ] && echo "${GREEN}Incluido${NC}" || echo "${RED}No incluido${NC}")"
echo -e "  - Versión: $([ "$MINIMAL_VERSION" = true ] && echo "${YELLOW}Minimalista${NC}" || echo "${GREEN}Completa${NC}")"
echo -e ""
echo -e "${YELLOW}Para comenzar a trabajar:${NC}"
echo -e "${BLUE}cd ../$PROJECT_NAME${NC}"
if [ "$INCLUDE_BACKEND" = true ] && [ "$INCLUDE_FRONTEND" = true ]; then
    echo -e "${BLUE}docker-compose up -d${NC}"
fi
echo -e ""
if [ "$INCLUDE_FRONTEND" = true ]; then
    echo -e "${YELLOW}Frontend:${NC} http://localhost:5001"
fi
if [ "$INCLUDE_BACKEND" = true ]; then
    echo -e "${YELLOW}Backend API:${NC} http://localhost:5002"
    echo -e "${YELLOW}Documentación API:${NC} http://localhost:5002/docs"
fi

# Hacer el script ejecutable
chmod +x "$0"
chmod +x "$(dirname "$0")/utils-creator.sh"

# Hacer el script ejecutable
chmod +x "$0"
