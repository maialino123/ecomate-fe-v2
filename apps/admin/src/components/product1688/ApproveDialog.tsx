import { useState } from 'react'
import { useApi } from '@workspace/shared/providers'
import { useProduct1688Approve, Product1688Entity } from '@workspace/lib'
import { Button } from '@workspace/ui/components/Button'
import { Loader2, CheckCircle } from 'lucide-react'

interface ApproveDialogProps {
  product: Product1688Entity
  onSuccess?: () => void
}

export function ApproveDialog({ product, onSuccess }: ApproveDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [sku, setSku] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [supplierId, setSupplierId] = useState('')
  const api = useApi()

  const approveMutation = useProduct1688Approve({
    api,
    onSuccess: () => {
      setIsOpen(false)
      setSku('')
      setCategoryId('')
      setSupplierId('')
      onSuccess?.()
    },
  })

  const handleApprove = () => {
    if (!sku || !categoryId) return

    approveMutation.mutate({
      id: product.id,
      data: {
        sku,
        categoryId,
        supplierId: supplierId || undefined,
      },
    })
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="default" size="sm">
        <CheckCircle className="w-4 h-4 mr-2" />
        Duyệt
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-green-600 dark:text-green-400">Duyệt sản phẩm</h3>

            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                <strong>Sản phẩm:</strong> {product.nameVi || product.nameZh}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Giá:</strong> {product.priceMinCNY} CNY
                {product.priceMaxCNY && ` - ${product.priceMaxCNY} CNY`}
              </p>
            </div>

            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Mã SKU <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={sku}
                  onChange={e => setSku(e.target.value)}
                  placeholder="VD: SKU-1688-001"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Mã danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                  placeholder="Chọn từ danh mục có sẵn"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Mã nhà cung cấp (Tùy chọn)</label>
                <input
                  type="text"
                  value={supplierId}
                  onChange={e => setSupplierId(e.target.value)}
                  placeholder="Liên kết nhà cung cấp"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleApprove} isDisabled={!sku || !categoryId || approveMutation.isPending} className="flex-1">
                {approveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Duyệt & Nhập
              </Button>
              <Button
                onClick={() => {
                  setIsOpen(false)
                  setSku('')
                  setCategoryId('')
                  setSupplierId('')
                }}
                variant="outline"
                className="flex-1"
              >
                Hủy
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
