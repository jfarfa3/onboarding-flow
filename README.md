# Sistema de Gestión de Onboarding

Este es un sistema completo de gestión de onboarding para empleados que incluye la gestión de usuarios, equipos, software y accesos. El proyecto está construido con FastAPI en el backend, React + TypeScript + Vite en el frontend, y PostgreSQL como base de datos.

## 🏗️ Arquitectura del Proyecto

### Backend (FastAPI)
- **Framework**: FastAPI con Python 3.9+
- **Base de datos**: PostgreSQL con SQLAlchemy ORM
- **Arquitectura**: Clean Architecture (Domain, Application, Infrastructure)
- **Puerto**: 5002

### Frontend (React + TypeScript)
- **Framework**: React 19 con TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS 4.x
- **Estado**: Zustand
- **HTTP Client**: Axios
- **Puerto**: 5001

### Base de Datos
- **Motor**: PostgreSQL
- **Puerto**: 5436 (mapeado desde 5432 del contenedor)

## 📋 Funcionalidades Principales

### Gestión de Usuarios
- CRUD completo de usuarios
- Asignación de roles y equipos
- Gestión de áreas de trabajo
- Control de estado activo/inactivo

### Gestión de Equipos/Dispositivos
- Registro de dispositivos (serial, modelo, sistema operativo)
- Asignación a usuarios
- Control de estados de solicitud

### Gestión de Software
- Catálogo de software disponible
- Configuración de roles requeridos
- URLs de acceso
- Estado activo/inactivo

### Gestión de Accesos
- Solicitudes de acceso a software
- Estados de aprobación (Pendiente, Aprobada, Rechazada)
- Vinculación usuario-software

### Gestión de Roles
- Definición de roles organizacionales
- Permisos basados en roles
- Relación muchos a muchos con software

## 🚀 Inicio Rápido

### Prerequisitos
- Docker y Docker Compose
- Node.js 18+ (para desarrollo local)
- Python 3.9+ (para desarrollo local)

### Opción 1: Usando Docker Compose (Recomendado)

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd onboarding-flow
```

2. **Ejecutar con Docker Compose**
```bash
# Construir e iniciar todos los servicios
docker-compose up --build

# O en modo detached (segundo plano)
docker-compose up -d --build
```

3. **Acceder a la aplicación**
- **Frontend**: http://localhost:5001
- **Backend API**: http://localhost:5002
- **Documentación API**: http://localhost:5002/docs

4. **Detener los servicios**
```bash
docker-compose down

# Para eliminar también los volúmenes
docker-compose down -v
```

### Opción 2: Desarrollo Local (con PostgreSQL en Docker)

El desarrollo local ahora utiliza un contenedor Docker para PostgreSQL, eliminando la necesidad de instalar PostgreSQL localmente.

#### Requisitos para Desarrollo Local
- **Docker** (para PostgreSQL)
- **Python 3.9+**
- **Node.js 18+**

#### Ejecución Automática

1. **Usar el script automatizado**
```bash
# Dar permisos de ejecución (solo la primera vez)
chmod +x run-local.sh

# Ejecutar el proyecto
./run-local.sh
```

El script automáticamente:
- ✅ Verifica todas las dependencias
- 🐳 Crea y configura el contenedor PostgreSQL
- 🐍 Configura el entorno virtual de Python
- 📦 Instala todas las dependencias
- 🚀 Inicia todos los servicios
- 📋 Muestra información útil

#### Ejecución Manual (Opcional)

Si prefieres ejecutar manualmente cada paso:

**PostgreSQL (Docker)**
```bash
# Crear y ejecutar contenedor PostgreSQL
docker run -d \
  --name onboarding_flow-db-local \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=onboarding_flow \
  -p 5436:5432 \
  postgres:latest
