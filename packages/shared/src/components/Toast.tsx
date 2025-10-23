'use client'

import { useEffect, useState } from 'react'
import { useNotificationStore } from '@workspace/lib/stores'
import { X, CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react'

export function Toast() {
    const { notifications, removeNotification } = useNotificationStore()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        console.log('[Toast] Component mounted')

        // Add global test function
        if (typeof window !== 'undefined') {
            ;(window as any).testToast = () => {
                console.log('[Toast] Manual test triggered')
                useNotificationStore.getState().error('Manual test toast!', 'Test')
            }
            console.log('[Toast] Global testToast() function added. Try: window.testToast()')
        }
    }, [])

    useEffect(() => {
        console.log('[Toast] Notifications changed:', {
            count: notifications.length,
            notifications: notifications,
        })
    }, [notifications])

    // Don't render on server
    if (!isMounted) {
        console.log('[Toast] Not mounted yet, skipping render')
        return null
    }

    console.log('[Toast] Rendering with', notifications.length, 'notifications')

    return (
        <div
            className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-md pointer-events-none"
            style={{
                position: 'fixed',
                top: '1rem',
                right: '1rem',
                zIndex: 9999,
            }}
        >
            {notifications.map(notification => (
                <ToastItem
                    key={notification.id}
                    {...notification}
                    onClose={() => removeNotification(notification.id)}
                />
            ))}

            {/* Debug indicator */}
            {process.env.NODE_ENV === 'development' && (
                <div className="text-xs text-gray-500 mt-2 pointer-events-auto">
                    Toast mounted ({notifications.length} notifications)
                </div>
            )}
        </div>
    )
}

interface ToastItemProps {
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title?: string
    message: string
    onClose: () => void
}

function ToastItem({ type, title, message, onClose }: ToastItemProps) {
    useEffect(() => {
        console.log('[ToastItem] Rendering:', { type, title, message })
    }, [type, title, message])

    const icons = {
        success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
        error: <XCircle className="w-5 h-5 text-red-500" />,
        warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />,
    }

    const bgColors = {
        success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
        error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
        warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
        info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    }

    return (
        <div
            className={`
        flex items-start gap-3 p-4 rounded-lg border shadow-2xl
        ${bgColors[type]}
        pointer-events-auto
        transition-all duration-300 ease-out
        transform translate-x-0
      `}
            style={{
                minWidth: '300px',
                maxWidth: '400px',
            }}
        >
            <div className="flex-shrink-0">{icons[type]}</div>
            <div className="flex-1 min-w-0">
                {title && <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">{title}</div>}
                <div className="text-sm text-gray-700 dark:text-gray-300">{message}</div>
            </div>
            <button
                onClick={onClose}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    )
}
