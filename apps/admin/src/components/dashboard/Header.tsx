'use client'

import { useAuthStore, useUIStore } from '@workspace/lib/stores'
import { useApi } from '@workspace/shared/providers'
import { useLogout } from '@workspace/lib/hooks'
import { useRouter } from 'next/navigation'
import { ThemeSwitcher } from '@workspace/shared/components/ThemeSwitcher'
import { LogOut, User } from 'lucide-react'
import { cn } from '@workspace/ui/lib/utils'
import { formatRole } from '@workspace/shared/utils'

export function DashboardHeader() {
    const router = useRouter()
    const api = useApi()
    const { user } = useAuthStore()
    const { sidebarCollapsed } = useUIStore()

    const logoutMutation = useLogout({
        api,
        onSuccess: () => {
            router.push('/login')
        },
    })

    return (
        <header
            className={cn(
                'fixed top-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-30 transition-all duration-300',
                sidebarCollapsed ? 'left-16' : 'left-64',
            )}
        >
            <div className="flex items-center justify-between h-full px-6">
                <div className="flex items-center">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Admin Dashboard</h1>
                </div>

                <div className="flex items-center gap-4">
                    <ThemeSwitcher />

                    {/* User Menu */}
                    <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <div className="text-sm">
                                <div className="font-medium text-gray-900 dark:text-white">
                                    {user?.username || user?.email}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {user?.role && formatRole(user.role)}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => logoutMutation.mutate()}
                            disabled={logoutMutation.isPending}
                            className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                            title="Logout"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}