```

**Backend**

1. **Navegar al directorio del backend**
```bash
cd backend
```

2. **Crear y activar entorno virtual**
```bash
python3 -m venv venv
source venv/bin/activate  # En macOS/Linux
# o en Windows: venv\Scripts\activate
```

3. **Instalar dependencias**
```bash
pip install -r requirements.txt
```

4. **Configurar variables de entorno**
```bash
# El archivo .env se configura automáticamente, pero puedes verificarlo
echo "DATABASE_URL=postgresql://postgres:password@localhost:5436/onboarding_flow" > .env
```

5. **Ejecutar el servidor**
```bash
# Desde el directorio backend
cd app
uvicorn main:app --host 0.0.0.0 --port 5002 --reload
```

**Frontend**

1. **Navegar al directorio del frontend**
```bash
cd frontend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

#### Acceso a la Base de Datos

```bash
# Conectar al contenedor PostgreSQL
docker exec -it onboarding_flow-db-local psql -U postgres -d onboarding_flow

# Ver logs del contenedor
docker logs onboarding_flow-db-local

# Detener el contenedor
docker stop onboarding_flow-db-local

# Reiniciar el contenedor
docker start onboarding_flow-db-local
```

4. **Construir para producción**
```bash
npm run build
npm run preview
```

## 📁 Estructura del Proyecto

```
onboarding-flow/
├── docker-compose.yml          # Configuración de Docker Compose
├── init-db.sql                 # Script inicial de base de datos
├── README.md                   # Este archivo
├── run-docker.sh              # Script para Docker Compose
├── run-local.sh               # Script para desarrollo local
├── run-local-old.sh           # Script legacy (PostgreSQL local)
├── stop-services.sh           # Script para detener servicios
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── .env                   # Variables de entorno (auto-generado)
│   ├── logs/                  # Logs de la aplicación
│   └── app/
│       ├── main.py            # Punto de entrada de FastAPI
│       ├── config/            # Configuraciones (logger, env)
│       │   ├── env.py
│       │   └── logger.py
│       ├── domain/            # Modelos y esquemas del dominio
│       │   ├── models/        # Modelos SQLAlchemy
│       │   │   ├── access.py
│       │   │   ├── device.py
│       │   │   ├── role.py
│       │   │   ├── software.py
│       │   │   ├── state_request.py
│       │   │   └── user.py
│       │   └── schemas/       # Esquemas Pydantic
│       │       ├── access.py
│       │       ├── all_data.py
│       │       ├── device.py
│       │       ├── health.py
│       │       ├── role.py
│       │       └── software.py
│       ├── application/       # Casos de uso y servicios
│       │   ├── services/      # Servicios de negocio
│       │   │   ├── access_service.py
│       │   │   ├── all_data_service.py
│       │   │   └── software_service.py
│       │   └── use_cases/     # Casos de uso
│       │       ├── access_use_case.py
│       │       ├── device_use_case.py
│       │       ├── role_use_case.py
│       │       ├── software_use_case.py
│       │       ├── state_request_use_case.py
│       │       └── user_use_case.py
│       └── infrastructure/    # Infraestructura (DB, API, repositories)
│           ├── api/           # Rutas de API
│           └── database/      # Configuración de BD
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── vite.config.ts
    ├── nginx.conf            # Configuración Nginx para producción
    ├── public/
    └── src/
        ├── components/       # Componentes React (atomic design)
        │   ├── atoms/        # Componentes básicos
        │   ├── molecules/    # Componentes compuestos
        │   ├── organism/     # Componentes complejos
        │   ├── pages/        # Páginas completas
        │   └── layout/       # Componentes de layout
        ├── hooks/           # Custom hooks
        │   ├── useAllData.ts
        │   ├── useRole.ts
        │   ├── useSoftware.ts
        │   └── useStateRequest.ts
        ├── services/        # Servicios HTTP
        │   ├── access.ts
        │   ├── devices.ts
        │   ├── http.ts
        │   ├── roles.ts
        │   ├── software.ts
        │   └── user.ts
        ├── store/          # Estado global (Zustand)
        │   ├── accessStore.ts
        │   ├── devicesStore.ts
        │   ├── generalStore.ts
        │   ├── roleStore.ts
        │   ├── sessionStore.ts
        │   ├── sidebarStore.ts
        │   ├── softwareStore.ts
        │   ├── stateRequest.ts
        │   └── userStore.ts
        ├── types/          # Definiciones TypeScript
        │   ├── access.ts
        │   ├── devices.ts
        │   ├── dynamicForm.ts
        │   ├── dynamicTable.ts
        │   ├── input.ts
        │   ├── itemsSidebar.ts
        │   ├── letter.ts
        │   ├── roles.ts
        │   ├── software.ts
        │   ├── stateRequest.ts
        │   └── user.ts
        ├── utils/          # Utilidades
        │   ├── filters.ts
        │   ├── jwt.ts
        │   └── toast.ts
        └── mocks/          # Datos de prueba
            ├── jwt.ts
            └── users.ts
```

