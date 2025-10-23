# Admin Dashboard Architecture

## Overview

This document describes the architecture and design patterns used in the Ecomate Admin Dashboard.

## Architecture Principles

### 1. **Separation of Concerns**
- **Presentation Layer**: React components (`apps/admin/src/components`)
- **Business Logic**: Custom hooks (`packages/lib/src/hooks`)
- **Data Layer**: API SDKs (`packages/lib/src/api/sdk`)
- **State Management**: Zustand stores (`packages/lib/src/stores`)

### 2. **Monorepo Structure**
```
workspace/
├── apps/admin/          # Application code
└── packages/
    ├── lib/             # API, hooks, stores (business logic)
    ├── shared/          # Shared components & utilities
    ├── ui/              # UI component library
    └── config/          # Shared configuration
```

### 3. **Type Safety**
- Full TypeScript coverage
- Zod schema validation for forms
- Type-safe API responses
- Strict mode enabled

## Layer Architecture

### Layer 1: API Client (`packages/lib/src/api`)

```typescript
┌─────────────────────────────────────┐
│         API Client Factory          │
│   (createApiClient + interceptors)  │
└─────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│          API Class (SDKs)           │
│  ┌───────────┐  ┌────────────┐     │
│  │  AuthApi  │  │  AdminApi  │     │
│  └───────────┘  └────────────┘     │
└─────────────────────────────────────┘
```

**Responsibilities:**
- HTTP request/response handling
- Token management (access + refresh)
- Error normalization
- Request/response interceptors

**Key Files:**
- `client.ts` - Axios client factory with auth interceptors
- `interceptors.ts` - Error handling utilities
- `sdk/auth.api.ts` - Authentication endpoints
- `sdk/admin.api.ts` - Admin management endpoints

### Layer 2: React Query Hooks (`packages/lib/src/hooks`)

```typescript
┌─────────────────────────────────────┐
│         React Query Hooks           │
│  ┌──────────┐  ┌──────────────┐    │
│  │useLogin  │  │useUsers      │    │
│  │useRegister│  │useApprove   │    │
│  └──────────┘  └──────────────┘    │
└─────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│     Zustand Stores & Toasts         │
└─────────────────────────────────────┘
```

**Responsibilities:**
- Data fetching and caching
- Mutation handling
- Automatic cache invalidation
- Loading/error state management
- Notification triggers

**Patterns:**
```typescript
export function useLogin({ api, onSuccess, onError }) {
  const { setUser, setTokens } = useAuthStore()
  const { error: showError } = useNotificationStore()

  return useMutation({
    mutationFn: (dto) => api.auth.signIn(dto),
    onSuccess: (data) => {
      // Update stores
      setTokens(data.tokens)
      setUser(data.user)
      onSuccess?.(data)
    },
    onError: (error) => {
      // Show notification
      showError(handleApiError(error).message)
      onError?.(error)
    },
  })
}
```

### Layer 3: Zustand Stores (`packages/lib/src/stores`)

```typescript
┌─────────────────────────────────────┐
│          Zustand Stores             │
│  ┌───────────────┐                  │
│  │  AuthStore    │ ← Persisted      │
│  │  - user       │                  │
│  │  - tokens     │                  │
│  └───────────────┘                  │
│  ┌───────────────┐                  │
│  │ NotificationStore                │
│  │  - notifications[]               │
│  └───────────────┘                  │
│  ┌───────────────┐                  │
│  │   UIStore     │ ← Persisted      │
│  │  - sidebar    │                  │
│  └───────────────┘                  │
└─────────────────────────────────────┘
```

**Responsibilities:**
- Global state management
- Persistence (localStorage)
- State subscriptions
- Actions for state updates

**Persistence Strategy:**
- `AuthStore`: Persisted (for session continuity)
- `UIStore`: Persisted (for user preferences)
- `NotificationStore`: NOT persisted (ephemeral)

### Layer 4: React Components (`apps/admin/src/components`)

```typescript
┌─────────────────────────────────────┐
│        React Components             │
│  ┌───────────┐  ┌────────────┐     │
│  │LoginForm  │  │UsersTable  │     │
│  └───────────┘  └────────────┘     │
│         │              │            │
│         ▼              ▼            │
│  ┌───────────────────────┐         │
│  │    Custom Hooks       │         │
│  │  (useLogin, useUsers) │         │
│  └───────────────────────┘         │
└─────────────────────────────────────┘
```

