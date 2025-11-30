import { useQuery, keepPreviousData } from '@tanstack/react-query'
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
    queryKey: [
      'product1688',
      'list',
      {
        page: query?.page,
        limit: query?.limit,
        status: query?.status,
        search: query?.search,
        sortBy: query?.sortBy,
        sortOrder: query?.sortOrder,
      },
    ],
    queryFn: () => api.product1688.list(query),
    enabled,
    staleTime: 1000 * 90,
    gcTime: 1000 * 60 * 5,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  })
}
