/**
 * Main App Component
 * Handles routing and theme management
 */

import { useState, useEffect } from 'react';
import { HeroUIProvider } from '@heroui/react';
import { ExtractPage } from './pages/ExtractPage';
import { SettingsPage } from './pages/SettingsPage';
import { Toaster } from 'sonner';

type View = 'extract' | 'settings';

export function App() {
  const [view, setView] = useState<View>('extract');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load theme from storage on mount
  useEffect(() => {
    chrome.storage.sync.get(['theme'], (result) => {
      if (result.theme) {
        setTheme(result.theme);
        applyTheme(result.theme);
      } else {
        // Default to system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const defaultTheme = prefersDark ? 'dark' : 'light';
        setTheme(defaultTheme);
        applyTheme(defaultTheme);
      }
    });
  }, []);

  const applyTheme = (newTheme: 'light' | 'dark') => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
    chrome.storage.sync.set({ theme: newTheme });
  };

  return (
    <HeroUIProvider>
      <Toaster position="top-right" theme={theme} richColors closeButton />
      <div className="bg-background">
      {/* Tab Navigation */}
      <nav className="border-b border-border bg-background">
        <div className="flex items-center">
          <button
            onClick={() => setView('extract')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors relative
              ${
                view === 'extract'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            Extract
          </button>
          <button
            onClick={() => setView('settings')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors relative
              ${
                view === 'settings'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            Settings
          </button>
          <button
            onClick={toggleTheme}
            className="p-3 text-muted-foreground hover:text-foreground transition-colors"
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* View Content */}
      <div>
        {view === 'extract' && <ExtractPage />}
        {view === 'settings' && <SettingsPage />}
      </div>
    </div>
    </HeroUIProvider>
  );
}
