'use client'

import { useAuthStore } from '@workspace/lib/stores'
import { formatRole } from '@workspace/shared/utils'

export default function DashboardPage() {
    const { user } = useAuthStore()

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Welcome back, {user?.username || user?.email}!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    You are logged in as {user?.role && formatRole(user.role)}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {user?.role === 'OWNER' && (
                    <>
                        <DashboardCard title="Total Users" value="0" description="Active users in the system" />
                        <DashboardCard
                            title="Pending Requests"
                            value="0"
                            description="Registration requests awaiting approval"
                        />
                        <DashboardCard title="System Status" value="Active" description="All systems operational" />
                    </>
                )}
            </div>
        </div>
    )
}

function DashboardCard({ title, value, description }: { title: string; value: string; description: string }) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{description}</p>
        </div>
    )
}
