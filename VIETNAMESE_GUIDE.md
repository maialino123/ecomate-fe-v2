# Hướng Dẫn Sử Dụng Admin Dashboard - Tiếng Việt

## Tổng Quan

Đây là giao diện quản trị hoàn chỉnh cho hệ thống Ecomate, tích hợp với backend IAM đã có sẵn.

## Cấu Trúc Dự Án

### Kiến Trúc Monorepo

```
ecomate-fe-v2/
├── apps/
│   └── admin/              # Ứng dụng admin chính
│       ├── src/
│       │   ├── app/        # Next.js App Router
│       │   │   ├── (auth)/ # Trang đăng nhập, đăng ký (public)
│       │   │   └── (dashboard)/ # Trang dashboard (protected)
│       │   ├── components/ # React components
│       │   └── lib/        # API client, utilities
│       └── package.json
│
└── packages/               # Shared packages
    ├── lib/                # API, hooks, stores (logic nghiệp vụ)
    │   ├── api/            # API client & SDKs
    │   ├── hooks/          # React Query hooks
    │   └── stores/         # Zustand stores (state management)
    │
    ├── shared/             # Components & utils dùng chung
    │   ├── components/     # Toast, ErrorBoundary, etc.
    │   ├── providers/      # React Context Providers
    │   └── utils/          # Error handler, format functions
    │
    └── ui/                 # UI component library (input, label, button, etc.)
```

### Tại Sao Dùng Monorepo?

1. **Chia Sẻ Code Dễ Dàng**: Components, utils, API có thể dùng chung
2. **Type Safety**: TypeScript types được share giữa các packages
3. **Dễ Maintain**: Thay đổi ở 1 nơi, tất cả apps được cập nhật
4. **Scalable**: Dễ thêm apps mới (mobile, landing page, etc.)

## Các Thành Phần Chính

### 1. Zustand Stores (State Management)

#### Auth Store (`packages/lib/src/stores/auth.store.ts`)
- **Mục đích**: Lưu thông tin user và JWT tokens
- **Persistence**: Lưu vào localStorage (giữ khi refresh trang)
- **Data**:
  - `user`: Thông tin user (email, role, status, etc.)
  - `tokens`: Access token & refresh token
  - `isAuthenticated`: Trạng thái đăng nhập

#### Notification Store (`packages/lib/src/stores/notification.store.ts`)
- **Mục đích**: Quản lý toast notifications
- **Không persist**: Mất khi refresh trang
- **Methods**:
  - `success()`: Toast màu xanh
  - `error()`: Toast màu đỏ
  - `warning()`: Toast màu vàng
  - `info()`: Toast màu xanh dương

#### UI Store (`packages/lib/src/stores/ui.store.ts`)
- **Mục đích**: Lưu preferences của user
- **Persistence**: Lưu vào localStorage
- **Data**:
  - `sidebarCollapsed`: Sidebar đóng/mở
  - Theme preferences (future)

### 2. API Layer

#### API Client (`packages/lib/src/api/client.ts`)
- **Axios client** với auto token refresh
- **Interceptors**:
  - Request: Tự động thêm JWT token vào header
  - Response: Tự động refresh token khi 401

#### API SDKs
- **AuthApi** (`auth.api.ts`): Login, register, verify, logout
- **AdminApi** (`admin.api.ts`): User management, approval requests

### 3. React Query Hooks

#### Tại Sao Dùng React Query?
- **Caching**: Tự động cache data, giảm API calls
- **Auto Refetch**: Tự động fetch lại data khi cần
- **Loading/Error States**: Quản lý states tự động
- **Optimistic Updates**: UI update ngay, không đợi server

#### Auth Hooks (`packages/lib/src/hooks/auth/`)
```typescript
// Login
const loginMutation = useLogin({
  api,
  onSuccess: () => router.push('/dashboard')
})
loginMutation.mutate({ email, password })

// Register
const registerMutation = useRegister({ api })
registerMutation.mutate({ email, password, firstName, lastName })

// Logout
const logoutMutation = useLogout({ api })
logoutMutation.mutate()
```

#### Admin Hooks (`packages/lib/src/hooks/admin/`)
```typescript
// Get registration requests
const { data, isLoading } = useRegistrationRequests({ api })

// Approve request
const approveMutation = useApproveRequest({ api })
approveMutation.mutate({ id: 'xxx', dto: { role: 'ADMIN' } })

// Reject request
const rejectMutation = useRejectRequest({ api })
rejectMutation.mutate({ id: 'xxx', dto: { reason: 'Invalid' } })
```

#### User Management Hooks (`packages/lib/src/hooks/users/`)
```typescript
// Get users
const { data: users } = useUsers({ api })

// Update role
const updateRoleMutation = useUpdateUserRole({ api })
updateRoleMutation.mutate({ id: 'xxx', dto: { role: 'STAFF' } })

// Update status
const updateStatusMutation = useUpdateUserStatus({ api })
updateStatusMutation.mutate({ id: 'xxx', dto: { status: 'INACTIVE' } })

// Delete user
const deleteUserMutation = useDeleteUser({ api })
deleteUserMutation.mutate('user-id')
```

