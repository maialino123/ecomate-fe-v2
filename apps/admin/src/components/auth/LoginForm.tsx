'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useApi } from '@workspace/shared/providers'
import { useLogin } from '@workspace/lib/hooks'
import { Input } from '@workspace/ui/components/ui/input'
import { Label } from '@workspace/ui/components/ui/label'
import { Button } from '@workspace/ui/components/Button'
import { Loader2 } from 'lucide-react'

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
    const router = useRouter()
    const api = useApi()
    const [show2FAMessage, setShow2FAMessage] = useState(false)
    const [apiError, setApiError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    })

    const loginMutation = useLogin({
        api,
        onSuccess: data => {
            setApiError(null) // Clear any previous errors
            if (data.require2FA) {
                setShow2FAMessage(true)
            } else {
                router.push('/dashboard')
            }
        },
        onError: (error: any) => {
            // Set inline error as fallback
            const message = error?.response?.data?.message || error?.message || 'Login failed. Please try again.'
            setApiError(message)
        },
    })

    const onSubmit = async (data: LoginFormData) => {
        try {
            await loginMutation.mutateAsync(data)
        } catch (error) {
            // Error is already handled by useLogin hook
            console.error('Login error:', error)
        }
    }

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        e.stopPropagation()
        try {
            await handleSubmit(onSubmit)(e)
        } catch (error) {
            // Catch any unhandled errors from form submission
            // This prevents ErrorBoundary from catching and refreshing the page
            console.error('Form submission error:', error)
        }
    }

    if (show2FAMessage) {
        return (
            <div className="w-full max-w-md space-y-4">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold">Check Your Email</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        We&apos;ve sent a magic link to your email address. Please click the link to complete your
                        login.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">The link will expire in 5 minutes.</p>
                </div>
                <Button onClick={() => setShow2FAMessage(false)} variant="outline" className="w-full">
                    Back to Login
                </Button>
            </div>
        )
    }

    return (
        <form onSubmit={handleFormSubmit} className="w-full max-w-md space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Welcome Back</h2>
                <p className="text-gray-600 dark:text-gray-400">Sign in to your admin account</p>
            </div>

            {apiError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{apiError}</p>
                </div>
            )}

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="admin@example.com"
                        {...register('email')}
                        disabled={loginMutation.isPending}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        {...register('password')}
                        disabled={loginMutation.isPending}
                    />
                    {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                </div>
            </div>

            <Button type="submit" className="w-full" isDisabled={loginMutation.isPending}>
                {loginMutation.isPending ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Signing in...
                    </>
                ) : (
                    'Sign In'
                )}
            </Button>

            <div className="text-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Don&apos;t have an account? </span>
                <a href="/register" className="text-blue-500 hover:underline">
                    Register
                </a>
            </div>
        </form>
    )
}
