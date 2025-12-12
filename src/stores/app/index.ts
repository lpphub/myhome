import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

interface AppState {
  theme: "light" | "dark"
  sidebarCollapsed: boolean
  setTheme: (theme: "light" | "dark") => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      set => ({
        theme: "light",
        sidebarCollapsed: false,
        setTheme: theme => set({ theme }),
        toggleSidebar: () => set(state => ({ sidebarCollapsed: !state.sidebarCollapsed })),
        setSidebarCollapsed: collapsed => set({ sidebarCollapsed: collapsed }),
      }),
      {
        name: "app-storage",
        partialize: state => ({
          theme: state.theme,
          sidebarCollapsed: state.sidebarCollapsed,
        }),
      }
    )
  )
)
