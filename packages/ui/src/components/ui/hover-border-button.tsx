'use client'

import React, {
    forwardRef,
    useRef,
    useState,
    useCallback,
    useContext,
    type ComponentPropsWithoutRef,
    type PropsWithChildren,
} from 'react'
import { motion } from 'framer-motion'
import { createSafeContext } from '@workspace/lib'
import { cn } from '../../lib/utils'

interface HoverBorderContextValue {
    borderColor: string
    borderWidth: string
    glowIntensity: number
    animationDuration: number
}

interface HoverBorderLocalState {
    mousePosition: { x: number; y: number }
    isHovered: boolean
    elementRef: React.RefObject<HTMLElement | null>
    handleMouseMove: (e: React.MouseEvent<HTMLElement>) => void
    handleMouseEnter: () => void
    handleMouseLeave: () => void
}

interface HoverBorderButtonProps extends PropsWithChildren {
    borderColor?: string
    borderWidth?: string
    glowIntensity?: number
    animationDuration?: number
}

interface HoverBorderButtonButtonProps extends ComponentPropsWithoutRef<'button'> {}

interface HoverBorderButtonLinkProps extends ComponentPropsWithoutRef<'a'> {}

interface HoverBorderFrameProps extends ComponentPropsWithoutRef<'div'> {}

const [HoverBorderProvider, useHoverBorder, HoverBorderContext] =
    createSafeContext<HoverBorderContextValue>('HoverBorder')

const [LocalStateProvider, useLocalState, LocalStateContext] =
    createSafeContext<HoverBorderLocalState>('HoverBorderLocalState')

function useLocalButtonState(): HoverBorderLocalState {
    const elementRef = useRef<HTMLElement>(null)
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
    const [isHovered, setIsHovered] = useState(false)

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
        if (!elementRef.current) return

        requestAnimationFrame(() => {
            if (elementRef.current) {
                const rect = elementRef.current.getBoundingClientRect()
                const x = ((e.clientX - rect.left) / rect.width) * 100
                const y = ((e.clientY - rect.top) / rect.height) * 100
                setMousePosition({ x, y })
            }
        })
    }, [])

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true)
    }, [])

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false)
    }, [])

    return {
        elementRef,
        mousePosition,
        isHovered,
        handleMouseMove,
        handleMouseEnter,
        handleMouseLeave,
    }
}

function useOptionalLocalState(): HoverBorderLocalState | null {
    const context = useContext(LocalStateContext)
    return context ?? null
}

function useLocalStateOrDefault(): HoverBorderLocalState {
    const localState = useOptionalLocalState()

    if (!localState) {
        return {
            mousePosition: { x: 50, y: 50 },
            isHovered: false,
            elementRef: { current: null },
            handleMouseMove: () => {},
            handleMouseEnter: () => {},
            handleMouseLeave: () => {},
        }
    }

    return localState
}

