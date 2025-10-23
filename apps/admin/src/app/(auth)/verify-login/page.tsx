'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useApi } from '@workspace/shared/providers'
import { useVerifyMagicLink } from '@workspace/lib/hooks'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@workspace/ui/components/Button'

function VerifyLoginContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const api = useApi()
    const token = searchParams.get('token')

    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')

    const verifyMutation = useVerifyMagicLink({
        api,
        onSuccess: () => {
            setStatus('success')
            setTimeout(() => {
                router.push('/dashboard')
            }, 2000)
        },
        onError: () => {
            setStatus('error')
        },
    })

    useEffect(() => {
        if (token) {
            verifyMutation.mutate({ token })
        } else {
            setStatus('error')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token])

    if (status === 'verifying') {
        return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="w-full max-w-md space-y-4 text-center">
                    <div className="flex justify-center">
                        <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
                    </div>
                    <h2 className="text-2xl font-bold">Verifying...</h2>
                    <p className="text-gray-600 dark:text-gray-400">Please wait while we verify your login link.</p>
                </div>
            </div>
        )
    }

    if (status === 'success') {
        return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="w-full max-w-md space-y-4 text-center">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold">Login Successful!</h2>
                    <p className="text-gray-600 dark:text-gray-400">Redirecting you to the dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-md space-y-4 text-center">
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                        <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold">Verification Failed</h2>
                <p className="text-gray-600 dark:text-gray-400">
                    The login link is invalid or has expired. Please try logging in again.
                </p>
                <Button onClick={() => router.push('/login')} className="w-full">
                    Back to Login
                </Button>
            </div>
        </div>
    )
}

export default function VerifyLoginPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            }
        >
            <VerifyLoginContent />
        </Suspense>
    )
}
