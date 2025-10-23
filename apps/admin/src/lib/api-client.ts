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
                authStore.logout()
                if (typeof window !== 'undefined') {
                    window.location.href = '/login'
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
