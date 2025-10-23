'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useApi } from '@workspace/shared/providers'
import { useApproveFromEmail } from '@workspace/lib/hooks'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@workspace/ui/components/Button'

function ApproveContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const api = useApi()
    const token = searchParams.get('token')
    const role = searchParams.get('role') as 'ADMIN' | 'STAFF' | 'VIEWER' | null

    const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
    const [message, setMessage] = useState('')
    const [userEmail, setUserEmail] = useState('')

    const approveMutation = useApproveFromEmail({
        api,
        onSuccess: (data) => {
            setStatus('success')
            setMessage(data.message)
            setUserEmail(data.userEmail)
        },
        onError: (error) => {
            setStatus('error')
            setMessage(error.message || 'Failed to approve registration')
        },
    })

    useEffect(() => {
        if (token) {
            approveMutation.mutate({ token, role: role || undefined })
        } else {
            setStatus('error')
            setMessage('Invalid approval link - missing token')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, role])

    if (status === 'processing') {
        return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="w-full max-w-md space-y-4 text-center">
                    <div className="flex justify-center">
                        <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
                    </div>
                    <h2 className="text-2xl font-bold">Processing Approval...</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Please wait while we approve the registration request.
                    </p>
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
                    <h2 className="text-2xl font-bold">Approval Successful!</h2>
                    <div className="space-y-2">
                        <p className="text-gray-600 dark:text-gray-400">{message}</p>
                        {userEmail && (
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                                User: <span className="font-medium">{userEmail}</span>
                            </p>
                        )}
                        {role && (
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                                Role: <span className="font-medium">{role}</span>
                            </p>
                        )}
                    </div>
                    <Button onClick={() => router.push('/dashboard')} className="w-full">
                        Go to Dashboard
                    </Button>
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
                <h2 className="text-2xl font-bold">Approval Failed</h2>
                <p className="text-gray-600 dark:text-gray-400">
                    {message || 'The approval link is invalid or has expired.'}
                </p>
                <Button onClick={() => router.push('/dashboard/registration-requests')} className="w-full">
                    View Registration Requests
                </Button>
            </div>
        </div>
    )
}

export default function ApprovalAcceptPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            }
        >
            <ApproveContent />
        </Suspense>
    )
}
