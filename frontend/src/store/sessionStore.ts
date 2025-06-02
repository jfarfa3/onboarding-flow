import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type SessionStore = {
  sessionToken: string | null;
  setSessionToken: (token: string) => void;
  clearSessionToken: () => void;
};

const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      sessionToken: null,
      setSessionToken: (token: string) => set({ sessionToken: token }),
      clearSessionToken: () => set({ sessionToken: null }),
    }),
    {
      name: "session-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useSessionStore;
