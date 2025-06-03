from sqlalchemy import Table, Column, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.infrastructure.database.database import Base

software_roles = Table(
    "software_roles",
    Base.metadata,
    Column("software_id", UUID(as_uuid=True), ForeignKey("software.id"), primary_key=True),
    Column("role_id", UUID(as_uuid=True), ForeignKey("roles.id"), primary_key=True)
)