from sqlalchemy.orm import Session
from app.config.logger import get_logger
from typing import Optional, Dict, Any, List
from app.domain.models.user import User
from app.domain.schemas.access import AccessResponse
from app.domain.schemas.device import DeviceResponse
from app.application.use_cases.user_use_case import get_user_by_id_use_case
from app.config.notification_config import NOTIFICATION_SETTINGS, EMAIL_TEMPLATES
import json
from datetime import datetime

logger = get_logger("services.notification_service")

def _get_user_info(db: Session, user_id: str) -> Optional[Dict[str, Any]]:
    logger.debug(f"Getting user info for user ID: {user_id}")
    user = get_user_by_id_use_case(db, user_id)
    
    if not user:
        logger.warning(f"User with ID {user_id} not found for notification")
        return None
    
    return {
        "id": str(user.id),
        "name": user.name,
        "email": user.email,
        "area": user.area,
        "team": user.team
    }

def _log_notification_sent(notification_type: str, recipient_type: str, recipient: str, content: Dict[str, Any], template_key: Optional[str] = None):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    logger.info(f"NOTIFICATION [{notification_type}] sent at {timestamp} to {recipient_type}: {recipient}")
    
    if template_key and template_key in EMAIL_TEMPLATES:
        subject = EMAIL_TEMPLATES[template_key].get("subject", "No subject")
        logger.info(f"Email subject: {subject}")
    
    logger.info(f"Notification content: {json.dumps(content, default=str)}")

def notify_team_new_request(db: Session, team_type: str, request_data: Dict[str, Any], request_type: str):
    if team_type not in ["access", "it"]:
        logger.error(f"Invalid team type for notification: {team_type}")
        return
    
    team_settings = NOTIFICATION_SETTINGS["teams"].get(team_type, {})
    team_email = team_settings.get("email", "unknown@example.com")
    
    template_key = f"{request_type}_created" 
    
    user_name = "N/A"
    if "user_id" in request_data:
        user_info = _get_user_info(db, str(request_data["user_id"]))
        if user_info:
            user_name = user_info.get("name", "N/A")
    
    notification_content = {
        "request_id": str(request_data.get("id", "Unknown")),
        "request_type": request_type,
        "created_at": str(request_data.get("created_at", "Unknown")),
        "user_name": user_name,
        "software_name": request_data.get("software", {}).get("name", "N/A") if request_type == "access" else "N/A",
        "device_type": request_data.get("type", "N/A") if request_type == "device" else "N/A",
        "status": request_data.get("state_request", {}).get("label", "N/A")
    }
    
    team_name = "Equipo de Accesos" if team_type == "access" else "Equipo de Tecnología TI"
    logger.info(f"TEAM_NOTIFICATION: Nueva solicitud de {request_type} recibida - ID: {notification_content['request_id']} - Para: {team_name}")
    
    _log_notification_sent("team", "email", team_email, notification_content, template_key)

def notify_user_request_update(db: Session, user_id: str, request_data: Dict[str, Any], request_type: str, 
                               new_status: Optional[str] = None):
    user_info = _get_user_info(db, user_id)
    if not user_info:
        logger.warning(f"Cannot notify user {user_id} - user not found")
        return
    
    template_key = f"{request_type}_updated"
    
    status = new_status or request_data.get("state_request", {}).get("label", "Unknown")
    
    notification_content = {
        "request_id": str(request_data.get("id", "Unknown")),
        "request_type": request_type,
        "status": status,
        "updated_at": str(request_data.get("updated_at", "Unknown")),
        "user_name": user_info['name'],
        "software_name": request_data.get("software", {}).get("name", "N/A") if request_type == "access" else "N/A",
        "device_type": request_data.get("type", "N/A") if request_type == "device" else "N/A"
    }
    
    logger.info(f"USER_NOTIFICATION: Usuario {user_info['name']} notificado sobre actualización " 
                f"de solicitud de {request_type} - ID: {notification_content['request_id']}, " 
                f"Estado: {notification_content['status']}")
    
    _log_notification_sent("user", "email", user_info['email'], notification_content, template_key)
