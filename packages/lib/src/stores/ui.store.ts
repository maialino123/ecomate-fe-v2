import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
    sidebarOpen: boolean
    sidebarCollapsed: boolean

    // Actions
    setSidebarOpen: (open: boolean) => void
    toggleSidebar: () => void
    setSidebarCollapsed: (collapsed: boolean) => void
    toggleSidebarCollapsed: () => void
}

export const useUIStore = create<UIState>()(
    persist(
        set => ({
            sidebarOpen: true,
            sidebarCollapsed: false,

            setSidebarOpen: open =>
                set({
                    sidebarOpen: open,
                }),

            toggleSidebar: () =>
                set(state => ({
                    sidebarOpen: !state.sidebarOpen,
                })),

            setSidebarCollapsed: collapsed =>
                set({
                    sidebarCollapsed: collapsed,
                }),

            toggleSidebarCollapsed: () =>
                set(state => ({
                    sidebarCollapsed: !state.sidebarCollapsed,
                })),
        }),
        {
            name: 'ecomate-ui-storage',
        },
    ),
)
