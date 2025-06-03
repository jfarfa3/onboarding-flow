import { useEffect } from "react";
import { getRoles } from "@/services/roles";
import useRolesStore from "@/store/roleStore";
import useGeneralStore from "@/store/generalStore";

export function useRoleRequest() {
  const { roles, setRoles, rolesOptions, setRolesOptions } = useRolesStore();
  const { reloadRoles, setReloadRoles } = useGeneralStore();

  useEffect(() => {
    async function loadRoles() {
      try {
        if (!reloadRoles && roles.length > 0) {
          const options = roles.map((role) => ({
            label: role.label,
            value: role.id,
          }));
          setRolesOptions(options);
          return;
        }

        const fetchRoles = await getRoles();
        setRoles(fetchRoles);
        setReloadRoles(false);
        const options = fetchRoles.map((role) => ({
          label: role.label,
          value: role.id,
        }));
        setRolesOptions(options);
      } catch {
        /* empty */
      }
    }
    loadRoles();
  }, [setRoles, setRolesOptions]);

  return {
    roles,
    rolesOptions,
    setRoles,
  };
}
