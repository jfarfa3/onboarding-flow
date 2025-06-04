#!/bin/bash

# Script para verificar el estado del proyecto Onboarding Flow
# Autor: Sistema de Gestión de Onboarding
# Fecha: 3 de junio de 2025

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes de estado
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_header() {
    echo ""
    echo -e "${BLUE}===========================================${NC}"
    echo -e "${BLUE} $1${NC}"
    echo -e "${BLUE}===========================================${NC}"
}

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Función para verificar si un puerto está en uso
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Inicio del script
clear
echo -e "${GREEN}🚀 VERIFICACIÓN DE ESTADO - ONBOARDING FLOW${NC}"
echo -e "${GREEN}===============================================${NC}"

# 1. Verificar dependencias del sistema
print_header "VERIFICANDO DEPENDENCIAS DEL SISTEMA"

# Docker
if command_exists docker; then
    docker_version=$(docker --version | cut -d' ' -f3 | tr -d ',')
    print_success "Docker instalado (versión: $docker_version)"
    
    # Verificar si Docker está corriendo
    if docker info >/dev/null 2>&1; then
        print_success "Docker daemon está corriendo"
    else
        print_error "Docker daemon no está corriendo"
        print_status "Ejecuta: docker desktop o systemctl start docker"
    fi
else
    print_error "Docker no está instalado"
    print_status "Instala Docker desde: https://docs.docker.com/get-docker/"
fi

# Docker Compose
if command_exists docker-compose; then
    compose_version=$(docker-compose --version | cut -d' ' -f3 | tr -d ',')
    print_success "Docker Compose instalado (versión: $compose_version)"
elif docker compose version >/dev/null 2>&1; then
    compose_version=$(docker compose version --short)
    print_success "Docker Compose (plugin) instalado (versión: $compose_version)"
else
    print_error "Docker Compose no está instalado"
fi

# Python
if command_exists python3; then
    python_version=$(python3 --version | cut -d' ' -f2)
    print_success "Python3 instalado (versión: $python_version)"
    
    # Verificar pip
    if command_exists pip3; then
        pip_version=$(pip3 --version | cut -d' ' -f2)
        print_success "pip3 instalado (versión: $pip_version)"
    else
        print_warning "pip3 no está instalado"
    fi
else
    print_error "Python3 no está instalado"
fi

# Node.js
if command_exists node; then
    node_version=$(node --version)
    print_success "Node.js instalado (versión: $node_version)"
    
    # Verificar npm
    if command_exists npm; then
        npm_version=$(npm --version)
        print_success "npm instalado (versión: $npm_version)"
    else
        print_warning "npm no está instalado"
    fi
else
    print_error "Node.js no está instalado"
fi

# 2. Verificar estructura del proyecto
print_header "VERIFICANDO ESTRUCTURA DEL PROYECTO"

# Archivos principales
files_to_check=(
    "README.md"
    "docker-compose.yml"
    "init-db.sql"
    "backend/"
    "frontend/"
    "run-docker.sh"
    "run-local.sh"
    "stop-services.sh"
)

for file in "${files_to_check[@]}"; do
    if [ -e "$file" ]; then
        print_success "Encontrado: $file"
    else
        print_error "Falta: $file"
    fi
done

# Verificar archivos de configuración específicos
if [ -f "backend/requirements.txt" ]; then
    print_success "Encontrado: backend/requirements.txt"
else
    print_warning "No encontrado: backend/requirements.txt"
fi

if [ -f "frontend/package.json" ]; then
    print_success "Encontrado: frontend/package.json"
else
    print_warning "No encontrado: frontend/package.json"
fi

# 3. Verificar puertos
print_header "VERIFICANDO DISPONIBILIDAD DE PUERTOS"

ports_to_check=(5001 5002 5436)
for port in "${ports_to_check[@]}"; do
    if check_port $port; then
        print_warning "Puerto $port está en uso"
        print_status "Proceso usando el puerto:"
        lsof -Pi :$port -sTCP:LISTEN | grep -v COMMAND || true
    else
        print_success "Puerto $port disponible"
    fi
done

# 4. Verificar servicios Docker
print_header "VERIFICANDO SERVICIOS DOCKER"

