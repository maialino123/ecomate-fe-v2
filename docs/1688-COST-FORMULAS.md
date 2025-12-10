# Công thức Tính toán Cost cho Sản phẩm 1688

**Version:** 1.0  
**Last Updated:** 2025-12-10

---

## Tổng quan

Tài liệu này mô tả chi tiết các công thức toán học được sử dụng để tính toán giá vốn và giá bán đề xuất cho sản phẩm nhập từ 1688 (Trung Quốc).

---

## 1. Các biến đầu vào

### 1.1 Chi phí nhập hàng (CNY)

| Biến | Ký hiệu | Đơn vị | Mô tả |
|------|---------|--------|-------|
| `importPrice` | P_nhập | CNY (¥) | Giá nhập từ 1688/xưởng |
| `domesticShippingCN` | P_shipTQ | CNY (¥) | Phí ship nội địa Trung Quốc |

### 1.2 Chi phí vận chuyển & xử lý (VND)

| Biến | Ký hiệu | Đơn vị | Mô tả |
|------|---------|--------|-------|
| `internationalShippingVN` | P_shipVN | VND (₫) | Phí ship quốc tế (TQ → VN) |
| `handlingFee` | P_xử_lý | VND (₫) | Chi phí xử lý/gom hàng/thuế |

### 1.3 Chi phí Marketing (Optional)

| Biến | Ký hiệu | Đơn vị | Mô tả |
|------|---------|--------|-------|
| `marketingCostVND` | M_fixed | VND (₫) | Chi phí marketing cố định cho lô hàng |
| `marketingRate` | M_rate | decimal | Tỷ lệ % marketing trên giá bán (0.10 = 10%) |

### 1.4 Tỷ giá & Số lượng

| Biến | Ký hiệu | Đơn vị | Mô tả |
|------|---------|--------|-------|
| `exchangeRateCNY` | T_CNY→VND | VND/¥ | Tỷ giá CNY sang VND |
| `quantity` | SL | cái | Số lượng sản phẩm trong lô |

### 1.5 Tham số kinh doanh

| Biến | Ký hiệu | Đơn vị | Mô tả |
|------|---------|--------|-------|
| `returnRate` | R | decimal | Tỷ lệ hoàn hàng (0.05 = 5%) |
| `platformFeeRate` | F | decimal | Phí sàn TMĐT (0.20 = 20%) |
| `profitMarginRate` | G | decimal | Biên lợi nhuận mong muốn (0.15 = 15%) |

---

## 2. Công thức tính toán

### Bước 1: Tổng chi phí CNY

```
totalCNYCost = P_nhập + P_shipTQ
```

**Giải thích**: Tổng chi phí bằng CNY bao gồm giá nhập và phí ship nội địa TQ.

**Ví dụ**:
```
P_nhập = 5.2 CNY
P_shipTQ = 10 CNY
→ totalCNYCost = 5.2 + 10 = 15.2 CNY
```

---

### Bước 2: Quy đổi sang VND

```
totalCNYInVND = totalCNYCost × T_CNY→VND
```

**Giải thích**: Chuyển đổi tổng chi phí CNY sang VND theo tỷ giá.

**Ví dụ**:
```
totalCNYCost = 15.2 CNY
T_CNY→VND = 3,600
→ totalCNYInVND = 15.2 × 3,600 = 54,720 VND
```

---

### Bước 3: Tổng chi phí VND

```
totalVNDCost = totalCNYInVND + P_shipVN + P_xử_lý + M_fixed
```

**Giải thích**: Tổng chi phí bằng VND bao gồm:
- Chi phí đã quy đổi từ CNY
- Phí ship quốc tế
- Phí xử lý/thuế
- Chi phí marketing cố định (nếu có)

**Ví dụ**:
```
totalCNYInVND = 54,720 VND
P_shipVN = 75,000 VND
P_xử_lý = 50,000 VND
M_fixed = 500,000 VND
→ totalVNDCost = 54,720 + 75,000 + 50,000 + 500,000 = 679,720 VND
```