## Luồng Hoạt Động

### 1. Luồng Đăng Nhập Thông Thường

```
User nhập email/password
     ↓
LoginForm submit
     ↓
useLogin hook gọi api.auth.signIn()
     ↓
Backend validate credentials
     ↓
Trả về: { accessToken, refreshToken, user }
     ↓
Lưu vào AuthStore (Zustand)
     ↓
Redirect đến /dashboard
```

### 2. Luồng Đăng Nhập Owner (2FA)

```
Owner nhập email/password
     ↓
LoginForm submit
     ↓
Backend validate credentials
     ↓
Trả về: { message: "Check email", require2FA: true }
     ↓
Hiển thị message "Check your email"
     ↓
Owner click magic link trong email
     ↓
Redirect đến /verify-login?token=xxx
     ↓
useVerifyMagicLink gọi api.auth.verifyMagicLink()
     ↓
Backend validate token
     ↓
Trả về: { accessToken, refreshToken, user }
     ↓
Lưu vào AuthStore
     ↓
Redirect đến /dashboard
```

### 3. Luồng Đăng Ký User Mới

```
User điền form đăng ký
     ↓
RegisterForm submit
     ↓
useRegister hook gọi api.auth.register()
     ↓
Backend tạo UserRegistrationRequest (PENDING)
     ↓
Backend gửi email cho Owner
     ↓
Hiển thị: "Registration submitted, wait for approval"
     ↓
Owner nhận email với 4 buttons:
  - Accept as ADMIN
  - Accept as STAFF
  - Accept as VIEWER
  - Reject
     ↓
Owner click "Accept as ADMIN"
     ↓
Backend tạo User với role ADMIN
     ↓
User có thể login bình thường
```

### 4. Luồng Quản Lý User (Owner)

```
Owner login → Go to /dashboard/users
     ↓
useUsers fetch danh sách users
     ↓
Click "Edit Role" button
     ↓
Modal hiện lên, chọn role mới
     ↓
useUpdateUserRole mutation
     ↓
Backend update role
     ↓
React Query auto invalidate cache
     ↓
Table tự động refresh
     ↓
Toast notification "Role updated"
```

## Cách Sử Dụng

### Khởi Động Dự Án

```bash
# Từ thư mục workspace root
cd /Volumes/SSD-Tunb/ecomate-workspace/ecomate-fe-v2

# Install dependencies
pnpm install

# Start dev server
pnpm dev --filter admin

# Hoặc từ thư mục admin
cd apps/admin
pnpm dev
```

Frontend sẽ chạy tại: [http://localhost:3001](http://localhost:3001)

### Cấu Hình

Tạo file `.env.local` trong `apps/admin/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Testing

#### 1. Test Login Owner (2FA)
```
1. Go to /login
2. Email: <OWNER_EMAIL từ backend .env>
3. Password: Lmmt9981
4. Check email
5. Click magic link
6. Verify redirect to /dashboard
```

#### 2. Test Register User
```
1. Go to /register
2. Fill form: email, password, etc.
3. Submit
4. Verify message "Registration submitted"
5. Check email của Owner
6. Click "Accept as ADMIN"
7. Login với credentials vừa đăng ký
```

#### 3. Test User Management (as Owner)
```
1. Login as Owner
2. Go to /dashboard/users
3. Click edit button on any user (not Owner)
4. Change role to STAFF
5. Verify toast "Role updated"
6. Verify table refreshed
7. Try change status to INACTIVE
8. Try delete user (with confirmation)
```

## Giải Thích Các Pattern

### 1. API Client với Interceptors

**Vấn đề**: Mỗi lần gọi API phải thêm token, handle error, refresh token

**Giải pháp**: Axios interceptors

```typescript
// Request interceptor: Tự động thêm token
client.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: Auto refresh token khi 401
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Gọi /refresh để lấy token mới
      const newTokens = await refreshToken()
      // Retry request với token mới
      return client(originalRequest)
    }
    return Promise.reject(error)
  }
)
```

### 2. React Query với Zustand

**Vấn đề**: Cần quản lý cả server state (users, requests) và client state (auth, UI)

**Giải pháp**: React Query cho server state, Zustand cho client state

```typescript
// Server state: React Query
const { data: users } = useQuery({
  queryKey: ['users'],
  queryFn: () => api.admin.getUsers(),
  staleTime: 60000, // Cache 1 phút
})

// Client state: Zustand
const { user, isAuthenticated } = useAuthStore()
```

### 3. Protected Routes

**Vấn đề**: Cần kiểm tra auth và role trước khi render page

**Giải pháp**: ProtectedRoute wrapper component

```typescript
export function ProtectedRoute({ children, requiredRoles }) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    redirect('/login')
  }

  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return <Unauthorized />
  }

  return <>{children}</>
}

