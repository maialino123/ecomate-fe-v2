'use client'

import React, { forwardRef, type ComponentPropsWithoutRef, type ElementType, type PropsWithChildren } from 'react'
import { createSafeContext } from '@workspace/lib'
import { cn } from '../../lib/utils'
import { typographyVariants, type TypographyVariantKey } from '@workspace/config'

interface TypographyContextValue {
    variant?: TypographyVariantKey
}

interface TypographyRootProps extends PropsWithChildren {
    variant?: TypographyVariantKey
}

interface TypographyBaseProps<T extends ElementType = 'span'> {
    as?: T
    variant?: TypographyVariantKey
    align?: 'left' | 'center' | 'right' | 'justify'
    className?: string
    children?: React.ReactNode
}

interface HeadingProps extends Omit<ComponentPropsWithoutRef<'h1'>, 'className'> {
    level: 1 | 2 | 3 | 4 | 5 | 6
    align?: 'left' | 'center' | 'right' | 'justify'
    className?: string
}

interface TextProps extends Omit<ComponentPropsWithoutRef<'p'>, 'className'> {
    as?: ElementType
    size?: 'sm' | 'base' | 'lg'
    align?: 'left' | 'center' | 'right' | 'justify'
    className?: string
}

const [TypographyProvider, useTypography] = createSafeContext<TypographyContextValue>('Typography')

function useOptionalTypography(): TypographyContextValue {
    try {
        return useTypography()
    } catch {
        return {}
    }
}

function getVariantClasses(variant?: TypographyVariantKey): string {
    if (!variant) return ''
    return `text-${variant} leading-${variant}`
}

function getAlignClass(align?: string): string {
    if (!align || align === 'left') return ''
    return `text-${align}`
}

const TypographyRoot = forwardRef<HTMLSpanElement, TypographyRootProps>(function Typography(
    { children, variant },
    ref,
) {
    return (
        <TypographyProvider value={{ variant }}>
            <span ref={ref}>{children}</span>
        </TypographyProvider>
    )
})

interface DisplayProps extends Omit<ComponentPropsWithoutRef<'h1'>, 'className'> {
    as?: ElementType
    size?: 'sm' | 'md' | 'lg'
    align?: 'left' | 'center' | 'right' | 'justify'
    className?: string
}

const Display = forwardRef<HTMLHeadingElement, DisplayProps>(function Display(
    { as, size = 'md', align, className, children, ...props },
    ref,
) {
    const context = useOptionalTypography()
    const Component = as || 'h1'
    const variantKey = `display-${size}` as TypographyVariantKey

    return (
        <Component
            ref={ref}
            className={cn(getVariantClasses(context.variant || variantKey), getAlignClass(align), className)}
            {...props}
        >
            {children}
        </Component>
    )
})

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
    { level, align, className, children, ...props },
    ref,
) {
    const context = useOptionalTypography()
    const Component = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    const variantKey = `h${level}` as TypographyVariantKey

    return (
        <Component
            ref={ref}
            className={cn(getVariantClasses(context.variant || variantKey), getAlignClass(align), className)}
            {...props}
        >
            {children}
        </Component>
    )
})

const Text = forwardRef<HTMLParagraphElement, TextProps>(function Text(
    { as, size = 'base', align, className, children, ...props },
    ref,
) {
    const context = useOptionalTypography()
    const Component = as || 'p'
    const variantKey = size === 'base' ? 'body' : (`body-${size}` as TypographyVariantKey)

    return (
        <Component
            ref={ref}
            className={cn(getVariantClasses(context.variant || variantKey), getAlignClass(align), className)}
            {...props}
        >
            {children}
        </Component>
    )
})

interface LabelProps extends Omit<ComponentPropsWithoutRef<'label'>, 'className'> {
    as?: ElementType
    align?: 'left' | 'center' | 'right' | 'justify'
    className?: string
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
    { as, align, className, children, ...props },
    ref,
) {
    const context = useOptionalTypography()
    const Component = as || 'label'

    return (
        <Component
            ref={ref}
            className={cn(getVariantClasses(context.variant || 'label'), getAlignClass(align), className)}
            {...props}
        >
            {children}
        </Component>
    )
})

interface CaptionProps extends Omit<ComponentPropsWithoutRef<'span'>, 'className'> {
    as?: ElementType
    align?: 'left' | 'center' | 'right' | 'justify'
    className?: string
}

const Caption = forwardRef<HTMLSpanElement, CaptionProps>(function Caption(
    { as, align, className, children, ...props },
    ref,
) {
    const context = useOptionalTypography()
    const Component = as || 'span'

    return (
        <Component
            ref={ref}
            className={cn(getVariantClasses(context.variant || 'caption'), getAlignClass(align), className)}
            {...props}
        >
            {children}
        </Component>
    )
})

interface OverlineProps extends Omit<ComponentPropsWithoutRef<'span'>, 'className'> {
    as?: ElementType
    align?: 'left' | 'center' | 'right' | 'justify'
    className?: string
}

const Overline = forwardRef<HTMLSpanElement, OverlineProps>(function Overline(
    { as, align, className, children, ...props },
    ref,
) {
    const context = useOptionalTypography()
    const Component = as || 'span'

    return (
        <Component
            ref={ref}
            className={cn(
                getVariantClasses(context.variant || 'overline'),
                'uppercase tracking-widest',
                getAlignClass(align),
                className,
            )}
            {...props}
        >
            {children}
        </Component>
    )
})

export const Typography = Object.assign(TypographyRoot, {
    Display,
    Heading,
    H1: forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'level'>>((props, ref) => (
        <Heading level={1} ref={ref} {...props} />
    )),
    H2: forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'level'>>((props, ref) => (
        <Heading level={2} ref={ref} {...props} />
    )),
    H3: forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'level'>>((props, ref) => (
        <Heading level={3} ref={ref} {...props} />
    )),
    H4: forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'level'>>((props, ref) => (
        <Heading level={4} ref={ref} {...props} />
    )),
    H5: forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'level'>>((props, ref) => (
        <Heading level={5} ref={ref} {...props} />
    )),
    H6: forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'level'>>((props, ref) => (
        <Heading level={6} ref={ref} {...props} />
    )),
    Text,
    Label,
    Caption,
    Overline,
})

Typography.Display.displayName = 'Typography.Display'
Typography.Heading.displayName = 'Typography.Heading'
Typography.H1.displayName = 'Typography.H1'
Typography.H2.displayName = 'Typography.H2'
Typography.H3.displayName = 'Typography.H3'
Typography.H4.displayName = 'Typography.H4'
Typography.H5.displayName = 'Typography.H5'
Typography.H6.displayName = 'Typography.H6'
Typography.Text.displayName = 'Typography.Text'
Typography.Label.displayName = 'Typography.Label'
Typography.Caption.displayName = 'Typography.Caption'
Typography.Overline.displayName = 'Typography.Overline'

export type {
    TypographyRootProps,
    TypographyBaseProps,
    HeadingProps,
    TextProps,
    DisplayProps,
    LabelProps,
    CaptionProps,
    OverlineProps,
    TypographyContextValue,
    TypographyVariantKey,
}
