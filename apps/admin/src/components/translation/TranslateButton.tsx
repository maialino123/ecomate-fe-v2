'use client';

import { useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { useNotificationStore } from '@workspace/lib/stores';
import { useApi } from '@workspace/shared/providers';
import { Languages, Loader2, CheckCircle2 } from 'lucide-react';
import type { TranslateProductResponse } from '@workspace/lib';

interface TranslateButtonProps {
  productId: string;
  onTranslateSuccess?: (result: TranslateProductResponse) => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

/**
 * TranslateButton Component
 *
 * Button to translate product from Chinese to Vietnamese using Cloudflare Worker AI
 * Shows loading state during translation and displays success/error toast
 *
 * @example
 * <TranslateButton
 *   productId="cm123abc456"
 *   onTranslateSuccess={(result) => console.log('Translated:', result)}
 * />
 */
export function TranslateButton({
  productId,
  onTranslateSuccess,
  variant = 'outline',
  size = 'default',
  className,
}: TranslateButtonProps) {
  const [isTranslating, setIsTranslating] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);
  const { success, error } = useNotificationStore();
  const api = useApi();

  const handleTranslate = async () => {
    try {
      setIsTranslating(true);

      // Call translation API
      const result = await api.translation.translateProduct(productId, {
        sourceLang: 'chinese',
        targetLang: 'vietnamese',
        forceRefresh: false,
      });

      // Success
      setIsTranslated(true);

      success(
        result.cached
          ? 'Product translated successfully (from cache)'
          : 'Product translated successfully',
        'Translation Successful'
      );

      // Call success callback
      onTranslateSuccess?.(result);

      // Reset translated state after 3 seconds
      setTimeout(() => setIsTranslated(false), 3000);

    } catch (err: any) {
      console.error('Translation failed:', err);

      error(
        err.response?.data?.message || err.message || 'Failed to translate product',
        'Translation Failed'
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
      onPress={handleTranslate}
      isDisabled={isTranslating}
    >
      {isTranslating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Translating...
        </>
      ) : isTranslated ? (
        <>
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Translated
        </>
      ) : (
        <>
          <Languages className="mr-2 h-4 w-4" />
          Translate
        </>
      )}
    </Button>
  );
}
