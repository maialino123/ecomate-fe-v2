# Tài liệu Hệ thống Tính toán Cost cho Sản phẩm 1688

**Ngày tạo:** 2025-12-10  
**Version:** 1.0

---

## 📚 Giới thiệu

Bộ tài liệu này cung cấp phân tích toàn diện về hệ thống tính toán giá bán cho sản phẩm nhập từ 1688 (Trung Quốc) trong ứng dụng Ecomate.

---

## 📋 Danh sách Tài liệu

### 1. [1688-COST-CALCULATION-ANALYSIS.md](./1688-COST-CALCULATION-ANALYSIS.md)

**Báo cáo Phân tích Chi tiết - Tài liệu Chính (35,000 từ)**

Tài liệu này cung cấp phân tích sâu và toàn diện về:

#### Nội dung chính:
- ✅ **Tổng quan hệ thống** (Executive Summary)
- ✅ **Kiến trúc hệ thống** với cấu trúc file chi tiết
- ✅ **Luồng dữ liệu** cho 2 loại calculator:
  - Variant Cost Calculator (Dialog-based, lưu DB)
  - Standalone Calculator (Page-based, client-side only)
- ✅ **Công thức tính toán** với 9 bước chi tiết
- ✅ **Chi tiết Code Implementation** cho từng component:
  - CostCalculatorDialog.tsx
  - CostCalculationForm.tsx
  - CalculationResult.tsx
  - FormulaGuide.tsx
- ✅ **API Integration** (cost.api.ts, product1688.api.ts)
- ✅ **Type Definitions** (cost.types.ts, product1688.types.ts)
- ✅ **React Hooks** (useCalculatePrice, useCreateCostCalculation, useCostHistory)
- ✅ **Luồng người dùng** (User Flow)
- ✅ **Validation và Error Handling**
- ✅ **Performance Optimization** (debouncing, client-side calc, lazy loading)
- ✅ **Security Considerations**
- ✅ **Future Improvements** và Known Issues
- ✅ **Testing Recommendations**
- ✅ **Glossary** (Thuật ngữ)
- ✅ **Appendix** (File locations, API endpoints, related docs)

#### Khi nào sử dụng:
- Cần hiểu toàn bộ hệ thống từ A-Z
- Onboarding developer mới
- Code review và maintenance
- Planning cho features mới

---

### 2. [1688-COST-CALCULATION-FLOW-DIAGRAM.md](./1688-COST-CALCULATION-FLOW-DIAGRAM.md)

**Sơ đồ Luồng Dữ liệu - Visualization**

Tài liệu này cung cấp các sơ đồ trực quan bằng ASCII art:

#### Nội dung chính:
- 📊 **System Architecture Overview**
  - So sánh 2 loại calculator
  - Data flow từ UI → API → Database
  
- 📊 **Complete Calculation Formula Flow**
  - Từng bước tính toán với ví dụ số cụ thể
  - Input → Processing → Output
  - Visualization từng công thức

#### Khi nào sử dụng:
- Cần hiểu nhanh luồng hoạt động
- Present cho stakeholders
- Debug issues trong flow
- Training và documentation

---

### 3. [1688-COST-FORMULAS.md](./1688-COST-FORMULAS.md)

**Tài liệu Công thức Toán học - Reference Guide**

Tài liệu này là reference guide cho các công thức tính toán:

#### Nội dung chính:
- 📐 **Các biến đầu vào** với bảng định nghĩa đầy đủ
  - Chi phí nhập hàng (CNY)
  - Chi phí vận chuyển & xử lý (VND)
  - Chi phí Marketing
  - Tỷ giá & Số lượng
  - Tham số kinh doanh

- 📐 **9 Bước tính toán** chi tiết:
  1. Tổng chi phí CNY
  2. Quy đổi sang VND
  3. Tổng chi phí VND
  4. Giá vốn cơ bản (C₀)
  5. Giá vốn hiệu dụng (C_eff)
  6. Tổng tỷ lệ phí
  7. Giá bán đề xuất (P)
  8. Lợi nhuận ròng (L)
  9. Giá hòa vốn (P_BE)

