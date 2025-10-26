/**
 * Submit Button Component
 * Handles submitting extracted product to backend with duplicate check
 */

import { useState } from 'react';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';
import type { Product1688 } from '@workspace/lib';
import { toast } from 'sonner';
import { getApi } from '../../shared/api-client';
import { useExtractStore } from '../store/extract';

interface Props {
  data: Product1688;
  onSuccess?: () => void;
}

interface DuplicateInfo {
  exists: boolean;
  productId?: string;
  productName?: string;
  status?: string;
}

export function SubmitButton({ data, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateInfo, setDuplicateInfo] = useState<DuplicateInfo | null>(null);
  const { clear } = useExtractStore();

  const handleSubmit = async (force = false) => {
    setLoading(true);

    try {
      const api = await getApi();

      // Check for duplicates first (unless forcing)
      if (!force) {
        const duplicateCheck = await api.product1688.checkDuplicate(data.url);

        if (duplicateCheck.exists && duplicateCheck.product) {
          // Show duplicate warning modal
          setDuplicateInfo({
            exists: true,
            productId: duplicateCheck.product.id,
            productName: duplicateCheck.product.nameZh,
            status: duplicateCheck.product.status,
          });
          setShowDuplicateModal(true);
          setLoading(false);
          return;
        }
      }

      // Submit product to backend
      const response = await api.product1688.create({
        nameZh: data.title,
        descriptionZh: data.description || '',
        originalUrl: data.url,
        priceMinCNY: data.priceRange.min,
        priceMaxCNY: data.priceRange.max || data.priceRange.min,
        currency: 'CNY',
        variants: data.skus.map((sku, index) => ({
          name: sku.specText || `Variant ${index + 1}`,
          price: sku.price,
          properties: sku.propPath ? JSON.parse(JSON.stringify(sku.propPath)) : {},
          stock: sku.canBookCount,
          sku: sku.skuId,
        })),
        rawData: data,
        images: data.images.map(img => img.fullPathImageUrl || img.url),
        mainImage: data.images[0]?.fullPathImageUrl || data.images[0]?.url,
      });

      // Clear extracted data
      clear();

      // Get total count
      const listResponse = await api.product1688.list({ page: 1, limit: 1 });
      const totalCount = listResponse.total || 0;

      // Show success toast
      toast.success('Product Saved!', {
        description: `You now have ${totalCount} product${totalCount === 1 ? '' : 's'}`,
      });

      // Close duplicate modal if open
      setShowDuplicateModal(false);
      setDuplicateInfo(null);

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Submit failed:', error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to submit product';

      toast.error('Submit Failed', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewExisting = () => {
    if (duplicateInfo?.productId) {
      // Open admin panel to view existing product
      chrome.tabs.create({
        url: `/dashboard/1688-products/${duplicateInfo.productId}`,
      });
    }
  };

  const handleSubmitAnyway = () => {
    setShowDuplicateModal(false);
    handleSubmit(true); // Force submit
  };

  return (
    <>
      <Button
        color="primary"
        size="sm"
        onPress={() => handleSubmit(false)}
        isLoading={loading}
        fullWidth
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
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
          )
        }
      >
        {loading ? 'Submitting...' : 'Save to Catalog'}
      </Button>

      {/* Duplicate Warning Modal */}
      <Modal
        isOpen={showDuplicateModal}
        onClose={() => setShowDuplicateModal(false)}
        placement="center"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-warning">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
              </svg>
              Duplicate Product
            </div>
          </ModalHeader>
          <ModalBody>
            <p className="text-sm text-foreground">
              This product already exists in your catalog:
            </p>
            <div className="mt-2 p-3 bg-content2 rounded-lg">
              <p className="text-sm font-medium text-foreground">
                {duplicateInfo?.productName}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Status: {duplicateInfo?.status?.replace(/_/g, ' ')}
              </p>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Would you like to view the existing product or submit anyway?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={() => setShowDuplicateModal(false)}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              variant="bordered"
              onPress={handleViewExisting}
              size="sm"
            >
              View Existing
            </Button>
            <Button
              color="primary"
              onPress={handleSubmitAnyway}
              size="sm"
            >
              Submit Anyway
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
