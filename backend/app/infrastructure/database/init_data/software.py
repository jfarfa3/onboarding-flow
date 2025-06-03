from app.domain.models.software import Software
from app.domain.models.software_roles import software_roles
from app.domain.models.role import Role
from sqlalchemy import insert


def insert_default_software(db):
    default_software = [
        {
            "name": "GitHub",
            "description": "Plataforma de desarrollo colaborativo y control de versiones.",
            "url": "https://github.com/",
            "is_active": True,
            "roles_required": [
                "Desarrollador",
                "Líder Técnico",
                "DevOps"
            ]
        },
        {
            "name": "AWS",
            "description": "Plataforma de servicios en la nube.",
            "url": "https://aws.amazon.com/",
            "is_active": True,
            "roles_required": [
                "Desarrollador",
                "DevOps",
                "Arquitecto de Software"
            ]
        },
        {
            "name": "Azure DevOps",
            "description": "Herramienta de DevOps y CI/CD.",
            "url": "https://dev.azure.com/",
            "is_active": True,
            "roles_required": [
                "DevOps",
                "Líder Técnico"
            ]
        },
        {
            "name": "SonarCloud",
            "description": "Análisis de calidad de código en la nube.",
            "url": "https://sonarcloud.io/",
            "is_active": True,
            "roles_required": [
                "Desarrollador",
                "Arquitecto de Software",
                "Calidad (QA)"
            ]
        },
        {
            "name": "BrowserStack",
            "description": "Pruebas de aplicaciones web en distintos dispositivos.",
            "url": "https://browserstack.com/",
            "is_active": True,
            "roles_required": [
                "Calidad (QA)",
                "Scrum Master"
            ]
        },
        {
            "name": "Jira",
            "description": "Gestión de proyectos y seguimiento de tareas.",
            "url": "https://www.atlassian.com/software/jira",
            "is_active": True,
            "roles_required": [
                "Product Owner",
                "Scrum Master",
                "Administrador"
            ]
        },
        {
            "name": "Figma",
            "description": "Diseño colaborativo de interfaces.",
            "url": "https://www.figma.com/",
            "is_active": True,
            "roles_required": [
                "Diseñador UX/UI"
            ]
        },
        {
            "name": "TestRail",
            "description": "Gestión de casos de prueba y reportes.",
            "url": "https://www.gurock.com/testrail/",
            "is_active": True,
            "roles_required": [
                "Calidad (QA)"
            ]
        },
        {
            "name": "Slack",
            "description": "Comunicación y colaboración de equipos.",
            "url": "https://slack.com/",
            "is_active": True,
            "roles_required": [
                "Desarrollador",
                "Administrador",
                "Líder Técnico"
            ]
        },
        {
            "name": "Confluence",
            "description": "Documentación colaborativa y base de conocimientos.",
            "url": "https://www.atlassian.com/software/confluence",
            "is_active": True,
            "roles_required": [
                "Administrador",
                "Product Owner"
            ]
        },
        {
            "name": "Terraform Cloud",
            "description": "Automatización de infraestructura como código.",
            "url": "https://app.terraform.io/",
            "is_active": True,
            "roles_required": [
                "DevOps",
                "Arquitecto de Software"
            ]
        },
        {
            "name": "PagerDuty",
            "description": "Plataforma de gestión de incidentes.",
            "url": "https://www.pagerduty.com/",
            "is_active": True,
            "roles_required": [
                "DevOps",
                "Administrador"
            ]
        }
    ]

    extended_software = []
    for item in default_software:
        # Generar variantes
        extended_software.append(item)
        extended_software.append({**item, "name": f"{item['name']} Staging", "url": f"{item['url']}/staging"})
        extended_software.append({**item, "name": f"{item['name']} QA", "url": f"{item['url']}/qa"})
    
    role_mapping = {role.label: role.id for role in db.query(Role).all()}

    for software_data in extended_software:
        software = Software(
            name=software_data["name"],
            description=software_data["description"],
            url=software_data["url"],
            is_active=software_data["is_active"]
        )
        db.add(software)
        db.flush()  # Necesario para obtener el ID

        for role_label in software_data["roles_required"]:
            role_id = role_mapping.get(role_label)
            if not role_id:
                raise Exception(
                    f"El rol '{role_label}' no existe en la base de datos.")
            stmt = insert(software_roles).values(
                software_id=software.id,
                role_id=role_id
            )
            db.execute(stmt)
    db.commit()
