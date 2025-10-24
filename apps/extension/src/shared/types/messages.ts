/**
 * Chrome extension message types for communication between
 * popup, content script, and background service worker
 */

import type { Product1688, Raw1688Data } from '@workspace/lib';

/**
 * Message sent from popup to content script to extract product data
 */
export interface ExtractProductMessage {
  type: 'EXTRACT_PRODUCT';
}

/**
 * Response from content script after extraction
 */
export interface ExtractProductResponse {
  success: boolean;
  data?: {
    rawData: Raw1688Data;
    url: string;
  };
  error?: string;
}

/**
 * Union type of all message types
 */
export type ChromeMessage = ExtractProductMessage;

/**
 * Type guard to check if message is ExtractProductMessage
 */
export function isExtractProductMessage(
  message: any
): message is ExtractProductMessage {
  return message?.type === 'EXTRACT_PRODUCT';
}
