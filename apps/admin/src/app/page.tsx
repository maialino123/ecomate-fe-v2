'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@workspace/lib/stores'
import { Loader2 } from 'lucide-react'

export default function Page() {
    const router = useRouter()
    const { isAuthenticated } = useAuthStore()

    useEffect(() => {
        // Redirect based on auth status
        if (isAuthenticated) {
            router.push('/dashboard')
        } else {
            router.push('/login')
        }
    }, [isAuthenticated, router])

    // Show loading while redirecting
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
    )
}
