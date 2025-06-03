import { create } from "zustand";

type GeneralStore = {
  reloadRoles: boolean;
  setReloadRoles: (reload: boolean) => void;
  reloadSoftware: boolean;
  setReloadSoftware: (reload: boolean) => void;
  reloadStateRequest: boolean;
  setReloadStateRequest: (reload: boolean) => void;
  reloadUser: boolean;
  setReloadUser: (reload: boolean) => void;
  reloadDevices: boolean;
  setReloadDevices: (reload: boolean) => void;
  reloadAccess: boolean;
  setReloadAccess: (reload: boolean) => void;

};

const useGeneralStore = create<GeneralStore>((set) => ({
  reloadRoles: true,
  setReloadRoles: (reload) => set({ reloadRoles: reload }),
  reloadSoftware: true,
  setReloadSoftware: (reload) => set({ reloadSoftware: reload }),
  reloadStateRequest: true,
  setReloadStateRequest: (reload) => set({ reloadStateRequest: reload }),
  reloadUser: true,
  setReloadUser: (reload) => set({ reloadUser: reload }),
  reloadDevices: true,
  setReloadDevices: (reload) => set({ reloadDevices: reload }),
  reloadAccess: true,
  setReloadAccess: (reload) => set({ reloadAccess: reload }),
}));

export default useGeneralStore;
