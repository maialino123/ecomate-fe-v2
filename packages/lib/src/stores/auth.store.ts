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

export interface AuthTokens {
    accessToken: string
    refreshToken: string
}

interface AuthState {
    user: User | null
    tokens: AuthTokens | null
    isAuthenticated: boolean
    isLoading: boolean

    // Actions
    setUser: (user: User | null) => void
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
            partialize: state => ({
                user: state.user,
                tokens: state.tokens,
                isAuthenticated: state.isAuthenticated,
            }),
        },
    ),
)
