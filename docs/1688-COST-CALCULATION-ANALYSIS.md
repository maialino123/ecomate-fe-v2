# Báo cáo Phân tích Luồng Tính toán Cost trong hệ thống 1688

**Ngày:** 2025-12-10  
**Người thực hiện:** Copilot Agent  
**Phiên bản:** v1.0

---

## 1. Tổng quan (Executive Summary)

Hệ thống tính toán giá bán cho sản phẩm 1688 của Ecomate là một module phức tạp, bao gồm cả tính toán phía client và server. Module này giúp doanh nghiệp:
- Tính toán giá vốn từ sản phẩm nhập từ 1688 (Trung Quốc)
- Xác định giá bán đề xuất dựa trên các tham số kinh doanh
- Lưu trữ và theo dõi lịch sử tính toán chi phí cho từng variant
- Hỗ trợ ra quyết định kinh doanh thông qua các chỉ số như lợi nhuận ròng, giá hòa vốn

---

## 2. Kiến trúc Hệ thống

### 2.1 Cấu trúc Tổng quan

```
Frontend (React/Next.js)
│
├── UI Components (apps/admin/src/components/)
│   ├── product1688/
│   │   ├── CostCalculatorDialog.tsx          # Dialog tính toán cost cho variant
│   │   ├── VariantCostHistoryList.tsx        # Hiển thị lịch sử tính toán
│   │   ├── VariantCard.tsx                   # Card hiển thị variant
│   │   └── VariantGrid.tsx                   # Grid các variant
│   │
│   └── cost/
│       ├── CostCalculationForm.tsx           # Form nhập liệu tính toán
│       ├── CalculationResult.tsx             # Hiển thị kết quả
│       └── FormulaGuide.tsx                  # Hướng dẫn công thức
│
├── API SDK (packages/lib/src/api/sdk/)
│   ├── cost.api.ts                           # API client cho cost calculation
│   ├── cost.types.ts                         # Type definitions
│   └── product1688.api.ts                    # API client cho product 1688
│
├── React Hooks (packages/lib/src/hooks/cost/)
│   ├── useCalculatePrice.ts                  # Hook tính toán giá
│   ├── useCreateCostCalculation.ts           # Hook lưu tính toán
│   └── useCostHistory.ts                     # Hook lấy lịch sử
│
└── Types (packages/lib/src/types/)
    └── product1688.types.ts                  # Product 1688 types
```

---

## 3. Luồng Dữ liệu (Data Flow)

### 3.1 Luồng Tính toán Giá cho Variant 1688

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                              │
│  CostCalculatorDialog.tsx (Dialog chính cho tính toán variant)     │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     INPUT COLLECTION                                │
│  User nhập các thông số:                                           │
│  • Giá nhập (CNY) - importPrice                                    │
│  • Phí ship nội địa TQ (CNY) - domesticShippingCN                  │
│  • Phí ship quốc tế (VND) - internationalShippingVN               │
│  • Phí xử lý/thuế (VND) - handlingFee                             │
│  • Tỷ giá CNY→VND - exchangeRateCNY                               │
│  • Số lượng - quantity                                             │
│  • Tỷ lệ hoàn hàng (%) - returnRate                               │
│  • Phí sàn TMĐT (%) - platformFeeRate                             │
│  • Biên lợi nhuận (%) - profitMarginRate                          │
│  • Ghi chú - notes (optional)                                      │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    API REQUEST BUILDING                             │
│  SaveCostCalculationRequest:                                        │
│  {                                                                  │
│    product1688Id: string,                                          │
│    variantSku: string,                                             │
│    importPrice: number,                                            │
│    domesticShippingCN: number,                                     │
│    internationalShippingVN: number,                                │
│    handlingFee: number,                                            │
│    exchangeRateCNY: number,                                        │
│    quantity: number,                                               │
│    returnRate: number,                                             │
│    platformFeeRate: number,                                        │
│    profitMarginRate: number,                                       │
│    notes?: string                                                  │
│  }                                                                  │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      API CALL                                       │
│  POST /v1/1688-products/variant-cost/calculate                     │
│  (via product1688.api.ts → saveVariantCostCalculation)            │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND PROCESSING                               │
│  • Nhận request từ frontend                                        │
│  • Thực hiện tính toán theo công thức                              │
│  • Lưu vào database (bảng variant_cost_history)                   │
│  • Cập nhật costCalculation trong Product1688Variant               │
│  • Trả về SaveCostCalculationResponse                              │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    RESULT DISPLAY                                   │
│  SaveCostCalculationResponse:                                       │
│  {                                                                  │
│    success: boolean,                                               │
│    result: {                                                       │
│      baseCost: number,              // Giá vốn cơ bản             │
│      effectiveCost: number,         // Giá vốn hiệu dụng          │
│      suggestedSellingPrice: number, // Giá bán đề xuất            │
│      netProfit: number,             // Lợi nhuận ròng             │
│      breakEvenPrice: number         // Giá hòa vốn                │
│    }                                                                │
│  }                                                                  │
│                                                                     │
│  Hiển thị trên UI:                                                 │
│  • Kết quả tính toán (màu xanh nếu có lời)                        │
│  • Chuyển sang tab lịch sử sau 500ms                              │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Luồng Tính toán Nhanh (Cost Calculator Page)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    COST CALCULATOR PAGE                             │
│  /dashboard/cost-calculator                                         │
│  (Standalone calculator - không lưu DB)                            │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  CostCalculationForm.tsx                            │
│  • Form với các input tương tự variant calculator                  │
│  • Thêm marketing costs:                                           │
│    - marketingCostVND (chi phí marketing cố định)                 │
│    - marketingRate (% marketing trên giá bán)                     │
│  • Sử dụng react-hook-form để quản lý form state                  │
│  • Watch tất cả form values                                        │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      DEBOUNCING                                     │
│  useDebounce(formValues, 500ms)                                    │
│  • Tránh tính toán quá nhiều khi user đang nhập                   │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│              CLIENT-SIDE CALCULATION                                │
│  calculatePrice() function trong CostCalculationForm.tsx            │
│  • Tính toán trực tiếp trên client (không gọi API)                │
│  • Validation inputs                                                │
│  • Áp dụng công thức tính toán (xem phần 4)                       │
│  • Trả về PriceCalculationResult                                   │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  RESULT DISPLAY                                     │
│  CalculationResult.tsx                                              │
│  • Hiển thị kết quả chi tiết                                       │
│  • Breakdown từng bước tính toán                                   │
│  • Visualization các chỉ số                                        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. Công thức Tính toán Chi tiết

