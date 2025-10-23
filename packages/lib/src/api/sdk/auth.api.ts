import { AxiosInstance } from 'axios'
import {
    SignInDto,
    RegisterDto,
    RefreshTokenDto,
    SignInResponse,
    RegisterResponse,
    AuthTokensResponse,
    MeResponse,
    MessageResponse,
    VerifyMagicLinkResponse,
    VerifyMagicLinkDto,
} from './auth.types'

export class AuthApi {
    constructor(private readonly client: AxiosInstance) {}

    /**
     * Sign in user
     * If user is Owner with 2FA, returns { message, require2FA: true }
     * Otherwise returns { accessToken, refreshToken, user }
     */
    async signIn(dto: SignInDto): Promise<SignInResponse> {
        const response = await this.client.post<SignInResponse>('/v1/auth/signin', dto)
        return response.data
    }

    /**
     * Register new user (creates pending registration request)
     */
    async register(dto: RegisterDto): Promise<RegisterResponse> {
        const response = await this.client.post<RegisterResponse>('/v1/auth/register', dto)
        return response.data
    }

    /**
     * Verify magic link token (for Owner 2FA)
     */
    async verifyMagicLink(dto: VerifyMagicLinkDto): Promise<VerifyMagicLinkResponse> {
        const response = await this.client.get<VerifyMagicLinkResponse>(`/v1/auth/verify-login?token=${dto.token}`)
        return response.data
    }

    /**
     * Refresh access token
     */
    async refreshToken(dto: RefreshTokenDto): Promise<AuthTokensResponse> {
        const response = await this.client.post<AuthTokensResponse>('/v1/auth/refresh', dto)
        return response.data
    }

    /**
     * Sign out user
     */
    async signOut(): Promise<MessageResponse> {
        const response = await this.client.post<MessageResponse>('/v1/auth/signout')
        return response.data
    }

    /**
     * Get current user info
     */
    async me(): Promise<MeResponse> {
        const response = await this.client.get<MeResponse>('/v1/auth/me')
        return response.data
    }
}
