/**
 * Application constants
 * Shared constants across all apps
 */

export const APP_CONSTANTS = {
  // Theme
  THEME: {
    LIGHT: 'light',
    DARK: 'dark',
  },

  // Query
  QUERY_STALE_TIME: 1000 * 60, // 1 minute
  QUERY_RETRY_COUNT: 1,
} as const

export type AppConstants = typeof APP_CONSTANTS