### 4.1 Các Biến Đầu vào

| Ký hiệu | Tên biến | Mô tả | Đơn vị | Giá trị mặc định |
|---------|----------|-------|--------|------------------|
| `P_nhập` | importPrice | Giá nhập từ 1688/xưởng | CNY (¥) | - |
| `P_shipTQ` | domesticShippingCN | Phí ship nội địa TQ | CNY (¥) | 0 |
| `P_shipVN` | internationalShippingVN | Phí ship quốc tế (TQ → VN) | VND (₫) | 0 |
| `P_xử_lý` | handlingFee | Chi phí xử lý/gom hàng/thuế | VND (₫) | 0 |
| `M_fixed` | marketingCostVND | Chi phí marketing cố định cho lô | VND (₫) | 0 |
| `T_CNY→VND` | exchangeRateCNY | Tỷ giá CNY sang VND | VND/¥ | 3600 |
| `SL` | quantity | Số lượng sản phẩm trong lô | cái | 1 |
| `R` | returnRate | Tỷ lệ hoàn hàng | decimal | 0.05 (5%) |
| `F` | platformFeeRate | Phí sàn TMĐT | decimal | 0.2 (20%) |
| `G` | profitMarginRate | Biên lợi nhuận mong muốn | decimal | 0.15 (15%) |
| `M_rate` | marketingRate | Tỷ lệ % marketing trên giá bán | decimal | 0.1 (10%) |

### 4.2 Các Bước Tính toán

#### Bước 1: Tổng chi phí CNY
```
totalCNYCost = P_nhập + P_shipTQ
```

#### Bước 2: Quy đổi sang VND
```
totalCNYInVND = totalCNYCost × T_CNY→VND
```

#### Bước 3: Tổng chi phí VND (bao gồm marketing cố định)
```
totalVNDCost = totalCNYInVND + P_shipVN + P_xử_lý + M_fixed
```

#### Bước 4: Giá vốn cơ bản (C₀)
```
C₀ = totalVNDCost / SL
```

**Ý nghĩa**: Giá vốn thực tế của 1 sản phẩm sau khi nhập về Việt Nam, đã chia đều chi phí vận chuyển và xử lý cho toàn bộ lô hàng.

#### Bước 5: Giá vốn hiệu dụng (C_eff)
```
C_eff = C₀ / (1 - R)
```

**Ý nghĩa**: Chi phí thực tế khi tính đến tỷ lệ hoàn hàng. Ví dụ nếu R = 5%, nghĩa là cứ 100 sản phẩm bán ra thì có 5 sản phẩm bị hoàn trả, chi phí của 5 sản phẩm đó phải được phân bổ vào 95 sản phẩm còn lại.

**Điều kiện**: `R < 1` (tỷ lệ hoàn hàng phải nhỏ hơn 100%)

#### Bước 6: Tổng tỷ lệ phí (totalFeeRate)
```
totalFeeRate = F + M_rate
```

