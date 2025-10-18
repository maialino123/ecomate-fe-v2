'use client'

import { Button } from '@workspace/ui/components/Button'
import { ThemeSwitcher } from '@workspace/shared/components/ThemeSwitcher'

export default function Page() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center max-w-2xl mx-auto px-4">
                <ThemeSwitcher />
                <h1 className="text-4xl md:text-5xl font-bold my-6">Admin Dashboard</h1>
                <p className="text-lg text-muted-foreground">
                    Welcome to Ecomate Admin Dashboard. Manage your application from here.
                </p>
                <Button size="lg" className="mt-6">
                    Get Started
                </Button>
            </div>
        </div>
    )
}
