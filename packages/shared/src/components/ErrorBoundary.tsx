'use client'

import React, { Component, ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
    error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    handleReset = () => {
        this.setState({ hasError: false, error: undefined })
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback
            }

            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
                    <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Something went wrong</h1>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            An unexpected error occurred. Please refresh the page and try again.
                        </p>
                        {this.state.error && (
                            <details className="mb-4">
                                <summary className="text-sm text-gray-500 dark:text-gray-500 cursor-pointer">
                                    Error details
                                </summary>
                                <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-auto">
                                    {this.state.error.toString()}
                                </pre>
                            </details>
                        )}
                        <div className="flex gap-2">
                            <button
                                onClick={this.handleReset}
                                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Refresh Page
                            </button>
                        </div>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}
