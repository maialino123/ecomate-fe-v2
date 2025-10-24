'use client'

import { useState } from 'react'
import { useApi } from '@workspace/shared/providers'
import { useUsers, useUpdateUserRole, useUpdateUserStatus, useDeleteUser } from '@workspace/lib/hooks'
import { UserRole, UserStatus } from '@workspace/lib/stores'
import { formatDateTime, formatRole, formatStatus } from '@workspace/shared/utils'
import { Loader2, Edit, Trash2 } from 'lucide-react'
import { Button } from '@workspace/ui/components/Button'
import { ProtectedRoute } from '../../../../lib/protected-route'

type DialogType = 'role' | 'status' | 'delete' | null

function UsersPageContent() {
    const api = useApi()
    const { data, isLoading, error, refetch } = useUsers({ api })
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const [dialogType, setDialogType] = useState<DialogType>(null)
    const [selectedRole, setSelectedRole] = useState<UserRole>('VIEWER')
    const [selectedStatus, setSelectedStatus] = useState<UserStatus>('ACTIVE')

    const updateRoleMutation = useUpdateUserRole({
        api,
        onSuccess: () => {
            setDialogType(null)
            setSelectedUser(null)
            refetch()
        },
    })

    const updateStatusMutation = useUpdateUserStatus({
        api,
        onSuccess: () => {
            setDialogType(null)
            setSelectedUser(null)
            refetch()
        },
    })

    const deleteUserMutation = useDeleteUser({
        api,
        onSuccess: () => {
            setDialogType(null)
            setSelectedUser(null)
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
                <p className="text-red-500">Failed to load users</p>
                <Button onClick={() => refetch()} className="mt-4">
                    Retry
                </Button>
            </div>
        )
    }

    const users = data?.users || []

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{users.length} total users</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Joined
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {user.username || 'N/A'}
                                            </div>
                                            {(user.firstName || user.lastName) && (
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {user.firstName} {user.lastName}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <RoleBadge role={user.role} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={user.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {formatDateTime(user.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {user.role !== 'OWNER' && (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedUser(user)
                                                            setSelectedRole(user.role)
                                                            setDialogType('role')
                                                        }}
                                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                        title="Change Role"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedUser(user)
                                                            setSelectedStatus(user.status)
                                                            setDialogType('status')
                                                        }}
                                                        className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                                                        title="Change Status"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedUser(user)
                                                            setDialogType('delete')
                                                        }}
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
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

            {/* Update Role Dialog */}
            {dialogType === 'role' && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Update User Role</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Change role for {selectedUser.email}
                        </p>
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
                                        updateRoleMutation.mutate({ id: selectedUser.id, dto: { role: selectedRole } })
                                    }}
                                    isDisabled={updateRoleMutation.isPending}
                                    className="flex-1"
                                >
                                    {updateRoleMutation.isPending ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        'Update'
                                    )}
                                </Button>
                                <Button onClick={() => setDialogType(null)} variant="outline" className="flex-1">
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Status Dialog */}
            {dialogType === 'status' && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Update User Status</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Change status for {selectedUser.email}
                        </p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Select Status</label>
                                <select
                                    value={selectedStatus}
                                    onChange={e => setSelectedStatus(e.target.value as UserStatus)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                                >
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                    <option value="SUSPENDED">Suspended</option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => {
                                        updateStatusMutation.mutate({
                                            id: selectedUser.id,
                                            dto: { status: selectedStatus },
                                        })
                                    }}
                                    isDisabled={updateStatusMutation.isPending}
                                    className="flex-1"
                                >
                                    {updateStatusMutation.isPending ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        'Update'
                                    )}
                                </Button>
                                <Button onClick={() => setDialogType(null)} variant="outline" className="flex-1">
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete User Dialog */}
            {dialogType === 'delete' && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4 text-red-600 dark:text-red-400">Delete User</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Are you sure you want to delete {selectedUser.email}? This action cannot be undone.
                        </p>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => {
                                    deleteUserMutation.mutate(selectedUser.id)
                                }}
                                isDisabled={deleteUserMutation.isPending}
                                variant="destructive"
                                className="flex-1"
                            >
                                {deleteUserMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
                            </Button>
                            <Button onClick={() => setDialogType(null)} variant="outline" className="flex-1">
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function RoleBadge({ role }: { role: string }) {
    const colors = {
        OWNER: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
        ADMIN: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
        STAFF: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
        VIEWER: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    }

    return (
        <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colors[role as keyof typeof colors] || colors.VIEWER}`}
        >
            {formatRole(role)}
        </span>
    )
}

function StatusBadge({ status }: { status: string }) {
    const colors = {
        ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
        INACTIVE: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
        SUSPENDED: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    }

    return (
        <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colors[status as keyof typeof colors] || colors.INACTIVE}`}
        >
            {formatStatus(status)}
        </span>
    )
}

// Wrap with ProtectedRoute to ensure only OWNER can access
export default function UsersPage() {
    return (
        <ProtectedRoute requiredRoles={['OWNER']}>
            <UsersPageContent />
        </ProtectedRoute>
    )
}
