import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { CalculatePriceDto, PriceCalculationResult } from '../../api/sdk/cost.types'

interface UseCalculatePriceOptions {
    api: {
        cost: {
            calculatePrice: (dto: CalculatePriceDto) => Promise<PriceCalculationResult>
        }
    }
}

/**
 * Hook for quick price calculation (without saving to DB)
 * Uses mutation to allow manual trigger and better error handling
 */
export function useCalculatePrice({
    api,
}: UseCalculatePriceOptions): UseMutationResult<PriceCalculationResult, Error, CalculatePriceDto> {
    return useMutation({
        mutationFn: async (dto: CalculatePriceDto) => {
            return await api.cost.calculatePrice(dto)
        },
    })
}
