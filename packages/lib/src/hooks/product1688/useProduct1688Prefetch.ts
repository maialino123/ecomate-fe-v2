import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { QueryProduct1688Request, Product1688ListResponse } from '../../types/product1688.types'

interface UseProduct1688PrefetchOptions {
  api: {
    product1688: {
      list: (query?: QueryProduct1688Request) => Promise<Product1688ListResponse>
    }
  }
  query: QueryProduct1688Request
  hasNextPage: boolean
}

export function useProduct1688Prefetch({ api, query, hasNextPage }: UseProduct1688PrefetchOptions) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!hasNextPage) return

    const nextPage = (query.page ?? 1) + 1
    const nextPageQuery = { ...query, page: nextPage }

    queryClient.prefetchQuery({
      queryKey: [
        'product1688',
        'list',
        {
          page: nextPageQuery.page,
          limit: nextPageQuery.limit,
          status: nextPageQuery.status,
          search: nextPageQuery.search,
          sortBy: nextPageQuery.sortBy,
          sortOrder: nextPageQuery.sortOrder,
        },
      ],
      queryFn: () => api.product1688.list(nextPageQuery),
      staleTime: 1000 * 90, // match list hook staleTime
    })
  }, [
    api,
    queryClient,
    hasNextPage,
    query.page,
    query.limit,
    query.status,
    query.search,
    query.sortBy,
    query.sortOrder,
  ])
}
