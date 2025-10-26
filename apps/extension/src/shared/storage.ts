/**
 * Chrome Storage Helper Functions
 * Provides typed wrappers around chrome.storage APIs
 */

export interface StorageConfig {
  apiUrl: string;
  autoTranslate?: boolean;
  autoApprove?: boolean;
  defaultCategory?: string;
  enableNotifications?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserInfo {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
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
  const result = await chrome.storage.sync.get([
    'apiUrl',
    'autoTranslate',
    'autoApprove',
    'defaultCategory',
    'enableNotifications',
  ]);
  return {
    apiUrl: result.apiUrl || getDefaultApiUrl(),
    autoTranslate: result.autoTranslate ?? false,
    autoApprove: result.autoApprove ?? false,
    defaultCategory: result.defaultCategory,
    enableNotifications: result.enableNotifications ?? true,
  };
}

/**
 * Save config to chrome.storage.sync
 */
export async function saveConfig(config: Partial<StorageConfig>): Promise<void> {
  await chrome.storage.sync.set(config);
}

// ============================================================================
// Auth Token Management
// ============================================================================

/**
 * Save authentication tokens to chrome.storage.local
 * Use local storage for tokens (more storage space, not synced)
 */
export async function saveTokens(tokens: AuthTokens): Promise<void> {
  await chrome.storage.local.set({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
}

/**
 * Get access token from storage
 */
export async function getAccessToken(): Promise<string | null> {
  const result = await chrome.storage.local.get(['accessToken']);
  return result.accessToken || null;
}

/**
 * Get refresh token from storage
 */
export async function getRefreshToken(): Promise<string | null> {
  const result = await chrome.storage.local.get(['refreshToken']);
  return result.refreshToken || null;
}

/**
 * Clear all authentication tokens
 */
export async function clearTokens(): Promise<void> {
  await chrome.storage.local.remove(['accessToken', 'refreshToken', 'userInfo']);
}

/**
 * Check if user is authenticated (has access token)
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getAccessToken();
  return !!token;
}

/**
 * Save user info to storage
 */
export async function saveUserInfo(user: UserInfo): Promise<void> {
  await chrome.storage.local.set({ userInfo: user });
}

/**
 * Get user info from storage
 */
export async function getUserInfo(): Promise<UserInfo | null> {
  const result = await chrome.storage.local.get(['userInfo']);
  return result.userInfo || null;
}
