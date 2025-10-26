/**
 * Extension API Client
 * Singleton API client instance with token management
 */

import { Api, createApiClient } from '@workspace/lib';
import {
  getConfig,
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
} from './storage';

let apiInstance: Api | null = null;
let cachedAccessToken: string | null = null;
let cachedRefreshToken: string | null = null;

/**
 * Load tokens from storage into memory cache
 */
async function loadTokensIntoCache(): Promise<void> {
  cachedAccessToken = await getAccessToken();
  cachedRefreshToken = await getRefreshToken();
}

/**
 * Initialize API client with current config
 */
export async function initializeApi(): Promise<Api> {
  // Load tokens into cache first
  await loadTokensIntoCache();

  const config = await getConfig();

  const axiosClient = createApiClient({
    baseURL: config.apiUrl,
    getAccessToken: () => cachedAccessToken,
    getRefreshToken: () => cachedRefreshToken,
    onTokenRefresh: tokens => {
      console.log('[API Client] Tokens refreshed, saving to storage');

      // Update cache
      cachedAccessToken = tokens.accessToken;
      cachedRefreshToken = tokens.refreshToken;

      // Save to storage
      saveTokens(tokens);
    },
    onUnauthorized: () => {
      console.log('[API Client] Unauthorized, clearing tokens');

      // Clear cache
      cachedAccessToken = null;
      cachedRefreshToken = null;

      // Clear storage
      clearTokens();

      // Notify popup (if open)
      chrome.runtime.sendMessage({ type: 'UNAUTHORIZED' }).catch(() => {
        // Popup might not be open, ignore error
      });
    },
  });

  apiInstance = new Api(axiosClient);
  return apiInstance;
}

/**
 * Get API client instance
 * Initializes if not already initialized
 */
export async function getApi(): Promise<Api> {
  if (!apiInstance) {
    return initializeApi();
  }
  return apiInstance;
}

/**
 * Reset API client (useful when API URL changes or on logout)
 */
export async function resetApi(): Promise<void> {
  apiInstance = null;
  cachedAccessToken = null;
  cachedRefreshToken = null;
}

/**
 * Update cached tokens after login
 */
export function updateCachedTokens(accessToken: string, refreshToken: string): void {
  cachedAccessToken = accessToken;
  cachedRefreshToken = refreshToken;
}