---

### Bước 4: Giá vốn cơ bản (C₀)

```
C₀ = totalVNDCost / SL
```

**Giải thích**: Giá vốn cơ bản của 1 sản phẩm, được tính bằng cách chia đều tổng chi phí cho số lượng sản phẩm trong lô.

**Ý nghĩa**: Đây là chi phí thực tế để có được 1 sản phẩm về đến Việt Nam, chưa tính đến các rủi ro hoàn hàng.

**Ví dụ**:
```
totalVNDCost = 679,720 VND
SL = 50
→ C₀ = 679,720 / 50 = 13,594.4 VND
```

---

### Bước 5: Giá vốn hiệu dụng (C_eff)

```
C_eff = C₀ / (1 - R)
```

**Điều kiện**: `R < 1` (tỷ lệ hoàn hàng phải nhỏ hơn 100%)

**Giải thích**: Giá vốn hiệu dụng tính đến rủi ro hoàn hàng. Nếu có một phần sản phẩm bị hoàn trả, chi phí của những sản phẩm đó phải được phân bổ vào các sản phẩm bán được.

**Logic**: Nếu R = 5%, nghĩa là cứ 100 sản phẩm bán ra thì có 5 sản phẩm bị hoàn trả. Chi phí của 5 sản phẩm đó phải được 95 sản phẩm còn lại gánh chịu.

**Ví dụ**:
```
C₀ = 13,594.4 VND
R = 0.05 (5%)
→ C_eff = 13,594.4 / (1 - 0.05) = 13,594.4 / 0.95 = 14,309.9 VND
```

---

### Bước 6: Tổng tỷ lệ phí

```
totalFeeRate = F + M_rate
```

**Điều kiện**: `totalFeeRate < 1` (tổng phí phải nhỏ hơn 100%)

**Giải thích**: Tổng tỷ lệ phí bao gồm phí sàn TMĐT và phí marketing (tính theo % giá bán).

**Ví dụ**:
```
F = 0.20 (20%)
M_rate = 0.10 (10%)
→ totalFeeRate = 0.20 + 0.10 = 0.30 (30%)
```

---

### Bước 7: Giá bán đề xuất (P)

```
P = [C_eff × (1 + G)] / (1 - totalFeeRate)
```

**Điều kiện**: `totalFeeRate < 1`

**Giải thích**: Giá bán cần đạt để có được lợi nhuận mục tiêu (G) sau khi đã trừ đi phí sàn và phí marketing.

**Phân tích công thức**:
- `C_eff × (1 + G)`: Giá vốn hiệu dụng cộng với lợi nhuận mong muốn
- `/ (1 - totalFeeRate)`: Điều chỉnh lên để bù trừ phần phí (sàn + marketing) sẽ bị trừ đi

**Logic**:
1. Bạn muốn lợi nhuận G = 15% trên giá vốn
2. Nhưng khi bán trên sàn, sàn sẽ trừ F = 20% và marketing M_rate = 10%
3. Vậy giá bán phải cao hơn để sau khi trừ phí, bạn vẫn còn lại lợi nhuận mong muốn

**Ví dụ**:
```
C_eff = 14,309.9 VND
G = 0.15 (15%)
totalFeeRate = 0.30 (30%)

Bước 1: Tính giá mục tiêu (giá vốn + lợi nhuận)
C_eff × (1 + G) = 14,309.9 × 1.15 = 16,456.4 VND

Bước 2: Điều chỉnh cho phí
P = 16,456.4 / (1 - 0.30) = 16,456.4 / 0.70 = 23,509.1 VND
```

**Kiểm chứng**:
```
Giá bán: 23,509.1 VND
Sau khi trừ phí 30%: 23,509.1 × 0.70 = 16,456.4 VND
Trừ giá vốn: 16,456.4 - 14,309.9 = 2,146.5 VND (lợi nhuận)
Biên lợi nhuận: 2,146.5 / 14,309.9 = 15% ✓
```