**Ý nghĩa**: Tổng tỷ lệ phí cần trừ từ giá bán, bao gồm cả phí sàn TMĐT và chi phí marketing (tính theo % giá bán).

#### Bước 7: Giá bán đề xuất (P)
```
P = [C_eff × (1 + G)] / (1 - totalFeeRate)
```

**Ý nghĩa**: Giá bán cần đạt để có được lợi nhuận mục tiêu (G) sau khi đã trừ đi phí sàn và phí marketing.

**Điều kiện**: `totalFeeRate < 1` (tổng phí phải nhỏ hơn 100%)

**Giải thích công thức**:
- `C_eff × (1 + G)`: Giá vốn cộng với lợi nhuận mong muốn
- `/ (1 - totalFeeRate)`: Điều chỉnh lên để bù trừ phần phí sàn và marketing sẽ bị trừ đi

#### Bước 8: Lợi nhuận ròng (L)
```
L = P × (1 - totalFeeRate) - C_eff
```

**Ý nghĩa**: Lợi nhuận thực tế trên mỗi sản phẩm bán được, sau khi đã trừ đi tất cả các chi phí và phí.

**Giải thích**:
- `P × (1 - totalFeeRate)`: Số tiền thực nhận sau khi trừ phí sàn và marketing
- `- C_eff`: Trừ đi giá vốn hiệu dụng

#### Bước 9: Giá hòa vốn (P_BE - Break Even Price)
```
P_BE = C_eff / (1 - totalFeeRate)
```

**Ý nghĩa**: Giá tối thiểu để không lỗ (khi G = 0). Đây là điểm break-even, bán dưới giá này sẽ bị lỗ.

### 4.3 Các Chỉ số Phụ

#### Biên lợi nhuận thực tế (Profit Margin Percentage)
```
profitMarginPercentage = (L / C_eff) × 100
```

#### Các tỷ lệ phần trăm
```
platformFeePercentage = F × 100
marketingRatePercentage = M_rate × 100
totalFeePercentage = totalFeeRate × 100
returnRatePercentage = R × 100
```

### 4.4 Ví dụ Tính toán Cụ thể

**Input:**
- P_nhập = 5.2 CNY
- P_shipTQ = 10 CNY
- T_CNY→VND = 3,600
- P_shipVN = 75,000 VND
- P_xử_lý = 50,000 VND
- M_fixed = 500,000 VND
- SL = 50
- R = 0.05 (5%)
- F = 0.20 (20%)
- M_rate = 0.10 (10%)
- G = 0.15 (15%)

**Tính toán:**

1. `totalCNYCost = 5.2 + 10 = 15.2 CNY`

2. `totalCNYInVND = 15.2 × 3,600 = 54,720 VND`

3. `totalVNDCost = 54,720 + 75,000 + 50,000 + 500,000 = 679,720 VND`

4. `C₀ = 679,720 / 50 = 13,594.4 VND`

5. `C_eff = 13,594.4 / (1 - 0.05) = 13,594.4 / 0.95 = 14,309.9 VND`

6. `totalFeeRate = 0.20 + 0.10 = 0.30 (30%)`

7. `P = 14,309.9 × 1.15 / 0.70 = 16,456.4 / 0.70 = 23,509.1 VND`

8. `L = 23,509.1 × 0.70 - 14,309.9 = 16,456.4 - 14,309.9 = 2,146.5 VND`

9. `P_BE = 14,309.9 / 0.70 = 20,442.7 VND`

**Kết quả:**
- Giá vốn cơ bản (C₀): **13,594 VND**
- Giá vốn hiệu dụng (C_eff): **14,310 VND**
- Giá bán đề xuất (P): **23,509 VND**
- Lợi nhuận ròng (L): **2,147 VND** (15% trên C_eff)
- Giá hòa vốn (P_BE): **20,443 VND**

---

## 5. Chi tiết Code Implementation

### 5.1 CostCalculatorDialog.tsx (Variant Cost Calculator)

**File**: `apps/admin/src/components/product1688/CostCalculatorDialog.tsx`

**Mục đích**: Dialog để tính toán chi phí cho từng variant của sản phẩm 1688

**Các tính năng chính**:

1. **Form Input với React Hook Form**:
```typescript
const {
  register,
  control,
  handleSubmit,
  reset,
  formState: { errors },
} = useForm<CostFormData>({
  defaultValues: {
    importPrice: variant.price || 0,
    domesticShippingCN: 0,
    internationalShippingVN: 0,
    handlingFee: 0,
    exchangeRateCNY: 3600,
    quantity: 1,
    returnRate: 0.05,
    platformFeeRate: 0.2,
    profitMarginRate: 0.15,
    notes: '',
  },
})
```

