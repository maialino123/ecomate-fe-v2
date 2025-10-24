/**
 * Extract Store
 * Manages product extraction state
 */

import { create } from 'zustand';
import type { Product1688 } from '@workspace/lib';
import { normalize1688Product } from '@workspace/lib';
import type { ExtractProductResponse } from '../../shared/types/messages';
import { toast } from 'sonner';

interface ExtractState {
  loading: boolean;
  data: Product1688 | null;
  error: string | null;

  // Actions
  extract: () => Promise<void>;
  clear: () => void;
  clearError: () => void;
}

export const useExtractStore = create<ExtractState>((set) => ({
  loading: false,
  data: null,
  error: null,

  extract: async () => {
    set({ loading: true, error: null });

    try {
      // Get active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab || !tab.id) {
        throw new Error('No active tab found');
      }

      if (!tab.url || !tab.url.includes('1688.com')) {
        const errorMsg = 'Please navigate to a 1688.com product page first';
        toast.error('Invalid Page', { description: errorMsg });
        throw new Error(errorMsg);
      }

      // Send message to content script
      const response: ExtractProductResponse = await chrome.tabs.sendMessage(
        tab.id,
        { type: 'EXTRACT_PRODUCT' }
      );

      if (!response.success) {
        throw new Error(response.error || 'Extraction failed');
      }

      if (!response.data) {
        throw new Error('No data received from content script');
      }

      // Normalize data using @workspace/lib
      const normalized = normalize1688Product(
        response.data.rawData,
        response.data.url
      );

      set({ data: normalized, loading: false });

      // Show success toast
      toast.success('Product Extracted', {
        description: 'Product data extracted successfully',
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to extract product data';

      set({
        error: errorMessage,
        loading: false,
      });

      // Show error toast (only if not already shown)
      if (error instanceof Error && !error.message.includes('1688.com')) {
        toast.error('Extraction Failed', {
          description: errorMessage,
        });
      }

      throw error;
    }
  },

  clear: () => {
    set({ data: null, error: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
