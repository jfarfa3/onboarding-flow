from fastapi import APIRouter
from app.domain.schemas.health import HealthResponse

router = APIRouter()

@router.get("/health", response_model=HealthResponse, description="API health check")
@router.get("/", response_model=HealthResponse, description="API root health check")
def health():
    return HealthResponse(status="ok")