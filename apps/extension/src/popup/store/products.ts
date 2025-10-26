/**
 * Products Store
 * Manages product count and list state
 */

import { create } from 'zustand';
import { getApi } from '../../shared/api-client';

interface ProductsState {
  count: number;
  loading: boolean;
  initialized: boolean;

  // Actions
  fetchCount: () => Promise<void>;
  incrementCount: () => void;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  count: 0,
  loading: false,
  initialized: false,

  fetchCount: async () => {
    set({ loading: true });

    try {
      const api = await getApi();
      const response = await api.product1688.list({ page: 1, limit: 1 });

      set({
        count: response.total || 0,
        loading: false,
        initialized: true,
      });
    } catch (error) {
      console.error('Failed to fetch product count:', error);
      set({ loading: false, initialized: true });
    }
  },

  incrementCount: () => {
    set(state => ({ count: state.count + 1 }));
  },
}));
