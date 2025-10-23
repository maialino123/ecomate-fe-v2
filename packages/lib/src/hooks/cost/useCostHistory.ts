import { useQuery, UseQueryResult } from '@tanstack/react-query'
import {
    PaginatedCostCalculationsResponse,
    QueryCostCalculationDto,
    CostCalculationResponse,
} from '../../api/sdk/cost.types'

interface UseCostHistoryOptions {
    api: {
        cost: {
            getCostCalculationsByProduct: (
                productId: string,
                query?: QueryCostCalculationDto,
            ) => Promise<PaginatedCostCalculationsResponse>
            getLatestCostCalculation: (productId: string) => Promise<CostCalculationResponse | null>
            getCostCalculation: (id: string) => Promise<CostCalculationResponse>
        }
    }
}

/**
 * Hook for fetching cost calculation history for a product
 */
export function useCostHistory(
    { api }: UseCostHistoryOptions,
    productId: string,
    query?: QueryCostCalculationDto,
): UseQueryResult<PaginatedCostCalculationsResponse, Error> {
    return useQuery({
        queryKey: ['cost-calculations', 'product', productId, query],
        queryFn: async () => {
            return await api.cost.getCostCalculationsByProduct(productId, query)
        },
        enabled: !!productId,
    })
}

/**
 * Hook for fetching latest cost calculation for a product
 */
export function useLatestCostCalculation(
    { api }: UseCostHistoryOptions,
    productId: string,
): UseQueryResult<CostCalculationResponse | null, Error> {
    return useQuery({
        queryKey: ['cost-calculations', 'latest', productId],
        queryFn: async () => {
            return await api.cost.getLatestCostCalculation(productId)
        },
        enabled: !!productId,
    })
}

/**
 * Hook for fetching a single cost calculation by ID
 */
export function useCostCalculation({ api }: UseCostHistoryOptions, id: string): UseQueryResult<CostCalculationResponse, Error> {
    return useQuery({
        queryKey: ['cost-calculations', id],
        queryFn: async () => {
            return await api.cost.getCostCalculation(id)
        },
        enabled: !!id,
    })
}
