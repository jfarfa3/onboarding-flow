import type { User } from "@/types/user";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type UserStore = {
  users: User[];
  setUsers: (users: User[]) => void;
};

const useUsersStore = create<UserStore>()(
  persist(
    (set) => ({
      users: [],
      setUsers: (users: User[]) => set({ users }),
    }),
    {
      name: "users-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
export default useUsersStore;
