'use client'

import { Loader2 } from 'lucide-react'

/**
 * Default loading component shown during hydration
 * Apps can override this by passing their own loadingComponent to Providers
 */
export function HydrationLoader() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
    )
}
