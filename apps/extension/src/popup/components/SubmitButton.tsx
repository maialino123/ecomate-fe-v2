/**
 * Submit Button Component
 * Handles submitting extracted product to backend with duplicate check
 */

import { useState } from 'react'
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react'
import type { Product1688 } from '@workspace/lib'
import { toast } from 'sonner'
import { getApi } from '../../shared/api-client'
import { getConfig } from '../../shared/storage'
import { useExtractStore } from '../store/extract'

interface Props {
    data: Product1688
    onSuccess?: () => void
}

interface DuplicateInfo {
    exists: boolean
    productId?: string
    productName?: string
    productType?: 'product1688' | 'product'
}

export function SubmitButton({ data, onSuccess }: Props) {
    const [loading, setLoading] = useState(false)
    const [showDuplicateModal, setShowDuplicateModal] = useState(false)
    const [duplicateInfo, setDuplicateInfo] = useState<DuplicateInfo | null>(null)
    const { clear } = useExtractStore()

    const handleSubmit = async (force = false) => {
        setLoading(true)

        try {
            const api = await getApi()

            // Check for duplicates first (unless forcing)
            if (!force) {
                const duplicateCheck = await api.product1688.checkDuplicate(data.sourceUrl)

                if (duplicateCheck.exists) {
                    // Show duplicate warning modal
                    setDuplicateInfo({
                        exists: true,
                        productId: duplicateCheck.id,
                        productName: duplicateCheck.name,
                        productType: duplicateCheck.type,
                    })
                    setShowDuplicateModal(true)
                    setLoading(false)
                    return
                }
            }

            // Calculate min and max prices from price tiers
            const prices = data.priceTiers.map(tier => tier.price)
            const minPrice = Math.min(...prices)
            const maxPrice = Math.max(...prices)

            // Submit product to backend
            const response = await api.product1688.create({
                nameZh: data.title,
                descriptionZh: data.description || '',
                originalUrl: data.sourceUrl,
                priceMinCNY: minPrice,
                priceMaxCNY: maxPrice !== minPrice ? maxPrice : undefined,
                images: data.images.main,
                thumbnail: data.images.main[0],
                variants:
                    data.skus.length > 0
                        ? data.skus.map((sku, index) => ({
                              sku: sku.skuId || `SKU-${index + 1}`,
                              nameZh:
                                  Object.entries(sku.attributes)
                                      .map(([k, v]) => `${k}:${v}`)
                                      .join(', ') || `Variant ${index + 1}`,
                              attributes: sku.attributes,
                              price: sku.price || minPrice,
                              stock: sku.stock,
                              image: sku.image,
                          }))
                        : undefined,
                supplierName: data.supplierName,
                supplierId1688: data.supplierId,
                originalVideoUrl: data.videoUrl, // Send video URL for dubbing
            })

            // Clear extracted data
            clear()

            // Get total count
            const listResponse = await api.product1688.list({ page: 1, limit: 1 })
            const totalCount = listResponse.total || 0

            // Show success toast
            toast.success('Product Saved!', {
                description: `You now have ${totalCount} product${totalCount === 1 ? '' : 's'}`,
            })

            // Close duplicate modal if open
            setShowDuplicateModal(false)
            setDuplicateInfo(null)

            // Call success callback
            if (onSuccess) {
                onSuccess()
            }
        } catch (error) {
            console.error('Submit failed:', error)

            const errorMessage = error instanceof Error ? error.message : 'Failed to submit product'

            toast.error('Submit Failed', {
                description: errorMessage,
            })
        } finally {
            setLoading(false)
        }
    }

    const handleViewExisting = async () => {
        if (duplicateInfo?.productId) {
            try {
                // Get config to determine admin URL
                const config = await getConfig()

                // Convert API URL to admin URL
                // API: https://ecomate-be-staging.up.railway.app
                // Admin: https://ecomate-admin.vercel.app (or localhost:3001 for dev)
                const apiUrl = config.apiUrl
                let adminUrl: string

                if (apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1')) {
                    // Development environment
                    adminUrl = 'http://localhost:3001'
                } else if (apiUrl.includes('staging')) {
                    // Staging environment - update this URL when you have admin staging
                    adminUrl = 'https://ecomate-admin-staging.vercel.app'
                } else {
                    // Production environment
                    adminUrl = 'https://ecomate-admin.vercel.app'
                }

                // Determine the correct path based on product type
                const path =
                    duplicateInfo.productType === 'product'
                        ? `products/${duplicateInfo.productId}`
                        : `1688-products/${duplicateInfo.productId}`

                // Open admin panel to view existing product
                chrome.tabs.create({
                    url: `${adminUrl}/dashboard/${path}`,
                })
            } catch (error) {
                console.error('Failed to open existing product:', error)
                toast.error('Failed to open product page')
            }
        }
    }

    const handleSubmitAnyway = () => {
        setShowDuplicateModal(false)
        handleSubmit(true) // Force submit
    }

    return (
        <>
            <Button
                color="primary"
                size="md"
                onPress={() => handleSubmit(false)}
                isLoading={loading}
                fullWidth
                startContent={
                    !loading && (
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
            <Modal isOpen={showDuplicateModal} onClose={() => setShowDuplicateModal(false)} placement="center">
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
                        <p className="text-sm text-foreground">This product already exists in your catalog:</p>
                        <div className="mt-2 p-3 bg-content2 rounded-lg">
                            <p className="text-sm font-medium text-foreground">{duplicateInfo?.productName}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Type: {duplicateInfo?.productType === 'product' ? 'Product (Approved)' : 'Product1688'}
                            </p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                            Would you like to view the existing product or submit anyway?
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={() => setShowDuplicateModal(false)} size="sm">
                            Cancel
                        </Button>
                        <Button variant="bordered" onPress={handleViewExisting} size="sm">
                            View Existing
                        </Button>
                        <Button color="primary" onPress={handleSubmitAnyway} size="sm">
                            Submit Anyway
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
