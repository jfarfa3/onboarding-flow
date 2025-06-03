from app.domain.models.state_request import StateRequest

def insert_default_states(db):
    default_states = [
        {"label": "Pendiente"},
        {"label": "Aprobada"},
        {"label": "Rechazada"},
    ]

    existing_states = {state.label for state in db.query(StateRequest).all()}
    for state_data in default_states:
        if state_data["label"] not in existing_states:
            db.add(StateRequest(label=state_data["label"]))
    db.commit()