// Usage
<ProtectedRoute requiredRoles={['OWNER']}>
  <UsersPage />
</ProtectedRoute>
```

### 4. Form Validation với Zod

**Vấn đề**: Cần validate form trước khi submit

**Giải pháp**: React Hook Form + Zod schema

```typescript
// Define schema
const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
})

// Use in form
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(loginSchema),
})

// Auto validate on submit
<form onSubmit={handleSubmit(onSubmit)}>
  <input {...register('email')} />
  {errors.email && <p>{errors.email.message}</p>}
</form>
```

## Troubleshooting Thường Gặp

### 1. "Failed to fetch" hoặc CORS error
**Nguyên nhân**: Backend chưa chạy hoặc sai URL

**Giải pháp**:
```bash
# Check backend đang chạy
curl http://localhost:3000/v1/auth/me

# Check .env.local
cat apps/admin/.env.local
# Phải có: NEXT_PUBLIC_API_URL=http://localhost:3000

# Restart dev server
pnpm dev --filter admin
```

### 2. "Unauthorized" khi vào protected route
**Nguyên nhân**: Token expired hoặc bị xóa

**Giải pháp**:
```javascript
// Clear localStorage và login lại
localStorage.clear()
// Reload trang
window.location.href = '/login'
```

### 3. Toast không hiện
**Nguyên nhân**: `<Toast />` component chưa được include

**Giải pháp**: Check file `packages/shared/src/providers/Providers.tsx`:
```typescript
export function Providers({ children, api }) {
  return (
    <ErrorBoundary>
      <QueryClientProvider>
        <AuthProvider api={api}>
          {children}
          <Toast /> {/* Phải có dòng này */}
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
```

### 4. Sidebar không responsive
**Nguyên nhân**: Tailwind classes không load đúng

**Giải pháp**:
```bash
# Clear Next.js cache
rm -rf apps/admin/.next
# Rebuild
pnpm dev --filter admin
```

## Mở Rộng Dự Án

### Thêm Trang Mới

1. **Tạo page mới**:
```typescript
// apps/admin/src/app/(dashboard)/dashboard/settings/page.tsx
export default function SettingsPage() {
  return <div>Settings Page</div>
}
```

2. **Thêm vào sidebar**:
```typescript
// apps/admin/src/components/dashboard/Sidebar.tsx
const navigation = [
  // ... existing routes
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    roles: ['OWNER', 'ADMIN'], // Ai được xem
  },
]
```

### Thêm API Endpoint Mới

1. **Tạo types**:
```typescript
// packages/lib/src/api/sdk/products.types.ts
export interface Product {
  id: string
  name: string
  price: number
}
```

2. **Tạo API SDK**:
```typescript
// packages/lib/src/api/sdk/products.api.ts
export class ProductsApi {
  async getProducts(): Promise<Product[]> {
    const response = await this.client.get('/v1/products')
    return response.data
  }
}
```

3. **Thêm vào main API class**:
```typescript
// packages/lib/src/api/index.ts
export class Api {
  auth: AuthApi
  admin: AdminApi
  products: ProductsApi // NEW

  constructor(client: AxiosInstance) {
    this.auth = new AuthApi(client)
    this.admin = new AdminApi(client)
    this.products = new ProductsApi(client) // NEW
  }
}
```

4. **Tạo React Query hook**:
```typescript
// packages/lib/src/hooks/products/useProducts.ts
export function useProducts({ api }) {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => api.products.getProducts(),
  })
}
```

5. **Sử dụng trong component**:
```typescript
// apps/admin/src/app/(dashboard)/dashboard/products/page.tsx
export default function ProductsPage() {
  const api = useApi()
  const { data: products, isLoading } = useProducts({ api })

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  )
}
```

## Tài Liệu Tham Khảo

- **[README.md](./apps/admin/README.md)** - Hướng dẫn chi tiết (English)
- **[ARCHITECTURE.md](./apps/admin/ARCHITECTURE.md)** - Kiến trúc hệ thống
- **[QUICK_START.md](./apps/admin/QUICK_START.md)** - Hướng dẫn nhanh
- **[Backend IAM](../ecomate-be/docs/IAM_IMPLEMENTATION_SUMMARY.md)** - Tài liệu backend

## Tech Stack

- **Next.js 15**: React framework với App Router
- **Zustand**: State management (nhẹ hơn Redux)
- **React Query**: Server state management & caching
- **Axios**: HTTP client
- **React Hook Form**: Form management
- **Zod**: Schema validation
- **Tailwind CSS**: Styling
- **TypeScript**: Type safety

## Kết Luận

Dự án được thiết kế với:
- ✅ **Dễ maintain**: Code sạch, tách biệt rõ ràng
- ✅ **Dễ mở rộng**: Monorepo, shared packages
- ✅ **Type safe**: Full TypeScript
- ✅ **Performance**: Caching, code splitting
- ✅ **Security**: JWT, role-based access

Nếu có câu hỏi, hãy tham khảo các file documentation ở trên!
