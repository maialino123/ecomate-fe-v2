/**
 * Chrome Storage Helper Functions
 * Provides typed wrappers around chrome.storage APIs
 */

export interface StorageConfig {
  apiUrl: string;
}

/**
 * Get default API URL from environment variables
 */
function getDefaultApiUrl(): string {
  // Vite exposes env vars as import.meta.env.VITE_*
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
}

/**
 * Get config from chrome.storage.sync
 * Falls back to environment variable if not set by user
 */
export async function getConfig(): Promise<StorageConfig> {
  const result = await chrome.storage.sync.get(['apiUrl']);
  return {
    apiUrl: result.apiUrl || getDefaultApiUrl(),
  };
}

/**
 * Save config to chrome.storage.sync
 */
export async function saveConfig(config: Partial<StorageConfig>): Promise<void> {
  await chrome.storage.sync.set(config);
}