if command_exists docker && docker info >/dev/null 2>&1; then
    # Verificar contenedores del proyecto
    containers=$(docker ps -a --filter name=onboarding --format "table {{.Names}}\t{{.Status}}")
    if [ -n "$containers" ]; then
        print_status "Contenedores relacionados con onboarding:"
        echo "$containers"
    else
        print_status "No se encontraron contenedores relacionados con onboarding"
    fi
    
    # Verificar volúmenes
    volumes=$(docker volume ls --filter name=onboarding --format "table {{.Name}}")
    if [ -n "$volumes" ]; then
        print_status "Volúmenes relacionados con onboarding:"
        echo "$volumes"
    else
        print_status "No se encontraron volúmenes relacionados con onboarding"
    fi
    
    # Verificar redes
    networks=$(docker network ls --filter name=onboarding --format "table {{.Name}}\t{{.Driver}}")
    if [ -n "$networks" ]; then
        print_status "Redes relacionadas con onboarding:"
        echo "$networks"
    else
        print_status "No se encontraron redes relacionadas con onboarding"
    fi
fi

# 5. Verificar entorno de desarrollo Backend
print_header "VERIFICANDO ENTORNO DE DESARROLLO - BACKEND"

if [ -d "backend" ]; then
    cd backend
    
    # Verificar virtual environment
    if [ -d "venv" ] || [ -d ".venv" ] || [ -n "$VIRTUAL_ENV" ]; then
        print_success "Entorno virtual detectado"
        
        if [ -n "$VIRTUAL_ENV" ]; then
            print_status "Entorno virtual activo: $VIRTUAL_ENV"
            
            # Verificar dependencias instaladas
            if command_exists pip; then
                installed_packages=$(pip list --format=freeze | wc -l)
                print_status "Paquetes instalados: $installed_packages"
                
                # Verificar FastAPI específicamente
                if pip list | grep -i fastapi >/dev/null; then
                    fastapi_version=$(pip list | grep -i fastapi | awk '{print $2}')
                    print_success "FastAPI instalado (versión: $fastapi_version)"
                else
                    print_warning "FastAPI no está instalado"
                fi
                
                # Verificar SQLAlchemy
                if pip list | grep -i sqlalchemy >/dev/null; then
                    sqlalchemy_version=$(pip list | grep -i sqlalchemy | awk '{print $2}')
                    print_success "SQLAlchemy instalado (versión: $sqlalchemy_version)"
                else
                    print_warning "SQLAlchemy no está instalado"
                fi
            fi
        fi
    else
        print_warning "No se detectó entorno virtual"
        print_status "Crear con: python3 -m venv venv && source venv/bin/activate"
    fi
    
    cd ..
fi

# 6. Verificar entorno de desarrollo Frontend
print_header "VERIFICANDO ENTORNO DE DESARROLLO - FRONTEND"

if [ -d "frontend" ]; then
    cd frontend
    
    # Verificar node_modules
    if [ -d "node_modules" ]; then
        print_success "node_modules encontrado"
        
        # Verificar React
        if [ -d "node_modules/react" ]; then
            print_success "React instalado"
        else
            print_warning "React no está instalado"
        fi
        
        # Verificar TypeScript
        if [ -d "node_modules/typescript" ]; then
            print_success "TypeScript instalado"
        else
            print_warning "TypeScript no está instalado"
        fi
        
        # Verificar Vite
        if [ -d "node_modules/vite" ]; then
            print_success "Vite instalado"
        else
            print_warning "Vite no está instalado"
        fi
    else
        print_warning "node_modules no encontrado"
        print_status "Ejecutar: npm install"
    fi
    
    cd ..
fi

# 7. Verificar archivos de configuración
print_header "VERIFICANDO ARCHIVOS DE CONFIGURACIÓN"

config_files=(
    "backend/.env"
    "backend/alembic.ini"
    "frontend/.env"
    "frontend/vite.config.ts"
    "frontend/tsconfig.json"
)

for config_file in "${config_files[@]}"; do
    if [ -f "$config_file" ]; then
        print_success "Encontrado: $config_file"
    else
        print_warning "No encontrado: $config_file"
    fi
done

# 8. Resumen y recomendaciones
print_header "RESUMEN Y RECOMENDACIONES"

print_status "Scripts disponibles:"
echo "  • ./run-local.sh     - Iniciar en modo desarrollo local"
echo "  • ./run-docker.sh    - Iniciar con Docker"
echo "  • ./stop-services.sh - Detener todos los servicios"
echo "  • ./check-status.sh  - Verificar estado del proyecto"
echo ""

print_status "Para iniciar el proyecto:"
echo "  1. Modo local: ./run-local.sh"
echo "  2. Modo Docker: ./run-docker.sh"
echo ""

print_status "URLs de acceso (cuando esté corriendo):"
echo "  • Frontend: http://localhost:5001"
echo "  • Backend API: http://localhost:5002"
echo "  • API Docs: http://localhost:5002/docs"
echo "  • Base de datos: localhost:5436"
echo ""

print_success "Verificación completada! 🎉"
echo ""
