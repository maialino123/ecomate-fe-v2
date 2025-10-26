# Ecomate 1688 Chrome Extension

Chrome extension để trích xuất dữ liệu sản phẩm từ 1688.com cho hệ thống tính cost của Ecomate.

## 🎯 Features (MVP)

- ✅ **Authentication**: Đăng nhập bằng JWT token qua backend API
- ✅ **Product Extraction**: Trích xuất dữ liệu sản phẩm từ trang 1688.com
  - Tên sản phẩm, ID
  - Price tiers (giá theo số lượng)
  - SKU variations (biến thể sản phẩm)
  - Hình ảnh
  - Thông tin nhà cung cấp
- ✅ **Preview**: Xem trước dữ liệu đã trích xuất
- ✅ **Download**: Tải xuống file JSON
- ✅ **Dark Mode**: Hỗ trợ giao diện sáng/tối
- ✅ **Settings**: Cấu hình API endpoint

## 📋 Prerequisites

- Node.js >= 20
- pnpm >= 10.4.1
- Chrome hoặc Edge browser (hỗ trợ Manifest V3)
- Ecomate backend API đang chạy

## 🚀 Development Setup

### 1. Install Dependencies

```bash
# Từ root của monorepo
cd ecomate-fe-v2
pnpm install
```

### 2. Configure Environment

```bash
# Copy và edit environment file
cd apps/extension
cp .env.example .env

# Edit .env và set your API URL
# VITE_API_BASE_URL=http://localhost:3000
# hoặc
# VITE_API_BASE_URL=https://ecomate-be-staging.up.railway.app
```

📖 **Chi tiết**: Xem [ENV_SETUP.md](./ENV_SETUP.md) để biết thêm về environment configuration.

### 3. Start Dev Server

```bash
# Chạy extension ở dev mode (với HMR)
pnpm --filter extension dev
```

### 4. Load Extension vào Chrome

1. Mở Chrome và vào `chrome://extensions/`
2. Bật **Developer mode** (góc trên bên phải)
3. Click **Load unpacked**
4. Chọn folder `apps/extension/dist`

Extension sẽ xuất hiện trong danh sách với icon placeholder purple.

### 4. Hot Reload

Extension sử dụng `@crxjs/vite-plugin` để hỗ trợ HMR:
- **Popup UI**: Tự động reload khi bạn sửa code
- **Content script**: Cần refresh trang 1688 để áp dụng thay đổi
- **Background worker**: Tự động reload

## 🧪 Testing

### Manual Testing

1. **Login Flow**:
   ```
   - Click extension icon
   - Nhập email/password
   - Verify JWT token được lưu
   - Popup hiển thị Extract page
   ```

2. **Extraction Flow**:
   ```
   - Navigate to https://detail.1688.com/offer/[PRODUCT_ID].html
   - Click extension icon
   - Click "Extract" button
   - Verify preview hiển thị đúng data
   - Click "Download JSON"
   - Verify file được tải xuống
   ```

3. **Settings**:
   ```
   - Switch sang Settings tab
   - Update API URL
   - Click Save
   - Verify settings được persist
   ```

### Type Checking

```bash
pnpm --filter extension typecheck
```

## 📦 Build for Production

```bash
pnpm --filter extension build
```

Output sẽ ở trong `apps/extension/dist/`.

### 📤 Đóng gói để publish

```bash
cd apps/extension/dist
zip -r ecomate-1688-extension.zip .
```

File ZIP này có thể upload lên Chrome Web Store hoặc phân phối nội bộ.

## 📁 Project Structure

```
apps/extension/
├── public/
│   ├── manifest.json              # Chrome Extension manifest (MV3)
│   └── icons/                     # Extension icons (16, 48, 128)
├── src/
│   ├── popup/                     # Popup UI (React)
│   │   ├── App.tsx               # Main app với routing
│   │   ├── main.tsx              # Entry point
│   │   ├── pages/                # Login, Extract, Settings pages
│   │   ├── components/           # Preview, Download components
│   │   └── store/                # Zustand stores (auth, extract)
│   ├── content/                   # Content scripts
│   │   ├── index.ts              # Main content script
│   │   └── extractors/           # 1688 data extractors
│   ├── background/               # Service worker
│   │   └── index.ts
│   └── shared/                    # Shared code
│       ├── types/                 # TypeScript types
│       └── storage.ts             # Chrome storage helpers
├── vite.config.ts
├── package.json
└── README.md
```

## 🔧 Configuration

### API Endpoint

Default: `http://localhost:3000`

Để thay đổi:
1. Mở extension popup
2. Vào Settings tab
3. Nhập API URL mới
4. Click Save

### Theme

Extension tự động detect system theme preference. Có thể toggle manually qua icon 🌙/☀️ trên navigation bar.

## 🐛 Troubleshooting

### Extension không load

1. Kiểm tra `chrome://extensions/` có hiển thị errors không
2. Rebuild extension: `pnpm --filter extension build`
3. Reload extension trong Chrome

### Content script không chạy trên 1688

1. Kiểm tra URL có match pattern trong `manifest.json` không
2. Refresh lại trang 1688
3. Check console logs (F12 → Console tab)

### Extraction failed

1. Verify bạn đang ở trang product detail (không phải search results)
2. Check console logs để xem raw data structure
3. 1688 có thể đã đổi structure → cần update extractor logic

### Login failed

1. Verify backend API đang chạy
2. Check API URL trong Settings
3. Xem Network tab (F12) để kiểm tra request/response
4. Verify credentials đúng

## 📝 Known Limitations (MVP)

- ❌ Chưa support 2FA (Owner role cần login qua web app)
- ❌ Chưa có "Send to API" feature (chỉ download JSON)
- ❌ Chưa support bulk extraction (nhiều products)
- ❌ Chưa support side panel (Chrome 114+)
- ❌ Icon là placeholder (cần design proper logo)

## 🔮 Future Enhancements

- [ ] Send to API integration
- [ ] Batch extraction (extract nhiều products từ search results)
- [ ] Side panel cho preview rộng hơn
- [ ] Image extraction cho product description
- [ ] Queue system + retry logic trong background worker
- [ ] Context menu "Extract 1688" khi right-click
- [ ] Badge notification khi detect 1688 page
- [ ] Auto-update manifest

## 🛠️ Development Tips

### Debugging

**Popup**:
- Right-click extension icon → Inspect popup
- Console logs xuất hiện trong DevTools

**Content Script**:
- F12 trên trang 1688
- Console logs có prefix `[Ecomate Extension]`

**Background Worker**:
- `chrome://extensions/` → Click "service worker" link
- Console logs cho background worker

### Adding New Extractors

1. Tạo file mới trong `src/content/extractors/`
2. Export function với signature: `(raw: Raw1688Data) => ExtractedData`
3. Import và gọi trong `normalize-1688.ts` (`@workspace/lib`)
4. Test trên real 1688 pages

### Updating Schema

1. Sửa `@workspace/lib/src/types/product-1688.ts`
2. Update normalizer trong `@workspace/lib/src/normalizers/normalize-1688.ts`
3. Rebuild: `pnpm --filter @workspace/lib build`
4. Extension sẽ auto-reload nếu đang chạy dev mode

## 📄 License

Internal use only - Ecomate Team

## 🤝 Contributing

Contact project maintainer before making changes.
