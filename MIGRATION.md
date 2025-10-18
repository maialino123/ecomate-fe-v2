# Migration Guide - ecomate-fe-v2 Refactoring

## Tổng quan

Dự án đã được refactor từ cấu trúc lộn xộn sang monorepo chuẩn với Turborepo, hỗ trợ 3 ứng dụng frontend.

## Thay đổi cấu trúc

### Trước khi refactor:
```
ecomate-fe-v2/
├── apps/
│   ├── ecomate-fe-v2/      # Config files nhưng KHÔNG có src/
│   └── src/                # Code thực tế (SAI VỊ TRÍ)
│       ├── app/
│       └── shared/
└── packages/
    ├── ui/
    └── lib/
```

**Vấn đề:**
- Code đặt sai vị trí (`apps/src/` thay vì trong từng app)
- tsconfig trỏ sai path
- Không có cấu trúc rõ ràng cho nhiều apps
- Không có package cho shared code và config

### Sau khi refactor:
```
ecomate-fe-v2/
├── apps/
│   ├── web/                # Web app chính (port 3000)
│   ├── admin/              # Admin dashboard (port 3001)
│   └── landing/            # Landing page (port 3002)
│
└── packages/
    ├── ui/                 # UI components library
    ├── shared/             # Shared components, hooks, providers (MỚI)
    ├── config/             # Environment & constants (MỚI)
    ├── lib/                # API client & utilities
    ├── eslint-config/      # ESLint configs
    └── typescript-config/  # TypeScript configs
```

## Packages mới

### 1. @workspace/shared
Package chứa code được chia sẻ giữa các apps:

**Exports:**
- `@workspace/shared/providers` - React Providers (React Query, Theme, etc.)
- `@workspace/shared/components/*` - Shared components (ThemeSwitcher, etc.)
- `@workspace/shared/hooks/*` - Shared hooks (useMounted, etc.)

**Di chuyển từ:**
- `apps/src/shared/components/Providers.tsx` → `packages/shared/src/providers/Providers.tsx`
- `apps/src/shared/components/ThemeSwitcher.tsx` → `packages/shared/src/components/ThemeSwitcher.tsx`
- `apps/src/shared/hooks/useMounted.tsx` → `packages/shared/src/hooks/useMounted.tsx`

### 2. @workspace/config
Package quản lý environment variables và constants:

**Exports:**
- `@workspace/config/env` - Environment configuration
- `@workspace/config/constants` - Application constants

**Sử dụng:**
```typescript
import { env } from '@workspace/config/env'
import { APP_CONSTANTS } from '@workspace/config/constants'

console.log(env.API_BASE_URL)
console.log(APP_CONSTANTS.THEME.LIGHT)
```

## Apps mới

### 1. apps/web
Main web application (di chuyển từ apps/src)

**Port:** 3000
**Source:** Di chuyển từ `apps/src/app/` → `apps/web/src/app/`

### 2. apps/admin
Admin dashboard application (mới)

**Port:** 3001
**Description:** Quản lý hệ thống, users, content, v.v.

### 3. apps/landing
Landing page (mới)

**Port:** 3002
**Description:** Marketing landing page, SEO optimized

## Thay đổi import paths

### Trong apps:
```typescript
// CŨ (apps/src/app/)
import { Providers } from '@/shared/components/Providers'
import { ThemeSwitcher } from '@/shared/components/ThemeSwitcher'

// MỚI (apps/web/, apps/admin/, apps/landing/)
import { Providers } from '@workspace/shared/providers'
import { ThemeSwitcher } from '@workspace/shared/components/ThemeSwitcher'
```

### Trong packages:
```typescript
// Trong packages, sử dụng relative imports
import { useMounted } from '../hooks/useMounted'

// KHÔNG dùng path alias @/* trong packages
```

## File đã xóa

- `apps/src/` - Toàn bộ thư mục
- `apps/ecomate-fe-v2/` - Thư mục config cũ

## File mới

### Package configs:
- `packages/shared/package.json`
- `packages/shared/tsconfig.json`
- `packages/config/package.json`
- `packages/config/tsconfig.json`
- `packages/config/src/env.ts`
- `packages/config/src/constants.ts`

### App configs:
- `apps/web/package.json`
- `apps/web/tsconfig.json`
- `apps/web/next.config.mjs`
- `apps/admin/package.json`
- `apps/admin/tsconfig.json`
- `apps/admin/next.config.mjs`
- `apps/landing/package.json`
- `apps/landing/tsconfig.json`
- `apps/landing/next.config.mjs`

## Commands sau refactor

```bash
# Development - Chạy tất cả apps
pnpm dev

# Development - Chạy từng app
pnpm --filter web dev      # port 3000
pnpm --filter admin dev    # port 3001
pnpm --filter landing dev  # port 3002

# Build
pnpm build                 # Build tất cả
pnpm --filter web build    # Build web only

# Type checking
pnpm typecheck             # Typecheck tất cả packages

# Lint
pnpm lint                  # Lint tất cả
```

## Lợi ích sau refactor

### 1. Tách biệt rõ ràng
- Mỗi app có thư mục riêng với config riêng
- Packages được tổ chức theo chức năng
- Code không còn lẫn lộn giữa apps và packages

### 2. Dễ bảo trì
- Cấu trúc chuẩn, dễ tìm file
- Import paths rõ ràng
- Shared code tập trung ở packages

### 3. Dễ mở rộng
- Thêm app mới: copy từ template
- Thêm package mới: tạo trong packages/
- Chia sẻ code dễ dàng giữa các apps

### 4. Performance
- Turborepo cache builds
- Build parallel cho các packages
- Hot reload nhanh hơn

### 5. Type safety
- TypeScript strict mode
- Type checking toàn bộ monorepo
- Shared types qua packages

## Checklist migration

- [x] Tạo package @workspace/shared
- [x] Tạo package @workspace/config
- [x] Tạo apps/web và di chuyển code
- [x] Tạo apps/admin skeleton
- [x] Tạo apps/landing skeleton
- [x] Xóa apps/src và apps/ecomate-fe-v2
- [x] Cập nhật turbo.json
- [x] Test typecheck
- [x] Update README.md

## Next steps

1. **Thêm features cho Admin**
   - Authentication UI
   - User management
   - Dashboard components

2. **Thêm features cho Landing**
   - Hero section
   - Features showcase
   - Contact form

3. **Shared packages enhancement**
   - Thêm shared layouts
   - Thêm shared forms
   - Thêm shared utilities

4. **Testing setup**
   - Jest configuration
   - Vitest for packages
   - E2E tests với Playwright

5. **CI/CD**
   - GitHub Actions
   - Build optimization
   - Deploy workflows

## Hỗ trợ

Nếu gặp vấn đề sau migration:

1. Xóa node_modules và reinstall:
   ```bash
   rm -rf node_modules
   pnpm install
   ```

2. Clear Turbo cache:
   ```bash
   pnpm turbo clean
   ```

3. Typecheck để tìm lỗi import:
   ```bash
   pnpm typecheck
   ```

4. Check [README.md](./README.md) để xem hướng dẫn đầy đủ