## 🛠️ Scripts de Automatización

Se incluyen scripts shell profesionales con **interfaz en español** para facilitar el desarrollo:

### `run-docker.sh`
Script para ejecutar el proyecto completo con Docker Compose.
- ✅ Verifica instalación de Docker
- 🔍 Chequea puertos disponibles
- 🏗️ Construye e inicia todos los servicios
- 📋 Muestra logs en tiempo real (opcional)
- 🌐 **Interfaz completamente en español**

### `run-local.sh`
Script para ejecutar el proyecto en modo desarrollo local con PostgreSQL en Docker.
- ✅ Verifica todas las dependencias (Docker, Python, Node.js)
- 🐳 Maneja automáticamente el contenedor PostgreSQL
- 🐍 Configura entorno virtual de Python
- 📦 Instala dependencias automáticamente
- 🚀 Inicia backend y frontend en segundo plano
- 🗄️ Crea base de datos automáticamente
- 🌐 **Interfaz completamente en español**
- 📊 **Información detallada de servicios y logs**
- 🛠️ **Comandos útiles integrados**

### `stop-services.sh`
Script interactivo para detener servicios.
- 🐳 Detiene contenedores Docker
- 💻 Detiene procesos locales de desarrollo
- 🔧 Limpia puertos específicos
- 🔍 Verifica estado final
- 🌐 **Interfaz completamente en español**

### Uso de los Scripts

```bash
# Dar permisos de ejecución (solo la primera vez)
chmod +x run-docker.sh run-local.sh stop-services.sh

# Ejecutar con Docker Compose
./run-docker.sh

# Ejecutar en modo desarrollo local
./run-local.sh

# Detener todos los servicios
./stop-services.sh
```

### 🌟 Características Avanzadas de los Scripts

Los scripts incluyen características profesionales para una mejor experiencia de desarrollo:

**🎨 Interfaz Visual Mejorada:**
- Mensajes colorados y emojis para mejor legibilidad
- Progreso en tiempo real de las operaciones
- Información detallada de cada paso del proceso

**🛡️ Validación Robusta:**
- Verificación automática de dependencias del sistema
- Detección de puertos en uso con opciones de resolución
- Validación de Docker y servicios antes de la ejecución

**🔧 Gestión Inteligente de Servicios:**
- Manejo automático del ciclo de vida de PostgreSQL en Docker
- Configuración automática de variables de entorno
- Limpieza elegante al salir (Ctrl+C)

**📊 Monitoreo y Diagnóstico:**
- Verificación del estado de todos los servicios
- Logs centralizados con opciones de visualización en tiempo real
- Comandos útiles integrados para administración

**🌐 Experiencia de Usuario:**
- Prompts interactivos para decisiones del usuario
- Información contextual sobre URLs, credenciales y comandos
- Compatibilidad multiplataforma (macOS/Linux)

## 🎯 Flujo de Trabajo Recomendado

