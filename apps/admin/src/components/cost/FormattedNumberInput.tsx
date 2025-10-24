'use client'

import React from 'react'

interface FormattedNumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
    value?: number | string
    onChange?: (value: string) => void
    onValueChange?: (numericValue: number) => void
}

export const FormattedNumberInput = React.forwardRef<HTMLInputElement, FormattedNumberInputProps>(
    ({ value, onChange, onValueChange, className, ...props }, ref) => {
        const [displayValue, setDisplayValue] = React.useState('')

        // Format number with thousand separators
        const formatNumber = (num: string | number): string => {
            if (num === '' || num === undefined || num === null) return ''
            const numStr = String(num).replace(/,/g, '')
            if (numStr === '' || isNaN(Number(numStr))) return numStr

            // Handle decimal numbers
            if (numStr.includes('.')) {
                const [integer, decimal] = numStr.split('.')
                return `${Number(integer).toLocaleString('en-US')}.${decimal}`
            }

            return Number(numStr).toLocaleString('en-US')
        }

        // Remove formatting and get raw number
        const unformatNumber = (formatted: string): string => {
            return formatted.replace(/,/g, '')
        }

        // Update display value when value prop changes
        React.useEffect(() => {
            if (value !== undefined && value !== null && value !== '') {
                setDisplayValue(formatNumber(value))
            } else if (value === '') {
                setDisplayValue('')
            }
        }, [value])

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const inputValue = e.target.value
            const rawValue = unformatNumber(inputValue)

            // Allow empty, numbers, and single decimal point
            if (rawValue === '' || /^\d*\.?\d*$/.test(rawValue)) {
                // Format for display
                if (inputValue.endsWith('.')) {
                    // Keep the trailing dot while typing
                    setDisplayValue(formatNumber(rawValue.replace('.', '')) + '.')
                } else if (inputValue.includes('.') && inputValue.split('.')[1] !== undefined) {
                    // Keep decimal places as-is while typing
                    const [integer, decimal] = rawValue.split('.')
                    setDisplayValue(`${Number(integer).toLocaleString('en-US')}.${decimal}`)
                } else {
                    setDisplayValue(formatNumber(rawValue))
                }

                // Call onChange with raw value
                onChange?.(rawValue)

                // Call onValueChange with numeric value
                if (onValueChange) {
                    const numericValue = rawValue === '' ? 0 : Number(rawValue)
                    if (!isNaN(numericValue)) {
                        onValueChange(numericValue)
                    }
                }
            }
        }

        return (
            <input
                ref={ref}
                type="text"
                inputMode="decimal"
                value={displayValue}
                onChange={handleChange}
                className={className}
                {...props}
            />
        )
    },
)

FormattedNumberInput.displayName = 'FormattedNumberInput'
