/**
 * Preview Panel Component
 * Displays extracted product data in a formatted tabbed view
 */

import type { Product1688 } from '@workspace/lib';
import { Card, CardBody, CardHeader } from '@heroui/react';
import { Tabs, Tab } from '@heroui/tabs';
import { Chip } from '@heroui/react';
import { ImageGallery } from './ui/image-gallery';

interface Props {
  data: Product1688;
}

export function PreviewPanel({ data }: Props) {
  return (
    <Card className="h-full overflow-hidden shadow-sm">
      <CardHeader className="pb-2 pt-3 px-4">
        <h3 className="text-sm font-semibold leading-tight line-clamp-2">{data.title}</h3>
      </CardHeader>

      <CardBody className="px-0 py-0 overflow-hidden">
        <Tabs
          aria-label="Product data tabs"
          variant="underlined"
          size="md"
          color="primary"
          classNames={{
            tabList: 'px-4',
            panel: 'h-[440px] overflow-auto px-4 pb-3 pt-2',
          }}
        >
          {/* Overview Tab */}
          <Tab key="overview" title="Overview">
            <div className="space-y-3">
              {/* Pricing Section */}
              <div>
                <h4 className="text-xs font-semibold text-default-500 uppercase tracking-wide mb-2">
                  Pricing
                </h4>
                <div className="space-y-2">
                  {data.priceTiers.map((tier, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2.5 bg-content2 rounded-lg hover:bg-content3 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {tier.minQty}
                          {tier.maxQty ? `–${tier.maxQty}` : '+'} units
                        </span>
                        {index === 0 && (
                          <Chip size="sm" color="success" variant="flat" className="h-5 text-xs">
                            Base
                          </Chip>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-base font-bold text-primary">
                          ¥{tier.price.toFixed(2)}
                        </div>
                        {index > 0 && data.priceTiers[0] && (
                          <div className="text-xs text-default-500">
                            {(
                              ((data.priceTiers[0].price - tier.price) /
                                data.priceTiers[0].price) *
                              100
                            ).toFixed(1)}
                            % off
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Supplier Info */}
              {data.supplierName && (
                <div>
                  <h4 className="text-xs font-semibold text-default-500 uppercase tracking-wide mb-2">
                    Supplier
                  </h4>
                  <div className="p-2.5 bg-content2 rounded-lg">
                    <p className="text-sm font-medium">
                      {data.supplierName}
                    </p>
                    {data.supplierId && (
                      <p className="text-xs text-default-500 font-mono mt-1">
                        ID: {data.supplierId}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Weight */}
              {data.weight && (
                <div>
                  <h4 className="text-xs font-semibold text-default-500 uppercase tracking-wide mb-2">
                    Weight
                  </h4>
                  <div className="p-2.5 bg-content2 rounded-lg">
                    <p className="text-sm font-medium">
                      {data.weight} kg
                    </p>
                  </div>
                </div>
              )}

              {/* Source URL */}
              <div>
                <h4 className="text-xs font-semibold text-default-500 uppercase tracking-wide mb-2">
                  Source
                </h4>
                <div className="p-2.5 bg-content2 rounded-lg">
                  <a
                    href={data.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline break-all"
                  >
                    {data.sourceUrl}
                  </a>
                </div>
              </div>

              {/* Extracted At */}
              <div>
                <h4 className="text-xs font-semibold text-default-500 uppercase tracking-wide mb-2">
                  Extracted
                </h4>
                <div className="p-2.5 bg-content2 rounded-lg">
                  <p className="text-sm">
                    {new Date(data.extractedAt).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </Tab>

          {/* SKUs Tab */}
          <Tab
            key="skus"
            title={
              <span>
                SKUs{' '}
                {data.skus.length > 0 && (
                  <span className="text-default-500">({data.skus.length})</span>
                )}
              </span>
            }
          >
            {data.skus.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {data.skus.map((sku, index) => (
                  <Card key={index} shadow="sm" className="border border-divider">
                    <CardBody className="p-3">
                      <div className="space-y-2">
                        {Object.entries(sku.attributes).map(([key, value]) => (
                          <div key={key} className="flex flex-col gap-0.5">
                            <span className="text-xs text-default-500 uppercase tracking-wide">
                              {key}
                            </span>
                            <span className="text-sm font-medium truncate">
                              {value}
                            </span>
                          </div>
                        ))}
                        {sku.price && (
                          <div className="pt-2 border-t border-divider">
                            <div className="text-base font-bold text-primary">
                              ¥{sku.price.toFixed(2)}
                            </div>
                          </div>
                        )}
                        {sku.stock !== undefined && (
                          <div className="text-xs text-default-500">
                            Stock: {sku.stock}
                          </div>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center text-center py-12 h-full">
                <div className="text-default-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mx-auto mb-2 opacity-50"
                  >
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  <p className="text-xs">No SKU variations found</p>
                </div>
              </div>
            )}
          </Tab>

          {/* Images Tab */}
          <Tab
            key="images"
            title={
              <span>
                Images <span className="text-default-500">({data.images.main.length})</span>
              </span>
            }
          >
            <ImageGallery images={data.images.main} maxDisplay={12} />
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}
