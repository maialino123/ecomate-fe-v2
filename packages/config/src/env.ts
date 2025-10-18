/**
 * Environment configuration
 * Centralized environment variables management
 */

export const env = {
  // API Configuration
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',

  // App Configuration
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Ecomate',
  APP_ENV: process.env.NODE_ENV || 'development',

  // Feature Flags
  ENABLE_DEVTOOLS: process.env.NEXT_PUBLIC_ENABLE_DEVTOOLS === 'true',
} as const

export type Env = typeof env
