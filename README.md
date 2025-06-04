# 🚀 Sistema de Onboarding Flow

Sistema integral para la gestión de usuarios, equipos y accesos desarrollado para el proceso de onboarding de nuevos empleados en la organización.

## 📁 Estructura del Proyecto

```
onboarding-flow/
├── docker-compose.yml          # Configuración de Docker para todos los servicios
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
├── frontend/                # Interfaz de Usuario (React + TypeScript)
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── components/     # Componentes reutilizables (atoms, molecules, organisms)
│       ├── hooks/         # Custom hooks de React
│       ├── services/      # Servicios para consumir la API
│       ├── store/         # Estado global con Zustand
│       ├── types/         # Tipos de TypeScript
│       └── utils/         # Utilidades y helpers
└── README.md
```

## 🛠️ Tecnologías y Frameworks Utilizados

### Backend (Python + FastAPI)
- **FastAPI 0.112.0**: Framework web moderno y de alto rendimiento para APIs
- **SQLAlchemy 2.0.38**: ORM para manejo de base de datos
- **Pydantic 2.10.6**: Validación de datos y serialización
- **PostgreSQL**: Base de datos relacional
- **psycopg2-binary**: Adaptador de PostgreSQL para Python

**¿Por qué FastAPI?**
- Alto rendimiento (comparable con NodeJS y Go)
- Documentación automática con OpenAPI/Swagger
- Tipado estático con Python type hints
- Validación automática de datos con Pydantic
- Arquitectura asíncrona nativa

### Frontend (React + TypeScript)
- **React 19.1.0**: Biblioteca para interfaces de usuario
- **TypeScript 5.8.3**: Superset de JavaScript con tipado estático
- **Vite 6.3.5**: Herramienta de construcción rápida
- **Tailwind CSS 4.1.8**: Framework CSS utilitario
- **Zustand 5.0.5**: Manejo de estado global minimalista
- **Axios 1.9.0**: Cliente HTTP para consumir APIs
- **React Router DOM 7.6.1**: Enrutamiento declarativo
- **Recharts 2.15.3**: Componentes de gráficos

**¿Por qué React + TypeScript?**
- Ecosistema maduro y amplio soporte de la comunidad
- TypeScript proporciona seguridad de tipos en tiempo de desarrollo
- Vite ofrece desarrollo rápido con Hot Module Replacement
- Tailwind permite desarrollo de UI rápido y consistente

### Base de Datos
- **PostgreSQL**: Base de datos relacional robusta y escalable
- **Puerto**: 5436 (evita conflictos con instalaciones locales de PostgreSQL)

## 🏗️ Arquitectura del Backend

El backend sigue los principios de **Arquitectura Limpia (Clean Architecture)**:

### Capas de la Aplicación:
1. **Domain** (`domain/`): Entidades de negocio y esquemas
2. **Application** (`application/`): Casos de uso y servicios de aplicación
3. **Infrastructure** (`infrastructure/`): Implementaciones técnicas (API, DB)
4. **Configuration** (`config/`): Configuración y utilidades

### Módulos Principales:
- **Users**: Gestión de usuarios del sistema
- **Devices**: Solicitudes y asignación de equipos
- **Access**: Control de accesos a software
- **Roles**: Gestión de roles y permisos
- **Software**: Catálogo de software disponible
- **State Requests**: Estados de las solicitudes (Pendiente, Aprobada, Rechazada)

## 🔗 API Endpoints

### Usuarios (`/users`)
- `GET /users` - Obtener todos los usuarios
- `POST /users` - Crear nuevo usuario
- `GET /users/{user_id}` - Obtener usuario por ID
- `PUT /users/{user_id}` - Actualizar usuario
- `DELETE /users/{user_id}` - Eliminar usuario

### Dispositivos (`/devices`)
- `GET /devices` - Obtener todas las solicitudes de dispositivos
- `POST /devices` - Crear solicitud de dispositivo
- `GET /devices/{device_id}` - Obtener dispositivo por ID
- `PUT /devices/{device_id}` - Actualizar dispositivo
- `DELETE /devices/{device_id}` - Eliminar dispositivo

