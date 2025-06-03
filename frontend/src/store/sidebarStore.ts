import { create } from "zustand";

type SidebarStore = {
  isOpen: boolean;
  toggleSidebar: () => void;
  setOpen: () => void;
  setClose: () => void;
};

const useSidebarStore = create<SidebarStore>((set) => ({
  isOpen: false,
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
  setOpen: () => set({ isOpen: true }),
  setClose: () => set({ isOpen: false }),
}));

export default useSidebarStore;
