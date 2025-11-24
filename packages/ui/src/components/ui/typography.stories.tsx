import type { Meta, StoryObj } from '@storybook/react'
import { Typography } from './typography'

const meta = {
    title: 'Components/Typography',
    component: Typography,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Typography>

export default meta
type Story = StoryObj<typeof meta>

export const AllVariants: Story = {
    render: () => (
        <div className="space-y-8">
            <div>
                <h2 className="text-h6 leading-h6 mb-4 text-muted-foreground">Display Sizes</h2>
                <div className="space-y-2">
                    <Typography.Display size="lg">Display Large (72px)</Typography.Display>
                    <Typography.Display size="md">Display Medium (64px)</Typography.Display>
                    <Typography.Display size="sm">Display Small (56px)</Typography.Display>
                </div>
            </div>

            <div>
                <h2 className="text-h6 leading-h6 mb-4 text-muted-foreground">Headings</h2>
                <div className="space-y-2">
                    <Typography.H1>Heading 1 (48px)</Typography.H1>
                    <Typography.H2>Heading 2 (40px)</Typography.H2>
                    <Typography.H3>Heading 3 (32px)</Typography.H3>
                    <Typography.H4>Heading 4 (24px)</Typography.H4>
                    <Typography.H5>Heading 5 (20px)</Typography.H5>
                    <Typography.H6>Heading 6 (16px)</Typography.H6>
                </div>
            </div>

            <div>
                <h2 className="text-h6 leading-h6 mb-4 text-muted-foreground">Body Text</h2>
                <div className="space-y-2">
                    <Typography.Text size="lg">Body Large (20px) - Lorem ipsum dolor sit amet.</Typography.Text>
                    <Typography.Text>Body Base (16px) - Lorem ipsum dolor sit amet.</Typography.Text>
                    <Typography.Text size="sm">Body Small (14px) - Lorem ipsum dolor sit amet.</Typography.Text>
                </div>
            </div>

            <div>
                <h2 className="text-h6 leading-h6 mb-4 text-muted-foreground">UI Elements</h2>
                <div className="space-y-2">
                    <Typography.Label>Label Text (14px)</Typography.Label>
                    <Typography.Caption>Caption Text (12px)</Typography.Caption>
                    <Typography.Overline>Overline Text (12px)</Typography.Overline>
                </div>
            </div>
        </div>
    ),
}

export const DisplayVariants: Story = {
    render: () => (
        <div className="space-y-6">
            <Typography.Display size="lg" className="text-emerald-600">
                Display Large Heading
            </Typography.Display>
            <Typography.Display size="md" className="text-slate-700">
                Display Medium Heading
            </Typography.Display>
            <Typography.Display size="sm" className="text-slate-600">
                Display Small Heading
            </Typography.Display>
        </div>
    ),
}

export const HeadingHierarchy: Story = {
    render: () => (
        <article className="max-w-3xl">
            <Typography.H1 className="mb-4">The Power of 8-Point Grid System</Typography.H1>
            <Typography.Text className="mb-6 text-muted-foreground">
                Understanding how typography scales create visual harmony and improve readability across your
                interface.
            </Typography.Text>

            <Typography.H2 className="mb-3 mt-8">What is the 8-Point Grid?</Typography.H2>
            <Typography.Text className="mb-4">
                The 8-point grid system is a design methodology that uses increments of 8 pixels for sizing and spacing
                elements. This creates consistency and rhythm in your designs.
            </Typography.Text>

            <Typography.H3 className="mb-3 mt-6">Benefits of Using 8pt Grid</Typography.H3>
            <Typography.Text className="mb-4">
                By aligning typography to an 8-point grid, you ensure that all text sizes work harmoniously together
                and maintain proper vertical rhythm.
            </Typography.Text>

            <Typography.H4 className="mb-2 mt-4">Technical Implementation</Typography.H4>
            <Typography.Text size="sm" className="text-muted-foreground">
                Font sizes: 12px, 16px, 24px, 32px, 40px, 48px, 56px, 64px, 72px
            </Typography.Text>
        </article>
    ),
}

export const TextAlignment: Story = {
    render: () => (
        <div className="space-y-4 max-w-2xl">
            <Typography.H4 align="left">Left Aligned (Default)</Typography.H4>
            <Typography.Text align="left">
                This text is aligned to the left. This is the default alignment for most text content.
            </Typography.Text>

            <Typography.H4 align="center" className="mt-6">
                Center Aligned
            </Typography.H4>
            <Typography.Text align="center">
                This text is centered. Perfect for headings, call-to-actions, or emphasized content.
            </Typography.Text>

            <Typography.H4 align="right" className="mt-6">
                Right Aligned
            </Typography.H4>
            <Typography.Text align="right">
                This text is aligned to the right. Useful for certain design layouts or RTL languages.
            </Typography.Text>

            <Typography.H4 align="justify" className="mt-6">
                Justified Text
            </Typography.H4>
            <Typography.Text align="justify">
                This text is justified, meaning it stretches to fill the full width of the container. This creates a
                clean, block-like appearance but should be used carefully as it can create uneven spacing.
            </Typography.Text>
        </div>
    ),
}

export const WithColors: Story = {
    render: () => (
        <div className="space-y-4">
            <Typography.H2 className="text-emerald-600">Success Message</Typography.H2>
            <Typography.Text className="text-emerald-700">Your changes have been saved successfully.</Typography.Text>

            <Typography.H2 className="text-red-600 mt-6">Error Message</Typography.H2>
            <Typography.Text className="text-red-700">Something went wrong. Please try again.</Typography.Text>

            <Typography.H2 className="text-blue-600 mt-6">Information</Typography.H2>
            <Typography.Text className="text-blue-700">Did you know? You can customize the color scheme.</Typography.Text>

            <Typography.H2 className="text-muted-foreground mt-6">Muted Content</Typography.H2>
            <Typography.Text className="text-muted-foreground">
                This is secondary content with reduced emphasis.
            </Typography.Text>
        </div>
    ),
}

export const ResponsiveText: Story = {
    render: () => (
        <div className="space-y-6">
            <Typography.Display as="h1" size="lg" className="md:text-display-md sm:text-h1">
                Responsive Display
            </Typography.Display>
            <Typography.Text className="text-body-sm md:text-body lg:text-body-lg">
                This text scales from small to large based on screen size. The typography system supports responsive
                design patterns out of the box.
            </Typography.Text>
        </div>
    ),
}

export const LabelsAndCaptions: Story = {
    render: () => (
        <div className="space-y-6">
            <div className="space-y-2">
                <Typography.Label htmlFor="email" className="block font-medium">
                    Email Address
                </Typography.Label>
                <input
                    id="email"
                    type="email"
                    className="w-full px-4 py-2 border border-border rounded-lg"
                    placeholder="you@example.com"
                />
                <Typography.Caption className="text-muted-foreground">
                    We'll never share your email with anyone else.
                </Typography.Caption>
            </div>

            <div className="space-y-2">
                <Typography.Label htmlFor="password" className="block font-medium">
                    Password
                </Typography.Label>
                <input
                    id="password"
                    type="password"
                    className="w-full px-4 py-2 border border-border rounded-lg"
                    placeholder="••••••••"
                />
                <Typography.Caption className="text-muted-foreground">
                    Must be at least 8 characters long.
                </Typography.Caption>
            </div>
        </div>
    ),
}

export const OverlineUsage: Story = {
    render: () => (
        <div className="space-y-8">
            <div>
                <Typography.Overline className="text-emerald-600 font-semibold mb-2">New Feature</Typography.Overline>
                <Typography.H3>Enhanced Typography System</Typography.H3>
                <Typography.Text className="mt-2 text-muted-foreground">
                    A complete 8-point grid typography system for consistent design.
                </Typography.Text>
            </div>

            <div>
                <Typography.Overline className="text-blue-600 font-semibold mb-2">Blog Post</Typography.Overline>
                <Typography.H3>Understanding Design Systems</Typography.H3>
                <Typography.Text className="mt-2 text-muted-foreground">
                    Learn how to build scalable and maintainable design systems.
                </Typography.Text>
            </div>
        </div>
    ),
}

export const CustomElements: Story = {
    render: () => (
        <div className="space-y-4">
            <Typography.Text as="div" className="p-4 bg-emerald-50 rounded-lg">
                This is a div element styled as body text
            </Typography.Text>

            <Typography.Heading level={2} className="block text-blue-600">
                This is a span styled as H2
            </Typography.Heading>

            <Typography.Display as="p" size="sm" className="text-slate-700">
                This is a paragraph styled as Display Small
            </Typography.Display>
        </div>
    ),
}

export const DarkMode: Story = {
    parameters: {
        backgrounds: { default: 'dark' },
    },
    render: () => (
        <div className="dark p-8 bg-slate-900 rounded-lg">
            <Typography.H1 className="text-white mb-4">Dark Mode Typography</Typography.H1>
            <Typography.Text className="text-slate-300 mb-4">
                All typography components work seamlessly in dark mode with proper color adjustments.
            </Typography.Text>
            <Typography.Caption className="text-slate-400">
                This caption text has reduced opacity for hierarchy.
            </Typography.Caption>
        </div>
    ),
}

export const RealWorldExample: Story = {
    render: () => (
        <article className="max-w-4xl mx-auto p-8">
            <Typography.Overline className="text-emerald-600 font-semibold mb-3">
                Product Announcement
            </Typography.Overline>
            <Typography.Display size="md" className="mb-4">
                Introducing the New Typography System
            </Typography.Display>
            <Typography.Text size="lg" className="text-muted-foreground mb-8">
                A complete 8-point grid typography system designed for modern web applications
            </Typography.Text>

            <div className="flex items-center gap-4 mb-8 text-caption text-muted-foreground">
                <span>By Design Team</span>
                <span>•</span>
                <span>5 min read</span>
                <span>•</span>
                <span>Nov 24, 2024</span>
            </div>

            <div className="prose max-w-none space-y-6">
                <Typography.Text>
                    We're excited to announce our new typography system built on the 8-point grid methodology. This
                    system ensures consistent, harmonious text across all your interfaces.
                </Typography.Text>

                <Typography.H2 className="mt-8 mb-4">Key Features</Typography.H2>

                <Typography.Text>
                    The typography system includes display sizes, six heading levels, three body text sizes, and
                    specialized variants for UI elements like labels, captions, and buttons.
                </Typography.Text>

                <Typography.H3 className="mt-6 mb-3">Built for Scale</Typography.H3>

                <Typography.Text>
                    Every font size is carefully calculated to align with the 8-point grid, ensuring vertical rhythm
                    and visual consistency throughout your application.
                </Typography.Text>

                <div className="bg-slate-50 p-6 rounded-lg my-6">
                    <Typography.Caption className="text-muted-foreground block mb-2">Pro Tip</Typography.Caption>
                    <Typography.Text size="sm">
                        Use the compound component pattern for cleaner, more maintainable code: Typography.H1,
                        Typography.Text, etc.
                    </Typography.Text>
                </div>
            </div>
        </article>
    ),
}

export const Playground: Story = {
    args: {},
    render: () => (
        <div className="p-8">
            <Typography.H2 className="mb-4">Typography Playground</Typography.H2>
            <Typography.Text>Experiment with different typography variants and styles.</Typography.Text>
        </div>
    ),
}
