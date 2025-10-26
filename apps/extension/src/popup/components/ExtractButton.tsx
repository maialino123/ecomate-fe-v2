/**
 * Extract Button Component
 * Primary action button for extracting product data
 */

import { Button } from '@heroui/react';
import { useExtractStore } from '../store/extract';

export function ExtractButton() {
  const { loading, extract, clearError } = useExtractStore();

  const handleExtract = async () => {
    clearError();
    try {
      await extract();
    } catch (err) {
      // Error handled by store with toast
      console.error('Extract error:', err);
    }
  };

  return (
    <Button
      color="primary"
      size="sm"
      onPress={handleExtract}
      isLoading={loading}
      startContent={
        !loading && (
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
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" x2="12" y1="2" y2="15" />
          </svg>
        )
      }
    >
      {loading ? 'Extracting...' : 'Extract Data'}
    </Button>
  );
}
