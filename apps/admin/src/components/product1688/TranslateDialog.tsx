import { useApi } from '@workspace/shared/providers'
import { useProduct1688Translate } from '@workspace/lib'
import { Badge } from '@workspace/ui/components/Badge'
import { Loader2, Languages } from 'lucide-react'
import { useNotificationStore } from '@workspace/lib'

interface TranslateDialogProps {
  productId: string
  productName?: string
  onSuccess?: () => void
}

export function TranslateDialog({ productId, productName, onSuccess }: TranslateDialogProps) {
  const api = useApi()
  const { info } = useNotificationStore()

  const translateMutation = useProduct1688Translate({
    api,
    onSuccess: data => {
      onSuccess?.()
      // Success toast is already handled in the hook
    },
  })

  const handleTranslate = () => {
    // Show start notification
    info(
      `Translation started${productName ? ` for ${productName}` : ''}`,
      'Translation In Progress'
    )

    // Trigger translation without confirmation
    translateMutation.mutate({ id: productId, options: {} })
  }

  // Show progress indicator when translating
  if (translateMutation.isPending) {
    const progress = translateMutation.data?.progress
    const progressText = progress
      ? `${progress.completed}/${progress.total}`
      : 'Processing...'

    return (
      <Badge
        variant="secondary"
        className="flex items-center gap-1.5 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 animate-pulse"
      >
        <Loader2 className="w-3 h-3 animate-spin" />
        <span className="text-xs font-medium">Translating {progressText}</span>
      </Badge>
    )
  }

  // Show translate button when idle
  return (
    <button
      onClick={handleTranslate}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 border border-blue-600 dark:border-blue-400 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
      title="Translate to Vietnamese"
    >
      <Languages className="w-4 h-4" />
      <span>Translate</span>
    </button>
  )
}
