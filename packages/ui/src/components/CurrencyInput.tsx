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
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        borderColor: 'border-yellow-300 dark:border-yellow-700',
        focusColor: 'focus:border-yellow-500 focus:ring-yellow-500 dark:focus:border-yellow-400 dark:focus:ring-yellow-400',
    },
    VND: {
        symbol: '₫',
        name: 'Vietnamese Dong',
        locale: 'vi-VN',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-300 dark:border-blue-700',
        focusColor: 'focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400',
    },
    USD: {
        symbol: '$',
        name: 'US Dollar',
        locale: 'en-US',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-300 dark:border-green-700',
        focusColor: 'focus:border-green-500 focus:ring-green-500 dark:focus:border-green-400 dark:focus:ring-green-400',
    },
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
    ({ currency, error, label, helperText, className, value, onChange, ...props }, ref) => {
        const config = currencyConfig[currency]
        const [displayValue, setDisplayValue] = React.useState('')

        // Format number with thousand separators
        const formatNumber = (num: string | number): string => {
            if (num === '' || num === undefined || num === null) return ''
            const numStr = String(num).replace(/,/g, '')
            if (numStr === '' || isNaN(Number(numStr))) return numStr
            return Number(numStr).toLocaleString('en-US')
        }

        // Remove formatting and get raw number
        const unformatNumber = (formatted: string): string => {
            return formatted.replace(/,/g, '')
        }

        // Update display value when value prop changes
        React.useEffect(() => {
            if (value !== undefined && value !== null && typeof value !== 'object') {
                setDisplayValue(formatNumber(value))
            }
        }, [value])

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const inputValue = e.target.value
            const rawValue = unformatNumber(inputValue)

            // Allow empty, numbers, and single decimal point
            if (rawValue === '' || /^\d*\.?\d*$/.test(rawValue)) {
                setDisplayValue(inputValue.includes('.') ? inputValue : formatNumber(rawValue))

                // Create synthetic event with raw number value
                const syntheticEvent = {
                    ...e,
                    target: {
                        ...e.target,
                        value: rawValue,
                    },
                } as React.ChangeEvent<HTMLInputElement>

                onChange?.(syntheticEvent)
            }
        }

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
                        type="text"
                        inputMode="decimal"
                        value={displayValue}
                        onChange={handleChange}
                        className={cn(
                            'block w-full pl-10 pr-12 py-2 border rounded-md shadow-sm',
                            'text-gray-900 dark:text-white',
                            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
                            'focus:outline-none focus:ring-2',
                            config.bgColor,
                            error
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-600 dark:focus:border-red-500 dark:focus:ring-red-500'
                                : config.borderColor,
                            error ? '' : config.focusColor,
                            'disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed',
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
