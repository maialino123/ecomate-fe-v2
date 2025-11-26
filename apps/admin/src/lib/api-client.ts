'use client'

import { Api, createApiClient } from '@workspace/lib/api'
import { useAuthStore } from '@workspace/lib/stores'

let apiInstance: Api | null = null

/**
 * Get or create the API client instance for Admin app
 * Uses cookie-based authentication (HttpOnly cookies set by server)
 */
export function getApiClient(): Api {
    if (!apiInstance) {
        const client = createApiClient({
            baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
            // Cookie-based auth: no need for token getters
            // Cookies are sent automatically with withCredentials: true
            useCookies: true,
            onUnauthorized: () => {
                console.warn('[API Client] Session expired - logging out user')
                useAuthStore.getState().logout()
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

export function resetApiClient(): void {
    apiInstance = null
}
