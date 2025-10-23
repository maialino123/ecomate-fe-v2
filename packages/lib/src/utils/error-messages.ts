/**
 * User-friendly Vietnamese error messages
 * For non-technical users
 */

export interface FriendlyError {
    title: string
    message: string
    suggestion?: string
}

/**
 * Common error messages in Vietnamese
 */
export const ERROR_MESSAGES = {
    // Authentication errors
    INVALID_CREDENTIALS: {
        title: 'Đăng nhập không thành công',
        message: 'Email hoặc mật khẩu không đúng',
        suggestion: 'Vui lòng kiểm tra lại thông tin đăng nhập của bạn',
    },
    ACCOUNT_NOT_FOUND: {
        title: 'Tài khoản không tồn tại',
        message: 'Email này chưa được đăng ký trong hệ thống',
        suggestion: 'Vui lòng kiểm tra lại email hoặc đăng ký tài khoản mới',
    },
    ACCOUNT_LOCKED: {
        title: 'Tài khoản bị khóa',
        message: 'Tài khoản của bạn đã bị khóa tạm thời',
        suggestion: 'Vui lòng liên hệ quản trị viên để được hỗ trợ',
    },
    ACCOUNT_SUSPENDED: {
        title: 'Tài khoản bị tạm ngưng',
        message: 'Tài khoản của bạn đã bị tạm ngưng hoạt động',
        suggestion: 'Vui lòng liên hệ quản trị viên để biết thêm chi tiết',
    },
    ACCOUNT_PENDING: {
        title: 'Tài khoản chưa được duyệt',
        message: 'Yêu cầu đăng ký của bạn đang chờ được duyệt',
        suggestion: 'Bạn sẽ nhận được email thông báo khi tài khoản được kích hoạt',
    },
    EMAIL_ALREADY_EXISTS: {
        title: 'Email đã được sử dụng',
        message: 'Email này đã được đăng ký trong hệ thống',
        suggestion: 'Vui lòng sử dụng email khác hoặc đăng nhập nếu đây là tài khoản của bạn',
    },
    WEAK_PASSWORD: {
        title: 'Mật khẩu không đủ mạnh',
        message: 'Mật khẩu cần tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường và số',
        suggestion: 'Vui lòng chọn mật khẩu mạnh hơn để bảo vệ tài khoản của bạn',
    },

    // Network errors
    NETWORK_ERROR: {
        title: 'Không có kết nối Internet',
        message: 'Không thể kết nối đến máy chủ',
        suggestion: 'Vui lòng kiểm tra kết nối Internet của bạn và thử lại',
    },
    TIMEOUT_ERROR: {
        title: 'Hết thời gian chờ',
        message: 'Máy chủ không phản hồi trong thời gian quy định',
        suggestion: 'Vui lòng thử lại sau vài phút',
    },
    SERVER_ERROR: {
        title: 'Lỗi hệ thống',
        message: 'Hệ thống đang gặp sự cố tạm thời',
        suggestion: 'Chúng tôi đang khắc phục. Vui lòng thử lại sau ít phút',
    },

    // Permission errors
    UNAUTHORIZED: {
        title: 'Chưa đăng nhập',
        message: 'Bạn cần đăng nhập để thực hiện thao tác này',
        suggestion: 'Vui lòng đăng nhập lại',
    },
    FORBIDDEN: {
        title: 'Không có quyền truy cập',
        message: 'Bạn không có quyền thực hiện thao tác này',
        suggestion: 'Vui lòng liên hệ quản trị viên nếu bạn cần quyền truy cập',
    },

    // Validation errors
    INVALID_EMAIL: {
        title: 'Email không hợp lệ',
        message: 'Định dạng email không đúng',
        suggestion: 'Vui lòng nhập email theo định dạng: example@email.com',
    },
    REQUIRED_FIELD: {
        title: 'Thiếu thông tin bắt buộc',
        message: 'Vui lòng điền đầy đủ thông tin',
        suggestion: 'Các trường có dấu (*) là bắt buộc',
    },

    // Generic errors
    UNKNOWN_ERROR: {
        title: 'Đã xảy ra lỗi',
        message: 'Đã có lỗi không xác định xảy ra',
        suggestion: 'Vui lòng thử lại hoặc liên hệ hỗ trợ nếu lỗi vẫn tiếp diễn',
    },
} as const

/**
 * Map API error codes/messages to friendly Vietnamese messages
 */
