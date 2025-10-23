import { useMutation } from '@tanstack/react-query'
import { RegisterDto, RegisterResponse } from '../../api'
import { useNotificationStore } from '../../stores'
import { handleApiError } from '../../api/interceptors'

interface UseRegisterOptions {
    api: {
        auth: {
            register: (dto: RegisterDto) => Promise<RegisterResponse>
        }
    }
    onSuccess?: (data: RegisterResponse) => void
    onError?: (error: unknown) => void
}

export function useRegister({ api, onSuccess, onError }: UseRegisterOptions) {
    const { success, error: showError } = useNotificationStore()

    return useMutation({
        mutationFn: (dto: RegisterDto) => api.auth.register(dto),
        onSuccess: data => {
            try {
                success(data.message, 'Registration Submitted')
            } catch (notificationError) {
                // If notification fails, log but don't crash
                console.error('[useRegister] Failed to show success notification:', notificationError)
            }
            onSuccess?.(data)
        },
        onError: error => {
            const apiError = handleApiError(error)
            try {
                // Show error notification with longer duration for errors
                const { addNotification } = useNotificationStore.getState()
                addNotification({
                    type: 'error',
                    message: apiError.message,
                    title: 'Registration Failed',
                    duration: 7000, // 7 seconds for errors (longer than success)
                })
            } catch (notificationError) {
                // If notification fails, log but don't crash (inline error will show)
                console.error('[useRegister] Failed to show error notification:', notificationError)
            }
            onError?.(error)
        },
    })
}