2. **Submit Handler**:
```typescript
const onSubmit = async (data: CostFormData) => {
  setIsLoading(true)
  
  const requestData: SaveCostCalculationRequest = {
    product1688Id: productId,
    variantSku: variant.sku,
    importPrice: data.importPrice,
    domesticShippingCN: data.domesticShippingCN,
    // ... other fields
  }
  
  const response = await api.product1688.saveVariantCostCalculation(requestData)
  
  if (response.success) {
    setResult(response.result)
    onSuccess?.()
    // Chuyển sang view lịch sử
    setTimeout(() => {
      setShowHistory(true)
    }, 500)
  }
}
```

3. **UI Sections**:
   - Chi phí nhập hàng (CNY): giá nhập, ship nội địa
   - Chi phí vận chuyển & xử lý (VND): ship quốc tế, phí xử lý
   - Tỷ giá & Số lượng: exchange rate, quantity
   - Tham số kinh doanh: return rate, platform fee, profit margin
   - Hiển thị kết quả tính toán
   - Nút xem lịch sử

### 5.2 CostCalculationForm.tsx (Client-side Calculator)

**File**: `apps/admin/src/components/cost/CostCalculationForm.tsx`

**Mục đích**: Form tính toán nhanh trên client, không lưu vào DB

**Đặc điểm**:

1. **Client-side Calculation**:
```typescript
const calculatePrice = (dto: CalculatePriceDto): PriceCalculationResult | null => {
  // Validation
  if (!dto.importPrice || dto.importPrice <= 0) return null
  if (!dto.exchangeRateCNY || dto.exchangeRateCNY <= 0) return null
  if (!dto.quantity || dto.quantity <= 0) return null
  
  // Extract values
  const importPrice = dto.importPrice || 0
  const domesticShippingCN = dto.domesticShippingCN || 0
  // ... more fields
  
  // Calculate total fee rate (platform + marketing)
  const totalFeeRate = platformFeeRate + marketingRate
  
  // Step 1: Total CNY cost
  const totalCNYCost = importPrice + domesticShippingCN
  
  // Step 2: Convert to VND
  const totalCNYInVND = totalCNYCost * exchangeRateCNY
  
  // Step 3: Total VND cost (including fixed marketing cost)
  const totalVNDCost = totalCNYInVND + internationalShippingVN + handlingFee + marketingCostVND
  
  // Step 4: Base cost per unit
  const baseCost = totalVNDCost / quantity
  
  // Step 5: Effective cost with return rate
  if (returnRate >= 1) return null
  const effectiveCost = baseCost / (1 - returnRate)
  
  // Step 6: Suggested selling price
  if (totalFeeRate >= 1) return null
  const suggestedSellingPrice = (effectiveCost * (1 + profitMarginRate)) / (1 - totalFeeRate)
  
  // Step 7: Net profit
  const netProfit = suggestedSellingPrice * (1 - totalFeeRate) - effectiveCost
  
  // Step 8: Break-even price
  const breakEvenPrice = effectiveCost / (1 - totalFeeRate)
  
  return {
    baseCost,
    effectiveCost,
    suggestedSellingPrice,
    netProfit,
    breakEvenPrice,
    calculationBreakdown: { /* ... detailed breakdown */ }
  }
}
```

2. **Auto-calculation với Debouncing**:
```typescript
const formValues = watch() // Watch all form values
const debouncedValues = useDebounce(formValues, 500) // Debounce 500ms

useEffect(() => {
  onCalculationLoading(true)
  const result = calculatePrice(debouncedValues)
  onCalculationResult(result)
  onCalculationLoading(false)
}, [debouncedValues, onCalculationResult, onCalculationLoading])
```

3. **Additional Marketing Costs**:
   - `marketingCostVND`: Chi phí marketing cố định cho lô hàng
   - `marketingRate`: Tỷ lệ % marketing trên giá bán

### 5.3 CalculationResult.tsx (Result Display)

**File**: `apps/admin/src/components/cost/CalculationResult.tsx`

**Mục đích**: Component hiển thị kết quả tính toán chi tiết

**Các section hiển thị**:

1. **Main Results**:
   - Giá bán đề xuất (suggested selling price) - highlight màu xanh
   - Lợi nhuận ròng (net profit) - màu xanh nếu dương, đỏ nếu âm
   - Biên lợi nhuận (profit margin percentage)

2. **Cost Details**:
   - Giá vốn cơ bản (C₀)
   - Giá vốn hiệu dụng (C_eff)
   - Giá hòa vốn (P_BE)

3. **Detailed Breakdown**:
   - Tổng chi phí CNY
   - Quy đổi sang VND
   - Tổng chi phí VND
   - Số lượng
   - Tỷ lệ hoàn hàng
   - Phí sàn TMĐT
   - Tỷ lệ marketing
   - Tổng phí (sàn + marketing)
   - Chi phí marketing cố định