---

### Bước 8: Lợi nhuận ròng (L)

```
L = P × (1 - totalFeeRate) - C_eff
```

**Giải thích**: Lợi nhuận thực tế trên mỗi sản phẩm bán được, sau khi đã trừ đi tất cả các chi phí và phí.

**Phân tích**:
- `P × (1 - totalFeeRate)`: Số tiền thực nhận sau khi trừ phí sàn và marketing
- `- C_eff`: Trừ đi giá vốn hiệu dụng

**Ví dụ**:
```
P = 23,509.1 VND
totalFeeRate = 0.30
C_eff = 14,309.9 VND

→ L = 23,509.1 × (1 - 0.30) - 14,309.9
    = 23,509.1 × 0.70 - 14,309.9
    = 16,456.4 - 14,309.9
    = 2,146.5 VND
```

**Biên lợi nhuận**:
```
profitMarginPercentage = (L / C_eff) × 100
                       = (2,146.5 / 14,309.9) × 100
                       = 15%
```

---

### Bước 9: Giá hòa vốn (P_BE)

```
P_BE = C_eff / (1 - totalFeeRate)
```

**Giải thích**: Giá tối thiểu để không lỗ (khi G = 0). Đây là điểm break-even, bán dưới giá này sẽ bị lỗ.

**Logic**: Đây là trường hợp đặc biệt của công thức giá bán đề xuất khi G = 0:
```
P = [C_eff × (1 + 0)] / (1 - totalFeeRate)
  = C_eff / (1 - totalFeeRate)
```

**Ví dụ**:
```
C_eff = 14,309.9 VND
totalFeeRate = 0.30

→ P_BE = 14,309.9 / (1 - 0.30)
       = 14,309.9 / 0.70
       = 20,442.7 VND
```

**Kiểm chứng**:
```
Nếu bán với giá 20,442.7 VND:
Sau khi trừ phí: 20,442.7 × 0.70 = 14,309.9 VND
Lợi nhuận: 14,309.9 - 14,309.9 = 0 VND ✓ (hòa vốn)
```

---

## 3. Ví dụ tổng hợp

### Input
```
P_nhập = 5.2 CNY
P_shipTQ = 10 CNY
P_shipVN = 75,000 VND
P_xử_lý = 50,000 VND
M_fixed = 500,000 VND
T_CNY→VND = 3,600
SL = 50
R = 0.05 (5%)
F = 0.20 (20%)
M_rate = 0.10 (10%)
G = 0.15 (15%)
```

### Tính toán từng bước

```
1. totalCNYCost = 5.2 + 10 = 15.2 CNY

2. totalCNYInVND = 15.2 × 3,600 = 54,720 VND

3. totalVNDCost = 54,720 + 75,000 + 50,000 + 500,000 = 679,720 VND

4. C₀ = 679,720 / 50 = 13,594.4 VND

5. C_eff = 13,594.4 / 0.95 = 14,309.9 VND

6. totalFeeRate = 0.20 + 0.10 = 0.30

7. P = (14,309.9 × 1.15) / 0.70 = 23,509.1 VND

8. L = 23,509.1 × 0.70 - 14,309.9 = 2,146.5 VND

9. P_BE = 14,309.9 / 0.70 = 20,442.7 VND
```

### Output
```
✅ Kết quả tính toán:

• Giá vốn cơ bản (C₀): 13,594 VND
• Giá vốn hiệu dụng (C_eff): 14,310 VND
• Giá bán đề xuất (P): 23,509 VND
• Lợi nhuận ròng (L): 2,147 VND
• Giá hòa vốn (P_BE): 20,443 VND
• Biên lợi nhuận: 15.00%
```

---

## 4. Các trường hợp đặc biệt

### 4.1 Không có chi phí marketing

Nếu không có chi phí marketing (`M_fixed = 0` và `M_rate = 0`):

```
totalFeeRate = F + 0 = F
P = [C_eff × (1 + G)] / (1 - F)
```

