from app.domain.models.access import Access
from app.domain.models.user import User
from app.domain.models.software import Software
from app.domain.models.state_request import StateRequest
import random

def insert_default_access(db):
    users = db.query(User).all()
    software_list = db.query(Software).all()
    states = db.query(StateRequest).all()
    if not users or not software_list or not states:
        print("⚠️ No hay datos suficientes para crear accesos.")
        return

    for user in users:
        selected_software = random.sample(software_list, min(3, len(software_list)))
        for software in selected_software:
            access = Access(
                user_id=user.id,
                software_id=software.id,
                state_request_id=random.choice(states).id
            )
            db.add(access)
    db.commit()