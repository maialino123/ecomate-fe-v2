import { useMutation } from '@tanstack/react-query'
import { saveAs } from 'file-saver'
import { ExportProduct1688Request } from '../../types/product1688.types'
import { useNotificationStore } from '../../stores'
import { handleApiError } from '../../api/interceptors'

interface UseProduct1688ExportOptions {
  api: {
    product1688: {
      exportToExcel: (data: ExportProduct1688Request) => Promise<Blob>
    }
  }
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

/**
 * Hook for exporting Product1688 to Excel
 * Handles file download using file-saver
 */
export function useProduct1688Export({ api, onSuccess, onError }: UseProduct1688ExportOptions) {
  const { success, error: showError } = useNotificationStore()

  return useMutation({
    mutationFn: (data: ExportProduct1688Request) => api.product1688.exportToExcel(data),
    onSuccess: blob => {
      // Generate filename with date
      const now = new Date()
      const timestamp = [
        now.getFullYear().toString().slice(-2),
        (now.getMonth() + 1).toString().padStart(2, '0'),
        now.getDate().toString().padStart(2, '0'),
        '_',
        now.getHours().toString().padStart(2, '0'),
        now.getMinutes().toString().padStart(2, '0'),
      ].join('')
      const filename = `san_pham_1688_${timestamp}.xlsx`

      // Download file
      saveAs(blob, filename)

      success('Xuất Excel thành công!', 'Export')
      onSuccess?.()
    },
    onError: error => {
      const apiError = handleApiError(error)
      showError(apiError.message || 'Xuất Excel thất bại', 'Export Failed')
      onError?.(error)
    },
  })
}