**Responsibilities:**
- UI rendering
- User interactions
- Form validation (react-hook-form + zod)
- Local component state

**Component Pattern:**
```typescript
export function LoginForm() {
  const api = useApi()  // From context
  const router = useRouter()  // From Next.js

  // Form state (local)
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(loginSchema),
  })

  // Mutation (from hook)
  const loginMutation = useLogin({
    api,
    onSuccess: () => router.push('/dashboard'),
  })

  return <form onSubmit={handleSubmit((data) => loginMutation.mutate(data))} />
}
```

## Data Flow

### Authentication Flow

```
┌──────────┐         ┌──────────┐         ┌──────────┐         ┌──────────┐
│ LoginForm│────────▶│ useLogin │────────▶│ AuthApi  │────────▶│ Backend  │
└──────────┘  submit └──────────┘ mutate  └──────────┘  POST   └──────────┘
                          │                                          │
                          │ onSuccess                                │
                          ▼                                          │
                    ┌──────────┐                                     │
                    │AuthStore │◀────────────────────────────────────┘
                    │- setUser │  { accessToken, refreshToken, user }
                    │- setTokens│
                    └──────────┘
                          │
                          │ state update
                          ▼
                    ┌──────────┐
                    │Protected │
                    │  Route   │─────▶ Redirect to /dashboard
                    └──────────┘
```

### Token Refresh Flow

```
┌──────────┐         ┌──────────┐         ┌──────────┐
│ Any API  │────────▶│Axios     │────────▶│ Backend  │
│ Request  │  call   │Interceptor│  GET   └──────────┘
└──────────┘         └──────────┘              │
                          │                    │ 401 Unauthorized
                          │◀───────────────────┘
                          │
                          │ Refresh token?
                          ▼
                    ┌──────────┐
                    │ POST     │────────▶ Backend /refresh
                    │ /refresh │  token
                    └──────────┘
                          │
                          │ New tokens
                          ▼
                    ┌──────────┐
                    │AuthStore │
                    │.setTokens│
                    └──────────┘
                          │
                          │ Retry original request
                          ▼
                    ┌──────────┐
                    │ Success  │
                    └──────────┘
```

### Registration Approval Flow

```
User                     Owner                    System
  │                        │                        │
  │ POST /register         │                        │
  ├───────────────────────────────────────────────▶│
  │                        │                        │
  │◀─────────────────────── pending response ──────┤
  │                        │                        │
  │                        │◀─── approval email ────┤
  │                        │  (4 action buttons)    │
  │                        │                        │
  │                        │ Click "Approve as X"   │
  │                        ├───────────────────────▶│
  │                        │                        │
  │                        │                        │ Create user
  │                        │                        │ with role X
  │                        │                        │
  │                        │◀─────── success ───────┤
  │                        │                        │
  │ Can now login          │                        │
  │                        │                        │
```

## Routing Strategy

### Route Groups

```
app/
├── (auth)/              # Public routes
│   ├── login/
│   ├── register/
│   └── verify-login/
└── (dashboard)/         # Protected routes
    └── dashboard/
        ├── page.tsx
        ├── users/
        └── registration-requests/
```

**Benefits:**
- Clear separation of public/protected routes
- Shared layouts per group
- Easy to apply middleware/guards

### Protected Routes Pattern

```typescript
// (dashboard)/layout.tsx
export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute requiredRoles={['OWNER', 'ADMIN']}>
      <Sidebar />
      <Header />
      <main>{children}</main>
    </ProtectedRoute>
  )
}
```

## Error Handling Strategy

### 3-Tier Error Handling

1. **API Layer**: Normalize axios errors to `ApiError`
2. **Hook Layer**: Show toast notifications
3. **Component Layer**: Display inline errors

