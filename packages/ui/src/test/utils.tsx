import { render as rtlRender, type RenderOptions } from '@testing-library/react'
import type { ReactElement } from 'react'

/**
 * Custom render function that wraps components with common providers
 * Extend this function as needed when you add global providers (Theme, Router, etc.)
 */
function render(ui: ReactElement, options?: RenderOptions) {
    return rtlRender(ui, {
        ...options,
    })
}

// Re-export everything from React Testing Library
export * from '@testing-library/react'
export { render }
export { default as userEvent } from '@testing-library/user-event'
