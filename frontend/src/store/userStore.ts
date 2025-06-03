import type { UserDetail } from "@/types/userDetail";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type UserStore = {
  usersDetail: UserDetail[];
  setUsersDetail: (usersDetail: UserDetail[]) => void;
};

const useUsersStore = create<UserStore>()(
  persist(
    (set) => ({
      usersDetail: [],
      setUsersDetail: (usersDetail: UserDetail[]) => set({ usersDetail}),
    }),
    {
      name: "users-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
export default useUsersStore;
