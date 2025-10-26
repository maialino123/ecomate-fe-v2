import { useState } from 'react'
import { useApi } from '@workspace/shared/providers'
import { useProduct1688Reject, Product1688Entity, RejectionReason } from '@workspace/lib'
import { Button } from '@workspace/ui/components/Button'
import { Loader2, XCircle } from 'lucide-react'

interface RejectDialogProps {
  product: Product1688Entity
  onSuccess?: () => void
}

export function RejectDialog({ product, onSuccess }: RejectDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [reason, setReason] = useState<RejectionReason>(RejectionReason.LOW_QUALITY)
  const [notes, setNotes] = useState('')
  const api = useApi()

  const rejectMutation = useProduct1688Reject({
    api,
    onSuccess: () => {
      setIsOpen(false)
      setReason(RejectionReason.LOW_QUALITY)
      setNotes('')
      onSuccess?.()
    },
  })

  const handleReject = () => {
    rejectMutation.mutate({
      id: product.id,
      data: {
        reason,
        note: notes || undefined,
      },
    })
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="destructive" size="sm">
        <XCircle className="w-4 h-4 mr-2" />
        Reject
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-red-600 dark:text-red-400">Reject Product</h3>

            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                <strong>Product:</strong> {product.nameVi || product.nameZh}
              </p>
            </div>

            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rejection Reason</label>
                <select
                  value={reason}
                  onChange={e => setReason(e.target.value as RejectionReason)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                >
                  <option value={RejectionReason.LOW_QUALITY}>Low Quality</option>
                  <option value={RejectionReason.TOO_EXPENSIVE}>Too Expensive</option>
                  <option value={RejectionReason.ALREADY_HAVE}>Already Have</option>
                  <option value={RejectionReason.NOT_SUITABLE}>Not Suitable</option>
                  <option value={RejectionReason.SUPPLIER_ISSUES}>Supplier Issues</option>
                  <option value={RejectionReason.OTHER}>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Additional Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  rows={3}
                  placeholder="Provide additional details about the rejection..."
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleReject}
                isDisabled={rejectMutation.isPending}
                variant="destructive"
                className="flex-1"
              >
                {rejectMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Reject
              </Button>
              <Button
                onClick={() => {
                  setIsOpen(false)
                  setReason(RejectionReason.LOW_QUALITY)
                  setNotes('')
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
