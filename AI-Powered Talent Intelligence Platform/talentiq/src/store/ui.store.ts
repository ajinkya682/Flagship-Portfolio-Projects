import { create } from 'zustand'

interface UIStore {
  sidebarCollapsed: boolean
  mobileSidebarOpen: boolean
  modals: Record<string, boolean>
  globalLoading: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setMobileSidebarOpen: (open: boolean) => void
  openModal: (id: string) => void
  closeModal: (id: string) => void
  closeAllModals: () => void
  setGlobalLoading: (loading: boolean) => void
}

export const useUIStore = create<UIStore>()((set) => ({
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  modals: {},
  globalLoading: false,

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
  
  setMobileSidebarOpen: (mobileSidebarOpen) => set({ mobileSidebarOpen }),

  openModal: (id) =>
    set((state) => ({ modals: { ...state.modals, [id]: true } })),

  closeModal: (id) =>
    set((state) => ({ modals: { ...state.modals, [id]: false } })),

  closeAllModals: () => set({ modals: {} }),

  setGlobalLoading: (globalLoading) => set({ globalLoading }),
}))
