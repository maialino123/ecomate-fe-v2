import { AxiosInstance } from 'axios'
import {
    CalculatePriceDto,
    CreateCostCalculationDto,
    UpdateCostCalculationDto,
    PriceCalculationResult,
    CostCalculationResponse,
    QueryCostCalculationDto,
    PaginatedCostCalculationsResponse,
} from './cost.types'
import { MessageResponse } from './auth.types'

export class CostApi {
    constructor(private readonly client: AxiosInstance) {}

    /**
     * Quick price calculation (without saving to database)
     * POST /v1/cost/calculate
     */
    async calculatePrice(dto: CalculatePriceDto): Promise<PriceCalculationResult> {
        const response = await this.client.post<PriceCalculationResult>('/v1/cost/calculate', dto)
        return response.data
    }

    /**
     * Create and save cost calculation
     * POST /v1/cost/calculations
     */
    async createCostCalculation(dto: CreateCostCalculationDto): Promise<CostCalculationResponse> {
        const response = await this.client.post<CostCalculationResponse>('/v1/cost/calculations', dto)
        return response.data
    }

    /**
     * Get cost calculation by ID
     * GET /v1/cost/calculations/:id
     */
    async getCostCalculation(id: string): Promise<CostCalculationResponse> {
        const response = await this.client.get<CostCalculationResponse>(`/v1/cost/calculations/${id}`)
        return response.data
    }

    /**
     * Get all cost calculations for a product
     * GET /v1/cost/calculations/product/:productId
     */
    async getCostCalculationsByProduct(
        productId: string,
        query?: QueryCostCalculationDto,
    ): Promise<PaginatedCostCalculationsResponse> {
        const response = await this.client.get<PaginatedCostCalculationsResponse>(
            `/v1/cost/calculations/product/${productId}`,
            { params: query },
        )
        return response.data
    }

    /**
     * Get latest cost calculation for a product
     * GET /v1/cost/calculations/product/:productId/latest
     */
    async getLatestCostCalculation(productId: string): Promise<CostCalculationResponse | null> {
        const response = await this.client.get<CostCalculationResponse | null>(
            `/v1/cost/calculations/product/${productId}/latest`,
        )
        return response.data
    }

    /**
     * Update cost calculation
     * PATCH /v1/cost/calculations/:id
     */
    async updateCostCalculation(id: string, dto: UpdateCostCalculationDto): Promise<CostCalculationResponse> {
        const response = await this.client.patch<CostCalculationResponse>(`/v1/cost/calculations/${id}`, dto)
        return response.data
    }

    /**
     * Delete cost calculation
     * DELETE /v1/cost/calculations/:id
     */
    async deleteCostCalculation(id: string): Promise<void> {
        await this.client.delete(`/v1/cost/calculations/${id}`)
    }
}
