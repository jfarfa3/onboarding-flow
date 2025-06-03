from app.domain.models.device import Device
from app.domain.models.user import User
from app.domain.models.state_request import StateRequest
import random

def insert_default_devices(db):
    users = db.query(User).all()
    states = db.query(StateRequest).all()
    if not users or not states:
        print("⚠️ No hay usuarios o estados de solicitud para asociar dispositivos.")
        return

    models = ["Laptop Pro", "MacBook Air", "Dell XPS", "Lenovo ThinkPad", "Surface Laptop"]
    operating_systems = ["Windows 11", "macOS Sonoma", "Ubuntu 22.04", "Fedora 39"]

    for user in users:
        for _ in range(random.randint(2, 5)):  # Entre 2 y 5 dispositivos por usuario
            device = Device(
                serial_number=f"SN-{random.randint(10000,99999)}",
                model=random.choice(models),
                system_operating=random.choice(operating_systems),
                user_id=user.id,
                state_request_id=random.choice(states).id
            )
            db.add(device)
    db.commit()