### 4.2 Không có phí hoàn hàng

Nếu không tính hoàn hàng (`R = 0`):

```
C_eff = C₀ / (1 - 0) = C₀
```

### 4.3 Chỉ muốn hòa vốn

Nếu chỉ muốn hòa vốn (`G = 0`):

```
P = [C_eff × (1 + 0)] / (1 - totalFeeRate)
  = C_eff / (1 - totalFeeRate)
  = P_BE
```

### 4.4 Không có phí sàn

Nếu bán trực tiếp không qua sàn (`F = 0`, `M_rate = 0`):

```
P = [C_eff × (1 + G)] / (1 - 0)
  = C_eff × (1 + G)
```

---

## 5. Điều kiện ràng buộc

### 5.1 Điều kiện bắt buộc

1. `P_nhập > 0` - Giá nhập phải lớn hơn 0
2. `T_CNY→VND > 0` - Tỷ giá phải lớn hơn 0
3. `SL >= 1` - Số lượng phải ít nhất là 1

### 5.2 Điều kiện giới hạn

1. `0 <= R < 1` - Tỷ lệ hoàn hàng phải nhỏ hơn 100%
2. `0 <= F < 1` - Phí sàn phải nhỏ hơn 100%
3. `0 <= M_rate < 1` - Phí marketing phải nhỏ hơn 100%
4. `F + M_rate < 1` - Tổng phí phải nhỏ hơn 100%
5. `G >= 0` - Biên lợi nhuận không âm

### 5.3 Điều kiện optional

1. `P_shipTQ >= 0` - Phí ship nội địa không âm
2. `P_shipVN >= 0` - Phí ship quốc tế không âm
3. `P_xử_lý >= 0` - Phí xử lý không âm
4. `M_fixed >= 0` - Chi phí marketing cố định không âm

---

## 6. Giải thích thuật ngữ

| Thuật ngữ | Tiếng Anh | Ký hiệu | Giải thích |
|-----------|-----------|---------|-----------|
| Giá vốn cơ bản | Base Cost | C₀ | Chi phí thực tế của 1 sản phẩm sau khi nhập về |
| Giá vốn hiệu dụng | Effective Cost | C_eff | Giá vốn có tính đến tỷ lệ hoàn hàng |
| Giá bán đề xuất | Suggested Selling Price | P | Giá bán đề xuất để đạt lợi nhuận mục tiêu |
| Lợi nhuận ròng | Net Profit | L | Lợi nhuận thực tế sau tất cả chi phí |
| Giá hòa vốn | Break-even Price | P_BE | Giá tối thiểu để không lỗ |
| Tỷ lệ hoàn hàng | Return Rate | R | Phần trăm sản phẩm bị khách hàng hoàn trả |
| Phí sàn TMĐT | Platform Fee | F | Phí của sàn thương mại điện tử |
| Biên lợi nhuận | Profit Margin | G | Tỷ lệ lợi nhuận mong muốn trên giá vốn |

---

## 7. Lưu ý khi sử dụng

### 7.1 Đơn vị tiền tệ

⚠️ **Cực kỳ quan trọng**: Chú ý đơn vị tiền tệ!

- **CNY (¥)**: Dùng cho giá nhập và ship nội địa Trung Quốc
- **VND (₫)**: Dùng cho ship quốc tế, phí xử lý, và kết quả tính toán

### 7.2 Giá trị phần trăm

Các giá trị phần trăm được nhập dưới dạng decimal:
- 5% = 0.05
- 20% = 0.20
- 15% = 0.15

### 7.3 Làm tròn

Kết quả tính toán có thể được làm tròn để hiển thị:
- Giá tiền: làm tròn đến hàng đơn vị (0 chữ số thập phân)
- Phần trăm: làm tròn đến 2 chữ số thập phân

---

**Tài liệu được tạo bởi:** Copilot Agent  
**Version:** 1.0  
**Status:** ✅ Complete
