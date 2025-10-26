/**
 * Settings Page Component
 * Configure API endpoint and other settings
 */

import { useState, useEffect, FormEvent } from 'react';
import { getConfig, saveConfig } from '../../shared/storage';
import { Card, CardHeader, CardBody, Button, Input, Skeleton } from '@heroui/react';
import { toast } from 'sonner';

export function SettingsPage() {
  const [apiUrl, setApiUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load current config
    getConfig().then((config) => {
      setApiUrl(config.apiUrl);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await saveConfig({ apiUrl: apiUrl.trim() });
      toast.success('Settings Saved', {
        description: 'API endpoint updated successfully',
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Save Failed', {
        description: 'Failed to save settings. Please try again.',
      });
    }
  };

  if (loading) {
    return (
      <div className="w-[600px] h-[500px] bg-background p-4 flex flex-col gap-4">
        <div>
          <Skeleton className="h-6 w-24 rounded mb-2" />
          <Skeleton className="h-3 w-48 rounded" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-32 rounded mb-1" />
            <Skeleton className="h-3 w-40 rounded" />
          </CardHeader>
          <CardBody>
            <Skeleton className="h-10 w-full rounded mb-3" />
            <Skeleton className="h-9 w-full rounded" />
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-[600px] h-[500px] bg-background p-4 flex flex-col gap-4">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold">Settings</h2>
        <p className="text-xs text-default-500 mt-0.5">
          Configure your extension preferences
        </p>
      </div>

      {/* API Settings Card */}
      <Card shadow="sm">
        <CardHeader className="pb-2">
          <div>
            <h3 className="text-sm font-semibold">API Configuration</h3>
            <p className="text-xs text-default-500">Configure the backend API endpoint</p>
          </div>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSave} className="space-y-3">
            <Input
              type="url"
              label="API Endpoint"
              placeholder="https://your-api.railway.app"
              value={apiUrl}
              onValueChange={setApiUrl}
              isRequired
              size="sm"
              description="Enter the base URL of your Ecomate API server"
              classNames={{
                input: 'font-mono text-xs',
              }}
            />

            <Button
              type="submit"
              color="primary"
              size="sm"
              fullWidth
              startContent={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
              }
            >
              Save Settings
            </Button>
          </form>
        </CardBody>
      </Card>

      {/* About Card */}
      <Card shadow="sm" className="mt-auto">
        <CardHeader className="pb-2">
          <div>
            <h3 className="text-sm font-semibold">About</h3>
            <p className="text-xs text-default-500">Extension information</p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-default-500">Version</span>
              <span className="font-medium">0.1.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-default-500">Platform</span>
              <span className="font-medium">Chrome Extension</span>
            </div>
            <div className="flex justify-between">
              <span className="text-default-500">Support</span>
              <span className="font-medium">Contact Administrator</span>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
