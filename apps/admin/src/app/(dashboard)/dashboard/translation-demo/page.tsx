'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/Card';
import { TranslateButton, BatchTranslateButton } from '@/components/translation';
import { useApi } from '@workspace/shared/providers';
import type { TranslationStats } from '@workspace/lib';

/**
 * Translation Demo Page
 *
 * Demonstrates how to use translation features in the admin dashboard
 */
export default function TranslationDemoPage() {
  const [stats, setStats] = useState<TranslationStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const api = useApi();

  // Example product IDs (replace with real IDs from your database)
  const sampleProductId = 'cm123abc456';
  const sampleProductIds = ['cm123abc456', 'cm789def012', 'cm456ghi789'];

  const loadStats = async () => {
    setIsLoadingStats(true);
    try {
      const data = await api.translation.getCacheStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Translation Demo</h1>
        <p className="text-muted-foreground mt-2">
          Test translation features using Cloudflare Worker AI
        </p>
      </div>

      {/* Single Product Translation */}
      <Card>
        <CardHeader>
          <CardTitle>Single Product Translation</CardTitle>
          <CardDescription>
            Translate a single product from Chinese to Vietnamese
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <code className="px-3 py-2 bg-muted rounded-md text-sm flex-1">
              Product ID: {sampleProductId}
            </code>
            <TranslateButton
              productId={sampleProductId}
              onTranslateSuccess={(result) => {
                console.log('Translation result:', result);
                loadStats(); // Refresh stats
              }}
            />
          </div>

          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-2">How it works:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Click the "Translate" button</li>
              <li>Backend checks Redis cache for existing translation</li>
              <li>If not cached, calls Cloudflare Worker AI</li>
              <li>Updates product in database with translated text</li>
              <li>Caches result for 30 days</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Batch Translation */}
      <Card>
        <CardHeader>
          <CardTitle>Batch Translation</CardTitle>
          <CardDescription>
            Translate multiple products at once
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Selected Products:</p>
            <ul className="text-sm space-y-1">
              {sampleProductIds.map((id, idx) => (
                <li key={id}>
                  <code className="px-2 py-1 bg-muted rounded text-xs">
                    {idx + 1}. {id}
                  </code>
                </li>
              ))}
            </ul>
          </div>

          <BatchTranslateButton
            productIds={sampleProductIds}
            onTranslateSuccess={(result) => {
              console.log('Batch translation result:', result);
              loadStats(); // Refresh stats
            }}
          />

          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-2">Features:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Sequential translation to avoid rate limits</li>
              <li>Partial success handling (some may fail)</li>
              <li>Detailed error reporting per product</li>
              <li>Progress indication</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Cache Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Cache Statistics</CardTitle>
          <CardDescription>
            Redis cache performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingStats ? (
            <p className="text-muted-foreground">Loading stats...</p>
          ) : stats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Cache Hits</p>
                <p className="text-2xl font-bold">{stats.cacheHits}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Cache Misses</p>
                <p className="text-2xl font-bold">{stats.cacheMisses}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Requests</p>
                <p className="text-2xl font-bold">{stats.totalRequests}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Hit Rate</p>
                <p className="text-2xl font-bold">{stats.hitRate}%</p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No stats available</p>
          )}

          <button
            onClick={loadStats}
            className="mt-4 text-sm text-primary hover:underline"
            disabled={isLoadingStats}
          >
            Refresh Stats
          </button>
        </CardContent>
      </Card>

      {/* Code Example */}
      <Card>
        <CardHeader>
          <CardTitle>Code Example</CardTitle>
          <CardDescription>
            How to use translation API in your components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="p-4 bg-muted rounded-md text-xs overflow-x-auto">
{`import { api } from '@workspace/lib';

// Single product translation
const result = await api.translation.translateProduct('product-id', {
  sourceLang: 'chinese',
  targetLang: 'vietnamese',
  forceRefresh: false,
});

console.log(result.translations.name?.translated);

// Batch translation
const batchResult = await api.translation.batchTranslate({
  productIds: ['id1', 'id2', 'id3'],
  sourceLang: 'chinese',
  targetLang: 'vietnamese',
});

console.log(\`Translated \${batchResult.successful} products\`);`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
