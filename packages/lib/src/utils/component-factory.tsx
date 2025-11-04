/**
 * Component Factory Utilities
 *
 * Helper functions to create components following composition patterns.
 * These utilities enforce best practices and reduce boilerplate.
 */

import React, { createContext, useContext, type Context } from 'react'

/**
 * Creates a context with a custom hook and throws error if used outside provider
 *
 * @example
 * ```tsx
 * type TabsContextValue = {
 *   activeTab: string
 *   setActiveTab: (tab: string) => void
 * }
 *
 * const [TabsProvider, useTabs] = createSafeContext<TabsContextValue>('Tabs')
 *
 * function TabsRoot({ children }: PropsWithChildren) {
 *   const [activeTab, setActiveTab] = useState('tab1')
 *   return (
 *     <TabsProvider value={{ activeTab, setActiveTab }}>
 *       {children}
 *     </TabsProvider>
 *   )
 * }
 *
 * function Tab() {
 *   const { activeTab } = useTabs() // Type-safe and throws if used outside provider
 *   return <div>{activeTab}</div>
 * }
 * ```
 */
export function createSafeContext<T>(displayName: string): [React.Provider<T>, () => T, Context<T | undefined>] {
    const Context = createContext<T | undefined>(undefined)
    Context.displayName = displayName

    function useContextHook(): T {
        const context = useContext(Context)
        if (context === undefined) {
            throw new Error(`use${displayName} must be used within ${displayName}Provider`)
        }
        return context
    }

    return [Context.Provider, useContextHook, Context]
}

/**
 * Creates a compound component system with Provider and subcomponents
 *
 * @example
 * ```tsx
 * const Accordion = createCompoundComponent('Accordion', {
 *   Root: AccordionRoot,
 *   Item: AccordionItem,
 *   Trigger: AccordionTrigger,
 *   Content: AccordionContent,
 * })
 *
 * // Usage:
 * <Accordion.Root>
 *   <Accordion.Item>
 *     <Accordion.Trigger>Click me</Accordion.Trigger>
 *     <Accordion.Content>Content here</Accordion.Content>
 *   </Accordion.Item>
 * </Accordion.Root>
 * ```
 */
export function createCompoundComponent<T extends Record<string, React.ComponentType<any>>>(
    displayName: string,
    components: T,
): T {
    // Assign display names to all subcomponents
    Object.entries(components).forEach(([key, component]) => {
        if (component) {
            component.displayName = `${displayName}.${key}`
        }
    })

    return components
}

/**
 * Type-safe variant mapper utility
 * Converts variant strings to className or other values
 *
 * @example
 * ```tsx
 * const buttonVariants = createVariantMapper({
 *   variant: {
 *     primary: 'bg-blue-500 text-white',
 *     secondary: 'bg-gray-500 text-white',
 *     ghost: 'bg-transparent text-gray-900',
 *   },
 *   size: {
 *     sm: 'px-3 py-1 text-sm',
 *     md: 'px-4 py-2 text-base',
 *     lg: 'px-6 py-3 text-lg',
 *   },
 * })
 *
 * const classes = buttonVariants({ variant: 'primary', size: 'md' })
 * // Returns: 'bg-blue-500 text-white px-4 py-2 text-base'
 * ```
 */
export function createVariantMapper<T extends Record<string, Record<string, string>>>(variants: T) {
    return function getVariantClasses<K extends keyof T>(props: { [P in K]?: keyof T[P] }): string {
        return Object.entries(props)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => {
                const variantMap = variants[key as keyof T]
                return variantMap?.[value as string] ?? ''
            })
            .filter(Boolean)
            .join(' ')
    }
}

/**
 * Creates a forward ref component with proper typing
 * Useful for components that need ref forwarding
 *
 * @example
 * ```tsx
 * const Button = createForwardRefComponent<HTMLButtonElement, ButtonProps>(
 *   'Button',
 *   ({ children, ...props }, ref) => {
 *     return (
 *       <button ref={ref} {...props}>
 *         {children}
 *       </button>
 *     )
 *   }
 * )
 * ```
 */
export function createForwardRefComponent<
    T,
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    P = {},
>(displayName: string, component: React.ForwardRefRenderFunction<T, P>) {
    // @ts-expect-error - React.forwardRef type inference limitation with generic P
    const Component = React.forwardRef(component)
    Component.displayName = displayName
    return Component
}

/**
 * Utility to compose multiple className strings and remove duplicates
 * Use the `cn()` utility from @workspace/ui/lib/utils in your components
 *
 * @example
 * ```tsx
 * import { cn } from '@workspace/ui/lib/utils'
 *
 * const classes = cn(
 *   'base-class',
 *   condition && 'conditional-class',
 *   variants[variant]
 * )
 * ```
 */

/**
 * Helper to extract display name from component for debugging
 */
export function getComponentDisplayName(Component: React.ComponentType<any>): string {
    return Component.displayName || Component.name || 'Component'
}

/**
 * Creates a slot component that can be replaced
 * Useful for customizable parts of a component
 *
 * @example
 * const DefaultIcon = () => <svg>...</svg>
 * const IconSlot = createSlot('Icon', DefaultIcon)
 *
 * // Usage:
 * <Card>
 *   <Card.Icon /> - Uses default
 *   <Card.Icon as={CustomIcon} /> - Uses custom
 * </Card>
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export function createSlot<P = {}>(displayName: string, DefaultComponent: React.ComponentType<P>) {
    function Slot(props: P & { as?: React.ComponentType<P> }) {
        const { as: Component = DefaultComponent, ...rest } = props
        // @ts-expect-error - Generic P type inference limitation
        return <Component {...rest} />
    }

    Slot.displayName = displayName
    return Slot
}
