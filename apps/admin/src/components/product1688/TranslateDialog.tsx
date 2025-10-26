import { useState } from 'react'
import { useApi } from '@workspace/shared/providers'
import { useProduct1688Translate } from '@workspace/lib'
import { Button } from '@workspace/ui/components/Button'
import { Loader2, Languages } from 'lucide-react'

interface TranslateDialogProps {
  productId: string
  onSuccess?: () => void
}

export function TranslateDialog({ productId, onSuccess }: TranslateDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [force, setForce] = useState(false)
  const api = useApi()

  const translateMutation = useProduct1688Translate({
    api,
    onSuccess: () => {
      setIsOpen(false)
      setForce(false)
      onSuccess?.()
    },
  })

  const handleTranslate = () => {
    translateMutation.mutate({ id: productId, options: { forceRefresh: force } })
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="outline" size="sm">
        <Languages className="w-4 h-4 mr-2" />
        Translate
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Translate Product</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              This will translate the product name, description, and variants from Chinese to Vietnamese using AI.
            </p>

            <div className="mb-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={force} onChange={e => setForce(e.target.checked)} className="rounded" />
                <span>Force re-translate (even if already translated)</span>
              </label>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleTranslate} isDisabled={translateMutation.isPending} className="flex-1">
                {translateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Translate
              </Button>
              <Button
                onClick={() => {
                  setIsOpen(false)
                  setForce(false)
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
