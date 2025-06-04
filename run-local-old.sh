#!/bin/bash

# Script para ejecutar el proyecto Onboarding Flow en modo desarrollo local
# Autor: Sistema de Gestión de Onboarding
# Fecha: $(date)

set -e  # Exit on any error

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

print_message "🚀 Iniciando proyecto Onboarding Flow en modo desarrollo local..." $BLUE

# Verificar sistema operativo
OS="$(uname -s)"
case "${OS}" in
    Linux*)     MACHINE=Linux;;
    Darwin*)    MACHINE=Mac;;
    CYGWIN*)    MACHINE=Cygwin;;
    MINGW*)     MACHINE=MinGw;;
    *)          MACHINE="UNKNOWN:${OS}"
esac

print_message "🖥️  Sistema operativo detectado: $MACHINE" $BLUE

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Función para verificar si un puerto está en uso
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_message "⚠️  El puerto $port está en uso" $YELLOW
        print_message "🔍 Proceso usando el puerto:" $YELLOW
        lsof -Pi :$port -sTCP:LISTEN
        read -p "¿Deseas continuar? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_message "❌ Operación cancelada" $RED
            exit 1
        fi
    fi
}

print_message "🔍 Verificando dependencias..." $BLUE

if ! command_exists python3; then
    print_message "❌ Python 3 no está instalado" $RED
    if [[ "$MACHINE" == "Mac" ]]; then
        print_message "📥 Instala Python con: brew install python" $YELLOW
    elif [[ "$MACHINE" == "Linux" ]]; then
        print_message "📥 Instala Python con: sudo apt install python3 python3-pip" $YELLOW
    fi
    exit 1
fi

if ! command_exists node; then
    print_message "❌ Node.js no está instalado" $RED
    if [[ "$MACHINE" == "Mac" ]]; then
        print_message "📥 Instala Node.js con: brew install node" $YELLOW
    elif [[ "$MACHINE" == "Linux" ]]; then
        print_message "📥 Instala Node.js desde: https://nodejs.org/" $YELLOW
    fi
    exit 1
fi

if ! command_exists npm; then
    print_message "❌ npm no está instalado" $RED
    print_message "📥 npm debería venir con Node.js" $YELLOW
    exit 1
fi

if ! command_exists psql; then
    print_message "❌ PostgreSQL no está instalado" $RED
    if [[ "$MACHINE" == "Mac" ]]; then
        print_message "📥 Instala PostgreSQL con: brew install postgresql" $YELLOW
        print_message "🚀 Inicia el servicio con: brew services start postgresql" $YELLOW
    elif [[ "$MACHINE" == "Linux" ]]; then
        print_message "📥 Instala PostgreSQL con: sudo apt install postgresql postgresql-contrib" $YELLOW
        print_message "🚀 Inicia el servicio con: sudo systemctl start postgresql" $YELLOW
    fi
    exit 1
fi

print_message "✅ Todas las dependencias están instaladas" $GREEN

print_message "🔍 Verificando puertos disponibles..." $BLUE
check_port 5001  # Frontend (Vite dev server)
check_port 5002  # Backend (FastAPI)
check_port 5436  # PostgreSQL

print_message "🔍 Verificando PostgreSQL..." $BLUE
if ! pg_isready -h localhost -p 5436 2>/dev/null; then
    print_message "⚠️  PostgreSQL no está corriendo en el puerto 5436" $YELLOW
    print_message "🔧 Verificando puerto estándar 5432..." $BLUE
    if pg_isready -h localhost -p 5432 2>/dev/null; then
        print_message "✅ PostgreSQL está corriendo en el puerto 5432" $GREEN
        print_message "📝 Actualizando configuración para usar puerto 5432..." $YELLOW
        
        # Actualizar .env para usar puerto 5432
        if [[ -f "backend/.env" ]]; then
            sed -i.bak 's/:5436\//:5432\//' backend/.env
            print_message "✅ Configuración actualizada" $GREEN
        fi
    else
        print_message "❌ PostgreSQL no está corriendo" $RED
        if [[ "$MACHINE" == "Mac" ]]; then
            print_message "🚀 Inicia PostgreSQL con: brew services start postgresql" $YELLOW
        elif [[ "$MACHINE" == "Linux" ]]; then
            print_message "🚀 Inicia PostgreSQL con: sudo systemctl start postgresql" $YELLOW
        fi
        exit 1
    fi
fi

# Crear base de datos si no existe
print_message "🗄️  Configurando base de datos..." $BLUE
if ! psql -U postgres -h localhost -lqt | cut -d \| -f 1 | grep -qw onboarding_flow; then
    print_message "📝 Creando base de datos onboarding_flow..." $YELLOW
    createdb -U postgres -h localhost onboarding_flow || {
        print_message "❌ Error al crear la base de datos" $RED
        print_message "🔧 Intenta crear manualmente:" $YELLOW
        print_message "   psql -U postgres -c \"CREATE DATABASE onboarding_flow;\"" $YELLOW
        exit 1
    }
    print_message "✅ Base de datos creada" $GREEN
else
    print_message "✅ Base de datos ya existe" $GREEN
fi

