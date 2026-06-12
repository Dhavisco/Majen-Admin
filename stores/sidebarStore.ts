// stores/sidebarStore.ts
import { create } from 'zustand';

interface SidebarState {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  setCollapsed: (collapsed: boolean) => void;
  pendingVerifications: number;
  pendingProducts: number;
  setPendingCounts: (counts: { pendingVerifications: number; pendingProducts: number }) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isCollapsed: false,           // default: expanded
  toggleCollapse: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
  pendingVerifications: 0,
  pendingProducts: 0,
  setPendingCounts: ({ pendingVerifications, pendingProducts }) =>
    set({ pendingVerifications, pendingProducts }),
}));