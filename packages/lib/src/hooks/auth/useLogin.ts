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
}

export function useLogin({ api, onSuccess, onError }: UseLoginOptions) {
    const { setUser, setTokens } = useAuthStore()
    const { error: showError } = useNotificationStore()

    return useMutation({
        mutationFn: (dto: SignInDto) => api.auth.signIn(dto),
        onSuccess: data => {
            // If 2FA required, don't set tokens yet
            if (data.require2FA) {
                onSuccess?.(data)
                return
            }

            // Normal login - set tokens and user
            if (data.accessToken && data.refreshToken && data.user) {
                setTokens({
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                })
                setUser(data.user)
                onSuccess?.(data)
            }
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
