import type { HoverBorderButtonProps } from '@workspace/ui/components/ui/hover-border-button'

export const BUTTON_VARIANTS = {
    primary: {
        borderColor: 'rgba(16, 185, 129, 0.8)',
        glowIntensity: 0.7,
        borderWidth: '2px',
        animationDuration: 0.3,
    },
    secondary: {
        borderColor: 'rgba(15, 23, 42, 0.6)',
        glowIntensity: 0.5,
        borderWidth: '2px',
        animationDuration: 0.3,
    },
    danger: {
        borderColor: 'rgba(239, 68, 68, 0.8)',
        glowIntensity: 0.6,
        borderWidth: '2px',
        animationDuration: 0.3,
    },
    filter: {
        borderColor: 'rgba(100, 116, 139, 0.6)',
        glowIntensity: 0.4,
        borderWidth: '1.5px',
        animationDuration: 0.2,
    },
    filterActive: {
        borderColor: 'rgba(16, 185, 129, 0.9)',
        glowIntensity: 0.8,
        borderWidth: '2px',
        animationDuration: 0.2,
    },
} as const satisfies Record<string, HoverBorderButtonProps>

export type ButtonVariant = keyof typeof BUTTON_VARIANTS

export function getButtonVariant(variant: ButtonVariant): HoverBorderButtonProps {
    return BUTTON_VARIANTS[variant]
}
