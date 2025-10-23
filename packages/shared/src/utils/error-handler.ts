import { handleApiError, type ApiError } from '@workspace/lib/api'

/**
 * Global error handler for the application
 */
export class ErrorHandler {
    private static instance: ErrorHandler

    private constructor() {}

    static getInstance(): ErrorHandler {
        if (!ErrorHandler.instance) {
            ErrorHandler.instance = new ErrorHandler()
        }
        return ErrorHandler.instance
    }

    /**
     * Handle error and return user-friendly message
     */
    handle(error: unknown): ApiError {
        return handleApiError(error)
    }

    /**
     * Get user-friendly error message
     */
    getMessage(error: unknown): string {
        const apiError = this.handle(error)
        return apiError.message
    }

    /**
     * Check if error is network error
     */
    isNetworkError(error: unknown): boolean {
        const apiError = this.handle(error)
        return apiError.statusCode === 0 || apiError.error === 'NETWORK_ERROR'
    }

    /**
     * Check if error is authentication error
     */
    isAuthError(error: unknown): boolean {
        const apiError = this.handle(error)
        return apiError.statusCode === 401 || apiError.statusCode === 403
    }

    /**
     * Check if error is validation error
     */
    isValidationError(error: unknown): boolean {
        const apiError = this.handle(error)
        return apiError.statusCode === 400 || apiError.statusCode === 422
    }
}

export const errorHandler = ErrorHandler.getInstance()
