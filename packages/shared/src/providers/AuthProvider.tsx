'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { Api } from '@workspace/lib/api'

interface AuthContextValue {
    api: Api | null
}

const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthProviderProps {
    children: ReactNode
    api?: Api | null
}

export function AuthProvider({ children, api }: AuthProviderProps) {
    return <AuthContext.Provider value={{ api: api || null }}>{children}</AuthContext.Provider>
}

/**
 * Hook to access the API client
 */
export function useApi(): Api {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useApi must be used within AuthProvider')
    }
    if (!context.api) {
        throw new Error('API client is not available. Make sure to pass api or getApiClient to Providers.')
    }
    return context.api
}