### Accesos (`/access`)
- `GET /access` - Obtener todos los accesos
- `POST /access` - Crear solicitud de acceso
- `GET /access/{access_id}` - Obtener acceso por ID
- `PUT /access/{access_id}` - Actualizar acceso
- `DELETE /access/{access_id}` - Eliminar acceso
- `PATCH /access/{access_id}/{new_status}` - Actualizar estado del acceso

### Roles (`/roles`)
- `GET /roles` - Obtener todos los roles
- `POST /roles` - Crear nuevo rol
- `GET /roles/{role_id}` - Obtener rol por ID
- `PUT /roles/{role_id}` - Actualizar rol
- `DELETE /roles/{role_id}` - Eliminar rol

### Software (`/software`)
- `GET /software` - Obtener todo el software
- `POST /software` - Crear nuevo software
- `GET /software/{software_id}` - Obtener software por ID
- `PUT /software/{software_id}` - Actualizar software
- `DELETE /software/{software_id}` - Eliminar software

### Estados de Solicitud (`/state-requests`)
- `GET /state-requests` - Obtener todos los estados
- `POST /state-requests` - Crear nuevo estado
- `GET /state-requests/{state_request_id}` - Obtener estado por ID
- `PUT /state-requests/{state_request_id}` - Actualizar estado
- `DELETE /state-requests/{state_request_id}` - Eliminar estado

### Datos Consolidados (`/all-data`)
- `GET /all-data` - Obtener todos los datos (usuarios, dispositivos, accesos)

### Health Check (`/health`, `/`)
- `GET /health` - Verificar estado de la API
- `GET /` - Health check raíz

## 🖥️ Vistas del Frontend

### Páginas Principales:
- **Home** (`/`): Página de inicio
- **Dashboard** (`/dashboard`): Panel principal con métricas
- **Users** (`/dashboard/users`): Gestión de usuarios
- **User Detail** (`/dashboard/user/:userId`): Detalle de usuario específico
- **Devices** (`/dashboard/devices`): Gestión de dispositivos
- **Accesses** (`/dashboard/accesses`): Gestión de accesos
- **Settings** (`/dashboard/settings`): Configuración del sistema

### Componentes Arquitectura:
- **Atoms**: Componentes básicos reutilizables
- **Molecules**: Combinaciones de atoms
- **Organisms**: Componentes complejos con lógica de negocio
- **Pages**: Vistas completas de la aplicación

## 🚀 Instrucciones de Instalación y Ejecución

### Prerrequisitos
- Docker y Docker Compose
- Node.js (para desarrollo local del frontend)
- Python 3.9+ (para desarrollo local del backend)

### 🐳 Ejecución con Docker (Recomendado)

```bash
# Clonar el repositorio
git clone <repository-url>
cd onboarding-flow

# Ejecutar todos los servicios
docker compose up -d --build
```

**Servicios disponibles:**
- Frontend: http://localhost:5001
- Backend API: http://localhost:5002
- Base de datos PostgreSQL: localhost:5436

### 🔧 Desarrollo Local

#### Backend
```bash
cd backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar servidor de desarrollo
python -m fastapi dev app/main.py
```

#### Frontend
```bash
cd frontend

# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev
```

### 🗄️ Base de Datos Local (Sin Docker)

Si deseas ejecutar sin Docker, tienes dos opciones:

#### Opción 1: PostgreSQL instalado localmente
```bash
# Crear base de datos
createdb onboarding_flow

# O usando psql
psql -U postgres -c "CREATE DATABASE onboarding_flow;"
```

#### Opción 2: Solo base de datos con Docker (sin docker-compose)
```bash
# Ejecutar solo el contenedor de PostgreSQL
docker run -d \
  --name onboarding_flow-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=onboarding_flow \
  -p 5436:5432 \
  -v onboarding_flow-db-data:/var/lib/postgresql/data \
  -v $(pwd)/init-db.sql:/docker-entrypoint-initdb.d/init-dbs.sql \
  postgres:latest
```

