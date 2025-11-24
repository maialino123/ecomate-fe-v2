export const typographyScale = {
    size: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        md: '20px',
        lg: '24px',
        xl: '32px',
        '2xl': '40px',
        '3xl': '48px',
        '4xl': '56px',
        '5xl': '64px',
        '6xl': '72px',
    },
    lineHeight: {
        tight: '1',
        snug: '1.25',
        normal: '1.5',
        relaxed: '1.75',
        loose: '2',
        fixed: {
            '16': '16px',
            '20': '20px',
            '24': '24px',
            '28': '28px',
            '32': '32px',
            '40': '40px',
            '48': '48px',
            '56': '56px',
            '64': '64px',
            '72': '72px',
            '80': '80px',
        },
    },
    weight: {
        thin: 100,
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900,
    },
    letterSpacing: {
        tighter: '-0.02em',
        tight: '-0.01em',
        normal: '0',
        wide: '0.01em',
        wider: '0.02em',
        widest: '0.04em',
    },
} as const

export type TypographyScale = typeof typographyScale
export type FontSize = keyof typeof typographyScale.size
export type LineHeight = keyof typeof typographyScale.lineHeight | keyof typeof typographyScale.lineHeight.fixed
export type FontWeight = keyof typeof typographyScale.weight
export type LetterSpacing = keyof typeof typographyScale.letterSpacing
