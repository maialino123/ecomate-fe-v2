/**
 * Extract Page Component
 * Main extraction UI with preview and download
 */

import { useExtractStore } from '../store/extract';
import { PreviewPanel } from '../components/PreviewPanel';
import { DownloadButton } from '../components/DownloadButton';
import { InlineStats } from '../components/InlineStats';
import { ExtractButton } from '../components/ExtractButton';
import { Alert, AlertDescription } from '../components/ui/alert';

export function ExtractPage() {
  const { data, loading, error } = useExtractStore();

  return (
    <div className="w-[600px] h-[500px] bg-background flex flex-col">
      {/* Header */}
      <div className="px-3 py-2 border-b border-border flex items-center justify-between">
        <div>
          <h1 className="text-sm font-bold text-foreground">
            1688 Product Extractor
          </h1>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Extract product data from current page
          </p>
        </div>
        <ExtractButton />
      </div>

      {/* Error State */}
      {error && (
        <div className="mx-3 mt-2">
          <Alert variant="error">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Data Preview */}
      {data && (
        <>
          {/* Inline Quick Stats */}
          <InlineStats
            priceTiers={data.priceTiers.length}
            skuCount={data.skus.length}
            imageCount={data.images.main.length}
            productId={data.productId}
            basePrice={data.priceTiers[0]?.price || 0}
          />

          {/* Preview Panel - Takes remaining space */}
          <div className="flex-1 overflow-hidden px-3 py-2">
            <PreviewPanel data={data} />
          </div>

          {/* Sticky Download Button */}
          <div className="sticky bottom-0 bg-background border-t px-3 py-2">
            <DownloadButton data={data} />
          </div>
        </>
      )}

        {/* Empty State */}
        {!data && !loading && !error && (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <div className="w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" x2="12" y1="2" y2="15" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              Ready to Extract
            </h3>
            <p className="text-xs text-muted-foreground mb-4 max-w-sm">
              Navigate to a 1688.com product page and click "Extract Data" to get started.
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground max-w-sm">
              <div className="flex items-start gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary mt-0.5 flex-shrink-0"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Product title & ID</span>
              </div>
              <div className="flex items-start gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary mt-0.5 flex-shrink-0"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Price tiers</span>
              </div>
              <div className="flex items-start gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary mt-0.5 flex-shrink-0"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>SKU variations</span>
              </div>
              <div className="flex items-start gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary mt-0.5 flex-shrink-0"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Product images</span>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