- 📐 **Ví dụ tổng hợp** với số liệu cụ thể

- 📐 **Các trường hợp đặc biệt**:
  - Không có chi phí marketing
  - Không có phí hoàn hàng
  - Chỉ muốn hòa vốn
  - Không có phí sàn

- 📐 **Điều kiện ràng buộc** và validation rules

- 📐 **Giải thích thuật ngữ** (Glossary)

- 📐 **Lưu ý khi sử dụng**:
  - Đơn vị tiền tệ (CNY vs VND)
  - Giá trị phần trăm (decimal)
  - Làm tròn

#### Khi nào sử dụng:
- Cần tra cứu công thức nhanh
- Implement tính toán mới
- Verify calculation logic
- QA testing
- Customer support (giải thích cách tính)

---

## 🎯 Quick Start

### Tôi cần...

#### ...hiểu cách hệ thống hoạt động?
→ Đọc [1688-COST-CALCULATION-ANALYSIS.md](./1688-COST-CALCULATION-ANALYSIS.md) - Section 2 & 3

#### ...xem sơ đồ luồng dữ liệu?
→ Đọc [1688-COST-CALCULATION-FLOW-DIAGRAM.md](./1688-COST-CALCULATION-FLOW-DIAGRAM.md)

#### ...tra cứu công thức tính toán?
→ Đọc [1688-COST-FORMULAS.md](./1688-COST-FORMULAS.md) - Section 2

#### ...biết file nào chứa code nào?
→ Đọc [1688-COST-CALCULATION-ANALYSIS.md](./1688-COST-CALCULATION-ANALYSIS.md) - Section 5 & Appendix 17.1

#### ...implement feature mới?
→ Đọc tất cả 3 documents, focus vào:
- Analysis: Section 5 (Code Implementation)
- Formulas: Section 2 (Calculation Steps)
- Flow: Complete flow diagram

#### ...fix bug?
→ Đọc:
- Analysis: Section 10 (Validation và Error Handling)
- Flow: Error Handling Flow
- Formulas: Section 5 (Điều kiện ràng buộc)

#### ...optimize performance?
→ Đọc [1688-COST-CALCULATION-ANALYSIS.md](./1688-COST-CALCULATION-ANALYSIS.md) - Section 11

---

## 🔑 Key Concepts

### 2 Loại Calculator

1. **Variant Cost Calculator** (Dialog-based)
   - Tính toán cho variant cụ thể của product 1688
   - Lưu vào database
   - Có lịch sử tính toán
   - API: `/v1/1688-products/variant-cost/calculate`

2. **Standalone Calculator** (Page-based)
   - Calculator độc lập, không cần product
   - Tính toán trên client, không lưu DB
   - Có thêm marketing costs
   - Real-time calculation với debouncing

### Công thức Cốt lõi

```
C₀ = [(P_nhập + P_shipTQ) × T_CNY→VND + P_shipVN + P_xử_lý + M_fixed] / SL

C_eff = C₀ / (1 - R)

P = [C_eff × (1 + G)] / (1 - F - M_rate)

L = P × (1 - F - M_rate) - C_eff

P_BE = C_eff / (1 - F - M_rate)
```

### Key Files

```
Frontend:
├── apps/admin/src/components/product1688/CostCalculatorDialog.tsx
├── apps/admin/src/components/cost/CostCalculationForm.tsx
├── apps/admin/src/components/cost/CalculationResult.tsx
└── apps/admin/src/components/cost/FormulaGuide.tsx

API & Types:
├── packages/lib/src/api/sdk/cost.api.ts
├── packages/lib/src/api/sdk/cost.types.ts
├── packages/lib/src/api/sdk/product1688.api.ts
└── packages/lib/src/types/product1688.types.ts

Hooks:
└── packages/lib/src/hooks/cost/
    ├── useCalculatePrice.ts
    ├── useCreateCostCalculation.ts
    └── useCostHistory.ts
```

