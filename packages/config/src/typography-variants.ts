import type { FontSize, FontWeight, LetterSpacing } from './typography'

export interface TypographyVariant {
    fontSize: FontSize
    lineHeight: string
    fontWeight: FontWeight
    letterSpacing?: LetterSpacing
}

export const typographyVariants = {
    'display-lg': {
        fontSize: '6xl',
        lineHeight: '80px',
        fontWeight: 'bold',
        letterSpacing: 'tighter',
    },
    'display-md': {
        fontSize: '5xl',
        lineHeight: '72px',
        fontWeight: 'bold',
        letterSpacing: 'tighter',
    },
    'display-sm': {
        fontSize: '4xl',
        lineHeight: '64px',
        fontWeight: 'bold',
        letterSpacing: 'tight',
    },
    h1: {
        fontSize: '3xl',
        lineHeight: '56px',
        fontWeight: 'bold',
        letterSpacing: 'tight',
    },
    h2: {
        fontSize: '2xl',
        lineHeight: '48px',
        fontWeight: 'semibold',
        letterSpacing: 'tight',
    },
    h3: {
        fontSize: 'xl',
        lineHeight: '40px',
        fontWeight: 'semibold',
    },
    h4: {
        fontSize: 'lg',
        lineHeight: '32px',
        fontWeight: 'semibold',
    },
    h5: {
        fontSize: 'md',
        lineHeight: '28px',
        fontWeight: 'medium',
    },
    h6: {
        fontSize: 'base',
        lineHeight: '24px',
        fontWeight: 'medium',
    },
    'body-lg': {
        fontSize: 'md',
        lineHeight: '32px',
        fontWeight: 'regular',
    },
    body: {
        fontSize: 'base',
        lineHeight: '24px',
        fontWeight: 'regular',
    },
    'body-sm': {
        fontSize: 'sm',
        lineHeight: '20px',
        fontWeight: 'regular',
    },
    caption: {
        fontSize: 'xs',
        lineHeight: '16px',
        fontWeight: 'regular',
    },
    overline: {
        fontSize: 'xs',
        lineHeight: '16px',
        fontWeight: 'semibold',
        letterSpacing: 'widest',
    },
    label: {
        fontSize: 'sm',
        lineHeight: '20px',
        fontWeight: 'medium',
    },
    button: {
        fontSize: 'base',
        lineHeight: '24px',
        fontWeight: 'medium',
    },
} as const

export type TypographyVariantKey = keyof typeof typographyVariants
