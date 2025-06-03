import type { Software } from "@/types/software";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type SoftwareStore = {
  software: Software[];
  softwareOptions: Record<string, string>[];
  setSoftware: (software: Software[]) => void;
  setSoftwareOptions: (softwareOptions: Record<string, string>[]) => void;
};

const useSoftwareStore = create<SoftwareStore>()(
  persist(
    (set) => ({
      software: [],
      softwareOptions: [],
      setSoftware: (software: Software[]) => set({ software }),
      setSoftwareOptions: (softwareOptions: Record<string, string>[]) =>
        set({ softwareOptions }),
    }),
    {
      name: "software-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useSoftwareStore;
