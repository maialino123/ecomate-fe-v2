import { create } from 'zustand'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
    id: string
    type: NotificationType
    title?: string
    message: string
    duration?: number
}

interface NotificationState {
    notifications: Notification[]

    // Actions
    addNotification: (notification: Omit<Notification, 'id'>) => void
    removeNotification: (id: string) => void
    clearNotifications: () => void

    // Convenience methods
    success: (message: string, title?: string) => void
    error: (message: string, title?: string) => void
    warning: (message: string, title?: string) => void
    info: (message: string, title?: string) => void
}

const generateId = () => Math.random().toString(36).substring(2, 9)

export const useNotificationStore = create<NotificationState>(set => ({
    notifications: [],

    addNotification: notification => {
        const id = generateId()
        const newNotification = { id, ...notification }

        set(state => ({
            notifications: [...state.notifications, newNotification],
        }))

        // Auto-remove after duration (default 5s)
        const duration = notification.duration ?? 5000
        if (duration > 0) {
            setTimeout(() => {
                set(state => ({
                    notifications: state.notifications.filter(n => n.id !== id),
                }))
            }, duration)
        }
    },

    removeNotification: id =>
        set(state => ({
            notifications: state.notifications.filter(n => n.id !== id),
        })),

    clearNotifications: () =>
        set({
            notifications: [],
        }),

    success: (message, title) => {
        const { addNotification } = useNotificationStore.getState()
        addNotification({ type: 'success', message, title })
    },

    error: (message, title) => {
        const { addNotification } = useNotificationStore.getState()
        addNotification({ type: 'error', message, title, duration: 7000 })
    },

    warning: (message, title) => {
        const { addNotification } = useNotificationStore.getState()
        addNotification({ type: 'warning', message, title })
    },

    info: (message, title) => {
        const { addNotification } = useNotificationStore.getState()
        addNotification({ type: 'info', message, title })
    },
}))
