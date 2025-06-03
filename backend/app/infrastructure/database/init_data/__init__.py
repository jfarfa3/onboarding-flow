from .roles import insert_default_roles
from .state_requests import insert_default_states
from .software import insert_default_software
from .users import insert_default_users
from .devices import insert_default_devices
from .access import insert_default_access

def load_all_initial_data(db):
    insert_default_roles(db)
    insert_default_states(db)
    insert_default_software(db)
    insert_default_users(db)
    insert_default_devices(db)
    insert_default_access(db)