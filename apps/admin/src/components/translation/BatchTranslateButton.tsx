'use client';

import { useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { useNotificationStore } from '@workspace/lib/stores';
import { useApi } from '@workspace/shared/providers';
import { Languages, Loader2, CheckCircle2 } from 'lucide-react';
import type { BatchTranslateResponse } from '@workspace/lib';

interface BatchTranslateButtonProps {
  productIds: string[];
  onTranslateSuccess?: (result: BatchTranslateResponse) => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

/**
 * BatchTranslateButton Component
 *
 * Button to translate multiple products at once from Chinese to Vietnamese
 * Shows loading state and displays detailed results
 *
 * @example
 * <BatchTranslateButton
 *   productIds={['cm123abc456', 'cm789def012']}
 *   onTranslateSuccess={(result) => console.log('Batch completed:', result)}
 * />
 */
export function BatchTranslateButton({
  productIds,
  onTranslateSuccess,
  variant = 'default',
  size = 'default',
  className,
}: BatchTranslateButtonProps) {
  const [isTranslating, setIsTranslating] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);
  const { success, error: showError, warning } = useNotificationStore();
  const api = useApi();

  const handleBatchTranslate = async () => {
    if (!productIds || productIds.length === 0) {
      showError('Please select at least one product to translate', 'No Products Selected');
      return;
    }

    try {
      setIsTranslating(true);

      // Call batch translation API
      const result = await api.translation.batchTranslate({
        productIds,
        sourceLang: 'chinese',
        targetLang: 'vietnamese',
        forceRefresh: false,
      });

      // Success
      setIsTranslated(true);

      // Show detailed results
      if (result.failed === 0) {
        success(
          `Successfully translated ${result.successful} products`,
          'Batch Translation Successful'
        );
      } else {
        warning(
          `Translated: ${result.successful}, Failed: ${result.failed}`,
          'Batch Translation Completed with Errors'
        );
      }

      // Call success callback
      onTranslateSuccess?.(result);

      // Reset translated state after 3 seconds
      setTimeout(() => setIsTranslated(false), 3000);

    } catch (err: any) {
      console.error('Batch translation failed:', err);

      showError(
        err.response?.data?.message || err.message || 'Failed to translate products',
        'Batch Translation Failed'
      );
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onPress={handleBatchTranslate}
      isDisabled={isTranslating || productIds.length === 0}
    >
      {isTranslating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Translating {productIds.length} products...
        </>
      ) : isTranslated ? (
        <>
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Translated
        </>
      ) : (
        <>
          <Languages className="mr-2 h-4 w-4" />
          Translate {productIds.length} Products
        </>
      )}
    </Button>
  );
}
