import { useMutation } from '@tanstack/react-query'
import { MessageResponse } from '../../api'
import { useAuthStore } from '../../stores'
import { useNotificationStore } from '../../stores'

interface UseLogoutOptions {
    api: {
        auth: {
            signOut: () => Promise<MessageResponse>
        }
    }
    onSuccess?: () => void
    onError?: (error: unknown) => void
}

export function useLogout({ api, onSuccess, onError }: UseLogoutOptions) {
    const { logout } = useAuthStore()
    const { success } = useNotificationStore()

    return useMutation({
        mutationFn: () => api.auth.signOut(),
        onSuccess: () => {
            logout()
            success('Logged out successfully')
            onSuccess?.()
        },
        onError: error => {
            // Still logout locally even if API call fails
            logout()
            onError?.(error)
        },
    })
}
