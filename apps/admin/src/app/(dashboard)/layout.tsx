'use client'

import { ProtectedRoute } from '../../lib/protected-route'
import { Sidebar } from '../../components/dashboard/Sidebar'
import { DashboardHeader } from '../../components/dashboard/Header'
import { useUIStore } from '@workspace/lib/stores'
import { cn } from '@workspace/ui/lib/utils'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { sidebarCollapsed } = useUIStore()

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Sidebar />
                <DashboardHeader />
                <main className={cn('pt-16 transition-all duration-300', sidebarCollapsed ? 'ml-16' : 'ml-64')}>
                    <div className="p-6">{children}</div>
                </main>
            </div>
        </ProtectedRoute>
    )
}
