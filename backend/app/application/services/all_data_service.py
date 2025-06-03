from sqlalchemy.orm import Session
from app.application.use_cases.user_use_case import get_all_users_use_case
from app.application.use_cases.device_use_case import get_all_devices_use_case
from app.application.use_cases.access_use_case import get_all_accesses_use_case

def get_all_data_service(db: Session):
    users = get_all_users_use_case(db)
    devices = get_all_devices_use_case(db)
    access = get_all_accesses_use_case(db)

        
    