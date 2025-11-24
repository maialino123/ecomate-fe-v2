import type { Meta, StoryObj } from '@storybook/react'
import { HoverBorderButton } from './hover-border-button'

const meta = {
    title: 'Components/HoverBorderButton',
    component: HoverBorderButton,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        borderColor: {
            control: 'color',
            description: 'Color of the hover border effect (supports rgba, hex, etc.)',
        },
        borderWidth: {
            control: 'text',
            description: 'Width of the border in CSS units',
        },
        glowIntensity: {
            control: { type: 'range', min: 0, max: 1, step: 0.1 },
            description: 'Intensity of the glow effect (0-1)',
        },
        animationDuration: {
            control: { type: 'number', min: 0.1, max: 2, step: 0.1 },
            description: 'Duration of the animation in seconds',
        },
    },
} satisfies Meta<typeof HoverBorderButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        borderColor: 'rgba(16, 185, 129, 0.8)',
        borderWidth: '2px',
        glowIntensity: 0.7,
        animationDuration: 0.3,
    },
    render: (args) => (
        <HoverBorderButton {...args}>
            <HoverBorderButton.Button className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
                Hover me
            </HoverBorderButton.Button>
        </HoverBorderButton>
    ),
}

export const ButtonPrimary: Story = {
    args: {
        borderColor: 'rgba(16, 185, 129, 0.8)',
        glowIntensity: 0.7,
    },
    render: (args) => (
        <HoverBorderButton {...args}>
            <HoverBorderButton.Button className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 hover:scale-105 transition-all">
                Click me
            </HoverBorderButton.Button>
        </HoverBorderButton>
    ),
}

export const ButtonSecondary: Story = {
    args: {
        borderColor: 'rgba(15, 23, 42, 0.6)',
        glowIntensity: 0.5,
    },
    render: (args) => (
        <HoverBorderButton {...args}>
            <HoverBorderButton.Button className="px-8 py-4 bg-slate-900/8 text-slate-900 rounded-xl font-semibold border border-slate-900/20 hover:bg-slate-900/15 transition-colors">
                Secondary Button
            </HoverBorderButton.Button>
        </HoverBorderButton>
    ),
}

export const LinkVariant: Story = {
    args: {
        borderColor: 'rgba(59, 130, 246, 0.7)',
        glowIntensity: 0.6,
    },
    render: (args) => (
        <HoverBorderButton {...args}>
            <HoverBorderButton.Link
                href="https://example.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors inline-block"
            >
                Visit Website
            </HoverBorderButton.Link>
        </HoverBorderButton>
    ),
}

export const FrameVariant: Story = {
    args: {
        borderColor: 'rgba(168, 85, 247, 0.7)',
        glowIntensity: 0.6,
    },
    render: (args) => (
        <HoverBorderButton {...args}>
            <HoverBorderButton.Frame className="px-12 py-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl">
                <div className="text-center">
                    <div className="text-2xl font-bold mb-2">Custom Frame</div>
                    <div className="text-sm opacity-90">This is a div container with hover effects</div>
                </div>
            </HoverBorderButton.Frame>
        </HoverBorderButton>
    ),
}

export const DisabledButton: Story = {
    args: {
        borderColor: 'rgba(16, 185, 129, 0.8)',
        glowIntensity: 0.7,
    },
    render: (args) => (
        <HoverBorderButton {...args}>
            <HoverBorderButton.Button disabled className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-semibold">
                Disabled Button
            </HoverBorderButton.Button>
        </HoverBorderButton>
    ),
}

export const CustomColors: Story = {
    args: {
        borderColor: 'rgba(239, 68, 68, 0.8)',
        borderWidth: '3px',
        glowIntensity: 0.8,
        animationDuration: 0.5,
    },
    render: (args) => (
        <HoverBorderButton {...args}>
            <HoverBorderButton.Button className="px-8 py-4 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors">
                Red Border Effect
            </HoverBorderButton.Button>
        </HoverBorderButton>
    ),
}

