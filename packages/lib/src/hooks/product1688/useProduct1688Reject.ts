import { useMutation, useQueryClient } from '@tanstack/react-query'
import { RejectProduct1688Request, Product1688Entity } from '../../types/product1688.types'
import { useNotificationStore } from '../../stores'
import { handleApiError } from '../../api/interceptors'

interface UseProduct1688RejectOptions {
  api: {
    product1688: {
      reject: (id: string, data: RejectProduct1688Request) => Promise<Product1688Entity>
    }
  }
  onSuccess?: (data: Product1688Entity) => void
  onError?: (error: unknown) => void
}

export function useProduct1688Reject({ api, onSuccess, onError }: UseProduct1688RejectOptions) {
  const queryClient = useQueryClient()
  const { success, error: showError } = useNotificationStore()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RejectProduct1688Request }) => api.product1688.reject(id, data),
    onSuccess: data => {
      success('Product rejected', 'Product Rejected')
      queryClient.invalidateQueries({ queryKey: ['product1688'] })
      onSuccess?.(data)
    },
    onError: error => {
      const apiError = handleApiError(error)
      showError(apiError.message, 'Rejection Failed')
      onError?.(error)
    },
  })
}