### 5.4 FormulaGuide.tsx (Formula Documentation)

**File**: `apps/admin/src/components/cost/FormulaGuide.tsx`

**Mục đích**: Component expandable hiển thị công thức và hướng dẫn

**Nội dung**:

1. **Currency Warning**: Cảnh báo về đơn vị tiền tệ (CNY vs VND)

2. **Variable Definitions**: Bảng định nghĩa các biến với:
   - Ký hiệu (P_nhập, P_shipTQ, ...)
   - Tên biến
   - Mô tả
   - Đơn vị (CNY hoặc VND)

3. **Formula Steps**: Từng bước tính toán với công thức và giải thích

4. **Example**: Ví dụ tính toán cụ thể

---

## 6. API Integration

### 6.1 Cost API (cost.api.ts)

**File**: `packages/lib/src/api/sdk/cost.api.ts`

**Endpoints**:

1. **Calculate Price (Quick calculation)**:
```typescript
async calculatePrice(dto: CalculatePriceDto): Promise<PriceCalculationResult> {
  const response = await this.client.post<PriceCalculationResult>(
    '/v1/cost/calculate',
    dto
  )
  return response.data
}
```
- Không lưu vào DB
- Trả về kết quả tính toán nhanh

2. **Create Cost Calculation**:
```typescript
async createCostCalculation(dto: CreateCostCalculationDto): Promise<CostCalculationResponse> {
  const response = await this.client.post<CostCalculationResponse>(
    '/v1/cost/calculations',
    dto
  )
  return response.data
}
```
- Lưu tính toán vào DB
- Liên kết với productId

3. **Get Cost Calculations by Product**:
```typescript
async getCostCalculationsByProduct(
  productId: string,
  query?: QueryCostCalculationDto,
): Promise<PaginatedCostCalculationsResponse>
```

4. **Get Latest Cost Calculation**:
```typescript
async getLatestCostCalculation(productId: string): Promise<CostCalculationResponse | null>
```

### 6.2 Product1688 API (product1688.api.ts)

**File**: `packages/lib/src/api/sdk/product1688.api.ts`

**Variant Cost Endpoints**:

1. **Save Variant Cost Calculation**:
```typescript
async saveVariantCostCalculation(
  data: SaveCostCalculationRequest
): Promise<SaveCostCalculationResponse> {
  const response = await this.client.post<SaveCostCalculationResponse>(
    '/v1/1688-products/variant-cost/calculate',
    data
  )
  return response.data
}
```
- Lưu tính toán cho variant cụ thể
- Cập nhật `costCalculation` trong variant

2. **Get Variant Cost History**:
```typescript
async getVariantCostHistory(
  productId: string,
  variantSku: string
): Promise<VariantCostHistoryResponse> {
  const response = await this.client.get<VariantCostHistoryResponse>(
    `/v1/1688-products/${productId}/variant-cost/${encodeURIComponent(variantSku)}`
  )
  return response.data
}
```

---

## 7. Type Definitions

### 7.1 Cost Types (cost.types.ts)

**File**: `packages/lib/src/api/sdk/cost.types.ts`

**Key Interfaces**:

```typescript
// DTO for calculation
export interface CalculatePriceDto {
  importPrice: number                    // CNY
  domesticShippingCN?: number           // CNY
  internationalShippingVN?: number      // VND
  handlingFee?: number                  // VND
  exchangeRateCNY: number               // VND per CNY
  quantity: number                      // units
  returnRate?: number                   // 0.05 = 5%
  platformFeeRate?: number              // 0.20 = 20%
  profitMarginRate?: number             // 0.15 = 15%
  marketingCostVND?: number             // VND
  marketingRate?: number                // 0.10 = 10%
}

// Calculation result
export interface PriceCalculationResult {
  baseCost: number
  effectiveCost: number
  suggestedSellingPrice: number
  netProfit: number
  breakEvenPrice: number
  calculationBreakdown: {
    inputs: { /* all input values */ }
    steps: { /* intermediate calculation steps */ }
    percentages: { /* percentage values for display */ }
  }
}

// Saved calculation
export interface CostCalculationResponse {
  id: string
  productId: string
  userId: string
  // All input fields
  importPrice: number
  domesticShippingCN: number
  // ... more fields
  // All calculated fields
  baseCost: number
  effectiveCost: number
  suggestedSellingPrice: number
  netProfit: number
  breakEvenPrice: number
  // Metadata
  currency: string
  notes?: string
  calculationData?: Record<string, any>
  createdAt: string
  updatedAt: string
}
```

### 7.2 Product1688 Types (product1688.types.ts)

