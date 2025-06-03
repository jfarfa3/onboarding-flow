import type { Access } from "@/types/access";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AccessStore = {
  access: Access[];
  setAccess: (access: Access[]) => void;
  accessPending: Access[];
  setAccessPending: (accessPending: Access[]) => void;
};

const useAccessStore = create<AccessStore>()(
  persist(
    (set) => ({
      access: [],
      setAccess: (access: Access[]) => set({ access: access }),
      accessPending: [],
      setAccessPending: (accessPending: Access[]) => set({ accessPending: accessPending })
    }),
    {
      name: "access-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
export default useAccessStore;
