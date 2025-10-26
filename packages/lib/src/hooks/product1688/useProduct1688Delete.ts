import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotificationStore } from '../../stores'
import { handleApiError } from '../../api/interceptors'

interface UseProduct1688DeleteOptions {
  api: {
    product1688: {
      delete: (id: string) => Promise<{ success: boolean }>
    }
  }
  onSuccess?: (data: { success: boolean }) => void
  onError?: (error: unknown) => void
}

export function useProduct1688Delete({ api, onSuccess, onError }: UseProduct1688DeleteOptions) {
  const queryClient = useQueryClient()
  const { success, error: showError } = useNotificationStore()

  return useMutation({
    mutationFn: (id: string) => api.product1688.delete(id),
    onSuccess: data => {
      success('Product deleted successfully', 'Product Deleted')
      queryClient.invalidateQueries({ queryKey: ['product1688'] })
      onSuccess?.(data)
    },
    onError: error => {
      const apiError = handleApiError(error)
      showError(apiError.message, 'Delete Failed')
      onError?.(error)
    },
  })
}
