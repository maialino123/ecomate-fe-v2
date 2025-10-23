'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore, UserRole } from '@workspace/lib/stores'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
    children: React.ReactNode
    requiredRoles?: UserRole[]
    redirectTo?: string
}

export function ProtectedRoute({ children, requiredRoles, redirectTo = '/login' }: ProtectedRouteProps) {
    const router = useRouter()
    const { isAuthenticated, user, isLoading } = useAuthStore()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push(redirectTo)
        }
    }, [isAuthenticated, isLoading, router, redirectTo])

    useEffect(() => {
        if (!isLoading && isAuthenticated && user && requiredRoles) {
            const hasRequiredRole = requiredRoles.includes(user.role)
            if (!hasRequiredRole) {
                router.push('/unauthorized')
            }
        }
    }, [isAuthenticated, isLoading, user, requiredRoles, router])

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        )
    }

    if (!isAuthenticated) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        )
    }

    if (requiredRoles && user && !requiredRoles.includes(user.role)) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold">Unauthorized</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        You don&apos;t have permission to access this page.
                    </p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