**File**: `packages/lib/src/types/product1688.types.ts`

```typescript
export interface Product1688Variant {
  sku: string
  nameZh: string
  nameVi?: string
  attributes: Record<string, string>
  price: number
  stock?: number
  image?: string
  costCalculation?: {
    baseCost: number
    effectiveCost: number
    suggestedSellingPrice: number
    netProfit: number
    breakEvenPrice: number
    lastCalculatedAt: string
  }
}

export interface SaveCostCalculationRequest {
  product1688Id: string
  variantSku: string
  importPrice: number
  domesticShippingCN?: number
  internationalShippingVN?: number
  handlingFee?: number
  exchangeRateCNY: number
  quantity?: number
  returnRate?: number
  platformFeeRate?: number
  profitMarginRate?: number
  notes?: string
}

export interface SaveCostCalculationResponse {
  success: boolean
  result: CostCalculationResult
}

export interface VariantCostHistoryItem {
  id: string
  product1688Id: string
  variantSku: string
  userId: string
  // All input fields
  importPrice: number
  domesticShippingCN: number
  // ... more
  // All calculated fields
  baseCost: number
  effectiveCost: number
  suggestedSellingPrice: number
  netProfit: number
  breakEvenPrice: number
  calculationData?: any
  notes?: string
  createdAt: string
  updatedAt: string
}
```

---

## 8. React Hooks

### 8.1 useCalculatePrice

**File**: `packages/lib/src/hooks/cost/useCalculatePrice.ts`

```typescript
export function useCalculatePrice({
  api,
}: UseCalculatePriceOptions): UseMutationResult<PriceCalculationResult, Error, CalculatePriceDto> {
  return useMutation({
    mutationFn: async (dto: CalculatePriceDto) => {
      return await api.cost.calculatePrice(dto)
    },
  })
}
```

**Sử dụng**:
```typescript
const { mutate: calculatePrice, isPending } = useCalculatePrice({ api })

calculatePrice(calculationDto, {
  onSuccess: (result) => {
    console.log('Calculation result:', result)
  },
  onError: (error) => {
    console.error('Calculation error:', error)
  }
})
```

### 8.2 useCreateCostCalculation

**File**: `packages/lib/src/hooks/cost/useCreateCostCalculation.ts`

**Mục đích**: Hook để tạo và lưu cost calculation vào database

### 8.3 useCostHistory

**File**: `packages/lib/src/hooks/cost/useCostHistory.ts`

**Mục đích**: Hook để lấy lịch sử tính toán chi phí

---

## 9. Luồng Người dùng (User Flow)

### 9.1 Tính toán Cost cho Variant

1. **User mở product 1688 detail page**
   - Xem danh sách variants
   - Mỗi variant có nút "Tính giá"

2. **Click nút "Tính giá" trên variant card**
   - Mở `CostCalculatorDialog`
   - Form được pre-fill với giá nhập từ variant

3. **Nhập thông số tính toán**
   - Chi phí nhập hàng (CNY)
   - Chi phí vận chuyển (VND)
   - Tỷ giá và số lượng
   - Tham số kinh doanh (%, decimal)

4. **Click "Tính toán & Lưu"**
   - Gọi API `saveVariantCostCalculation`
   - Lưu vào database
   - Hiển thị kết quả
   - Auto chuyển sang tab lịch sử sau 500ms

5. **Xem lịch sử tính toán**
   - Danh sách các lần tính toán trước
   - So sánh giá bán qua các lần
   - Theo dõi sự thay đổi chi phí

### 9.2 Sử dụng Cost Calculator Page

1. **User truy cập `/dashboard/cost-calculator`**
   - Standalone calculator page
   - Không cần chọn product/variant

2. **Nhập thông số**
   - Form tương tự variant calculator
   - Có thêm marketing costs

3. **Real-time calculation**
   - Debounce 500ms
   - Tự động tính toán khi input thay đổi
   - Hiển thị kết quả ngay lập tức

4. **Xem công thức & hướng dẫn**
   - Click để expand FormulaGuide
   - Xem chi tiết từng bước tính toán
   - Ví dụ cụ thể

---

## 10. Validation và Error Handling

### 10.1 Input Validation

**CostCalculatorDialog.tsx**:
```typescript
{
  register('importPrice', {
    required: 'Giá nhập là bắt buộc',
    min: { value: 0, message: 'Giá phải >= 0' },
    valueAsNumber: true,
  })
}
```

**Validation Rules**:
- `importPrice`: required, >= 0
- `domesticShippingCN`: >= 0
- `internationalShippingVN`: >= 0
- `handlingFee`: >= 0
- `exchangeRateCNY`: required, > 0
- `quantity`: required, >= 1
- `returnRate`: >= 0, < 1 (< 100%)
- `platformFeeRate`: >= 0, < 1
- `profitMarginRate`: >= 0

