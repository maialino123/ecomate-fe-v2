/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, userEvent } from '../../../../test/utils'
import { HoverBorderButton } from '../index'

describe('HoverBorderButton', () => {
    describe('Provider (Root Component)', () => {
        it('should render children', () => {
            render(
                <HoverBorderButton>
                    <HoverBorderButton.Button>Test Button</HoverBorderButton.Button>
                </HoverBorderButton>,
            )

            expect(screen.getByText('Test Button')).toBeInTheDocument()
        })

        it('should provide context to children', () => {
            render(
                <HoverBorderButton borderColor="rgb(255, 0, 0)" glowIntensity={0.8}>
                    <HoverBorderButton.Button>Test</HoverBorderButton.Button>
                </HoverBorderButton>,
            )

            // Component should render without throwing context error
            expect(screen.getByText('Test')).toBeInTheDocument()
        })

        it('should accept custom configuration props', () => {
            render(
                <HoverBorderButton
                    borderColor="rgba(0, 255, 0, 0.5)"
                    borderWidth="4px"
                    glowIntensity={0.9}
                    animationDuration={0.5}
                >
                    <HoverBorderButton.Button>Custom Config</HoverBorderButton.Button>
                </HoverBorderButton>,
            )

            expect(screen.getByText('Custom Config')).toBeInTheDocument()
        })
    })

    describe('Button Variant', () => {
        it('should render as button element', () => {
            render(
                <HoverBorderButton>
                    <HoverBorderButton.Button>Click me</HoverBorderButton.Button>
                </HoverBorderButton>,
            )

            const button = screen.getByRole('button', { name: 'Click me' })
            expect(button.tagName).toBe('BUTTON')
        })

        it('should handle click events', async () => {
            const user = userEvent.setup()
            const handleClick = vi.fn()

            render(
                <HoverBorderButton>
                    <HoverBorderButton.Button onClick={handleClick}>Click me</HoverBorderButton.Button>
                </HoverBorderButton>,
            )

            const button = screen.getByRole('button')
            await user.click(button)

            expect(handleClick).toHaveBeenCalledTimes(1)
        })

        it('should apply custom className', () => {
            render(
                <HoverBorderButton>
                    <HoverBorderButton.Button className="custom-class">Styled Button</HoverBorderButton.Button>
                </HoverBorderButton>,
            )

            const button = screen.getByRole('button')
            expect(button).toHaveClass('custom-class')
        })

        it('should handle disabled state', () => {
            render(
                <HoverBorderButton>
                    <HoverBorderButton.Button disabled>Disabled Button</HoverBorderButton.Button>
                </HoverBorderButton>,
            )

            const button = screen.getByRole('button')
            expect(button).toBeDisabled()
            expect(button).toHaveClass('opacity-50', 'cursor-not-allowed')
        })

        it('should not trigger click when disabled', async () => {
            const user = userEvent.setup()
            const handleClick = vi.fn()

            render(
                <HoverBorderButton>
                    <HoverBorderButton.Button disabled onClick={handleClick}>
                        Disabled
                    </HoverBorderButton.Button>
                </HoverBorderButton>,
            )

            const button = screen.getByRole('button')
            await user.click(button)

            expect(handleClick).not.toHaveBeenCalled()
        })

        it('should forward additional props', () => {
            render(
                <HoverBorderButton>
                    <HoverBorderButton.Button data-testid="custom-button" aria-label="Custom">
                        Button
                    </HoverBorderButton.Button>
                </HoverBorderButton>,
            )

            const button = screen.getByTestId('custom-button')
            expect(button).toHaveAttribute('aria-label', 'Custom')
        })
    })

    describe('Link Variant', () => {
        it('should render as anchor element', () => {
            render(
                <HoverBorderButton>
                    <HoverBorderButton.Link href="/test">Link Text</HoverBorderButton.Link>
                </HoverBorderButton>,
            )

            const link = screen.getByRole('link', { name: 'Link Text' })
            expect(link.tagName).toBe('A')
            expect(link).toHaveAttribute('href', '/test')
        })

        it('should handle external links with target and rel', () => {
            render(
                <HoverBorderButton>
                    <HoverBorderButton.Link href="https://example.com" target="_blank" rel="noopener noreferrer">
                        External Link
                    </HoverBorderButton.Link>
                </HoverBorderButton>,
            )

            const link = screen.getByRole('link')
            expect(link).toHaveAttribute('href', 'https://example.com')
            expect(link).toHaveAttribute('target', '_blank')
            expect(link).toHaveAttribute('rel', 'noopener noreferrer')
        })

        it('should apply custom className', () => {
            render(
                <HoverBorderButton>
                    <HoverBorderButton.Link href="/test" className="link-class">
                        Styled Link
                    </HoverBorderButton.Link>
                </HoverBorderButton>,
            )

            const link = screen.getByRole('link')
            expect(link).toHaveClass('link-class')
        })

        it('should handle click events on links', async () => {
            const user = userEvent.setup()
            const handleClick = vi.fn(e => e.preventDefault())

            render(
                <HoverBorderButton>
                    <HoverBorderButton.Link href="/test" onClick={handleClick}>
                        Clickable Link
                    </HoverBorderButton.Link>
                </HoverBorderButton>,
            )

            const link = screen.getByRole('link')
            await user.click(link)

            expect(handleClick).toHaveBeenCalledTimes(1)
        })
    })

    describe('Hover Effects', () => {
        it('should track mouse movement', async () => {
            const user = userEvent.setup()

            render(
                <HoverBorderButton>
                    <HoverBorderButton.Button>Hover me</HoverBorderButton.Button>
                </HoverBorderButton>,
            )

            const button = screen.getByRole('button')
            await user.hover(button)

            // Component should not throw and should handle hover
            expect(button).toBeInTheDocument()
        })

        it('should handle mouse enter and leave events', async () => {
            const user = userEvent.setup()

            render(
                <HoverBorderButton>
                    <HoverBorderButton.Button>Hover Target</HoverBorderButton.Button>
                </HoverBorderButton>,
            )

            const button = screen.getByRole('button')

            await user.hover(button)
            await user.unhover(button)

            expect(button).toBeInTheDocument()
        })
    })

    describe('Composition', () => {
        it('should allow multiple buttons in one provider', () => {
            render(
                <HoverBorderButton>
                    <HoverBorderButton.Button>Button 1</HoverBorderButton.Button>
                    <HoverBorderButton.Button>Button 2</HoverBorderButton.Button>
                </HoverBorderButton>,
            )

            expect(screen.getByText('Button 1')).toBeInTheDocument()
            expect(screen.getByText('Button 2')).toBeInTheDocument()
        })

        it('should allow custom compositions', () => {
            render(
                <HoverBorderButton>
                    <div className="flex gap-4">
                        <HoverBorderButton.Button>Left</HoverBorderButton.Button>
                        <HoverBorderButton.Link href="/right">Right</HoverBorderButton.Link>
                    </div>
                </HoverBorderButton>,
            )

            expect(screen.getByRole('button', { name: 'Left' })).toBeInTheDocument()
            expect(screen.getByRole('link', { name: 'Right' })).toBeInTheDocument()
        })
    })

    describe('Accessibility', () => {
        it('should have proper button role', () => {
            render(
                <HoverBorderButton>
                    <HoverBorderButton.Button>Accessible Button</HoverBorderButton.Button>
                </HoverBorderButton>,
            )

            expect(screen.getByRole('button')).toBeInTheDocument()
        })

        it('should have proper link role', () => {
            render(
                <HoverBorderButton>
                    <HoverBorderButton.Link href="/test">Accessible Link</HoverBorderButton.Link>
                </HoverBorderButton>,
            )

            expect(screen.getByRole('link')).toBeInTheDocument()
        })

        it('should support aria attributes on button', () => {
            render(
                <HoverBorderButton>
                    <HoverBorderButton.Button aria-label="Custom label" aria-describedby="description">
                        Button
                    </HoverBorderButton.Button>
                </HoverBorderButton>,
            )

            const button = screen.getByRole('button')
            expect(button).toHaveAttribute('aria-label', 'Custom label')
            expect(button).toHaveAttribute('aria-describedby', 'description')
        })

        it('should support aria attributes on link', () => {
            render(
                <HoverBorderButton>
                    <HoverBorderButton.Link href="/test" aria-label="External link" aria-current="page">
                        Link
                    </HoverBorderButton.Link>
                </HoverBorderButton>,
            )

            const link = screen.getByRole('link')
            expect(link).toHaveAttribute('aria-label', 'External link')
            expect(link).toHaveAttribute('aria-current', 'page')
        })
    })

    describe('TypeScript Types', () => {
        it('should accept all button props', () => {
            render(
                <HoverBorderButton>
                    <HoverBorderButton.Button type="submit" form="my-form" name="submit-button" value="submit">
                        Submit
                    </HoverBorderButton.Button>
                </HoverBorderButton>,
            )

            const button = screen.getByRole('button')
            expect(button).toHaveAttribute('type', 'submit')
            expect(button).toHaveAttribute('form', 'my-form')
        })

        it('should accept all anchor props', () => {
            render(
                <HoverBorderButton>
                    <HoverBorderButton.Link href="/test" download="file.pdf" hrefLang="en" type="application/pdf">
                        Download
                    </HoverBorderButton.Link>
                </HoverBorderButton>,
            )

            const link = screen.getByRole('link')
            expect(link).toHaveAttribute('download', 'file.pdf')
            expect(link).toHaveAttribute('hrefLang', 'en')
        })
    })
})
