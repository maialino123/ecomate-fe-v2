import { AxiosError } from 'axios'

export interface ApiError {
    message: string
    statusCode: number
    error?: string
    details?: Record<string, unknown>
}

/**
 * Transform axios error to a normalized API error
 */
export function handleApiError(error: unknown): ApiError {
    if (error instanceof AxiosError) {
        const response = error.response

        if (response) {
            // Server responded with error
            return {
                message: response.data?.message || response.data?.error || error.message,
                statusCode: response.status,
                error: response.data?.error,
                details: response.data?.details,
            }
        } else if (error.request) {
            // Request made but no response
            return {
                message: 'No response from server. Please check your connection.',
                statusCode: 0,
                error: 'NETWORK_ERROR',
            }
        }
    }

    // Generic error
    return {
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        statusCode: 500,
        error: 'UNKNOWN_ERROR',
    }
}

/**
 * Check if error is a specific HTTP status code
 */
export function isErrorStatus(error: unknown, statusCode: number): boolean {
    if (error instanceof AxiosError) {
        return error.response?.status === statusCode
    }
    return false
}

/**
 * Check if error is unauthorized (401)
 */
export function isUnauthorizedError(error: unknown): boolean {
    return isErrorStatus(error, 401)
}

/**
 * Check if error is forbidden (403)
 */
export function isForbiddenError(error: unknown): boolean {
    return isErrorStatus(error, 403)
}

/**
 * Check if error is not found (404)
 */
export function isNotFoundError(error: unknown): boolean {
    return isErrorStatus(error, 404)
}
