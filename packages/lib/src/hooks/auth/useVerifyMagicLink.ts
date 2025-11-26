import { useMutation } from '@tanstack/react-query'
import { VerifyMagicLinkDto, VerifyMagicLinkResponse } from '../../api'
import { useAuthStore } from '../../stores'
import { useNotificationStore } from '../../stores'
import { handleApiError } from '../../api/interceptors'

interface UseVerifyMagicLinkOptions {
    api: {
        auth: {
            verifyMagicLink: (dto: VerifyMagicLinkDto) => Promise<VerifyMagicLinkResponse>
        }
    }
    onSuccess?: (data: VerifyMagicLinkResponse) => void
    onError?: (error: unknown) => void
    /** Store tokens in Zustand (for extension). Web apps use HttpOnly cookies instead */
    storeTokens?: boolean
}

export function useVerifyMagicLink({ api, onSuccess, onError, storeTokens = false }: UseVerifyMagicLinkOptions) {
    const { setUser, setTokens } = useAuthStore()
    const { success, error: showError } = useNotificationStore()

    return useMutation({
        mutationFn: (dto: VerifyMagicLinkDto) => api.auth.verifyMagicLink(dto),
        onSuccess: data => {
            // Set user info (always needed for UI)
            setUser(data.user)

            // Store tokens only for extension mode (web uses HttpOnly cookies)
            if (storeTokens) {
                setTokens({
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                })
            }

            success('Login successful!', 'Welcome back')
            onSuccess?.(data)
        },
        onError: error => {
            const apiError = handleApiError(error)
            showError(apiError.message, 'Verification Failed')
            onError?.(error)
        },
    })
}
