#!/bin/bash

# Script para ejecutar el proyecto Onboarding Flow con Docker Compose
# Autor: Sistema de Gestión de Onboarding
# Fecha: $(date)

set -e  # Exit on any error

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_message() {
    echo -e "${2}${1}${NC}"
}

print_message "🚀 Iniciando proyecto Onboarding Flow con Docker Compose..." $BLUE

if ! command -v docker &> /dev/null; then
    print_message "❌ Error: Docker no está instalado" $RED
    print_message "📥 Por favor instala Docker desde: https://docs.docker.com/get-docker/" $YELLOW
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    print_message "❌ Error: Docker Compose no está disponible" $RED
    print_message "📥 Por favor instala Docker Compose" $YELLOW
    exit 1
fi

check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
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

print_message "🔍 Verificando puertos disponibles..." $BLUE
check_port 5001  # Frontend
check_port 5002  # Backend  
check_port 5436  # PostgreSQL

print_message "🛑 Deteniendo contenedores existentes..." $YELLOW
docker-compose down 2>/dev/null || true

print_message "🧹 Limpiando imágenes huérfanas..." $YELLOW
docker image prune -f 2>/dev/null || true

print_message "🏗️  Construyendo e iniciando servicios..." $BLUE
print_message "⏳ Este proceso puede tomar varios minutos la primera vez..." $YELLOW

if docker-compose up --build -d; then
    print_message "✅ Servicios iniciados exitosamente!" $GREEN
    
    print_message "⏳ Esperando a que los servicios estén listos..." $YELLOW
    sleep 10
    
    print_message "📊 Estado de los servicios:" $BLUE
    docker-compose ps
    
    print_message "🎉 ¡Proyecto iniciado exitosamente!" $GREEN
    print_message "📱 Accede a la aplicación en:" $BLUE
    echo -e "   ${GREEN}• Frontend: ${NC}http://localhost:5001"
    echo -e "   ${GREEN}• Backend API: ${NC}http://localhost:5002"
    echo -e "   ${GREEN}• Documentación API: ${NC}http://localhost:5002/docs"
    echo -e "   ${GREEN}• Base de datos: ${NC}localhost:5436"
    
    print_message "📋 Comandos útiles:" $BLUE
    echo -e "   ${YELLOW}• Ver logs: ${NC}docker-compose logs -f"
    echo -e "   ${YELLOW}• Ver logs específicos: ${NC}docker-compose logs -f [frontend|backend|db]"
    echo -e "   ${YELLOW}• Detener: ${NC}docker-compose down"
    echo -e "   ${YELLOW}• Reiniciar: ${NC}docker-compose restart"
    echo -e "   ${YELLOW}• Estado: ${NC}docker-compose ps"
    
    echo
    read -p "¿Quieres ver los logs en tiempo real? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_message "📋 Mostrando logs (Ctrl+C para salir)..." $BLUE
        docker-compose logs -f
    fi
    
else
    print_message "❌ Error al iniciar los servicios" $RED
    print_message "📋 Revisa los logs para más detalles:" $YELLOW
    docker-compose logs
    exit 1
fi