### Para Desarrollo Rápido (Recomendado)
```bash
# 1. Usar Docker Compose para desarrollo completo
./run-docker.sh

# 2. Acceder a:
# - Frontend: http://localhost:5001
# - API: http://localhost:5002/docs
# - BD: localhost:5436
```

### Para Desarrollo Avanzado
```bash
# 1. Usar desarrollo local para debugging
./run-local.sh

# 2. Esto te permite:
# - Debugging directo en VS Code
# - Hot reload en ambos servicios
# - Acceso directo a logs
# - Desarrollo independiente de frontend/backend
```

### Para Debugging de Base de Datos
```bash
# Conectar directamente a PostgreSQL
docker exec -it onboarding_flow-db-local psql -U postgres -d onboarding_flow

# Ver logs de la base de datos
docker logs -f onboarding_flow-db-local
```

## 💡 Tips de Desarrollo

### Backend (FastAPI)
- **Hot Reload**: El servidor se reinicia automáticamente al cambiar código
- **Documentación**: Siempre disponible en `/docs` y `/redoc`
- **Logs**: Se guardan automáticamente en `backend/logs/`
- **Base de Datos**: Se configura automáticamente con las migraciones

### Frontend (React + Vite)
- **Hot Module Replacement**: Cambios instantáneos sin perder estado
- **TypeScript**: Verificación de tipos en tiempo real
- **Zustand**: Estado global simple y reactivo
- **TailwindCSS**: Estilos utilitarios con purga automática

### Base de Datos
- **Persistencia**: Los datos se mantienen entre reinicios
- **Backups**: Usar `docker exec` para exportar datos
- **Reset**: `docker-compose down -v` para limpiar completamente

## 🔧 Variables de Entorno

### Backend (`backend/.env`)
```bash
DATABASE_URL=postgresql://postgres:password@localhost:5436/onboarding_flow
```

### Frontend (Variables de build)
```bash
VITE_API_URL=http://localhost:5002/
```

> **Nota**: Los archivos `.env` se generan automáticamente por los scripts

## 🔧 Configuración

### Variables de Entorno

#### Backend (.env)
```
DATABASE_URL=postgresql://postgres:password@localhost:5436/onboarding_flow
```

#### Frontend (vite.config.ts)
```typescript
VITE_API_URL=http://localhost:5002/
```

### Puertos
- **Frontend**: 5001
- **Backend**: 5002
- **PostgreSQL**: 5436

## 📊 API Endpoints

### Salud del Sistema
- `GET /health` - Estado del servicio

### Usuarios
- `GET /users` - Listar usuarios
- `POST /users` - Crear usuario
- `GET /users/{id}` - Obtener usuario
- `PUT /users/{id}` - Actualizar usuario
- `DELETE /users/{id}` - Eliminar usuario

### Dispositivos
- `GET /devices` - Listar dispositivos
- `POST /devices` - Crear dispositivo
- `GET /devices/{id}` - Obtener dispositivo
- `PUT /devices/{id}` - Actualizar dispositivo
- `DELETE /devices/{id}` - Eliminar dispositivo

### Software
- `GET /software` - Listar software
- `POST /software` - Crear software
- `GET /software/{id}` - Obtener software
- `PUT /software/{id}` - Actualizar software
- `DELETE /software/{id}` - Eliminar software

### Accesos
- `GET /access` - Listar accesos
- `POST /access` - Crear acceso
- `GET /access/{id}` - Obtener acceso
- `PUT /access/{id}` - Actualizar acceso
- `DELETE /access/{id}` - Eliminar acceso

### Roles
- `GET /roles` - Listar roles
- `POST /roles` - Crear rol
- `GET /roles/{id}` - Obtener rol
- `PUT /roles/{id}` - Actualizar rol
- `DELETE /roles/{id}` - Eliminar rol

