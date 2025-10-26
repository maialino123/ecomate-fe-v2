import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ApproveProduct1688Request, ApproveProduct1688Response } from '../../types/product1688.types'
import { useNotificationStore } from '../../stores'
import { handleApiError } from '../../api/interceptors'

interface UseProduct1688ApproveOptions {
  api: {
    product1688: {
      approve: (id: string, data: ApproveProduct1688Request) => Promise<ApproveProduct1688Response>
    }
  }
  onSuccess?: (data: ApproveProduct1688Response) => void
  onError?: (error: unknown) => void
}

export function useProduct1688Approve({ api, onSuccess, onError }: UseProduct1688ApproveOptions) {
  const queryClient = useQueryClient()
  const { success, error: showError } = useNotificationStore()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ApproveProduct1688Request }) =>
      api.product1688.approve(id, data),
    onSuccess: data => {
      success('Product approved and imported to catalog', 'Product Approved')
      queryClient.invalidateQueries({ queryKey: ['product1688'] })
      onSuccess?.(data)
    },
    onError: error => {
      const apiError = handleApiError(error)
      showError(apiError.message, 'Approval Failed')
      onError?.(error)
    },
  })
}