### 10.2 Calculation Validation

**CostCalculationForm.tsx**:
```typescript
// Check return rate
if (returnRate >= 1) {
  console.error('Return rate cannot be 100% or higher')
  return null
}

// Check total fee rate
if (totalFeeRate >= 1) {
  console.error('Total fee rate (platform + marketing) cannot be 100% or higher')
  return null
}
```

### 10.3 Error Messages

**Từ API**:
```typescript
try {
  const response = await api.product1688.saveVariantCostCalculation(requestData)
  // handle success
} catch (error: any) {
  console.error('Failed to calculate cost:', error)
  alert(error.response?.data?.message || 'Failed to calculate cost')
}
```

---

## 11. Performance Optimization

### 11.1 Debouncing

**Trong CostCalculationForm**:
```typescript
const debouncedValues = useDebounce(formValues, 500)
```
- Tránh tính toán quá nhiều lần khi user đang nhập
- Delay 500ms trước khi trigger calculation

### 11.2 Client-side Calculation

**CostCalculationForm** sử dụng client-side calculation:
- Không cần gọi API cho mỗi lần thay đổi
- Tính toán ngay trên client
- Giảm tải cho server
- Phản hồi nhanh hơn

### 11.3 Lazy Loading

**Dialog Component**:
```typescript
if (!isOpen) return null
```
- Chỉ render khi dialog được mở
- Tiết kiệm resources

---

## 12. Security Considerations

### 12.1 Input Sanitization

- Sử dụng `valueAsNumber: true` trong react-hook-form
- Validation trên cả client và server
- Không cho phép giá trị âm hoặc vượt ngưỡng

### 12.2 Authorization

- API endpoints require authentication
- User ID được lưu trong cost calculation history
- Chỉ user có quyền mới xem/sửa calculations

### 12.3 Data Validation

- Backend validation trước khi lưu DB
- Kiểm tra ranges hợp lệ
- Prevent injection attacks

---

## 13. Future Improvements

### 13.1 Proposed Enhancements

1. **Batch Calculation**:
   - Tính toán cho nhiều variants cùng lúc
   - Export results to Excel

2. **Historical Analysis**:
   - Chart hiển thị xu hướng giá
   - So sánh chi phí qua thời gian
   - Alert khi chi phí thay đổi đáng kể

3. **Templates**:
   - Lưu các bộ tham số thường dùng
   - Quick apply templates

4. **AI Suggestions**:
   - Gợi ý giá bán dựa trên market data
   - Optimal pricing recommendations

5. **Currency Auto-update**:
   - Tự động cập nhật tỷ giá từ API
   - Historical exchange rates

6. **Mobile Optimization**:
   - Responsive design improvements
   - Mobile-first calculator

### 13.2 Known Issues / Limitations

1. **Marketing Cost Distribution**:
   - Hiện tại marketing cost được chia đều cho tất cả sản phẩm
   - Có thể cần phân bổ theo trọng số

2. **Exchange Rate**:
   - Phải nhập manual
   - Không có historical tracking

3. **Bulk Operations**:
   - Chưa hỗ trợ tính toán hàng loạt
   - Phải tính từng variant một

4. **Export/Import**:
   - Chưa có chức năng export calculations
   - Không thể import từ Excel

---

## 14. Testing Recommendations

### 14.1 Unit Tests

**Test Cases for Calculation Logic**:
```typescript
describe('calculatePrice', () => {
  it('should calculate base cost correctly', () => {
    // Test C₀ calculation
  })
  
  it('should calculate effective cost with return rate', () => {
    // Test C_eff calculation
  })
  
  it('should calculate suggested price with fees', () => {
    // Test P calculation
  })
  
  it('should return null for invalid inputs', () => {
    // Test validation
  })
  
  it('should handle return rate >= 1', () => {
    // Test edge case
  })
  
  it('should handle totalFeeRate >= 1', () => {
    // Test edge case
  })
})
```

### 14.2 Integration Tests

- Test API calls
- Test form submission
- Test error handling
- Test result display

### 14.3 E2E Tests

- Full user flow: open dialog → enter data → submit → view results
- Cost calculator page flow
- History viewing

---

## 15. Kết luận

### 15.1 Tóm tắt Hệ thống

Hệ thống tính toán giá cho sản phẩm 1688 là một module quan trọng trong Ecomate platform, giúp:

1. **Tính toán chính xác** giá vốn và giá bán đề xuất
2. **Quản lý chi phí** một cách có hệ thống
3. **Hỗ trợ quyết định** kinh doanh dựa trên dữ liệu
4. **Theo dõi lịch sử** để phân tích xu hướng

