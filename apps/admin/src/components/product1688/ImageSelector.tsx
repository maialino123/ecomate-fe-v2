'use client'

import { useState } from 'react'
import * as Checkbox from '@radix-ui/react-checkbox'
import { Check, Save, AlertCircle } from 'lucide-react'
import { Button } from '@workspace/ui/components/Button'
import { useApi } from '@workspace/shared/providers'
import { cn } from '@workspace/ui/lib/utils'

interface ImageSelectorProps {
  productId: string
  images: string[]
  selectedImages?: string[]
  onSuccess: () => void
}

export function ImageSelector({ productId, images, selectedImages: initialSelected = [], onSuccess }: ImageSelectorProps) {
  const api = useApi()
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSelected))
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleImage = (imageUrl: string) => {
    const newSelected = new Set(selected)
    if (newSelected.has(imageUrl)) {
      newSelected.delete(imageUrl)
    } else {
      newSelected.add(imageUrl)
    }
    setSelected(newSelected)
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await api.product1688.update(productId, {
        selectedImages: Array.from(selected),
      })
      onSuccess()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save selected images')
    } finally {
      setIsLoading(false)
    }
  }

  const hasChanges = () => {
    const current = Array.from(selected).sort()
    const initial = initialSelected.slice().sort()
    return JSON.stringify(current) !== JSON.stringify(initial)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Select Images</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {selected.size} of {images.length} images selected
          </p>
        </div>
        <Button
          onClick={handleSave}
          isDisabled={isLoading || !hasChanges()}
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {isLoading ? 'Saving...' : 'Save Selection'}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((imageUrl, index) => {
          const isSelected = selected.has(imageUrl)
          return (
            <div
              key={index}
              className={cn(
                'relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all',
                isSelected
                  ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-200 dark:ring-blue-800'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              )}
              onClick={() => toggleImage(imageUrl)}
            >
              <img
                src={imageUrl}
                alt={`Product image ${index + 1}`}
                className="w-full h-48 object-cover"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
              />
              <div className="absolute top-2 right-2">
                <Checkbox.Root
                  checked={isSelected}
                  onCheckedChange={() => toggleImage(imageUrl)}
                  className={cn(
                    'flex items-center justify-center w-6 h-6 rounded border-2 transition-colors',
                    isSelected
                      ? 'bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500'
                      : 'bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-600'
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox.Indicator>
                    <Check className="w-4 h-4 text-white" />
                  </Checkbox.Indicator>
                </Checkbox.Root>
              </div>
              {isSelected && (
                <div className="absolute inset-0 bg-blue-500/10 pointer-events-none" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
