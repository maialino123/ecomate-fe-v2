import js from '@eslint/js'
import pluginNext from '@next/eslint-plugin-next'
import eslintConfigPrettier from 'eslint-config-prettier'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

import { config as baseConfig } from './base.js'
import compositionPatternsPlugin from './rules/composition-patterns.js'

/**
 * A custom ESLint configuration for libraries that use Next.js.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const nextJsConfig = [
    ...baseConfig,
    js.configs.recommended,
    eslintConfigPrettier,
    ...tseslint.configs.recommended,
    {
        ...pluginReact.configs.flat.recommended,
        languageOptions: {
            ...pluginReact.configs.flat.recommended.languageOptions,
            globals: {
                ...globals.serviceworker,
            },
        },
    },
    {
        plugins: {
            '@next/next': pluginNext,
        },
        rules: {
            ...pluginNext.configs.recommended.rules,
            ...pluginNext.configs['core-web-vitals'].rules,
            '@typescript-eslint/no-explicit-any': 'off',
            '@next/next/no-img-element': 'off',
        },
    },
    {
        plugins: {
            'react-hooks': pluginReactHooks,
        },
        settings: { react: { version: 'detect' } },
        rules: {
            ...pluginReactHooks.configs.recommended.rules,
            // React scope no longer necessary with new JSX transform.
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
        },
    },
    {
        plugins: {
            'composition-patterns': compositionPatternsPlugin,
        },
        rules: {
            // Composition Pattern Rules
            // Warning for existing code, error for new code (configure per project)
            'composition-patterns/no-excessive-boolean-props': ['warn', { max: 2 }],
            'composition-patterns/prefer-object-mapping': 'off', // Enable per project if desired
            'composition-patterns/no-boolean-component-selection': 'off', // Enable per project if desired
        },
    },
]
