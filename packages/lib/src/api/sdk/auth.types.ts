import { User } from '../../stores'

// ============= Request DTOs =============

export interface SignInDto {
    email: string
    password: string
}

export interface RegisterDto {
    email: string
    password: string
    username?: string
    firstName?: string
    lastName?: string
}

export interface RefreshTokenDto {
    refreshToken: string
}

export interface VerifyMagicLinkDto {
    token: string
}

// ============= Response DTOs =============

export interface AuthTokensResponse {
    accessToken: string
    refreshToken: string
    user: User
}

export interface SignInResponse {
    message?: string
    require2FA?: boolean
    accessToken?: string
    refreshToken?: string
    user?: User
}

export interface RegisterResponse {
    message: string
    email: string
}

export interface MeResponse {
    user: User
}

export interface MessageResponse {
    message: string
}

export interface VerifyMagicLinkResponse {
    accessToken: string
    refreshToken: string
    user: User
}
