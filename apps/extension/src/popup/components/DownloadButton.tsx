/**
 * Download Button Component
 * Handles JSON file download
 */

import type { Product1688 } from '@workspace/lib';
import { Button } from '@heroui/react';
import { toast } from 'sonner';

interface Props {
  data: Product1688;
}

export function DownloadButton({ data }: Props) {
  const handleDownload = async () => {
    try {
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const filename = `1688_${data.productId}_${Date.now()}.json`;

      // Use chrome.downloads API
      await chrome.downloads.download({
        url,
        filename,
        saveAs: true,
      });

      // Show success toast
      toast.success('Download Started', {
        description: `${filename} is being saved`,
      });

      // Clean up object URL after a delay
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Download Failed', {
        description: 'Failed to download file. Please try again.',
      });
    }
  };

  return (
    <Button
      color="primary"
      variant="bordered"
      size="sm"
      onPress={handleDownload}
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
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" x2="12" y1="15" y2="3" />
        </svg>
      }
    >
      Download JSON
    </Button>
  );
}
