from app.domain.models.role import Role

def insert_default_roles(db):
    default_roles = [
        {"label": "Desarrollador"},
        {"label": "Administrador"},
        {"label": "Líder Técnico"},
        {"label": "DevOps"},
        {"label": "Arquitecto de Software"},
        {"label": "Product Owner"},
        {"label": "Scrum Master"},
        {"label": "Diseñador UX/UI"},
        {"label": "Calidad (QA)"},
    ]
    
    existing_roles = {role.label for role in db.query(Role).all()}
    for role_data in default_roles:
        if role_data["label"] not in existing_roles:
            db.add(Role(label=role_data["label"]))
    db.commit()