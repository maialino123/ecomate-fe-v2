'use client'

import { Api, createApiClient } from '@workspace/lib/api'
import { useAuthStore } from '@workspace/lib/stores'

let apiInstance: Api | null = null

/**
 * Get or create the API client instance
 */
export function getApiClient(): Api {
    if (!apiInstance) {
        const authStore = useAuthStore.getState()

        const client = createApiClient({
            baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
            getAccessToken: () => authStore.tokens?.accessToken || null,
            getRefreshToken: () => authStore.tokens?.refreshToken || null,
            onTokenRefresh: tokens => {
                authStore.setTokens(tokens)
            },
            onUnauthorized: () => {
                // Only logout and redirect if we're actually unauthenticated
                // This is called when refresh token fails, meaning session is truly expired
                console.warn('[API Client] Refresh token failed - logging out user')

                authStore.logout()

                if (typeof window !== 'undefined') {
                    // Only redirect if not already on login page
                    if (!window.location.pathname.includes('/login')) {
                        window.location.href = '/login'
                    }
                }
            },
        })

        apiInstance = new Api(client)
    }

    return apiInstance
}

/**
 * Reset API client (useful for testing or when changing base URL)
 */
export function resetApiClient(): void {
    apiInstance = null
}
