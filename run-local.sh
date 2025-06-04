#!/bin/bash

# Script para ejecutar el proyecto Onboarding Flow en modo desarrollo local con PostgreSQL en Docker
# Autor: Sistema de Gestión de Onboarding
# Fecha: 3 de junio de 2025

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

# Verificar dependencias
print_message "🔍 Verificando dependencias..." $BLUE

# Verificar Docker
if ! command_exists docker; then
    print_message "❌ Docker no está instalado" $RED
    print_message "📥 Instala Docker desde: https://docs.docker.com/get-docker/" $YELLOW
    exit 1
fi

# Verificar si Docker está corriendo
if ! docker info >/dev/null 2>&1; then
    print_message "❌ Docker no está corriendo" $RED
    print_message "🚀 Inicia Docker Desktop o el daemon de Docker" $YELLOW
    exit 1
fi

# Verificar Python
if ! command_exists python3; then
    print_message "❌ Python 3 no está instalado" $RED
    if [[ "$MACHINE" == "Mac" ]]; then
        print_message "📥 Instala Python con: brew install python" $YELLOW
    elif [[ "$MACHINE" == "Linux" ]]; then
        print_message "📥 Instala Python con: sudo apt install python3 python3-pip" $YELLOW
    fi
    exit 1
fi

# Verificar Node.js
if ! command_exists node; then
    print_message "❌ Node.js no está instalado" $RED
    if [[ "$MACHINE" == "Mac" ]]; then
        print_message "📥 Instala Node.js con: brew install node" $YELLOW
    elif [[ "$MACHINE" == "Linux" ]]; then
        print_message "📥 Instala Node.js desde: https://nodejs.org/" $YELLOW
    fi
    exit 1
fi

# Verificar npm
if ! command_exists npm; then
    print_message "❌ npm no está instalado" $RED
    print_message "📥 npm debería venir con Node.js" $YELLOW
    exit 1
fi

print_message "✅ Todas las dependencias están instaladas" $GREEN

# Verificar puertos
print_message "🔍 Verificando puertos disponibles..." $BLUE
check_port 5001  # Frontend (Vite dev server)
check_port 5002  # Backend (FastAPI)
check_port 5436  # PostgreSQL Docker

# Variables para PostgreSQL
DB_CONTAINER_NAME="onboarding_flow-db-local"
DB_PORT=5436
DB_USER="postgres"
DB_PASSWORD="password"
DB_NAME="onboarding_flow"

# Función para matar procesos en segundo plano al salir
cleanup() {
    print_message "🛑 Deteniendo servicios..." $YELLOW
    
    # Detener procesos de desarrollo
    if [[ ! -z "$BACKEND_PID" ]]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [[ ! -z "$FRONTEND_PID" ]]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    
    # Preguntar si detener el contenedor de PostgreSQL
    echo
    read -p "¿Quieres detener también el contenedor de PostgreSQL? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_message "🐳 Deteniendo contenedor PostgreSQL..." $YELLOW
        docker stop $DB_CONTAINER_NAME 2>/dev/null || true
        print_message "✅ Contenedor PostgreSQL detenido" $GREEN
    else
        print_message "ℹ️  El contenedor PostgreSQL seguirá corriendo" $BLUE
        print_message "🔧 Para detenerlo manualmente: docker stop $DB_CONTAINER_NAME" $YELLOW
    fi
    
    print_message "👋 ¡Hasta luego!" $GREEN
}

trap cleanup EXIT INT TERM

# Configurar PostgreSQL en Docker
print_message "🐳 Configurando PostgreSQL en Docker..." $BLUE

# Verificar si el contenedor ya existe
if docker ps -a --format "table {{.Names}}" | grep -q "^${DB_CONTAINER_NAME}$"; then
    print_message "📦 Contenedor PostgreSQL ya existe" $BLUE
    
    # Verificar si está corriendo
    if docker ps --format "table {{.Names}}" | grep -q "^${DB_CONTAINER_NAME}$"; then
        print_message "✅ PostgreSQL ya está corriendo" $GREEN
    else
        print_message "🚀 Iniciando contenedor PostgreSQL existente..." $YELLOW
        docker start $DB_CONTAINER_NAME
        print_message "✅ PostgreSQL iniciado" $GREEN
    fi
else
    print_message "📦 Creando nuevo contenedor PostgreSQL..." $YELLOW
    docker run -d \
        --name $DB_CONTAINER_NAME \
        -e POSTGRES_USER=$DB_USER \
        -e POSTGRES_PASSWORD=$DB_PASSWORD \
        -e POSTGRES_DB=$DB_NAME \
        -p $DB_PORT:5432 \
        -v onboarding_flow-db-data-local:/var/lib/postgresql/data \
        postgres:latest
    
    print_message "✅ Contenedor PostgreSQL creado e iniciado" $GREEN
