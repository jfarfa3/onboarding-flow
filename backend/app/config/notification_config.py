NOTIFICATION_SETTINGS = {
    "teams": {
        "access": {
            "email": "equipo.accesos@ejemplo.com",
            "notify_on": ["access_created", "access_status_updated"]
        },
        "it": {
            "email": "equipo.ti@ejemplo.com",
            "notify_on": ["device_created", "device_status_updated"]
        }
    },
    "log_levels": {
        "team_notification": "INFO",
        "user_notification": "INFO",
        "notification_error": "ERROR"
    }
}

EMAIL_TEMPLATES = {
    "access_created": {
        "subject": "Nueva Solicitud de Acceso Recibida",
        "body": """
        Se ha recibido una nueva solicitud de acceso.
        
        ID de Solicitud: {request_id}
        Usuario: {user_name}
        Software: {software_name}
        Estado: {status}
        Fecha de Creación: {created_at}
        
        Por favor, revise y procese esta solicitud.
        """
    },
    "access_updated": {
        "subject": "Actualización en Solicitud de Acceso",
        "body": """
        Su solicitud de acceso ha sido actualizada.
        
        ID de Solicitud: {request_id}
        Software: {software_name}
        Nuevo Estado: {status}
        Fecha de Actualización: {updated_at}
        
        Si tiene preguntas, contacte al equipo de soporte.
        """
    },
    "device_created": {
        "subject": "Nueva Solicitud de Dispositivo Recibida",
        "body": """
        Se ha recibido una nueva solicitud de dispositivo.
        
        ID de Solicitud: {request_id}
        Usuario: {user_name}
        Tipo de Dispositivo: {device_type}
        Estado: {status}
        Fecha de Creación: {created_at}
        
        Por favor, revise y procese esta solicitud.
        """
    },
    "device_updated": {
        "subject": "Actualización en Solicitud de Dispositivo",
        "body": """
        Su solicitud de dispositivo ha sido actualizada.
        
        ID de Solicitud: {request_id}
        Tipo de Dispositivo: {device_type}
        Nuevo Estado: {status}
        Fecha de Actualización: {updated_at}
        
        Si tiene preguntas, contacte al equipo de soporte.
        """
    }
}
