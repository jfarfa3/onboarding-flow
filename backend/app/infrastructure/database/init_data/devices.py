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

    models = ["Laptop Pro", "MacBook Air", "Dell XPS",
              "Lenovo ThinkPad", "Surface Laptop"]
    operating_systems = ["Windows 11",
                         "macOS Sonoma", "Ubuntu 22.04", "Fedora 39"]

    for user in users:
        for _ in range(random.randint(2, 5)):
            selected_state = random.choice(states)

            device = Device(
                user_id=user.id,
                state_request_id=selected_state.id
            )

            if selected_state.label == "Aprobada":
                device.serial_number = f"SN-{random.randint(10000,99999)}"
                device.model = random.choice(models)
                device.system_operating = random.choice(operating_systems)
            else:
                device.serial_number = None
                device.model = None
                device.system_operating = None

            db.add(device)
    db.commit()
