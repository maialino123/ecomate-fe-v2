'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@workspace/lib/stores'
import { LayoutDashboard, Users, UserCheck, Settings, ChevronLeft, ChevronRight } from 'lucide-react'
import { useUIStore } from '@workspace/lib/stores'
import { cn } from '@workspace/ui/lib/utils'

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['OWNER', 'ADMIN', 'STAFF', 'VIEWER'] },
    { name: 'Users', href: '/dashboard/users', icon: Users, roles: ['OWNER'] },
    { name: 'Registration Requests', href: '/dashboard/registration-requests', icon: UserCheck, roles: ['OWNER'] },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings, roles: ['OWNER', 'ADMIN'] },
]

export function Sidebar() {
    const pathname = usePathname()
    const { user } = useAuthStore()
    const { sidebarCollapsed, toggleSidebarCollapsed } = useUIStore()

    const filteredNavigation = navigation.filter(item => user?.role && item.roles.includes(user.role))

    return (
        <div
            className={cn(
                'fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40',
                sidebarCollapsed ? 'w-16' : 'w-64',
            )}
        >
            <div className="flex flex-col h-full">
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
                    {!sidebarCollapsed && (
                        <span className="text-xl font-bold text-gray-900 dark:text-white">Ecomate</span>
                    )}
                    <button
                        onClick={toggleSidebarCollapsed}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                    {filteredNavigation.map(item => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                                    isActive
                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                                    sidebarCollapsed && 'justify-center',
                                )}
                                title={sidebarCollapsed ? item.name : undefined}
                            >
                                <item.icon className="w-5 h-5 flex-shrink-0" />
                                {!sidebarCollapsed && <span className="ml-3">{item.name}</span>}
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </div>
    )
}
