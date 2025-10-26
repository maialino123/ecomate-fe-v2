import { useQuery } from '@tanstack/react-query'
import { Product1688Entity } from '../../types/product1688.types'

interface UseProduct1688DetailOptions {
  api: {
    product1688: {
      getById: (id: string) => Promise<Product1688Entity>
    }
  }
  id: string
  enabled?: boolean
}

export function useProduct1688Detail({ api, id, enabled = true }: UseProduct1688DetailOptions) {
  return useQuery({
    queryKey: ['product1688', 'detail', id],
    queryFn: () => api.product1688.getById(id),
    enabled: enabled && !!id,
    staleTime: 1000 * 30, // 30 seconds
  })
}
