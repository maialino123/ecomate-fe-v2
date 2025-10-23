'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useApi } from '@workspace/shared/providers'
import { useRegister } from '@workspace/lib/hooks'
import { Input } from '@workspace/ui/components/ui/input'
import { Label } from '@workspace/ui/components/ui/label'
import { Button } from '@workspace/ui/components/Button'
import { Loader2, CheckCircle2 } from 'lucide-react'

const registerSchema = z
    .object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string(),
        username: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
    })
    .refine(data => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    })

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
    const api = useApi()
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [apiError, setApiError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    })

    const registerMutation = useRegister({
        api,
        onSuccess: () => {
            setApiError(null) // Clear any previous errors
            setIsSubmitted(true)
        },
        onError: (error: any) => {
            // Set inline error as fallback
            const message = error?.response?.data?.message || error?.message || 'Registration failed. Please try again.'
            setApiError(message)
        },
    })

    const onSubmit = async (data: RegisterFormData) => {
        try {
            const { confirmPassword, ...registerData } = data
            await registerMutation.mutateAsync(registerData)
        } catch (error) {
            console.error('Registration error:', error)
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

    if (isSubmitted) {
        return (
            <div className="w-full max-w-md space-y-4">
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                </div>
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold">Registration Submitted</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Your registration request has been submitted successfully. You will receive an email once the
                        owner approves your request.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">This usually takes 1-2 business days.</p>
                </div>
                <Button onClick={() => (window.location.href = '/login')} variant="outline" className="w-full">
                    Back to Login
                </Button>
            </div>
        )
    }

    return (
        <form onSubmit={handleFormSubmit} className="w-full max-w-md space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Create Account</h2>
                <p className="text-gray-600 dark:text-gray-400">Request access to the admin panel</p>
            </div>

            {apiError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{apiError}</p>
                </div>
            )}

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        {...register('email')}
                        disabled={registerMutation.isPending}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                            id="firstName"
                            type="text"
                            placeholder="John"
                            {...register('firstName')}
                            disabled={registerMutation.isPending}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                            id="lastName"
                            type="text"
                            placeholder="Doe"
                            {...register('lastName')}
                            disabled={registerMutation.isPending}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        type="text"
                        placeholder="johndoe"
                        {...register('username')}
                        disabled={registerMutation.isPending}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        {...register('password')}
                        disabled={registerMutation.isPending}
                    />
                    {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        {...register('confirmPassword')}
                        disabled={registerMutation.isPending}
                    />
                    {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
                </div>
            </div>

            <Button type="submit" className="w-full" isDisabled={registerMutation.isPending}>
                {registerMutation.isPending ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                    </>
                ) : (
                    'Register'
                )}
            </Button>

            <div className="text-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
                <a href="/login" className="text-blue-500 hover:underline">
                    Sign In
                </a>
            </div>
        </form>
    )
}
