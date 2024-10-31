import { create } from 'zustand'

interface LayoutState {
  isSidebarOpen: boolean
  isPreviewOpen: boolean
  toggleSidebar: () => void
  togglePreview: () => void
}

export const useStore = create<LayoutState>((set) => ({
  isSidebarOpen: true,
  isPreviewOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  togglePreview: () => set((state) => ({ isPreviewOpen: !state.isPreviewOpen })),
}))