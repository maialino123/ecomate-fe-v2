export const APP_CONSTANTS = {
  THEME: {
    LIGHT: 'light',
    DARK: 'dark',
  },

  QUERY_STALE_TIME: 1000 * 60,
  QUERY_RETRY_COUNT: 1,
} as const

export type AppConstants = typeof APP_CONSTANTS
