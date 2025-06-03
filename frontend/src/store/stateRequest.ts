import type { StateRequest } from "@/types/stateRequest";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type StateRequestStore = {
  stateRequest: StateRequest[];
  stateRequestOptions: Record<string, string>[];
  setStateRequest: (roles: StateRequest[]) => void;
  setStateRequestOptions: (
    stateRequestOptions: Record<string, string>[]
  ) => void;
};

const useStateRequestStore = create<StateRequestStore>()(
  persist(
    (set) => ({
      stateRequest: [],
      stateRequestOptions: [],
      setStateRequest: (stateRequest: StateRequest[]) =>
        set({ stateRequest: stateRequest }),
      setStateRequestOptions: (stateRequestOptions: Record<string, string>[]) =>
        set({ stateRequestOptions: stateRequestOptions }),
      stateRquestPendingUUID: "",
      stateRequestAcceptedUUID: "",
    }),
    {
      name: "state-request-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useStateRequestStore;