```typescript
// 1. API Layer (interceptors.ts)
export function handleApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    return {
      message: error.response?.data?.message,
      statusCode: error.response?.status,
    }
  }
  return { message: 'Unknown error', statusCode: 500 }
}

// 2. Hook Layer (useLogin.ts)
return useMutation({
  onError: (error) => {
    const apiError = handleApiError(error)
    showError(apiError.message, 'Login Failed')
  },
})

// 3. Component Layer (LoginForm.tsx)
{loginMutation.error && (
  <p className="text-red-500">
    {handleApiError(loginMutation.error).message}
  </p>
)}
```

## State Management Strategy

### When to Use Each Store

| Store | Use Case | Persistence |
|-------|----------|-------------|
| **AuthStore** | User session, tokens | ✅ Yes (localStorage) |
| **NotificationStore** | Toast messages | ❌ No (ephemeral) |
| **UIStore** | Sidebar, preferences | ✅ Yes (localStorage) |
| **React Query** | Server state (users, requests) | ✅ Yes (memory cache) |
| **Local State** | Form inputs, modals | ❌ No (component-scoped) |

### State Location Decision Tree

```
Is it server data? ───Yes──▶ React Query
     │
     No
     │
     ▼
Is it auth-related? ───Yes──▶ AuthStore
     │
     No
     │
     ▼
Is it UI preference? ───Yes──▶ UIStore
     │
     No
     │
     ▼
Is it a notification? ───Yes──▶ NotificationStore
     │
     No
     │
     ▼
Component-local state (useState)
```

## Performance Optimizations

### 1. Code Splitting
```typescript
// Automatic with Next.js App Router
// Each route is a separate chunk
```

### 2. React Query Caching
```typescript
{
  staleTime: 1000 * 60,  // 1 minute
  cacheTime: 1000 * 60 * 5,  // 5 minutes
}
```

### 3. Zustand Persistence
```typescript
// Only persist necessary data
persist(
  (set) => ({ /* state */ }),
  {
    name: 'auth-storage',
    partialize: (state) => ({
      user: state.user,
      tokens: state.tokens,
    }),
  }
)
```

### 4. Component Memoization
```typescript
// Use React.memo for expensive components
export const ExpensiveTable = React.memo(function ExpensiveTable({ data }) {
  // ...
})
```

## Security Considerations

### 1. Token Storage
- ✅ Stored in localStorage (accessible by JS)
- ✅ Auto-cleared on logout
- ⚠️ Vulnerable to XSS (mitigated by Content Security Policy)
- 🔄 Consider httpOnly cookies for production

### 2. CSRF Protection
- All mutations use POST/PATCH/DELETE
- Tokens in Authorization header (not cookies)

### 3. XSS Prevention
- React auto-escapes rendered content
- No `dangerouslySetInnerHTML` usage
- Sanitize user input

### 4. Route Protection
- Server-side: JWT validation on backend
- Client-side: `ProtectedRoute` component
- Role-based access control

## Testing Strategy (Future)

### Unit Tests
- Zustand stores
- Utility functions
- API error handling

### Integration Tests
- React Query hooks
- Form submissions
- Auth flow

### E2E Tests
- Login/logout flow
- User management
- Registration approval

## Deployment

### Build Process
```bash
pnpm build
# Outputs to .next/
```

### Environment Variables
```env
# Required
NEXT_PUBLIC_API_URL=https://api.production.com

# Optional
NODE_ENV=production
```

### Hosting Recommendations
- **Vercel**: Zero-config Next.js hosting
- **Netlify**: Good alternative with SSR support
- **AWS Amplify**: For AWS-integrated deployments
- **Self-hosted**: Docker + Node.js server

## Future Enhancements

### Phase 1 (Current) ✅
- Authentication & authorization
- User management
- Registration approval

### Phase 2 (Planned)
- [ ] Analytics dashboard
- [ ] Audit logs
- [ ] Email notification preferences
- [ ] Bulk operations

### Phase 3 (Future)
- [ ] Real-time updates (WebSocket)
- [ ] Advanced reporting
- [ ] Role permissions customization
- [ ] Multi-tenant support

## Conclusion

This architecture prioritizes:
- **Maintainability**: Clear separation of concerns
- **Scalability**: Monorepo structure for shared code
- **Type Safety**: Full TypeScript coverage
- **Performance**: Efficient caching and code splitting
- **Developer Experience**: Modern tooling and patterns

For questions or suggestions, please contact the development team.