### Estados de Solicitud
- `GET /state-requests` - Listar estados
- `POST /state-requests` - Crear estado de solicitud
- `GET /state-requests/{id}` - Obtener estado de solicitud
- `PUT /state-requests/{id}` - Actualizar estado de solicitud
- `DELETE /state-requests/{id}` - Eliminar estado de solicitud

### Accesos (Rutas Especiales)
- `PATCH /access/{id}/{new_status}` - Actualizar estado de acceso específico

### Datos Consolidados
- `GET /all-data` - Obtener todos los datos relacionados

## 🗄️ Modelo de Datos

### Entidades Principales

#### User (Usuario)
- `id` (UUID)
- `name` (String)
- `email` (String, único)
- `area` (String)
- `team` (String)
- `role_id` (UUID, FK)
- `is_active` (Boolean)
- `last_login` (DateTime)

#### Device (Dispositivo)
- `id` (UUID)
- `serial_number` (String)
- `model` (String)
- `system_operating` (String)
- `user_id` (UUID, FK)
- `state_request_id` (UUID, FK)

#### Software
- `id` (UUID)
- `name` (String)
- `description` (Text)
- `url` (String)
- `is_active` (Boolean)
- Relación muchos a muchos con roles

#### Access (Acceso)
- `id` (UUID)
- `user_id` (UUID, FK)
- `software_id` (UUID, FK)
- `state_request_id` (UUID, FK)

#### Role (Rol)
- `id` (UUID)
- `label` (String)

#### StateRequest (Estado de Solicitud)
- `id` (UUID)
- `label` (String) - "Pendiente", "Aprobada", "Rechazada"

## 📝 Logs

Los logs del backend se almacenan en `backend/logs/` con rotación diaria:
- `app_YYYYMMDD.log`

## 🧪 Testing

### Backend (FastAPI)
```bash
# Ejecutar tests unitarios
cd backend
source venv/bin/activate
pytest

# Ejecutar tests con cobertura
pytest --cov=app

# Ejecutar tests específicos
pytest tests/test_user_use_case.py
```

### Frontend (React + TypeScript)
```bash
# Ejecutar tests unitarios
cd frontend
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con cobertura
npm run test:coverage
```

## 🚀 Deployment

### Desarrollo
```bash
# Docker Compose para desarrollo
./run-docker.sh
```

### Staging/Producción
```bash
# Docker Compose para producción (cuando esté disponible)
docker-compose -f docker-compose.prod.yml up -d
```

### Variables de Entorno para Producción
```bash
# Backend
DATABASE_URL=postgresql://user:password@host:5432/database
SECRET_KEY=your-secret-key
ENVIRONMENT=production

# Frontend
VITE_API_URL=https://your-api-domain.com/
```

## 📊 Monitoreo y Logs

### Logs del Backend
```bash
# Ver logs en tiempo real
tail -f backend/logs/app_$(date +%Y%m%d).log

# Buscar errores específicos
grep "ERROR" backend/logs/app_*.log

# Filtrar por endpoint
grep "/api/users" backend/logs/app_*.log
```

### Logs de Docker
```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Filtrar logs por tiempo
docker-compose logs --since="1h" backend
```

### Métricas del Sistema
```bash
# Ver uso de recursos de contenedores
docker stats

# Ver espacio en disco usado por Docker
docker system df

# Ver información de la base de datos
docker exec onboarding_flow-db-local psql -U postgres -d onboarding_flow -c "\dt+"
```

## 🛡️ Seguridad

### Configuraciones de Seguridad
- **CORS**: Configurado para desarrollo local
- **Autenticación**: JWT tokens para autenticación
- **Variables de Entorno**: Credenciales nunca hardcodeadas
- **Docker**: Contenedores con usuarios no-root cuando sea posible

### Mejores Prácticas
```bash
# Nunca commits archivos .env
echo "*.env" >> .gitignore

# Usar secrets para producción
# Variables sensibles deben ser inyectadas como secrets de Docker

# Mantener dependencias actualizadas
cd backend && pip list --outdated
cd frontend && npm audit
```

