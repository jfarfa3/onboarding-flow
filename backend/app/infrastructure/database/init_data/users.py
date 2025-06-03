from app.domain.models.user import User
from app.domain.models.role import Role
import uuid

def insert_default_users(db):
    role_mapping = {role.label: role.id for role in db.query(Role).all()}

    default_users = [
        {"name": "Admin User", "email": "admin@example.com", "area": "Administración", "team": "Equipo A", "role_label": "Administrador"},
        {"name": "Developer One", "email": "dev1@example.com", "area": "Desarrollo", "team": "Frontend", "role_label": "Desarrollador"},
        {"name": "Developer Two", "email": "dev2@example.com", "area": "Desarrollo", "team": "Backend", "role_label": "Desarrollador"},
        {"name": "QA Tester", "email": "qa@example.com", "area": "Calidad", "team": "Testing", "role_label": "Calidad (QA)"},
        {"name": "UX Designer", "email": "ux@example.com", "area": "Diseño", "team": "UX/UI", "role_label": "Diseñador UX/UI"},
        {"name": "Product Owner", "email": "po@example.com", "area": "Producto", "team": "Negocio", "role_label": "Product Owner"},
        {"name": "Scrum Master", "email": "scrum@example.com", "area": "Metodología", "team": "Scrum", "role_label": "Scrum Master"},
        {"name": "DevOps Engineer", "email": "devops@example.com", "area": "Infraestructura", "team": "DevOps", "role_label": "DevOps"},
        {"name": "Software Architect", "email": "arch@example.com", "area": "Arquitectura", "team": "Equipo A", "role_label": "Arquitecto de Software"},
        {"name": "Lead Developer", "email": "lead@example.com", "area": "Desarrollo", "team": "Equipo B", "role_label": "Líder Técnico"},
    ]

    existing_emails = {user.email for user in db.query(User).all()}
    for user_data in default_users:
        if user_data["email"] not in existing_emails:
            user = User(
                name=user_data["name"],
                email=user_data["email"],
                area=user_data["area"],
                team=user_data["team"],
                role_id=role_mapping.get(user_data["role_label"]),
                is_active=True
            )
            db.add(user)
    db.commit()