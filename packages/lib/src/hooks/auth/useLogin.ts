import { useMutation } from '@tanstack/react-query'
import { SignInDto, SignInResponse } from '../../api'
import { useAuthStore } from '../../stores'
import { useNotificationStore } from '../../stores'
import { formatErrorForToast } from '../../utils/error-messages'

interface UseLoginOptions {
    api: {
        auth: {
            signIn: (dto: SignInDto) => Promise<SignInResponse>
        }
    }
    onSuccess?: (data: SignInResponse) => void
    onError?: (error: unknown) => void
    /** Store tokens in Zustand (for extension). Web apps use HttpOnly cookies instead */
    storeTokens?: boolean
}

export function useLogin({ api, onSuccess, onError, storeTokens = false }: UseLoginOptions) {
    const { setUser, setTokens } = useAuthStore()
    // Reserved for future error handling
    const { error: _showError } = useNotificationStore()

    return useMutation({
        mutationFn: (dto: SignInDto) => api.auth.signIn(dto),
        onSuccess: data => {
            // If 2FA required, don't set tokens yet
            if (data.require2FA) {
                onSuccess?.(data)
                return
            }

            // Set user info (always needed for UI)
            if (data.user) {
                setUser(data.user)
            }

            // Store tokens only for extension mode (web uses HttpOnly cookies)
            if (storeTokens && data.accessToken && data.refreshToken) {
                setTokens({
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                })
            }

            onSuccess?.(data)
        },
        onError: error => {
            try {
                // Format error to Vietnamese user-friendly message
                const friendlyError = formatErrorForToast(error)

                // Show error notification with longer duration
                const { addNotification } = useNotificationStore.getState()
                addNotification({
                    type: 'error',
                    message: friendlyError.message,
                    title: friendlyError.title,
                    duration: 8000, // 8 seconds for Vietnamese text (longer to read)
                })
            } catch (notificationError) {
                // If notification fails, log but don't crash (inline error will show)
                console.error('[useLogin] Failed to show error notification:', notificationError)
            }
            onError?.(error)
        },
    })
}
