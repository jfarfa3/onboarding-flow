#!/bin/bash

# Script para detener los servicios del proyecto Onboarding Flow
# Autor: Sistema de Gestión de Onboarding

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar mensajes con color
print_message() {
    echo -e "${2}${1}${NC}"
}

print_message "🛑 Deteniendo servicios del proyecto Onboarding Flow..." $BLUE

# Función para detener Docker Compose
stop_docker() {
    print_message "🐳 Deteniendo servicios Docker..." $YELLOW
    if docker-compose ps | grep -q "Up"; then
        docker-compose down
        print_message "✅ Servicios Docker detenidos" $GREEN
    else
        print_message "ℹ️  No hay servicios Docker corriendo" $BLUE
    fi
}

# Función para detener procesos locales
stop_local() {
    print_message "💻 Buscando procesos locales..." $YELLOW
    
    # Buscar y detener procesos FastAPI
    if pgrep -f "uvicorn.*main:app" > /dev/null; then
        print_message "🐍 Deteniendo Backend (FastAPI)..." $YELLOW
        pkill -f "uvicorn.*main:app" || true
        print_message "✅ Backend detenido" $GREEN
    else
        print_message "ℹ️  Backend no está corriendo" $BLUE
    fi
    
    # Buscar y detener procesos Vite
    if pgrep -f "vite" > /dev/null; then
        print_message "⚛️  Deteniendo Frontend (Vite)..." $YELLOW
        pkill -f "vite" || true
        print_message "✅ Frontend detenido" $GREEN
    else
        print_message "ℹ️  Frontend no está corriendo" $BLUE
    fi
    
    # Buscar procesos Node.js que puedan ser del frontend
    if pgrep -f "node.*dev" > /dev/null; then
        print_message "📦 Deteniendo procesos Node.js de desarrollo..." $YELLOW
        pkill -f "node.*dev" || true
    fi
    
    # Detener contenedor PostgreSQL local si existe
    local db_container="onboarding_flow-db-local"
    if docker ps --format "table {{.Names}}" | grep -q "^${db_container}$" 2>/dev/null; then
        print_message "🐳 Deteniendo contenedor PostgreSQL local..." $YELLOW
        docker stop $db_container 2>/dev/null || true
        print_message "✅ Contenedor PostgreSQL local detenido" $GREEN
    fi
}

# Función para limpiar puertos específicos
clean_ports() {
    local ports=(5001 5002 5436)
    print_message "🔍 Verificando puertos específicos..." $YELLOW
    
    for port in "${ports[@]}"; do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            print_message "🔧 Liberando puerto $port..." $YELLOW
            local pid=$(lsof -Pi :$port -sTCP:LISTEN -t)
            kill -9 $pid 2>/dev/null || true
            print_message "✅ Puerto $port liberado" $GREEN
        fi
    done
}

# Mostrar opciones
echo
print_message "Selecciona una opción:" $BLUE
echo "1) Detener servicios Docker"
echo "2) Detener servicios locales"
echo "3) Detener todos los servicios"
echo "4) Limpiar puertos específicos"
echo "5) Salir"
echo

read -p "Opción (1-5): " -n 1 -r
echo

case $REPLY in
    1)
        stop_docker
        ;;
    2)
        stop_local
        ;;
    3)
        stop_docker
        stop_local
        clean_ports
        ;;
    4)
        clean_ports
        ;;
    5)
        print_message "👋 ¡Hasta luego!" $GREEN
        exit 0
        ;;
    *)
        print_message "❌ Opción inválida" $RED
        exit 1
        ;;
esac

print_message "🏁 Operación completada" $GREEN

# Verificar que no queden procesos corriendo
print_message "🔍 Verificando estado final..." $BLUE

if docker-compose ps 2>/dev/null | grep -q "Up"; then
    print_message "⚠️  Algunos servicios Docker aún están corriendo" $YELLOW
    docker-compose ps
elif pgrep -f "uvicorn\|vite\|node.*dev" > /dev/null; then
    print_message "⚠️  Algunos procesos locales aún están corriendo" $YELLOW
    echo "Procesos encontrados:"
    pgrep -f "uvicorn\|vite\|node.*dev" | xargs ps -p 2>/dev/null || true
else
    print_message "✅ Todos los servicios han sido detenidos correctamente" $GREEN
fi
