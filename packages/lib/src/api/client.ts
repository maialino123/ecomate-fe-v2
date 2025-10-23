import axios, { AxiosInstance } from 'axios'

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

            try {
                const refreshToken = config.getRefreshToken?.()
                if (!refreshToken) {
                    throw new Error('No refresh token available')
                }

                // Call refresh endpoint
                const response = await axios.post(`${config.baseURL}/v1/auth/refresh`, {
                    refreshToken,
                })

                const { accessToken, refreshToken: newRefreshToken } = response.data

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

                // Token refresh failed, logout user
                config.onUnauthorized?.()

                return Promise.reject(refreshError)
            }
        },
    )

    return client
}