# Función para matar procesos en segundo plano al salir
cleanup() {
    print_message "🛑 Deteniendo servicios..." $YELLOW
    if [[ ! -z "$BACKEND_PID" ]]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [[ ! -z "$FRONTEND_PID" ]]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    print_message "👋 ¡Hasta luego!" $GREEN
}

trap cleanup EXIT INT TERM

# Configurar Backend
print_message "🐍 Configurando Backend (FastAPI)..." $BLUE

cd backend

# Crear entorno virtual si no existe
if [[ ! -d "venv" ]]; then
    print_message "📦 Creando entorno virtual..." $YELLOW
    python3 -m venv venv
fi

# Activar entorno virtual
print_message "🔧 Activando entorno virtual..." $YELLOW
source venv/bin/activate

# Instalar dependencias
print_message "📦 Instalando dependencias Python..." $YELLOW
pip install -q --upgrade pip
pip install -q -r requirements.txt

# Verificar archivo .env
if [[ ! -f ".env" ]]; then
    print_message "📝 Creando archivo .env..." $YELLOW
    echo "DATABASE_URL=postgresql://postgres:password@localhost:5432/onboarding_flow" > .env
fi

# Iniciar backend en segundo plano
print_message "🚀 Iniciando Backend en puerto 5002..." $GREEN
cd app
uvicorn main:app --host 0.0.0.0 --port 5002 --reload > ../backend.log 2>&1 &
BACKEND_PID=$!

# Volver al directorio raíz
cd ../..

# Configurar Frontend
print_message "⚛️  Configurando Frontend (React + Vite)..." $BLUE

cd frontend

# Instalar dependencias
print_message "📦 Instalando dependencias Node.js..." $YELLOW
npm install --silent

# Iniciar frontend en segundo plano
print_message "🚀 Iniciando Frontend en puerto 5001..." $GREEN
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!

# Volver al directorio raíz
cd ..

# Esperar a que los servicios estén listos
print_message "⏳ Esperando a que los servicios estén listos..." $YELLOW
sleep 5

# Verificar si los servicios están corriendo
print_message "🔍 Verificando servicios..." $BLUE

# Verificar backend
if curl -s http://localhost:5002/health > /dev/null 2>&1; then
    print_message "✅ Backend está corriendo correctamente" $GREEN
else
    print_message "⚠️  Backend puede estar iniciando aún..." $YELLOW
fi

# Verificar frontend
if curl -s http://localhost:5001 > /dev/null 2>&1; then
    print_message "✅ Frontend está corriendo correctamente" $GREEN
else
    print_message "⚠️  Frontend puede estar iniciando aún..." $YELLOW
fi

print_message "🎉 ¡Proyecto iniciado exitosamente!" $GREEN
print_message "📱 Accede a la aplicación en:" $BLUE
echo -e "   ${GREEN}• Frontend: ${NC}http://localhost:5001"
echo -e "   ${GREEN}• Backend API: ${NC}http://localhost:5002"
echo -e "   ${GREEN}• Documentación API: ${NC}http://localhost:5002/docs"
echo -e "   ${GREEN}• Base de datos: ${NC}localhost:5432"

print_message "📋 Archivos de log:" $BLUE
echo -e "   ${YELLOW}• Backend: ${NC}backend/backend.log"
echo -e "   ${YELLOW}• Frontend: ${NC}frontend.log"

print_message "⚙️  Variables de entorno:" $BLUE
echo -e "   ${YELLOW}• VITE_API_URL: ${NC}http://localhost:5002/"
echo -e "   ${YELLOW}• DATABASE_URL: ${NC}$(cat backend/.env | grep DATABASE_URL | cut -d= -f2)"

print_message "📋 Comandos útiles:" $BLUE
echo -e "   ${YELLOW}• Ver logs backend: ${NC}tail -f backend/backend.log"
echo -e "   ${YELLOW}• Ver logs frontend: ${NC}tail -f frontend.log"
echo -e "   ${YELLOW}• Reiniciar backend: ${NC}kill $BACKEND_PID && cd backend/app && uvicorn main:app --host 0.0.0.0 --port 5002 --reload &"
echo -e "   ${YELLOW}• Acceder a la DB: ${NC}psql -U postgres -h localhost onboarding_flow"

print_message "🔄 Los servicios están corriendo en segundo plano..." $BLUE
print_message "🛑 Presiona Ctrl+C para detener todos los servicios" $YELLOW

# Mantener el script corriendo y mostrar logs
echo
read -p "¿Quieres ver los logs en tiempo real? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_message "📋 Mostrando logs (Ctrl+C para salir)..." $BLUE
    echo -e "${BLUE}=== BACKEND LOGS ===${NC}"
    tail -f backend/backend.log &
    echo -e "${BLUE}=== FRONTEND LOGS ===${NC}"
    tail -f frontend.log &
    wait
else
    print_message "✅ Servicios corriendo en segundo plano" $GREEN
    print_message "🔍 Para monitorear: tail -f backend/backend.log" $YELLOW
    print_message "🛑 Para detener: kill $BACKEND_PID $FRONTEND_PID" $YELLOW
    
    # Mantener el script corriendo hasta Ctrl+C
    while true; do
        sleep 1
    done
fi
