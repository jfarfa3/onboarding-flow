from app.domain.models.user import User
from app.domain.models.role import Role
import random

def insert_default_users(db):
    roles = db.query(Role).all()
    if not roles:
        print("⚠️ No hay roles en la base de datos. Por favor, crea roles antes de insertar usuarios.")
        return

    default_users = [
        {"name": "María Fernández", "email": "maria.fernandez@example.com", "area": "Administración", "team": "Equipo A"},
        {"name": "Carlos Gómez", "email": "carlos.gomez@example.com", "area": "Desarrollo", "team": "Frontend"},
        {"name": "Laura Rodríguez", "email": "laura.rodriguez@example.com", "area": "Desarrollo", "team": "Backend"},
        {"name": "David Martínez", "email": "david.martinez@example.com", "area": "Calidad", "team": "Testing"},
        {"name": "Sofía Torres", "email": "sofia.torres@example.com", "area": "Diseño", "team": "UX/UI"},
        {"name": "Luis Ramírez", "email": "luis.ramirez@example.com", "area": "Producto", "team": "Negocio"},
        {"name": "Ana Morales", "email": "ana.morales@example.com", "area": "Metodología", "team": "Scrum"},
        {"name": "Felipe Castro", "email": "felipe.castro@example.com", "area": "Infraestructura", "team": "DevOps"},
        {"name": "Gabriela Mendoza", "email": "gabriela.mendoza@example.com", "area": "Arquitectura", "team": "Equipo A"},
        {"name": "Andrés Herrera", "email": "andres.herrera@example.com", "area": "Desarrollo", "team": "Equipo B"},
        {"name": "Valentina Rojas", "email": "valentina.rojas@example.com", "area": "Desarrollo", "team": "Frontend"},
        {"name": "Julián Navarro", "email": "julian.navarro@example.com", "area": "Desarrollo", "team": "Backend"},
        {"name": "Camila Vega", "email": "camila.vega@example.com", "area": "Calidad", "team": "Testing"},
        {"name": "Tomás Duarte", "email": "tomas.duarte@example.com", "area": "Diseño", "team": "UX/UI"},
        {"name": "Natalia López", "email": "natalia.lopez@example.com", "area": "Producto", "team": "Negocio"},
        {"name": "Sebastián Ruiz", "email": "sebastian.ruiz@example.com", "area": "Metodología", "team": "Scrum"},
        {"name": "Diego Medina", "email": "diego.medina@example.com", "area": "Infraestructura", "team": "DevOps"},
        {"name": "Isabella Sánchez", "email": "isabella.sanchez@example.com", "area": "Arquitectura", "team": "Equipo A"},
        {"name": "Mateo Gil", "email": "mateo.gil@example.com", "area": "Desarrollo", "team": "Equipo B"},
        {"name": "Paula Salazar", "email": "paula.salazar@example.com", "area": "Desarrollo", "team": "Equipo C"},
        {"name": "Martín Pérez", "email": "martin.perez@example.com", "area": "Soporte", "team": "Helpdesk"},
        {"name": "Lorena Vargas", "email": "lorena.vargas@example.com", "area": "Marketing", "team": "Digital"},
        {"name": "Alejandro Torres", "email": "alejandro.torres@example.com", "area": "Ventas", "team": "Comercial"},
        {"name": "Diana López", "email": "diana.lopez@example.com", "area": "Recursos Humanos", "team": "Gestión"},
        {"name": "Pablo Sánchez", "email": "pablo.sanchez@example.com", "area": "Legal", "team": "Jurídico"},
        {"name": "Sandra Ruiz", "email": "sandra.ruiz@example.com", "area": "Finanzas", "team": "Contabilidad"},
        {"name": "Ricardo Mendoza", "email": "ricardo.mendoza@example.com", "area": "Compras", "team": "Logística"},
        {"name": "Fernanda Ramírez", "email": "fernanda.ramirez@example.com", "area": "Ventas", "team": "Internacional"},
        {"name": "Oscar Romero", "email": "oscar.romero@example.com", "area": "Operaciones", "team": "Producción"},
        {"name": "Marisol Herrera", "email": "marisol.herrera@example.com", "area": "Atención al Cliente", "team": "Soporte"},
        {"name": "Hugo Morales", "email": "hugo.morales@example.com", "area": "Desarrollo", "team": "Movil"},
        {"name": "Alejandra Castillo", "email": "alejandra.castillo@example.com", "area": "Marketing", "team": "SEO"},
        {"name": "Rodrigo Ruiz", "email": "rodrigo.ruiz@example.com", "area": "Producto", "team": "Investigación"},
        {"name": "Daniela Jiménez", "email": "daniela.jimenez@example.com", "area": "Analítica", "team": "BI"},
        {"name": "Cristian Ortiz", "email": "cristian.ortiz@example.com", "area": "Seguridad", "team": "SOC"},
        {"name": "Verónica Morales", "email": "veronica.morales@example.com", "area": "Legal", "team": "Cumplimiento"},
        {"name": "Esteban Castro", "email": "esteban.castro@example.com", "area": "Desarrollo", "team": "Backend"},
        {"name": "Pamela Gutiérrez", "email": "pamela.gutierrez@example.com", "area": "Diseño", "team": "UI/UX"},
        {"name": "Nicolás Varela", "email": "nicolas.varela@example.com", "area": "Desarrollo", "team": "Data"},
        {"name": "Melissa Díaz", "email": "melissa.diaz@example.com", "area": "Administración", "team": "Soporte"},
        {"name": "Kevin Guzmán", "email": "kevin.guzman@example.com", "area": "Recursos Humanos", "team": "Talento"},
        {"name": "Lucía Pineda", "email": "lucia.pineda@example.com", "area": "Finanzas", "team": "Auditoría"},
        {"name": "Pedro Molina", "email": "pedro.molina@example.com", "area": "Marketing", "team": "Contenido"},
        {"name": "Ángela Ríos", "email": "angela.rios@example.com", "area": "Producto", "team": "UX"},
        {"name": "Jorge Vargas", "email": "jorge.vargas@example.com", "area": "Operaciones", "team": "Distribución"},
        {"name": "Liliana Moreno", "email": "liliana.moreno@example.com", "area": "Compras", "team": "Proveedores"},
        {"name": "Francisco Salazar", "email": "francisco.salazar@example.com", "area": "Calidad", "team": "Auditoría"},
        {"name": "Marcela Torres", "email": "marcela.torres@example.com", "area": "Desarrollo", "team": "QA"},
        {"name": "Juan José Zapata", "email": "juan.zapata@example.com", "area": "Marketing", "team": "Publicidad"},
        {"name": "Carmen Castro", "email": "carmen.castro@example.com", "area": "Legal", "team": "Contratos"},
        {"name": "Emilio Herrera", "email": "emilio.herrera@example.com", "area": "Metodología", "team": "Agilidad"},
        {"name": "Paola Andrade", "email": "paola.andrade@example.com", "area": "Soporte", "team": "Helpdesk"}
    ]

    existing_emails = {user.email for user in db.query(User).all()}

    for user_data in default_users:
        if user_data["email"] not in existing_emails:
            selected_role = random.choice(roles)
            user = User(
                name=user_data["name"],
                email=user_data["email"],
                area=user_data["area"],
                team=user_data["team"],
                role_id=selected_role.id,
                is_active=True
            )
            db.add(user)
    
    db.commit()
    print("🎉 Usuarios creados exitosamente.")