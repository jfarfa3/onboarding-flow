import type { Devices } from "@/types/devices";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type DevicesStore = {
  devices: Devices[];
  setDevices: (devices: Devices[]) => void;
  devicesPending: Devices[];
  setDevicesPending: (devicesPending: Devices[]) => void;
};

const useDevicesStore = create<DevicesStore>()(
  persist(
    (set) => ({
      devices: [],
      setDevices: (devices: Devices[]) => set({ devices }),
      devicesPending: [],
      setDevicesPending: (devicesPending: Devices[]) => set({ devicesPending })
    }),
    {
      name: "devices-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
export default useDevicesStore;
