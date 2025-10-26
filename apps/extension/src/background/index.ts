/**
 * Background Service Worker (MV3)
 *
 * Handles:
 * - Extension installation
 * - Default settings initialization
 * - Keep-alive for service worker
 * - Future: API calls, queue management, notifications
 */

console.log('[Ecomate Extension] Background service worker loaded');

/**
 * Handle extension installation
 */
chrome.runtime.onInstalled.addListener((details) => {
  console.log('[Ecomate Extension] Installed:', details.reason);

  if (details.reason === 'install') {
    // First time installation
    initializeDefaultSettings();
  } else if (details.reason === 'update') {
    // Extension updated
    console.log('[Ecomate Extension] Updated to version', chrome.runtime.getManifest().version);
  }
});

/**
 * Initialize default settings on first install
 */
async function initializeDefaultSettings() {
  const defaults = {
    apiUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    theme: 'light',
  };

  await chrome.storage.sync.set(defaults);
  console.log('[Ecomate Extension] Default settings initialized:', defaults);
}

/**
 * Handle messages from popup or content scripts
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[Ecomate Extension] Background received message:', message);

  // Future: Handle API calls, downloads, notifications here
  // For MVP, messages are handled directly by popup <-> content script

  return false; // Synchronous response
});

/**
 * Keep service worker alive
 * MV3 service workers can be terminated after inactivity
 */
let keepAliveInterval: number | null = null;

function keepAlive() {
  if (keepAliveInterval) return;

  keepAliveInterval = setInterval(() => {
    chrome.runtime.getPlatformInfo(() => {
      // This just keeps the worker alive
    });
  }, 20000); // Ping every 20 seconds
}

// Start keep-alive
keepAlive();

/**
 * Listen for service worker activation
 */
self.addEventListener('activate', () => {
  console.log('[Ecomate Extension] Service worker activated');
});

/**
 * Handle extension icon clicks (optional)
 */
chrome.action.onClicked.addListener((tab) => {
  console.log('[Ecomate Extension] Extension icon clicked on tab:', tab.id);
  // Popup will open automatically due to manifest.json configuration
});

/**
 * Monitor tab updates to check if user navigated to 1688
 * (Future: Could show badge or notification)
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    if (tab.url.includes('1688.com') && tab.url.includes('detail')) {
      console.log('[Ecomate Extension] User navigated to 1688 product page');
      // Future: Set badge, show notification, etc.
    }
  }
});

/**
 * Error handling
 */
self.addEventListener('error', (event) => {
  console.error('[Ecomate Extension] Service worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('[Ecomate Extension] Unhandled promise rejection:', event.reason);
});
