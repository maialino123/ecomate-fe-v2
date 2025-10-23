import axios, { AxiosInstance, AxiosError } from 'axios'

export interface ApiClientConfig {
    baseURL: string
    getAccessToken?: () => string | null
    getRefreshToken?: () => string | null
    onTokenRefresh?: (tokens: { accessToken: string; refreshToken: string }) => void
    onUnauthorized?: () => void
}

export function createApiClient(config: ApiClientConfig): AxiosInstance {
    const client = axios.create({
        baseURL: config.baseURL,
        timeout: 30000,
        headers: {
            'Content-Type': 'application/json',
        },
    })

    // Request interceptor - Add auth token
    client.interceptors.request.use(
        requestConfig => {
            const token = config.getAccessToken?.()
            if (token) {
                requestConfig.headers.Authorization = `Bearer ${token}`
            }
            return requestConfig
        },
        error => Promise.reject(error),
    )

    // Response interceptor - Handle token refresh
    let isRefreshing = false
    let failedQueue: Array<{
        resolve: (value?: unknown) => void
        reject: (reason?: unknown) => void
    }> = []

    const processQueue = (error: Error | null = null) => {
        failedQueue.forEach(prom => {
            if (error) {
                prom.reject(error)
            } else {
                prom.resolve()
            }
        })
        failedQueue = []
    }

    client.interceptors.response.use(
        response => response,
        async error => {
            const originalRequest = error.config

            // Log all API errors for debugging
            console.debug('[API Client] Error:', {
                url: originalRequest?.url,
                status: error.response?.status,
                message: error.message,
            })

            // Don't intercept 401 from auth endpoints (login, register, etc.)
            const isAuthEndpoint =
                originalRequest.url?.includes('/auth/signin') ||
                originalRequest.url?.includes('/auth/register') ||
                originalRequest.url?.includes('/auth/refresh') ||
                originalRequest.url?.includes('/auth/verify-login')

            // If error is not 401 or request has already been retried, reject
            if (error.response?.status !== 401 || originalRequest._retry || isAuthEndpoint) {
                return Promise.reject(error)
            }

            console.log('[API Client] 401 detected on', originalRequest.url, '- attempting token refresh')

            // If already refreshing, queue the request
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                })
                    .then(() => {
                        return client(originalRequest)
                    })
                    .catch(err => {
                        return Promise.reject(err)
                    })
            }

            originalRequest._retry = true
            isRefreshing = true

            // Check if refresh token exists before attempting refresh
            const refreshToken = config.getRefreshToken?.()
            if (!refreshToken) {
                console.warn('[API Client] No refresh token available - user needs to login')
                processQueue(new Error('No refresh token'))
                isRefreshing = false
                config.onUnauthorized?.()
                return Promise.reject(new Error('No refresh token available'))
            }

            try {
                // Call refresh endpoint
                console.log('[API Client] Calling refresh endpoint...')
                const response = await axios.post(`${config.baseURL}/v1/auth/refresh`, {
                    refreshToken,
                })

                const { accessToken, refreshToken: newRefreshToken } = response.data

                console.log('[API Client] Token refresh successful')

                // Update tokens
                config.onTokenRefresh?.({ accessToken, refreshToken: newRefreshToken })

                // Update authorization header
                originalRequest.headers.Authorization = `Bearer ${accessToken}`

                processQueue()
                isRefreshing = false

                // Retry original request
                return client(originalRequest)
            } catch (refreshError) {
                processQueue(refreshError as Error)
                isRefreshing = false

                // Only call onUnauthorized if refresh actually failed due to invalid/expired token
                // Don't call it for network errors or other issues
                if (refreshError instanceof AxiosError) {
                    const status = refreshError.response?.status
                    // Only logout on 401 (unauthorized) or 403 (forbidden) from refresh endpoint
                    // Network errors or 5xx errors should not trigger logout
                    if (status === 401 || status === 403) {
                        console.warn('[API Client] Refresh token invalid or expired (status:', status, ')')
                        config.onUnauthorized?.()
                    } else {
                        console.error('[API Client] Refresh failed with non-auth error:', status || 'network error')
                        // Don't logout - just let the error propagate
                    }
                } else {
                    // Non-Axios error (shouldn't happen, but handle it)
                    console.error('[API Client] Refresh failed with unexpected error:', refreshError)
                }

                return Promise.reject(refreshError)
            }
        },
    )

    return client
}
