/**
 * Content Script - Main Entry Point
 *
 * This script runs on all 1688.com pages and handles:
 * - Listening for extraction requests from popup
 * - Extracting product data from page
 * - Sending data back to popup
 */

import { extractProductData, getPageInfo } from './extractors/json-extractor';
import type {
  ChromeMessage,
  ExtractProductResponse,
  isExtractProductMessage,
} from '../shared/types/messages';

console.log('[Ecomate Extension] Content script loaded on', window.location.href);

/**
 * Listen for messages from popup or background script
 */
chrome.runtime.onMessage.addListener(
  (
    message: ChromeMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: ExtractProductResponse) => void
  ) => {
    console.log('[Ecomate Extension] Received message:', message);

    if (message.type === 'EXTRACT_PRODUCT') {
      handleExtractProduct()
        .then((response) => {
          console.log('[Ecomate Extension] Extraction successful');
          sendResponse(response);
        })
        .catch((error) => {
          console.error('[Ecomate Extension] Extraction failed:', error);
          sendResponse({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
          });
        });

      // Return true to indicate we'll send response asynchronously
      return true;
    }

    return false;
  }
);

/**
 * Handle product extraction request
 */
async function handleExtractProduct(): Promise<ExtractProductResponse> {
  const pageInfo = getPageInfo();

  // Validate we're on a 1688 product detail page
  if (!pageInfo.isDetailPage) {
    throw new Error(
      'This does not appear to be a 1688 product detail page. ' +
      'Please navigate to a product page (e.g., https://detail.1688.com/offer/...)'
    );
  }

  // Extract raw data from page
  const rawData = extractProductData();

  return {
    success: true,
    data: {
      rawData,
      url: pageInfo.url,
    },
  };
}

/**
 * Optional: Add visual indicator when extension is ready
 */
function addReadyIndicator() {
  // Only add if on detail page
  const pageInfo = getPageInfo();
  if (!pageInfo.isDetailPage) return;

  // Create subtle indicator
  const indicator = document.createElement('div');
  indicator.id = 'ecomate-extension-ready';
  indicator.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, oklch(54.6% 0.245 262.881), oklch(48.8% 0.243 264.376));
    color: white;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 12px;
    font-family: sans-serif;
    z-index: 999999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  `;
  indicator.textContent = '🌿 Ecomate Ready';

  document.body.appendChild(indicator);

  // Fade in
  setTimeout(() => {
    indicator.style.opacity = '1';
  }, 100);

  // Fade out after 2 seconds
  setTimeout(() => {
    indicator.style.opacity = '0';
    setTimeout(() => indicator.remove(), 300);
  }, 2000);
}

// Show ready indicator when page loads
if (document.readyState === 'complete') {
  addReadyIndicator();
} else {
  window.addEventListener('load', addReadyIndicator);
}
