import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'OWNER' | 'ADMIN' | 'STAFF' | 'VIEWER'
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'

export interface User {
    id: string
    email: string
    username: string
    firstName?: string
    lastName?: string
    role: UserRole
    status: UserStatus
    require2FA: boolean
    createdAt: string
    updatedAt: string
}

/**
 * Auth tokens - only used for extension (header-based auth)
 * Web apps use HttpOnly cookies instead
 */
export interface AuthTokens {
    accessToken: string
    refreshToken: string
}

interface AuthState {
    user: User | null
    /** Tokens for extension mode. Web apps use HttpOnly cookies instead */
    tokens: AuthTokens | null
    isAuthenticated: boolean
    isLoading: boolean

    // Actions
    setUser: (user: User | null) => void
    /** Set tokens - only for extension mode */
    setTokens: (tokens: AuthTokens | null) => void
    setLoading: (loading: boolean) => void
    logout: () => void
    updateUser: (updates: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        set => ({
            user: null,
            tokens: null,
            isAuthenticated: false,
            isLoading: false,

            setUser: user =>
                set({
                    user,
                    isAuthenticated: !!user,
                }),

            setTokens: tokens =>
                set({
                    tokens,
                }),

            setLoading: loading =>
                set({
                    isLoading: loading,
                }),

            logout: () =>
                set({
                    user: null,
                    tokens: null,
                    isAuthenticated: false,
                }),

            updateUser: updates =>
                set(state => ({
                    user: state.user ? { ...state.user, ...updates } : null,
                })),
        }),
        {
            name: 'ecomate-auth-storage',
            // Only persist user info - tokens are handled by HttpOnly cookies for web apps
            // Extension uses Authorization header with tokens from its own storage
            partialize: state => ({
                user: state.user,
                // tokens: NOT persisted - web uses cookies, extension manages its own storage
                isAuthenticated: state.isAuthenticated,
            }),
        },
    ),
)