fi

# Esperar a que PostgreSQL esté listo
print_message "⏳ Esperando a que PostgreSQL esté listo..." $YELLOW
timeout=30
counter=0
while ! docker exec $DB_CONTAINER_NAME pg_isready -U $DB_USER >/dev/null 2>&1; do
    if [ $counter -eq $timeout ]; then
        print_message "❌ Timeout esperando PostgreSQL" $RED
        exit 1
    fi
    sleep 1
    counter=$((counter + 1))
done

print_message "✅ PostgreSQL está listo" $GREEN

# Verificar/crear la base de datos
print_message "🗄️  Verificando base de datos..." $BLUE
if ! docker exec $DB_CONTAINER_NAME psql -U $DB_USER -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    print_message "📝 Creando base de datos $DB_NAME..." $YELLOW
    docker exec $DB_CONTAINER_NAME createdb -U $DB_USER $DB_NAME
    print_message "✅ Base de datos creada" $GREEN
else
    print_message "✅ Base de datos ya existe" $GREEN
fi

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

# Verificar/crear archivo .env
print_message "📝 Configurando variables de entorno..." $YELLOW
if [[ ! -f ".env" ]]; then
    print_message "📝 Creando archivo .env..." $YELLOW
    echo "DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@localhost:$DB_PORT/$DB_NAME" > .env
else
    # Actualizar .env para usar la configuración de Docker
    if grep -q "DATABASE_URL" .env; then
        sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@localhost:$DB_PORT/$DB_NAME|" .env
    else
        echo "DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@localhost:$DB_PORT/$DB_NAME" >> .env
    fi
fi

print_message "✅ Variables de entorno configuradas" $GREEN

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

# Verificar PostgreSQL
if docker exec $DB_CONTAINER_NAME pg_isready -U $DB_USER >/dev/null 2>&1; then
    print_message "✅ PostgreSQL está corriendo correctamente" $GREEN
else
    print_message "❌ Problema con PostgreSQL" $RED
fi

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
echo -e "   ${GREEN}• Base de datos: ${NC}localhost:$DB_PORT"

print_message "📋 Información de la base de datos:" $BLUE
echo -e "   ${YELLOW}• Contenedor: ${NC}$DB_CONTAINER_NAME"
echo -e "   ${YELLOW}• Usuario: ${NC}$DB_USER"
echo -e "   ${YELLOW}• Base de datos: ${NC}$DB_NAME"
echo -e "   ${YELLOW}• Puerto: ${NC}$DB_PORT"

print_message "📋 Archivos de log:" $BLUE
echo -e "   ${YELLOW}• Backend: ${NC}backend/backend.log"
echo -e "   ${YELLOW}• Frontend: ${NC}frontend.log"
echo -e "   ${YELLOW}• PostgreSQL: ${NC}docker logs $DB_CONTAINER_NAME"

print_message "⚙️  Variables de entorno:" $BLUE
echo -e "   ${YELLOW}• VITE_API_URL: ${NC}http://localhost:5002/"
echo -e "   ${YELLOW}• DATABASE_URL: ${NC}postgresql://$DB_USER:***@localhost:$DB_PORT/$DB_NAME"

print_message "📋 Comandos útiles:" $BLUE
echo -e "   ${YELLOW}• Ver logs backend: ${NC}tail -f backend/backend.log"
echo -e "   ${YELLOW}• Ver logs frontend: ${NC}tail -f frontend.log"
echo -e "   ${YELLOW}• Ver logs PostgreSQL: ${NC}docker logs -f $DB_CONTAINER_NAME"
echo -e "   ${YELLOW}• Acceder a PostgreSQL: ${NC}docker exec -it $DB_CONTAINER_NAME psql -U $DB_USER -d $DB_NAME"
echo -e "   ${YELLOW}• Reiniciar PostgreSQL: ${NC}docker restart $DB_CONTAINER_NAME"
echo -e "   ${YELLOW}• Detener PostgreSQL: ${NC}docker stop $DB_CONTAINER_NAME"

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
    echo -e "${BLUE}=== POSTGRESQL LOGS ===${NC}"
    docker logs -f $DB_CONTAINER_NAME &
    wait
else
    print_message "✅ Servicios corriendo en segundo plano" $GREEN
    print_message "🔍 Para monitorear backend: tail -f backend/backend.log" $YELLOW
    print_message "🔍 Para monitorear PostgreSQL: docker logs -f $DB_CONTAINER_NAME" $YELLOW
    print_message "🛑 Para detener: kill $BACKEND_PID $FRONTEND_PID" $YELLOW
    
    # Mantener el script corriendo hasta Ctrl+C
    while true; do
        sleep 1
    done
fi