## 🔄 CI/CD (Futuro)

### GitHub Actions (Propuesto)
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Backend Tests
        run: |
          cd backend
          pip install -r requirements.txt
          pytest
      - name: Run Frontend Tests
        run: |
          cd frontend
          npm install
          npm test
```

## 📚 Recursos Adicionales

### Documentación de Tecnologías
- **FastAPI**: https://fastapi.tiangolo.com/
- **React**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/
- **Vite**: https://vitejs.dev/
- **TailwindCSS**: https://tailwindcss.com/
- **Zustand**: https://zustand-demo.pmnd.rs/
- **SQLAlchemy**: https://www.sqlalchemy.org/
- **PostgreSQL**: https://www.postgresql.org/

### Herramientas de Desarrollo
- **Docker**: https://docs.docker.com/
- **VS Code Extensions**: 
  - Python
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - Docker
  - PostgreSQL

## 🤝 Contribución

### Cómo Contribuir
1. **Fork el repositorio**
2. **Crear una rama feature**: `git checkout -b feature/nueva-funcionalidad`
3. **Hacer commits descriptivos**: `git commit -m "feat: agregar gestión de permisos"`
4. **Push a la rama**: `git push origin feature/nueva-funcionalidad`
5. **Crear Pull Request**

### Convenciones de Código

#### Backend (Python)
```python
# Usar PEP 8
# Imports organizados
# Type hints obligatorios
# Docstrings para funciones públicas

def create_user(user_data: UserCreate) -> User:
    """
    Crea un nuevo usuario en el sistema.
    
    Args:
        user_data: Datos del usuario a crear
        
    Returns:
        Usuario creado con ID asignado
    """
```

#### Frontend (TypeScript/React)
```typescript
// Componentes funcionales con TypeScript
// Props tipadas
// Hooks personalizados para lógica reutilizable
// Atomic Design para organización

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
  // ...
};
```

### Git Commit Convention
```bash
# Tipos de commits
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: formateo, punto y coma faltante, etc
refactor: refactoring de código
test: agregar tests
chore: tareas de mantenimiento

# Ejemplos
git commit -m "feat: agregar filtros avanzados en tabla de usuarios"
git commit -m "fix: corregir validación de email en formulario"
git commit -m "docs: actualizar README con nuevas instrucciones"
```

## 🆘 Soporte

### Reportar Issues
Para problemas o preguntas:

1. **Verificar documentación**: Revisar este README y la documentación de la API
2. **Verificar logs**: Revisar `backend/logs/` y logs de Docker
3. **Buscar issues existentes**: Verificar si el problema ya fue reportado
4. **Crear nuevo issue**: Incluir pasos para reproducir, logs relevantes y configuración

### Canales de Comunicación
- **Issues**: Para bugs y feature requests
- **Discussions**: Para preguntas generales y ayuda
- **Documentation**: http://localhost:5002/docs para API reference

## 📋 Roadmap

### Version 1.1
- [ ] Autenticación y autorización completa
- [ ] Notificaciones en tiempo real
- [ ] Dashboard con métricas
- [ ] Exportación de reportes

### Version 1.2
- [ ] API versioning
- [ ] Tests de integración
- [ ] Performance monitoring
- [ ] Multi-tenancy

### Version 2.0
- [ ] Microservicios
- [ ] Kubernetes deployment
- [ ] GraphQL API
- [ ] Mobile app

---

**Desarrollado con ❤️ para Banco de Bogotá**

*Sistema de Gestión de Onboarding - Version 1.0.0*

---

## 📄 Licencia

Este proyecto es propiedad de Banco de Bogotá y es de uso interno exclusivo.

## 🔗 Enlaces Útiles

- **Aplicación Local**: http://localhost:5001
- **API Documentation**: http://localhost:5002/docs
- **API Alternative Docs**: http://localhost:5002/redoc
- **Base de Datos**: localhost:5436 (PostgreSQL)
