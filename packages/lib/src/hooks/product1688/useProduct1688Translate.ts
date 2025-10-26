import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TranslateProduct1688Request, TranslateProduct1688Response } from '../../types/product1688.types'
import { useNotificationStore } from '../../stores'
import { handleApiError } from '../../api/interceptors'

interface UseProduct1688TranslateOptions {
  api: {
    product1688: {
      translate: (id: string, options?: TranslateProduct1688Request) => Promise<TranslateProduct1688Response>
    }
  }
  onSuccess?: (data: TranslateProduct1688Response) => void
  onError?: (error: unknown) => void
}

export function useProduct1688Translate({ api, onSuccess, onError }: UseProduct1688TranslateOptions) {
  const queryClient = useQueryClient()
  const { success, error: showError } = useNotificationStore()

  return useMutation({
    mutationFn: ({ id, options }: { id: string; options?: TranslateProduct1688Request }) =>
      api.product1688.translate(id, options),
    onSuccess: data => {
      success('Product translated successfully', 'Translation Complete')
      queryClient.invalidateQueries({ queryKey: ['product1688'] })
      onSuccess?.(data)
    },
    onError: error => {
      const apiError = handleApiError(error)
      showError(apiError.message, 'Translation Failed')
      onError?.(error)
    },
  })
}
