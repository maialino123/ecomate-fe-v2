'use client'

import React, { useMemo } from 'react'
import { ThemeProvider } from 'next-themes'
import { matchQuery, MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BsProvider } from '@workspace/ui/components/Provider'
import { Toast } from '../components/Toast'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { AuthProvider } from './AuthProvider'
import { Api } from '@workspace/lib/api'
import { useHydration } from '../hooks'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60,
        },
    },
    mutationCache: new MutationCache({
        onSuccess: async (_data, _variables, _context, mutation) => {
            await queryClient.invalidateQueries({
                predicate: query =>
                    // invalidate all matching tags at once
                    // or everything if no meta is provided
                    (mutation.meta?.invalidates as any)?.some((queryKey: any) => matchQuery({ queryKey }, query)) ??
                    true,
            })
        },
    }),
})

interface ProvidersProps {
    children: React.ReactNode
    api?: Api
    getApiClient?: () => Api
    /**
     * Optional loading component to show during hydration
     * If not provided, nothing will be shown during hydration
     */
    loadingComponent?: React.ReactNode
}

export function Providers({ children, api: externalApi, getApiClient, loadingComponent }: ProvidersProps) {
    // Wait for client-side hydration to complete before accessing persisted stores
    const isHydrated = useHydration()

    // Initialize API client only on client-side to avoid hydration mismatch
    const api = useMemo(() => {
        // Only initialize API client after hydration to avoid accessing localStorage during SSR
        if (!isHydrated) return undefined
        if (externalApi) return externalApi
        if (getApiClient) return getApiClient()
        // If neither is provided, return undefined (for apps that don't need API)
        return undefined
    }, [isHydrated, externalApi, getApiClient])

    return (
        <>
            <ErrorBoundary>
                <BsProvider>
                    <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange enableColorScheme>
                        <QueryClientProvider client={queryClient}>
                            <AuthProvider api={api}>
                                {isHydrated ? children : loadingComponent || null}
                                <ReactQueryDevtools initialIsOpen={false} />
                            </AuthProvider>
                        </QueryClientProvider>
                    </ThemeProvider>
                </BsProvider>
            </ErrorBoundary>
            {/* Toast completely outside all providers - maximum independence */}
            <Toast />
        </>
    )
}
