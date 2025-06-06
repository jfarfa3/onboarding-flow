# 🚀 Guía del Template FullStack FastAPI + React

Esta guía explica cómo utilizar este template para iniciar nuevos proyectos de manera rápida y eficiente.

## 🛠️ Estructura y Filosofía del Template

Este template está estructurado siguiendo principios de arquitectura limpia y mejores prácticas tanto en el backend como en el frontend:

### Backend (FastAPI + Python)
- **Arquitectura Limpia**: Separación clara de responsabilidades (dominio, aplicación, infraestructura)
- **Orientado a Casos de Uso**: Cada funcionalidad está encapsulada en casos de uso específicos
- **Modelos de Dominio**: Entidades de negocio separadas de las representaciones de datos (schemas)
- **Inyección de Dependencias**: Facilita el testeo y desacopla componentes

### Frontend (React + TypeScript)
- **Componentes Atómicos**: Estructura basada en Atomic Design (átomos, moléculas, organismos, etc.)
- **Estado Global con Zustand**: Gestión de estado simple y eficiente
- **Hooks Personalizados**: Encapsula lógica compleja reutilizable
- **Servicios de API**: Separación clara de la lógica de comunicación con el backend

## 🧰 Cómo Utilizar Este Template

### 1. Generar un nuevo proyecto

```bash
# Hacer ejecutable el script (solo necesario la primera vez)
chmod +x create-custom-project.sh

# Crear un nuevo proyecto
./create-custom-project.sh nombre-del-proyecto
```

También puedes usar opciones adicionales:
```bash
# Crear un proyecto personalizado con autenticación
./create-custom-project.sh nombre-del-proyecto --with-auth

# Crear un proyecto sin frontend 
./create-custom-project.sh nombre-del-proyecto --no-react

# Crear un proyecto sin backend
./create-custom-project.sh nombre-del-proyecto --no-fastapi
```

### 2. Personalizar la configuración

Puedes personalizar la configuración del nuevo proyecto editando los siguientes archivos:

- **Backend**
  - `backend/app/config/env.py`: Configuración de variables de entorno
  - `backend/app/main.py`: Configuración principal de la API
  - `backend/requirements.txt`: Dependencias de Python

- **Frontend**
  - `frontend/package.json`: Dependencias de npm y scripts
  - `frontend/vite.config.ts`: Configuración de Vite
  - `frontend/src/config/`: Archivos de configuración 

- **Docker**
  - `docker-compose.yml`: Configuración de servicios, puertos y volúmenes
  - `backend/Dockerfile` y `frontend/Dockerfile`: Configuración de imágenes

### 3. Extender la funcionalidad

El template está diseñado para ser ampliado según las necesidades del proyecto:

#### Backend
- Agregar nuevas rutas en `app/infrastructure/api/routes/`
- Crear nuevos modelos de dominio en `app/domain/models/`
- Implementar nuevos casos de uso en `app/application/use_cases/`
- Agregar servicios adicionales en `app/application/services/`

#### Frontend
- Añadir nuevos componentes en `src/components/`
- Crear nuevos hooks en `src/hooks/`
- Implementar nuevos servicios en `src/services/`
- Definir nuevos tipos en `src/types/`
- Agregar nuevas stores para estado global en `src/store/`

## 🔗 Relaciones y Flujo de Datos

### Backend
```
User request → API Route → Use Case → Service → Domain Model → Database
                                   ↓
                            Response Schema
```

### Frontend
```
User interaction → Component → Hook → Store ← Service → API
                       ↑          ↑
                     Props     State data
```

## 📋 Lista de verificación para nuevo proyecto

- [ ] Adaptar README.md con descripción del nuevo proyecto
- [ ] Revisar y actualizar modelo de base de datos en `init-db.sql`
- [ ] Personalizar variables de entorno en backend
- [ ] Configurar servicios de autenticación según necesidades
- [ ] Actualizar el título de la aplicación en frontend
- [ ] Verificar configuración de CORS si es necesario
- [ ] Personalizar rutas y componentes del frontend
- [ ] Adaptar modelos y esquemas según los requisitos del proyecto

## 🚀 Consejos para la extensión

### Añadir nuevas características
1. Definir el modelo de dominio
2. Crear los esquemas (DTOs)
3. Implementar el caso de uso
4. Agregar endpoint en la API
5. Crear servicio en el frontend
6. Implementar componentes y hooks asociados

### Integración con servicios externos
1. Crear un servicio específico en `app/application/services/`
2. Configurar las conexiones en `app/config/`
3. Actualizar las variables de entorno
4. Implementar el servicio correspondiente en el frontend

## 🔍 Debugging

### Backend
- Los logs se guardan en `backend/logs/`
- Documentación API disponible en `/docs` (Swagger)
- Endpoints de health check para monitoreo

### Frontend
- React Developer Tools para depuración
- Console logs con niveles de importancia
- Error boundaries para captura de excepciones

## 🧪 Testing

### Backend
- Configurar pytest para tests unitarios y de integración
- Usar pytest-mock para mocks
- Crear fixtures para configuración de tests

### Frontend
- Configurar Jest y Testing Library
- Separar tests unitarios de tests de integración
- Mockear servicios y respuestas de API
