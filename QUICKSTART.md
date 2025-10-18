# Quick Start Guide - Ecomate FE v2

## 1. Cài đặt ban đầu

```bash
# Di chuyển vào thư mục project
cd ecomate-fe-v2

# Cài đặt dependencies (lần đầu tiên)
pnpm install

# Chạy tất cả apps
pnpm dev
```

## 2. Chạy từng app riêng lẻ

### Web App (Main)
```bash
pnpm --filter web dev
# Truy cập: http://localhost:3000
```

### Admin Dashboard
```bash
pnpm --filter admin dev
# Truy cập: http://localhost:3001
```

### Landing Page
```bash
pnpm --filter landing dev
# Truy cập: http://localhost:3002
```

## 3. Development Commands

```bash
# Typecheck toàn bộ project
pnpm typecheck

# Lint code
pnpm lint

# Build toàn bộ
pnpm build

# Build 1 app cụ thể
pnpm --filter web build
```

## 4. Thêm component mới

### Thêm vào @workspace/ui (Shared UI)
```bash
cd packages/ui/src/components
# Tạo file component mới
# Export trong index nếu cần
```

### Thêm vào @workspace/shared (Business logic)
```bash
cd packages/shared/src/components
# Tạo component có business logic
```

### Sử dụng trong app
```typescript
// apps/web/src/app/page.tsx
import { Button } from '@workspace/ui/components/Button'
import { ThemeSwitcher } from '@workspace/shared/components/ThemeSwitcher'

export default function Page() {
  return (
    <div>
      <Button>Click me</Button>
      <ThemeSwitcher />
    </div>
  )
}
```

## 5. Thêm page mới

### Trong Web App
```bash
# Tạo route mới với App Router
mkdir -p apps/web/src/app/about
touch apps/web/src/app/about/page.tsx
```

```typescript
// apps/web/src/app/about/page.tsx
export default function AboutPage() {
  return <div>About Page</div>
}
```

Truy cập: http://localhost:3000/about

## 6. Environment Variables

### Tạo .env.local
```bash
# apps/web/.env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### Sử dụng env
```typescript
import { env } from '@workspace/config/env'

console.log(env.API_BASE_URL)
```

## 7. API Calls

```typescript
import { api } from '@workspace/lib/api'
import { useQuery } from '@tanstack/react-query'

function MyComponent() {
  const { data } = useQuery(api.example.hello())
  
  return <div>{data?.message}</div>
}
```

## 8. Thêm dependency mới

### Thêm vào specific app
```bash
# Vào thư mục app
cd apps/web
pnpm add package-name

# Hoặc từ root
pnpm --filter web add package-name
```

### Thêm vào workspace package
```bash
cd packages/ui
pnpm add package-name

# Hoặc từ root
pnpm --filter @workspace/ui add package-name
```

## 9. Troubleshooting

### Typecheck lỗi
```bash
# Clear cache và rebuild
rm -rf .turbo node_modules
pnpm install
pnpm typecheck
```

### Hot reload không hoạt động
```bash
# Restart dev server
# Ctrl+C và chạy lại
pnpm dev
```

### Import không tìm thấy
```bash
# Kiểm tra package.json exports
# Kiểm tra tsconfig paths
# Reinstall dependencies
pnpm install
```

## 10. Useful VSCode Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Error Translator
- Error Lens

## 11. Git Workflow

```bash
# Tạo branch mới
git checkout -b feature/ten-feature

# Commit changes
git add .
git commit -m "feat: thêm feature X"

# Push
git push origin feature/ten-feature

# Tạo PR trên GitHub
```

## 12. Cấu trúc thường dùng

```
apps/web/src/
├── app/                    # Routes (Next.js App Router)
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── about/             # /about route
│   │   └── page.tsx
│   └── products/          # /products route
│       ├── page.tsx       # List
│       └── [id]/          # /products/123
│           └── page.tsx   # Detail
│
├── components/            # App-specific components
│   └── Header.tsx
│
├── lib/                   # App-specific utilities
│   └── utils.ts
│
└── types/                 # App-specific types
    └── index.ts
```

## 13. Best Practices

1. **Component Organization**
   - UI components → `@workspace/ui`
   - Business components → `@workspace/shared`
   - App-specific → `apps/[app]/src/components`

2. **State Management**
   - Server state → TanStack Query
   - Client state → React hooks
   - Global state → Context API

3. **Styling**
   - Use Tailwind utilities
   - Create variants with `tv()` (tailwind-variants)
   - Keep styles with components

4. **Type Safety**
   - Always type your props
   - Use Zod for runtime validation
   - Leverage TypeScript inference

## 14. Resources

- [Next.js Docs](https://nextjs.org/docs)
- [TanStack Query](https://tanstack.com/query)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Turborepo](https://turbo.build)

## Need Help?

- Check [README.md](./README.md) for full documentation
- Check [MIGRATION.md](./MIGRATION.md) for migration details
- Check [STRUCTURE.md](./STRUCTURE.md) for project structure
