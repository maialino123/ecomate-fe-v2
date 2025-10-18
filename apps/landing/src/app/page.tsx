'use client'

import { Button } from '@workspace/ui/components/Button'
import { ThemeSwitcher } from '@workspace/shared/components/ThemeSwitcher'

export default function Page() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center max-w-2xl mx-auto px-4">
                <ThemeSwitcher />
                <h1 className="text-4xl md:text-5xl font-bold my-6">Welcome to Ecomate</h1>
                <p className="text-lg text-muted-foreground">
                    Discover our eco-friendly solutions for a sustainable future. Join us in making a difference.
                </p>
                <div className="flex gap-4 justify-center mt-6">
                    <Button size="lg">Get Started</Button>
                    <Button size="lg" variant="outline">Learn More</Button>
                </div>
            </div>
        </div>
    )
}
