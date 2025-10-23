import React from 'react'
import { cn } from '../lib/utils'

export interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    currency: 'CNY' | 'VND' | 'USD'
    error?: string
    label?: string
    helperText?: string
}

const currencyConfig = {
    CNY: {
        symbol: '¥',
        name: 'Chinese Yuan',
        locale: 'zh-CN',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-300',
        focusColor: 'focus:border-yellow-500 focus:ring-yellow-500',
    },
    VND: {
        symbol: '₫',
        name: 'Vietnamese Dong',
        locale: 'vi-VN',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-300',
        focusColor: 'focus:border-blue-500 focus:ring-blue-500',
    },
    USD: {
        symbol: '$',
        name: 'US Dollar',
        locale: 'en-US',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-300',
        focusColor: 'focus:border-green-500 focus:ring-green-500',
    },
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
    ({ currency, error, label, helperText, className, ...props }, ref) => {
        const config = currencyConfig[currency]

        return (
            <div className="space-y-1">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 dark:text-gray-400 font-medium">{config.symbol}</span>
                    </div>
                    <input
                        ref={ref}
                        type="number"
                        step="any"
                        className={cn(
                            'block w-full pl-10 pr-12 py-2 border rounded-md shadow-sm',
                            'text-gray-900 dark:text-white',
                            'placeholder:text-gray-400',
                            'focus:outline-none focus:ring-2',
                            config.bgColor,
                            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : config.borderColor,
                            error ? '' : config.focusColor,
                            'disabled:bg-gray-100 disabled:cursor-not-allowed',
                            className,
                        )}
                        {...props}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{currency}</span>
                    </div>
                </div>
                {helperText && !error && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
                )}
                {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
            </div>
        )
    },
)

CurrencyInput.displayName = 'CurrencyInput'
