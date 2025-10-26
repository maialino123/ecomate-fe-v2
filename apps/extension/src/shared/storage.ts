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
 * Save authentication tokens to chrome.storage.session
 * Session storage is cleared when browser is closed (for "Remember me" = false)
 */
export async function saveTokensSession(tokens: AuthTokens): Promise<void> {
  await chrome.storage.session.set({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
}

/**
 * Save authentication tokens to chrome.storage.local
 * Local storage persists across browser restarts (for "Remember me" = true)
 */
export async function saveTokensPersistent(tokens: AuthTokens): Promise<void> {
  await chrome.storage.local.set({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
}

/**
 * Save authentication tokens based on remember me preference
 * @deprecated Use saveTokensSession or saveTokensPersistent directly
 */
export async function saveTokens(tokens: AuthTokens): Promise<void> {
  await saveTokensPersistent(tokens);
}

/**
 * Get access token from storage
 * Checks both session and local storage (session takes priority)
 */
export async function getAccessToken(): Promise<string | null> {
  // Check session storage first (for non-persistent logins)
  const sessionResult = await chrome.storage.session.get(['accessToken']);
  if (sessionResult.accessToken) {
    return sessionResult.accessToken;
  }

  // Fall back to local storage (for persistent logins)
  const localResult = await chrome.storage.local.get(['accessToken']);
  return localResult.accessToken || null;
}

/**
 * Get refresh token from storage
 * Checks both session and local storage (session takes priority)
 */
export async function getRefreshToken(): Promise<string | null> {
  // Check session storage first
  const sessionResult = await chrome.storage.session.get(['refreshToken']);
  if (sessionResult.refreshToken) {
    return sessionResult.refreshToken;
  }

  // Fall back to local storage
  const localResult = await chrome.storage.local.get(['refreshToken']);
  return localResult.refreshToken || null;
}

/**
 * Clear all authentication tokens from both session and local storage
 */
export async function clearTokens(): Promise<void> {
  await Promise.all([
    chrome.storage.session.remove(['accessToken', 'refreshToken', 'userInfo']),
    chrome.storage.local.remove(['accessToken', 'refreshToken', 'userInfo']),
  ]);
}

/**
 * Check if user is authenticated (has access token)
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getAccessToken();
  return !!token;
}

/**
 * Save user info to session storage (non-persistent)
 */
export async function saveUserInfoSession(user: UserInfo): Promise<void> {
  await chrome.storage.session.set({ userInfo: user });
}

/**
 * Save user info to local storage (persistent)
 */
export async function saveUserInfoPersistent(user: UserInfo): Promise<void> {
  await chrome.storage.local.set({ userInfo: user });
}

/**
 * Save user info to storage
 * @deprecated Use saveUserInfoSession or saveUserInfoPersistent directly
 */
export async function saveUserInfo(user: UserInfo): Promise<void> {
  await saveUserInfoPersistent(user);
}

/**
 * Get user info from storage
 * Checks both session and local storage (session takes priority)
 */
export async function getUserInfo(): Promise<UserInfo | null> {
  // Check session storage first
  const sessionResult = await chrome.storage.session.get(['userInfo']);
  if (sessionResult.userInfo) {
    return sessionResult.userInfo;
  }

  // Fall back to local storage
  const localResult = await chrome.storage.local.get(['userInfo']);
  return localResult.userInfo || null;
}
