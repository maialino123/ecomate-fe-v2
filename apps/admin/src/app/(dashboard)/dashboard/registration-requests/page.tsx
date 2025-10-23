'use client'

import { useState } from 'react'
import { useApi } from '@workspace/shared/providers'
import { useRegistrationRequests, useApproveRequest, useRejectRequest } from '@workspace/lib/hooks'
import { UserRole } from '@workspace/lib/stores'
import { formatDateTime, formatStatus } from '@workspace/shared/utils'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@workspace/ui/components/Button'

export default function RegistrationRequestsPage() {
    const api = useApi()
    const { data, isLoading, error, refetch } = useRegistrationRequests({ api })
    const [selectedRequest, setSelectedRequest] = useState<string | null>(null)
    const [selectedRole, setSelectedRole] = useState<UserRole>('VIEWER')
    const [rejectReason, setRejectReason] = useState('')

    const approveMutation = useApproveRequest({
        api,
        onSuccess: () => {
            setSelectedRequest(null)
            refetch()
        },
    })

    const rejectMutation = useRejectRequest({
        api,
        onSuccess: () => {
            setSelectedRequest(null)
            setRejectReason('')
            refetch()
        },
    })

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500">Failed to load registration requests</p>
                <Button onClick={() => refetch()} className="mt-4">
                    Retry
                </Button>
            </div>
        )
    }

    const requests = data?.requests || []
    const pendingRequests = requests.filter(r => r.status === 'PENDING')

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Registration Requests</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{pendingRequests.length} pending requests</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Submitted
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Expires
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {requests.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        No registration requests found
                                    </td>
                                </tr>
                            ) : (
                                requests.map(request => (
                                    <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {request.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={request.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {formatDateTime(request.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {formatDateTime(request.expiresAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {request.status === 'PENDING' && (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedRequest(request.id)
                                                            setSelectedRole('VIEWER')
                                                        }}
                                                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedRequest(request.id)
                                                            setRejectReason('')
                                                        }}
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Approve Dialog */}
            {selectedRequest && selectedRole && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Approve Request</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Select Role</label>
                                <select
                                    value={selectedRole}
                                    onChange={e => setSelectedRole(e.target.value as UserRole)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                                >
                                    <option value="VIEWER">Viewer</option>
                                    <option value="STAFF">Staff</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => {
                                        approveMutation.mutate({ id: selectedRequest, dto: { role: selectedRole } })
                                    }}
                                    isDisabled={approveMutation.isPending}
                                    className="flex-1"
                                >
                                    {approveMutation.isPending ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        'Approve'
                                    )}
                                </Button>
                                <Button onClick={() => setSelectedRequest(null)} variant="outline" className="flex-1">
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Dialog */}
            {selectedRequest && !selectedRole && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Reject Request</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Reason (optional)</label>
                                <textarea
                                    value={rejectReason}
                                    onChange={e => setRejectReason(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                                    rows={3}
                                    placeholder="Provide a reason for rejection..."
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => {
                                        rejectMutation.mutate({
                                            id: selectedRequest,
                                            dto: { reason: rejectReason || undefined },
                                        })
                                    }}
                                    isDisabled={rejectMutation.isPending}
                                    className="flex-1"
                                    variant="destructive"
                                >
                                    {rejectMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Reject'}
                                </Button>
                                <Button
                                    onClick={() => {
                                        setSelectedRequest(null)
                                        setRejectReason('')
                                    }}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const colors = {
        PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
        APPROVED: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
        REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
        EXPIRED: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    }

    return (
        <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colors[status as keyof typeof colors] || colors.EXPIRED}`}
        >
            {formatStatus(status)}
        </span>
    )
}
