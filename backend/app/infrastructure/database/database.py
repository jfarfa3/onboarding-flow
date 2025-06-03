from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

Base = declarative_base()

DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:password@localhost:5436/onboarding_flow')

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
  db = SessionLocal()
  try:
    yield db
  finally:
    db.close()

def init_db():
  import app.domain.models.user
  import app.domain.models.role
  import app.domain.models.access
  import app.domain.models.device
  import app.domain.models.software
  import app.domain.models.state_request
  
  Base.metadata.drop_all(bind=engine)
  Base.metadata.create_all(bind=engine)
  
    # Inserta datos por defecto
  from app.domain.models.role import Role
  from app.domain.models.state_request import StateRequest
  import uuid

  default_roles = [
      {"name": "dev", "label": "Desarrollador"},
      {"name": "admin", "label": "Administrador"},
      {"name": "lead", "label": "Líder Técnico"},
      {"name": "devops", "label": "DevOps"},
      {"name": "architect", "label": "Arquitecto de Software"},
      {"name": "product_owner", "label": "Product Owner"},
      {"name": "scrum_master", "label": "Scrum Master"},
      {"name": "ux_ui", "label": "Diseñador UX/UI"},
      {"name": "qa", "label": "Calidad (QA)"},
  ]

  default_states = [
      {"state": "pending", "label": "Pendiente"},
      {"state": "approved", "label": "Aprovada"},
      {"state": "rejected", "label": "Rechazada"},
  ]

  db = SessionLocal()
  try:
    for role_data in default_roles:
        role = Role(
            name=role_data["name"],
            label=role_data["label"]
        )
        db.add(role)

    for state_data in default_states:
        state = StateRequest(
            state=state_data["state"],
            label=state_data["label"]
        )
        db.add(state)

    db.commit()
  except Exception as e:
    db.rollback()
    raise e
  finally:
    db.close()      