### 15.2 Công thức Cốt lõi

```
C₀ = [(P_nhập + P_shipTQ) × T_CNY→VND + P_shipVN + P_xử_lý + M_fixed] / SL

C_eff = C₀ / (1 - R)

P = [C_eff × (1 + G)] / (1 - F - M_rate)

L = P × (1 - F - M_rate) - C_eff

P_BE = C_eff / (1 - F - M_rate)
```

### 15.3 Điểm Mạnh

✅ **Accurate Calculation**: Công thức toán học chính xác, xem xét đầy đủ các yếu tố  
✅ **User-friendly UI**: Giao diện trực quan, dễ sử dụng  
✅ **Real-time Feedback**: Tính toán nhanh với debouncing  
✅ **Historical Tracking**: Lưu trữ và theo dõi lịch sử  
✅ **Comprehensive Breakdown**: Hiển thị chi tiết từng bước tính toán  
✅ **Type Safety**: TypeScript đảm bảo type safety  
✅ **Validation**: Validation chặt chẽ trên cả client và server  

### 15.4 Khuyến nghị

1. **Documentation**: Maintain và update documentation này khi có thay đổi
2. **Testing**: Implement comprehensive test suite
3. **Monitoring**: Track calculation accuracy và user feedback
4. **Optimization**: Continue to optimize performance
5. **Features**: Consider implementing suggested enhancements

---

## 16. Glossary (Thuật ngữ)

| Thuật ngữ | Tiếng Anh | Giải thích |
|-----------|-----------|-----------|
| Giá vốn cơ bản | Base Cost (C₀) | Chi phí thực tế của 1 sản phẩm sau khi nhập về |
| Giá vốn hiệu dụng | Effective Cost (C_eff) | Giá vốn có tính đến tỷ lệ hoàn hàng |
| Giá bán đề xuất | Suggested Selling Price (P) | Giá bán đề xuất để đạt lợi nhuận mục tiêu |
| Lợi nhuận ròng | Net Profit (L) | Lợi nhuận thực tế sau tất cả chi phí |
| Giá hòa vốn | Break-even Price (P_BE) | Giá tối thiểu để không lỗ |
| Tỷ lệ hoàn hàng | Return Rate (R) | Phần trăm sản phẩm bị khách hàng hoàn trả |
| Phí sàn TMĐT | Platform Fee (F) | Phí của sàn thương mại điện tử (Shopee, Lazada...) |
| Biên lợi nhuận | Profit Margin (G) | Tỷ lệ lợi nhuận mong muốn trên giá vốn |

---

## 17. Appendix

### 17.1 File Locations

```
Frontend Files:
├── apps/admin/src/components/
│   ├── product1688/
│   │   ├── CostCalculatorDialog.tsx
│   │   ├── VariantCostHistoryList.tsx
│   │   ├── VariantCard.tsx
│   │   └── VariantGrid.tsx
│   └── cost/
│       ├── CostCalculationForm.tsx
│       ├── CalculationResult.tsx
│       ├── FormulaGuide.tsx
│       └── FormattedNumberInput.tsx
│
├── packages/lib/src/
│   ├── api/sdk/
│   │   ├── cost.api.ts
│   │   ├── cost.types.ts
│   │   └── product1688.api.ts
│   ├── types/
│   │   └── product1688.types.ts
│   └── hooks/cost/
│       ├── useCalculatePrice.ts
│       ├── useCreateCostCalculation.ts
│       └── useCostHistory.ts
│
└── apps/admin/src/app/(dashboard)/dashboard/
    └── cost-calculator/page.tsx
```

### 17.2 API Endpoints Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/v1/cost/calculate` | Quick price calculation (no save) |
| POST | `/v1/cost/calculations` | Create and save cost calculation |
| GET | `/v1/cost/calculations/:id` | Get calculation by ID |
| GET | `/v1/cost/calculations/product/:productId` | Get all calculations for product |
| GET | `/v1/cost/calculations/product/:productId/latest` | Get latest calculation |
| PATCH | `/v1/cost/calculations/:id` | Update calculation |
| DELETE | `/v1/cost/calculations/:id` | Delete calculation |
| POST | `/v1/1688-products/variant-cost/calculate` | Save variant cost calculation |
| GET | `/v1/1688-products/:productId/variant-cost/:sku` | Get variant cost history |

### 17.3 Related Documentation

- Main README: `/README.md`
- Extension README: `/apps/extension/README.md`
- Performance Optimizations: `/docs/TOUR_SECTION_PERFORMANCE_OPTIMIZATIONS.md`

---

**Tài liệu này được tạo bởi:** Copilot Agent  
**Ngày cập nhật cuối:** 2025-12-10  
**Version:** 1.0  
**Status:** ✅ Complete
