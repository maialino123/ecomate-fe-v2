import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html', 'lcov'],
            exclude: [
                'node_modules/',
                'src/test/',
                '**/*.d.ts',
                '**/*.config.*',
                '**/mockData',
                '**/*.test.{ts,tsx}',
                '**/*.spec.{ts,tsx}',
            ],
            // Apply thresholds only to tested components
            // This allows gradual adoption of testing without blocking development
            include: ['src/components/ui/hover-border-button/**/*.{ts,tsx}'],
            thresholds: {
                lines: 75,
                functions: 80,
                branches: 80,
                statements: 75,
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})
