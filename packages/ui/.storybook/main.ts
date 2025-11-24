import type { StorybookConfig } from '@storybook/react-vite'
import path from 'path'

const config: StorybookConfig = {
    framework: '@storybook/react-vite',
    stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: ['@storybook/addon-essentials', '@storybook/addon-themes', '@storybook/addon-a11y'],
    typescript: {
        reactDocgen: 'react-docgen',
        check: false,
    },
    async viteFinal(config) {
        return {
            ...config,
            resolve: {
                ...config.resolve,
                alias: {
                    ...config.resolve?.alias,
                    '@workspace/lib': path.resolve(__dirname, '../../lib/src'),
                },
            },
            optimizeDeps: {
                ...config.optimizeDeps,
                include: [...(config.optimizeDeps?.include || []), 'framer-motion', 'react', 'react-dom'],
            },
        }
    },
}

export default config