**Nota**: Para la opción 2, asegúrate de estar en la raíz del proyecto donde se encuentra el archivo `init-db.sql`.

## 🔐 Variables de Entorno

### Backend (`.env`)
```env
DATABASE_URL=postgresql://postgres:password@localhost:5436/onboarding_flow
```

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:8000/
```

**Nota**: Ajusta las URLs según tu entorno (desarrollo local vs Docker).

## 📊 Datos de Prueba

Al iniciar la aplicación por primera vez, se cargan automáticamente datos de prueba que incluyen:

### Roles Predefinidos:
- Desarrollador
- Líder Técnico
- DevOps
- Arquitecto de Software
- Product Owner
- Scrum Master
- Calidad (QA)
- Diseñador UX/UI
- Administrador

### Estados de Solicitud:
- Pendiente
- Aprobada
- Rechazada

### Software Disponible:
- IntelliJ IDEA, Visual Studio Code
- Docker, Kubernetes
- Jira, Confluence, Slack
- Figma, Adobe Creative Suite
- SonarCloud, TestRail
- Y más herramientas categorizadas por rol

### Usuarios de Ejemplo:
Se crean más de 30 usuarios de prueba con diferentes roles, áreas y equipos, incluyendo:
- María Fernández (Administración)
- Carlos Gómez (Desarrollo Frontend)
- Laura Rodríguez (Desarrollo Backend)
- David Martínez (Calidad)
- Y muchos más...

### Datos Relacionados:
- Solicitudes de dispositivos (laptops, equipos de diferentes marcas)
- Solicitudes de acceso a software según el rol del usuario
- Estados variados para simular flujos reales

## 🎯 Funcionalidades Principales

1. **Gestión de Usuarios**: CRUD completo con roles y equipos
2. **Solicitudes de Equipos**: Proceso de solicitud y aprobación de dispositivos
3. **Control de Accesos**: Asignación de software según roles
4. **Dashboard de Métricas**: Visualización de estadísticas del sistema
5. **Estados de Solicitudes**: Seguimiento del flujo de aprobaciones
6. **Filtros y Búsquedas**: Herramientas para encontrar información rápidamente

## 🔮 Mejoras Futuras

### Funcionalidades Pendientes:
- **Autenticación y Autorización**: Implementar JWT y roles de acceso
- **Notificaciones**: Sistema de notificaciones en tiempo real
- **Flujos de Aprobación**: Workflow configurable para aprobaciones
- **Integración con LDAP/AD**: Sincronización con directorio activo
- **Auditoría**: Log de acciones y cambios en el sistema
- **Reportes Avanzados**: Exportación de datos y reportes personalizados
- **API de Integración**: Webhooks para integraciones externas

### Mejoras Técnicas:
- **Testing**: Implementar tests unitarios y de integración
- **CI/CD**: Pipeline de despliegue automatizado
- **Monitoreo**: Logging avanzado y métricas de performance
- **Caché**: Implementar Redis para mejorar performance
- **Microservicios**: Separar funcionalidades en servicios independientes
- **GraphQL**: API más flexible para el frontend
- **PWA**: Convertir el frontend en Progressive Web App

### Mejoras de UX/UI:
- **Tema Oscuro**: Implementar modo oscuro
- **Responsivo**: Mejorar experiencia móvil
- **Internacionalización**: Soporte multi-idioma
- **Accesibilidad**: Cumplir con estándares WCAG
- **Offline Mode**: Funcionalidad sin conexión

## 📝 Documentación Adicional

- **API Documentation**: Disponible en `http://localhost:5002/docs` (Swagger UI)
- **Redoc**: Documentación alternativa en `http://localhost:5002/redoc`



---

**Desarrollado con ❤️ para optimizar el proceso de onboarding empresarial**