function HoverEffect() {
    const { mousePosition, isHovered } = useLocalStateOrDefault()
    const { borderColor, glowIntensity, animationDuration } = useHoverBorder()

    const borderGradientStyle = {
        background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, ${borderColor} 0%, transparent 70%)`,
        opacity: isHovered ? glowIntensity : 0,
        transition: `opacity ${animationDuration}s ease-in-out`,
        willChange: 'opacity',
    }

    return (
        <motion.div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={borderGradientStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? glowIntensity : 0 }}
            transition={{ duration: animationDuration }}
        />
    )
}

HoverEffect.displayName = 'HoverEffect'

function BorderFrame() {
    const { isHovered } = useLocalStateOrDefault()
    const { borderColor, borderWidth, animationDuration } = useHoverBorder()

    return (
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
    )
}

BorderFrame.displayName = 'BorderFrame'

const HoverBorderButtonButton = forwardRef<HTMLButtonElement, HoverBorderButtonButtonProps>(
    function HoverBorderButtonButton({ children, className, disabled, ...props }, ref) {
        const localState = useLocalButtonState()
        const { elementRef, handleMouseMove, handleMouseEnter, handleMouseLeave } = localState

        return (
            <LocalStateProvider value={localState}>
                <button
                    ref={(node) => {
                        if (typeof ref === 'function') {
                            ref(node)
                        } else if (ref) {
                            ref.current = node
                        }
                        ;(elementRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className={cn(
                        'relative overflow-hidden transition-all isolate',
                        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
                        className,
                    )}
                    disabled={disabled}
                    {...props}
                >
                    <HoverEffect />
                    <BorderFrame />
                    <span className="relative z-[3]">{children}</span>
                </button>
            </LocalStateProvider>
        )
    },
)

HoverBorderButtonButton.displayName = 'HoverBorderButton.Button'

const HoverBorderButtonLink = forwardRef<HTMLAnchorElement, HoverBorderButtonLinkProps>(
    function HoverBorderButtonLink({ children, className, ...props }, ref) {
        const localState = useLocalButtonState()
        const { elementRef, handleMouseMove, handleMouseEnter, handleMouseLeave } = localState

        return (
            <LocalStateProvider value={localState}>
                <a
                    ref={(node) => {
                        if (typeof ref === 'function') {
                            ref(node)
                        } else if (ref) {
                            ref.current = node
                        }
                        ;(elementRef as React.MutableRefObject<HTMLAnchorElement | null>).current = node
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className={cn('relative overflow-hidden transition-all isolate', className)}
                    {...props}
                >
                    <HoverEffect />
                    <BorderFrame />
                    <span className="relative z-[3]">{children}</span>
                </a>
            </LocalStateProvider>
        )
    },
)

HoverBorderButtonLink.displayName = 'HoverBorderButton.Link'

const HoverBorderButtonFrame = forwardRef<HTMLDivElement, HoverBorderFrameProps>(
    function HoverBorderButtonFrame({ children, className, ...props }, ref) {
        const localState = useLocalButtonState()
        const { elementRef, handleMouseMove, handleMouseEnter, handleMouseLeave } = localState

        return (
            <LocalStateProvider value={localState}>
                <div
                    ref={(node) => {
                        if (typeof ref === 'function') {
                            ref(node)
                        } else if (ref) {
                            ref.current = node
                        }
                        ;(elementRef as React.MutableRefObject<HTMLDivElement | null>).current = node
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className={cn('relative overflow-hidden transition-all isolate', className)}
                    {...props}
                >
                    <HoverEffect />
                    <BorderFrame />
                    <span className="relative z-[3]">{children}</span>
                </div>
            </LocalStateProvider>
        )
    },
)

HoverBorderButtonFrame.displayName = 'HoverBorderButton.Frame'

function HoverBorderButtonRoot({
    children,
    borderColor = 'rgba(255, 255, 255, 0.5)',
    borderWidth = '2px',
    glowIntensity = 0.5,
    animationDuration = 0.3,
}: HoverBorderButtonProps) {
    return (
        <HoverBorderProvider
            value={{
                borderColor,
                borderWidth,
                glowIntensity,
                animationDuration,
            }}
        >
            {children}
        </HoverBorderProvider>
    )
}

HoverBorderButtonRoot.displayName = 'HoverBorderButton'

export const HoverBorderButton = Object.assign(HoverBorderButtonRoot, {
    Button: HoverBorderButtonButton,
    Link: HoverBorderButtonLink,
    Frame: HoverBorderButtonFrame,
    Effect: HoverEffect,
    Border: BorderFrame,
})

export { useHoverBorder, useOptionalLocalState, useLocalStateOrDefault, LocalStateProvider }

export { useLocalButtonState }

export type {
    HoverBorderButtonProps,
    HoverBorderButtonButtonProps,
    HoverBorderButtonLinkProps,
    HoverBorderFrameProps,
    HoverBorderContextValue,
    HoverBorderLocalState,
}
