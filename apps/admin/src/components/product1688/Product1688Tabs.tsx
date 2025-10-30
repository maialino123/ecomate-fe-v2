'use client'

import * as Tabs from '@radix-ui/react-tabs'
import { Product1688Entity } from '@workspace/lib'
import { cn } from '@workspace/ui/lib/utils'
import { OverviewTab } from './OverviewTab'
import { ImageSelector } from './ImageSelector'
import { VariantGrid } from './VariantGrid'
import { VideoTab } from './VideoTab'

interface Product1688TabsProps {
    product: Product1688Entity
    onRefetch: () => void
}

export function Product1688Tabs({ product, onRefetch }: Product1688TabsProps) {
    return (
        <Tabs.Root defaultValue="overview" className="w-full">
            <Tabs.List className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                <Tabs.Trigger
                    value="overview"
                    className={cn(
                        'px-4 py-2 text-sm font-medium border-b-2 border-transparent',
                        'hover:text-blue-600 dark:hover:text-blue-400',
                        'data-[state=active]:border-blue-600 data-[state=active]:text-blue-600',
                        'dark:data-[state=active]:border-blue-400 dark:data-[state=active]:text-blue-400',
                        'transition-colors',
                    )}
                >
                    Overview
                </Tabs.Trigger>
                <Tabs.Trigger
                    value="images"
                    className={cn(
                        'px-4 py-2 text-sm font-medium border-b-2 border-transparent',
                        'hover:text-blue-600 dark:hover:text-blue-400',
                        'data-[state=active]:border-blue-600 data-[state=active]:text-blue-600',
                        'dark:data-[state=active]:border-blue-400 dark:data-[state=active]:text-blue-400',
                        'transition-colors',
                    )}
                >
                    Images ({product.images.length})
                </Tabs.Trigger>
                {product.variants && product.variants.length > 0 && (
                    <Tabs.Trigger
                        value="variants"
                        className={cn(
                            'px-4 py-2 text-sm font-medium border-b-2 border-transparent',
                            'hover:text-blue-600 dark:hover:text-blue-400',
                            'data-[state=active]:border-blue-600 data-[state=active]:text-blue-600',
                            'dark:data-[state=active]:border-blue-400 dark:data-[state=active]:text-blue-400',
                            'transition-colors',
                        )}
                    >
                        Variants ({product.variantCount})
                    </Tabs.Trigger>
                )}
                {product.originalVideoUrl && (
                    <Tabs.Trigger
                        value="video"
                        className={cn(
                            'px-4 py-2 text-sm font-medium border-b-2 border-transparent',
                            'hover:text-blue-600 dark:hover:text-blue-400',
                            'data-[state=active]:border-blue-600 data-[state=active]:text-blue-600',
                            'dark:data-[state=active]:border-blue-400 dark:data-[state=active]:text-blue-400',
                            'transition-colors',
                        )}
                    >
                        Video
                    </Tabs.Trigger>
                )}
            </Tabs.List>

            <Tabs.Content value="overview" className="focus:outline-none">
                <OverviewTab product={product} />
            </Tabs.Content>

            <Tabs.Content value="images" className="focus:outline-none">
                <ImageSelector
                    productId={product.id}
                    images={product.images}
                    selectedImages={product.selectedImages}
                    onSuccess={onRefetch}
                />
            </Tabs.Content>

            <Tabs.Content value="variants" className="focus:outline-none">
                <VariantGrid
                    productId={product.id}
                    variants={product.variants || []}
                    basePrice={product.priceMinCNY}
                    onUpdate={onRefetch}
                />
            </Tabs.Content>

            <Tabs.Content value="video" className="focus:outline-none">
                <VideoTab product={product} onRefetch={onRefetch} />
            </Tabs.Content>
        </Tabs.Root>
    )
}
