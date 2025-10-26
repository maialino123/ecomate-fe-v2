/**
 * Login Page
 * Handles user authentication
 */

import { useState } from 'react';
import { Button, Input, Checkbox } from '@heroui/react';
import { useAuthStore } from '../store/auth';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const { login, loading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    try {
      await login(email, password, rememberMe);
    } catch (error) {
      // Error is already handled in store with toast
    }
  };

  return (
    <div className="w-[700px] h-[600px] flex flex-col items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold">
              🌿
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Ecomate 1688</h1>
          <p className="text-sm text-muted-foreground">Sign in to continue</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            isRequired
            autoComplete="email"
            size="md"
          />

          <Input
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            isRequired
            autoComplete="current-password"
            size="md"
          />

          <Checkbox isSelected={rememberMe} onValueChange={setRememberMe} size="md">
            <span className="text-sm text-foreground">Remember me</span>
          </Checkbox>

          <Button
            type="submit"
            color="primary"
            fullWidth
            isLoading={loading}
            isDisabled={!email || !password}
            size="lg"
            className="mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            Don't have an account?{' '}
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                // Open admin panel in new tab
                chrome.tabs.create({ url: '/register' });
              }}
              className="text-primary hover:underline"
            >
              Register
            </a>
          </p>

          <p className="text-xs text-muted-foreground">
            By signing in, you agree to our{' '}
            <a href="#" className="text-primary hover:underline">
              Terms
            </a>{' '}
            and{' '}
            <a href="#" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
