import { User, UserRole, UserStatus } from '../../stores'

// ============= Enums =============

export type RegistrationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED'

// ============= Models =============

export interface UserRegistrationRequest {
    id: string
    email: string
    status: RegistrationStatus
    approvedBy?: string
    approvedRole?: UserRole
    rejectedBy?: string
    rejectionReason?: string
    expiresAt: string
    createdAt: string
    updatedAt: string
}

// ============= Request DTOs =============

export interface ApproveRegistrationDto {
    role: UserRole
}

export interface RejectRegistrationDto {
    reason?: string
}

export interface UpdateUserRoleDto {
    role: UserRole
}

export interface UpdateUserStatusDto {
    status: UserStatus
}

export interface ExportFormat {
    format: 'json' | 'csv'
}

export interface ImportUsersDto {
    users: Array<{
        email: string
        password: string
        username?: string
        firstName?: string
        lastName?: string
        role: UserRole
    }>
}

// ============= Response DTOs =============

export interface RegistrationRequestsResponse {
    requests: UserRegistrationRequest[]
    total: number
}

export interface SingleRegistrationRequestResponse {
    request: UserRegistrationRequest
}

export interface UsersResponse {
    users: User[]
    total: number
}

export interface SingleUserResponse {
    user: User
}

// MessageResponse is exported from auth.types.ts to avoid duplication

export interface ImportUsersResponse {
    message: string
    created: number
    failed: number
    errors?: Array<{
        email: string
        error: string
    }>
}
