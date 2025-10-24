/**
 * Cost Calculation API Types
 * Based on backend API: /cost/calculate and /cost/calculations
 */

/**
 * DTO for quick price calculation (without saving to DB)
 */
export interface CalculatePriceDto {
    // Input costs (Chi phí đầu vào)
    importPrice: number // P_nhập: Giá nhập từ 1688/xưởng (CNY)
    domesticShippingCN?: number // P_shipTQ: Phí ship nội địa TQ (CNY)
    internationalShippingVN?: number // P_shipVN: Phí ship quốc tế (VND)
    handlingFee?: number // P_xử_lý: Chi phí xử lý/gom hàng/thuế (VND)

    // Exchange rate and quantity
    exchangeRateCNY: number // T_CNY→VND: Tỷ giá CNY sang VND
    quantity: number // SL: Số lượng sản phẩm trong lô

    // Business parameters (Tham số kinh doanh)
    returnRate?: number // R: Tỷ lệ hoàn hàng (0.05 = 5%)
    platformFeeRate?: number // F: Phí sàn TMĐT (0.20 = 20%)
    profitMarginRate?: number // G: Biên lợi nhuận mong muốn (0.15 = 15%)
}

/**
 * DTO for creating cost calculation (saves to DB)
 */
export interface CreateCostCalculationDto extends CalculatePriceDto {
    productId: string // Product ID to calculate cost for
    currency?: string // Currency for the result
    notes?: string // Additional notes
}

/**
 * DTO for updating cost calculation
 */
export type UpdateCostCalculationDto = Partial<Omit<CreateCostCalculationDto, 'productId'>>

/**
 * Price calculation result (from quick calculation)
 */
export interface PriceCalculationResult {
    // Calculated results
    baseCost: number // C₀: Giá vốn cơ bản/sản phẩm (VND)
    effectiveCost: number // C_eff: Giá vốn hiệu dụng (có tính hoàn hàng) (VND)
    suggestedSellingPrice: number // P: Giá bán đề xuất (VND)
    netProfit: number // L: Lợi nhuận ròng/sản phẩm (VND)
    breakEvenPrice: number // P_BE: Giá hòa vốn (VND)

    // Calculation breakdown for detailed view
    calculationBreakdown: {
        // Input values
        inputs: {
            importPriceCNY: number
            domesticShippingCNY: number
            internationalShippingVND: number
            handlingFeeVND: number
            exchangeRateCNY: number
            quantity: number
            returnRate: number
            platformFeeRate: number
            profitMarginRate: number
        }
        // Step by step calculation
        steps: {
            totalCNYCost: number // (P_nhập + P_shipTQ)
            totalCNYInVND: number // (P_nhập + P_shipTQ) × T_CNY→VND
            totalVNDCost: number // Total in VND before division
            baseCostPerUnit: number // C₀
            effectiveCostPerUnit: number // C_eff
            priceBeforePlatformFee: number // P × (1-F)
            suggestedPrice: number // P
            netProfitPerUnit: number // L
            breakEvenPrice: number // P_BE
        }
        // Percentages for UI
        percentages: {
            profitMarginPercentage: number // (L / C_eff) × 100
            platformFeePercentage: number // F × 100
            returnRatePercentage: number // R × 100
        }
    }
}

/**
 * Cost calculation response (from saved calculation)
 */
export interface CostCalculationResponse {
    id: string
    productId: string
    userId: string

    // Input costs
    importPrice: number
    domesticShippingCN: number
    internationalShippingVN: number
    handlingFee: number

    // Exchange rate and quantity
    exchangeRateCNY: number
    quantity: number

    // Business parameters
    returnRate: number
    platformFeeRate: number
    profitMarginRate: number

    // Calculated results
    baseCost: number
    effectiveCost: number
    suggestedSellingPrice: number
    netProfit: number
    breakEvenPrice: number

    currency: string
    notes?: string
    calculationData?: Record<string, any>

    createdAt: string
    updatedAt: string
}

/**
 * Query parameters for listing cost calculations
 */
export interface QueryCostCalculationDto {
    page?: number
    limit?: number
    productId?: string
    sortBy?: 'createdAt' | 'updatedAt' | 'suggestedSellingPrice'
    sortOrder?: 'asc' | 'desc'
}

/**
 * Paginated cost calculations response
 */
export interface PaginatedCostCalculationsResponse {
    data: CostCalculationResponse[]
    total: number
    page: number
    limit: number
    totalPages: number
}

/**
 * Currency type
 */
export type CurrencyCode = 'CNY' | 'VND' | 'USD'

/**
 * Currency information for UI
 */
export interface CurrencyInfo {
    code: CurrencyCode
    symbol: string
    name: string
    locale: string
}
