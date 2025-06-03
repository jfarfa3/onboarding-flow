from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os


Base = declarative_base()

DATABASE_URL = os.getenv(
    'DATABASE_URL', 'postgresql://postgres:password@localhost:5436/onboarding_flow')

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
    import app.domain.models.software_roles

    # Base.metadata.drop_all(bind=engine) # Uncomment this line to drop all tables before creating them again to reset the database in development
    Base.metadata.create_all(bind=engine)
    from app.infrastructure.database.init_data import load_all_initial_data

    db = SessionLocal()
    try:
        load_all_initial_data(db)
        print("🎉 Base de datos inicializada con datos por defecto.")
    except Exception as e:
        db.rollback()
        print(f"❌ Error al inicializar la base de datos: {e}")
        raise e
    finally:
        db.close()