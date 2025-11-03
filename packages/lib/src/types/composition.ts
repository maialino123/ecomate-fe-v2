/**
 * Composition Pattern Type Utilities
 *
 * These utilities help enforce composition patterns and provide
 * type-safe APIs for compound components and provider patterns.
 *
 * Based on best practices from Radix UI and modern React patterns.
 */

import type { ComponentPropsWithoutRef, ElementType, PropsWithChildren } from 'react'

/**
 * Polymorphic component props that allow rendering as different HTML elements
 *
 * @example
 * ```tsx
 * type ButtonProps = PolymorphicComponentProps<'button', {
 *   variant?: 'primary' | 'secondary'
 * }>
 *
 * <Button as="a" href="/link">Link Button</Button>
 * ```
 */
export type PolymorphicComponentProps<
    E extends ElementType,
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    P = {},
> = P &
    Omit<ComponentPropsWithoutRef<E>, keyof P> & {
        as?: E
    }

/**
 * Extract variant props from a variant configuration object
 *
 * @example
 * ```tsx
 * const buttonVariants = {
 *   variant: ['primary', 'secondary', 'ghost'] as const,
 *   size: ['sm', 'md', 'lg'] as const,
 * }
 *
 * type ButtonVariantProps = VariantProps<typeof buttonVariants>
 * // { variant?: 'primary' | 'secondary' | 'ghost', size?: 'sm' | 'md' | 'lg' }
 * ```
 */
export type VariantProps<T extends Record<string, readonly string[]>> = {
    [K in keyof T]?: T[K][number]
}

/**
 * Props for a compound component that shares context
 *
 * @example
 * ```tsx
 * type AccordionProps = CompoundComponentProps<{
 *   defaultOpen?: boolean
 *   onOpenChange?: (open: boolean) => void
 * }>
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type CompoundComponentProps<P = {}> = PropsWithChildren<P>

/**
 * Context value type for Provider pattern
 * Ensures required context values are defined
 *
 * @example
 * ```tsx
 * type TabsContextValue = ProviderContextValue<{
 *   activeTab: string
 *   setActiveTab: (tab: string) => void
 * }>
 * ```
 */
export type ProviderContextValue<T> = T extends undefined ? never : T

/**
 * Props for a component that uses the Provider pattern
 *
 * @example
 * ```tsx
 * type ComposerProviderProps = ComponentWithProviderProps<{
 *   initialValue?: string
 *   onSubmit?: (value: string) => void
 * }>
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type ComponentWithProviderProps<P = {}> = PropsWithChildren<P>

/**
 * Helper to create discriminated union types for variants
 * Useful when different variants have completely different prop sets
 *
 * @example
 * ```tsx
 * type ButtonVariant =
 *   | DiscriminatedVariant<'button', { onClick: () => void }>
 *   | DiscriminatedVariant<'link', { href: string; target?: string }>
 *
 * function Button(props: ButtonVariant) {
 *   if (props.variant === 'button') {
 *     // TypeScript knows props.onClick exists here
 *   } else {
 *     // TypeScript knows props.href exists here
 *   }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type DiscriminatedVariant<V extends string, P = {}> = P & {
    variant: V
}

/**
 * Utility to merge component props with variant props
 *
 * @example
 * ```tsx
 * type BaseProps = { className?: string }
 * type VariantProps = { variant: 'primary' | 'secondary' }
 * type ButtonProps = MergeProps<BaseProps, VariantProps>
 * // { className?: string, variant: 'primary' | 'secondary' }
 * ```
 */
export type MergeProps<T, U> = Omit<T, keyof U> & U

/**
 * Extract the props type from a React component
 *
 * @example
 * ```tsx
 * const MyComponent = (props: { name: string }) => <div>{props.name}</div>
 * type MyComponentProps = ComponentProps<typeof MyComponent>
 * // { name: string }
 * ```
 */
export type ComponentProps<T> = T extends (props: infer P) => any ? P : never

/**
 * Make specific props required in a type
 *
 * @example
 * ```tsx
 * type Props = { name?: string; age?: number }
 * type RequiredNameProps = RequireProps<Props, 'name'>
 * // { name: string; age?: number }
 * ```
 */
export type RequireProps<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 * Make specific props optional in a type
 *
 * @example
 * ```tsx
 * type Props = { name: string; age: number }
 * type OptionalAgeProps = OptionalProps<Props, 'age'>
 * // { name: string; age?: number }
 * ```
 */
export type OptionalProps<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Type guard for checking if a variant matches
 *
 * @example
 * ```tsx
 * function isButtonVariant(
 *   props: ButtonVariant
 * ): props is DiscriminatedVariant<'button', { onClick: () => void }> {
 *   return props.variant === 'button'
 * }
 * ```
 */
export type TypeGuard<T, U extends T> = (value: T) => value is U
