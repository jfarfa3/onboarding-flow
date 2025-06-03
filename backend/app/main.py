import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.config.logger import get_logger
from app.infrastructure.database.database import init_db
from app.infrastructure.api.routes import (
    user_router,
    device_router,
    role_router,
    software_router,
    access_router,
    state_request_router,
    health_router,
    all_data_router
)

logger = get_logger("main")


load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

app = FastAPI(title="Gestion de Usuarios, Equipos y Accesos")

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
    
app.include_router(health_router.router)
app.include_router(user_router.router)
app.include_router(device_router.router)
app.include_router(role_router.router)
app.include_router(software_router.router)
app.include_router(state_request_router.router)
app.include_router(access_router.router)
app.include_router(all_data_router.router)