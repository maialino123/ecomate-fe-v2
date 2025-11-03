'use client'

import React, { useRef, useState, MouseEvent, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface HoverBorderButtonProps {
    children: ReactNode
    onClick?: () => void
    className?: string
    disabled?: boolean
    href?: string
    target?: string
    rel?: string
    borderColor?: string
    borderWidth?: string
    glowIntensity?: number
    animationDuration?: number
    as?: 'button' | 'a'
}

export const HoverBorderButton: React.FC<HoverBorderButtonProps> = ({
    children,
    onClick,
    className = '',
    disabled = false,
    href,
    target,
    rel,
    borderColor = 'rgba(255, 255, 255, 0.5)',
    borderWidth = '2px',
    glowIntensity = 0.5,
    animationDuration = 0.3,
    as = 'button',
}) => {
    const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null)
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
    const [isHovered, setIsHovered] = useState(false)

    const handleMouseMove = (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect()
            const x = ((e.clientX - rect.left) / rect.width) * 100
            const y = ((e.clientY - rect.top) / rect.height) * 100
            setMousePosition({ x, y })
        }
    }

    const handleMouseEnter = () => {
        setIsHovered(true)
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
    }

    const commonProps = {
        ref: buttonRef,
        onMouseMove: handleMouseMove,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        className: cn(
            'relative overflow-hidden transition-all isolate',
            disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
            className,
        ),
        disabled: disabled,
    }

    const borderGradientStyle = {
        background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, ${borderColor} 0%, transparent 70%)`,
        opacity: isHovered ? glowIntensity : 0,
        transition: `opacity ${animationDuration}s ease-in-out`,
    }

    const content = (
        <>
            {/* Animated border overlay */}
            <motion.div
                className="absolute inset-0 pointer-events-none z-[1]"
                style={borderGradientStyle}
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? glowIntensity : 0 }}
                transition={{ duration: animationDuration }}
            />

            {/* Border frame */}
            <div
                className={cn(
                    'absolute inset-0 pointer-events-none z-[2] rounded-[inherit] opacity-0 transition-opacity',
                    isHovered && 'opacity-100',
                )}
                style={{
                    background: `
            linear-gradient(to right, ${borderColor}, transparent) top / 100% ${borderWidth},
            linear-gradient(to bottom, ${borderColor}, transparent) right / ${borderWidth} 100%,
            linear-gradient(to left, ${borderColor}, transparent) bottom / 100% ${borderWidth},
            linear-gradient(to top, ${borderColor}, transparent) left / ${borderWidth} 100%
          `,
                    backgroundRepeat: 'no-repeat',
                    mixBlendMode: 'screen',
                    transition: `opacity ${animationDuration}s ease-in-out`,
                }}
            />

            {/* Content */}
            <span className="relative z-[3]">{children}</span>
        </>
    )

    if (as === 'a' || href) {
        return (
            <a {...(commonProps as any)} href={href} target={target} rel={rel} onClick={onClick}>
                {content}
            </a>
        )
    }

    return (
        <button {...(commonProps as any)} onClick={onClick}>
            {content}
        </button>
    )
}
