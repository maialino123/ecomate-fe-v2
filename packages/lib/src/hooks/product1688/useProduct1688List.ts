import { useQuery } from '@tanstack/react-query'
import { Product1688ListResponse, QueryProduct1688Request } from '../../types/product1688.types'

interface UseProduct1688ListOptions {
  api: {
    product1688: {
      list: (query?: QueryProduct1688Request) => Promise<Product1688ListResponse>
    }
  }
  query?: QueryProduct1688Request
  enabled?: boolean
}

export function useProduct1688List({ api, query, enabled = true }: UseProduct1688ListOptions) {
  return useQuery({
    queryKey: ['product1688', 'list', query],
    queryFn: () => api.product1688.list(query),
    enabled,
    staleTime: 1000 * 30, // 30 seconds
  })
}
