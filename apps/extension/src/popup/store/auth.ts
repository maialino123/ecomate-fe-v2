/**
 * Auth Store
 * Manages authentication state and actions
 */

import { create } from 'zustand';
import type { User } from '@workspace/lib';
import { getApi, resetApi, updateCachedTokens } from '../../shared/api-client';
import {
  saveTokensSession,
  saveTokensPersistent,
  saveUserInfoSession,
  saveUserInfoPersistent,
  clearTokens,
  getUserInfo,
  isAuthenticated as checkAuthStatus,
} from '../../shared/storage';
import { toast } from 'sonner';

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;

  // Actions
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  initialized: false,

  login: async (email, password, rememberMe) => {
    set({ loading: true });

    try {
      const api = await getApi();
      const response = await api.auth.signIn({ email, password });

      // Handle 2FA case (not implemented in extension yet)
      if (response.require2FA) {
        throw new Error('2FA is not supported in extension yet. Please login via web.');
      }

      // Check for tokens and user
      if (!response.accessToken || !response.refreshToken || !response.user) {
        throw new Error('Invalid response from server');
      }

      const tokens = {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      };

      const userInfo = {
        id: response.user.id,
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        role: response.user.role,
      };

      // Save tokens and user info based on "Remember me" choice
      if (rememberMe) {
        // Persistent storage - survives browser restart
        await saveTokensPersistent(tokens);
        await saveUserInfoPersistent(userInfo);
      } else {
        // Session storage - cleared when browser closes
        await saveTokensSession(tokens);
        await saveUserInfoSession(userInfo);
      }

      // Update cached tokens in memory for API client
      updateCachedTokens(response.accessToken, response.refreshToken);

      set({ user: response.user, loading: false });

      toast.success('Login Successful', {
        description: `Welcome back, ${response.user.email}!`,
      });
    } catch (error) {
      set({ loading: false });

      const errorMessage = error instanceof Error ? error.message : 'Login failed';

      toast.error('Login Failed', {
        description: errorMessage,
      });

      throw error;
    }
  },

  logout: async () => {
    // Clear tokens and user info
    await clearTokens();

    // Reset API client
    await resetApi();

    set({ user: null });

    toast.info('Logged Out', {
      description: 'You have been logged out successfully',
    });
  },

  checkAuth: async () => {
    const isAuth = await checkAuthStatus();

    if (!isAuth) {
      set({ initialized: true, user: null });
      return;
    }

    // Load user from storage
    const userInfo = await getUserInfo();

    if (userInfo) {
      set({
        user: userInfo as User,
        initialized: true,
      });
    } else {
      // Has token but no user info - invalid state, logout
      await get().logout();
      set({ initialized: true });
    }
  },

  setUser: user => {
    set({ user });
  },
}));