---

## 📊 Thống kê Tài liệu

| Tài liệu | Số từ | Sections | Mục đích chính |
|----------|-------|----------|----------------|
| ANALYSIS.md | ~35,000 | 17 | Comprehensive analysis |
| FLOW-DIAGRAM.md | ~3,000 | 7 | Visual flows |
| FORMULAS.md | ~10,000 | 7 | Math reference |
| **TOTAL** | **~48,000** | **31** | **Complete documentation** |

---

## 🔄 Maintenance

### Cập nhật Tài liệu

Tài liệu cần được cập nhật khi:

1. ✏️ **Thay đổi công thức tính toán**
   → Update: FORMULAS.md + ANALYSIS.md Section 4

2. ✏️ **Thêm/sửa component**
   → Update: ANALYSIS.md Section 5 + FLOW-DIAGRAM.md

3. ✏️ **Thay đổi API**
   → Update: ANALYSIS.md Section 6 & Appendix 17.2

4. ✏️ **Thay đổi types**
   → Update: ANALYSIS.md Section 7

5. ✏️ **New features**
   → Update: All documents + add to Section 13 (Future Improvements)

### Version Control

- Current Version: **1.0**
- Last Updated: **2025-12-10**
- Next Review: **2025-03-10** (3 months)

---

## 🆘 Support

### Questions?

1. **Về công thức tính toán**: Xem [1688-COST-FORMULAS.md](./1688-COST-FORMULAS.md)
2. **Về code implementation**: Xem [1688-COST-CALCULATION-ANALYSIS.md](./1688-COST-CALCULATION-ANALYSIS.md) Section 5
3. **Về luồng dữ liệu**: Xem [1688-COST-CALCULATION-FLOW-DIAGRAM.md](./1688-COST-CALCULATION-FLOW-DIAGRAM.md)
4. **Vẫn chưa rõ**: Contact team hoặc tạo issue

### Contributing

Để đóng góp vào tài liệu này:

1. Đọc hiểu toàn bộ tài liệu hiện tại
2. Tạo branch mới
3. Cập nhật tài liệu cần thiết
4. Update version và last updated date
5. Tạo PR với description rõ ràng

---

## ✅ Checklist Sử dụng

Khi onboarding developer mới vào module cost calculation:

- [ ] Đọc README này (bạn đang đọc đấy!)
- [ ] Đọc ANALYSIS.md Section 1, 2, 3 (Overview, Architecture, Data Flow)
- [ ] Đọc FORMULAS.md Section 1, 2 (Variables, Formulas)
- [ ] Xem FLOW-DIAGRAM.md để visualize
- [ ] Đọc ANALYSIS.md Section 5 (Code Implementation)
- [ ] Clone repo và chạy thử cost calculator
- [ ] Thử tính toán với ví dụ trong FORMULAS.md Section 3
- [ ] Đọc ANALYSIS.md Section 10 (Error Handling)
- [ ] Review code với focus vào validation
- [ ] Sẵn sàng contribute! 🚀

---

## 📖 Summary

Bộ tài liệu này cung cấp **phân tích toàn diện** về hệ thống tính toán giá bán cho sản phẩm 1688, bao gồm:

✅ Architecture & design  
✅ Data flows & state management  
✅ Mathematical formulas với giải thích chi tiết  
✅ Code implementation với examples  
✅ API integration & types  
✅ Error handling & validation  
✅ Performance optimization  
✅ Testing recommendations  
✅ Future improvements  

**Tổng cộng 48,000+ từ** documentation đảm bảo bất kỳ developer nào cũng có thể hiểu và maintain module này một cách hiệu quả.

---

**Tác giả:** Copilot Agent  
**Version:** 1.0  
**Status:** ✅ Complete  
**Last Updated:** 2025-12-10
