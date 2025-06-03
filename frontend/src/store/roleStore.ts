import type { Roles } from "@/types/roles";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type RolesStore = {
  roles: Roles[];
  rolesOptions: Record<string, string>[];
  setRoles: (roles: Roles[]) => void;
  setRolesOptions: (rolesOptions: Record<string, string>[]) => void;
};

const useRolesStore = create<RolesStore>()(
  persist(
    (set) => ({
      roles: [],
      setRoles: (roles: Roles[]) => set({ roles: roles }),
      rolesOptions: [],
      setRolesOptions: (rolesOptions: Record<string, string>[]) =>
        set({ rolesOptions: rolesOptions }),
    }),
    {
      name: "roles-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useRolesStore;