export const GlowIntensities: Story = {
    render: () => (
        <div className="flex gap-4">
            <HoverBorderButton borderColor="rgba(16, 185, 129, 0.8)" glowIntensity={0.3}>
                <HoverBorderButton.Button className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium">
                    Low (0.3)
                </HoverBorderButton.Button>
            </HoverBorderButton>
            <HoverBorderButton borderColor="rgba(16, 185, 129, 0.8)" glowIntensity={0.6}>
                <HoverBorderButton.Button className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium">
                    Medium (0.6)
                </HoverBorderButton.Button>
            </HoverBorderButton>
            <HoverBorderButton borderColor="rgba(16, 185, 129, 0.8)" glowIntensity={0.9}>
                <HoverBorderButton.Button className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium">
                    High (0.9)
                </HoverBorderButton.Button>
            </HoverBorderButton>
        </div>
    ),
}

export const AnimationSpeeds: Story = {
    render: () => (
        <div className="flex gap-4">
            <HoverBorderButton borderColor="rgba(59, 130, 246, 0.8)" animationDuration={0.1}>
                <HoverBorderButton.Button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium">
                    Fast (0.1s)
                </HoverBorderButton.Button>
            </HoverBorderButton>
            <HoverBorderButton borderColor="rgba(59, 130, 246, 0.8)" animationDuration={0.5}>
                <HoverBorderButton.Button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium">
                    Normal (0.5s)
                </HoverBorderButton.Button>
            </HoverBorderButton>
            <HoverBorderButton borderColor="rgba(59, 130, 246, 0.8)" animationDuration={1.0}>
                <HoverBorderButton.Button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium">
                    Slow (1.0s)
                </HoverBorderButton.Button>
            </HoverBorderButton>
        </div>
    ),
}

export const MultipleButtons: Story = {
    render: () => (
        <HoverBorderButton borderColor="rgba(16, 185, 129, 0.8)" glowIntensity={0.7}>
            <div className="flex gap-4">
                <HoverBorderButton.Button className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700">
                    Button 1
                </HoverBorderButton.Button>
                <HoverBorderButton.Button className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700">
                    Button 2
                </HoverBorderButton.Button>
                <HoverBorderButton.Link
                    href="#"
                    className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 inline-block"
                >
                    Link
                </HoverBorderButton.Link>
            </div>
        </HoverBorderButton>
    ),
}

export const GradientButtons: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <HoverBorderButton borderColor="rgba(168, 85, 247, 0.8)" glowIntensity={0.7}>
                <HoverBorderButton.Button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all">
                    Purple to Pink
                </HoverBorderButton.Button>
            </HoverBorderButton>
            <HoverBorderButton borderColor="rgba(59, 130, 246, 0.8)" glowIntensity={0.7}>
                <HoverBorderButton.Button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all">
                    Blue to Cyan
                </HoverBorderButton.Button>
            </HoverBorderButton>
            <HoverBorderButton borderColor="rgba(245, 158, 11, 0.8)" glowIntensity={0.7}>
                <HoverBorderButton.Button className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all">
                    Orange to Red
                </HoverBorderButton.Button>
            </HoverBorderButton>
        </div>
    ),
}

export const DarkMode: Story = {
    parameters: {
        backgrounds: { default: 'dark' },
    },
    render: () => (
        <div className="dark">
            <HoverBorderButton borderColor="rgba(16, 185, 129, 0.8)" glowIntensity={0.8}>
                <HoverBorderButton.Button className="px-8 py-4 bg-emerald-600/20 text-emerald-400 rounded-xl font-semibold border border-emerald-500/30 hover:bg-emerald-600/30 transition-colors">
                    Dark Mode Button
                </HoverBorderButton.Button>
            </HoverBorderButton>
        </div>
    ),
}

export const Playground: Story = {
    args: {
        borderColor: 'rgba(16, 185, 129, 0.8)',
        borderWidth: '2px',
        glowIntensity: 0.7,
        animationDuration: 0.3,
    },
    render: (args) => (
        <HoverBorderButton {...args}>
            <HoverBorderButton.Button className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
                Experiment with controls
            </HoverBorderButton.Button>
        </HoverBorderButton>
    ),
}
