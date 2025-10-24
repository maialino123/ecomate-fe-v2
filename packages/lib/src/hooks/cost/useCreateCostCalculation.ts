import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { CreateCostCalculationDto, CostCalculationResponse } from '../../api/sdk/cost.types'

interface UseCreateCostCalculationOptions {
    api: {
        cost: {
            createCostCalculation: (dto: CreateCostCalculationDto) => Promise<CostCalculationResponse>
        }
    }
}

/**
 * Hook for creating and saving cost calculation
 */
export function useCreateCostCalculation({
    api,
}: UseCreateCostCalculationOptions): UseMutationResult<CostCalculationResponse, Error, CreateCostCalculationDto> {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (dto: CreateCostCalculationDto) => {
            return await api.cost.createCostCalculation(dto)
        },
        onSuccess: (data) => {
            // Invalidate cost history queries for this product
            queryClient.invalidateQueries({
                queryKey: ['cost-calculations', 'product', data.productId],
            })
            queryClient.invalidateQueries({
                queryKey: ['cost-calculations', 'latest', data.productId],
            })
        },
    })
}
