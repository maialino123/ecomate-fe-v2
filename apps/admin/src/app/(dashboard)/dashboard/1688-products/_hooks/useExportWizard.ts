import { useState, useCallback, useMemo } from 'react'
import { Product1688Entity } from '@workspace/lib'

export type ExportWizardStep = 'closed' | 'variant-selection' | 'summary'

export interface ExportWizardState {
  step: ExportWizardStep
  currentProductIndex: number
  products: Product1688Entity[]
  variantSelections: Map<string, string[]>
  skippedProducts: Set<string>
}

export interface ExportWizardActions {
  openWizard: (products: Product1688Entity[]) => void
  closeWizard: () => void
  nextProduct: () => void
  prevProduct: () => void
  skipProduct: () => void
  goToSummary: () => void
  setVariants: (productId: string, variantSkus: string[]) => void
  removeProduct: (productId: string) => void
  editProduct: (productId: string) => void
  getExportPayload: () => { productId: string; variantSkus: string[] }[]
}

/**
 * Hook for managing the multi-product export wizard flow
 * Handles sequential variant selection and pre-export summary
 */
export function useExportWizard(): ExportWizardState & ExportWizardActions {
  const [step, setStep] = useState<ExportWizardStep>('closed')
  const [currentProductIndex, setCurrentProductIndex] = useState(0)
  const [products, setProducts] = useState<Product1688Entity[]>([])
  const [variantSelections, setVariantSelections] = useState<Map<string, string[]>>(new Map())
  const [skippedProducts, setSkippedProducts] = useState<Set<string>>(new Set())

  // Open wizard with selected products
  const openWizard = useCallback((selectedProducts: Product1688Entity[]) => {
    if (selectedProducts.length === 0) return

    setProducts(selectedProducts)
    setCurrentProductIndex(0)
    setVariantSelections(new Map())
    setSkippedProducts(new Set())
    setStep('variant-selection')

    // Pre-select all variants for each product
    const initialSelections = new Map<string, string[]>()
    selectedProducts.forEach(product => {
      const variants = (product.variants || []) as { sku: string }[]
      initialSelections.set(
        product.id,
        variants.map(v => v.sku)
      )
    })
    setVariantSelections(initialSelections)
  }, [])

  // Close wizard and reset state
  const closeWizard = useCallback(() => {
    setStep('closed')
    setProducts([])
    setCurrentProductIndex(0)
    setVariantSelections(new Map())
    setSkippedProducts(new Set())
  }, [])

  // Move to next product or summary
  const nextProduct = useCallback(() => {
    if (currentProductIndex < products.length - 1) {
      setCurrentProductIndex(prev => prev + 1)
    } else {
      // Last product - go to summary
      setStep('summary')
    }
  }, [currentProductIndex, products.length])

  // Move to previous product
  const prevProduct = useCallback(() => {
    if (currentProductIndex > 0) {
      setCurrentProductIndex(prev => prev - 1)
    }
  }, [currentProductIndex])

  // Skip current product
  const skipProduct = useCallback(() => {
    const currentProduct = products[currentProductIndex]
    if (currentProduct) {
      setSkippedProducts(prev => {
        const next = new Set(prev)
        next.add(currentProduct.id)
        return next
      })
      // Clear variant selection for skipped product
      setVariantSelections(prev => {
        const next = new Map(prev)
        next.delete(currentProduct.id)
        return next
      })
    }
    nextProduct()
  }, [currentProductIndex, products, nextProduct])

  // Go directly to summary
  const goToSummary = useCallback(() => {
    setStep('summary')
  }, [])

  // Set variant selection for a product
  const setVariants = useCallback((productId: string, variantSkus: string[]) => {
    setVariantSelections(prev => {
      const next = new Map(prev)
      next.set(productId, variantSkus)
      return next
    })
  }, [])

  // Remove product from export list
  const removeProduct = useCallback((productId: string) => {
    setSkippedProducts(prev => {
      const next = new Set(prev)
      next.add(productId)
      return next
    })
    setVariantSelections(prev => {
      const next = new Map(prev)
      next.delete(productId)
      return next
    })
  }, [])

  // Edit product - go back to variant selection for that product
  const editProduct = useCallback(
    (productId: string) => {
      const productIndex = products.findIndex(p => p.id === productId)
      if (productIndex !== -1) {
        // Remove from skipped if it was skipped
        setSkippedProducts(prev => {
          const next = new Set(prev)
          next.delete(productId)
          return next
        })
        setCurrentProductIndex(productIndex)
        setStep('variant-selection')
      }
    },
    [products]
  )

  // Get export payload for API call
  const getExportPayload = useCallback(() => {
    const payload: { productId: string; variantSkus: string[] }[] = []

    products.forEach(product => {
      if (skippedProducts.has(product.id)) return

      const selectedSkus = variantSelections.get(product.id)
      if (selectedSkus && selectedSkus.length > 0) {
        payload.push({
          productId: product.id,
          variantSkus: selectedSkus,
        })
      }
    })

    return payload
  }, [products, variantSelections, skippedProducts])

  return {
    // State
    step,
    currentProductIndex,
    products,
    variantSelections,
    skippedProducts,
    // Actions
    openWizard,
    closeWizard,
    nextProduct,
    prevProduct,
    skipProduct,
    goToSummary,
    setVariants,
    removeProduct,
    editProduct,
    getExportPayload,
  }
}