export function getFriendlyError(error: any): FriendlyError {
    // Check status code
    const statusCode = error?.response?.status || error?.statusCode

    // Check error message from API
    const apiMessage = error?.response?.data?.message || error?.message || ''
    const apiError = error?.response?.data?.error || ''

    // Map by status code
    if (statusCode === 401) {
        if (
            apiMessage.toLowerCase().includes('invalid') ||
            apiMessage.toLowerCase().includes('wrong') ||
            apiMessage.toLowerCase().includes('incorrect')
        ) {
            return ERROR_MESSAGES.INVALID_CREDENTIALS
        }
        return ERROR_MESSAGES.UNAUTHORIZED
    }

    if (statusCode === 403) {
        if (apiMessage.toLowerCase().includes('suspended')) {
            return ERROR_MESSAGES.ACCOUNT_SUSPENDED
        }
        if (apiMessage.toLowerCase().includes('locked')) {
            return ERROR_MESSAGES.ACCOUNT_LOCKED
        }
        if (apiMessage.toLowerCase().includes('pending')) {
            return ERROR_MESSAGES.ACCOUNT_PENDING
        }
        return ERROR_MESSAGES.FORBIDDEN
    }

    if (statusCode === 404) {
        return ERROR_MESSAGES.ACCOUNT_NOT_FOUND
    }

    if (statusCode === 409) {
        if (apiMessage.toLowerCase().includes('email')) {
            return ERROR_MESSAGES.EMAIL_ALREADY_EXISTS
        }
    }

    if (statusCode === 422 || statusCode === 400) {
        if (apiMessage.toLowerCase().includes('email')) {
            return ERROR_MESSAGES.INVALID_EMAIL
        }
        if (apiMessage.toLowerCase().includes('password')) {
            return ERROR_MESSAGES.WEAK_PASSWORD
        }
        return ERROR_MESSAGES.REQUIRED_FIELD
    }

    if (statusCode === 500 || statusCode === 502 || statusCode === 503) {
        return ERROR_MESSAGES.SERVER_ERROR
    }

    // Map by error type
    if (error?.code === 'ECONNABORTED' || apiError === 'TIMEOUT') {
        return ERROR_MESSAGES.TIMEOUT_ERROR
    }

    if (error?.code === 'ERR_NETWORK' || apiError === 'NETWORK_ERROR' || statusCode === 0) {
        return ERROR_MESSAGES.NETWORK_ERROR
    }

    // Check API message keywords
    const lowerMessage = apiMessage.toLowerCase()

    if (
        lowerMessage.includes('invalid credential') ||
        lowerMessage.includes('wrong password') ||
        lowerMessage.includes('incorrect password')
    ) {
        return ERROR_MESSAGES.INVALID_CREDENTIALS
    }

    if (lowerMessage.includes('not found') || lowerMessage.includes('does not exist')) {
        return ERROR_MESSAGES.ACCOUNT_NOT_FOUND
    }

    if (lowerMessage.includes('already exists') || lowerMessage.includes('already registered')) {
        return ERROR_MESSAGES.EMAIL_ALREADY_EXISTS
    }

    if (lowerMessage.includes('suspended')) {
        return ERROR_MESSAGES.ACCOUNT_SUSPENDED
    }

    if (lowerMessage.includes('locked') || lowerMessage.includes('blocked')) {
        return ERROR_MESSAGES.ACCOUNT_LOCKED
    }

    if (lowerMessage.includes('pending') || lowerMessage.includes('awaiting approval')) {
        return ERROR_MESSAGES.ACCOUNT_PENDING
    }

    if (lowerMessage.includes('network') || lowerMessage.includes('connection')) {
        return ERROR_MESSAGES.NETWORK_ERROR
    }

    // Default unknown error
    return {
        ...ERROR_MESSAGES.UNKNOWN_ERROR,
        // Include technical message for debugging
        message: apiMessage || ERROR_MESSAGES.UNKNOWN_ERROR.message,
    }
}

/**
 * Format error for display in Toast
 */
export function formatErrorForToast(error: any): { title: string; message: string } {
    const friendlyError = getFriendlyError(error)

    return {
        title: friendlyError.title,
        message: friendlyError.suggestion
            ? `${friendlyError.message}. ${friendlyError.suggestion}`
            : friendlyError.message,
    }
}

/**
 * Format error for inline display (with suggestion separated)
 */
export function formatErrorForInline(error: any): string {
    const friendlyError = getFriendlyError(error)

    let message = friendlyError.message
    if (friendlyError.suggestion) {
        message += `\n💡 ${friendlyError.suggestion}`
    }

    return message
}
