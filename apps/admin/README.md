# Ecomate Admin Dashboard

Complete IAM (Identity & Access Management) admin interface for the Ecomate platform.

## Features

### Authentication
- ✅ **Login with 2FA support** - Owner accounts use magic link email verification
- ✅ **User registration** - Creates pending approval requests
- ✅ **Magic link verification** - Secure email-based 2FA
- ✅ **Protected routes** - Role-based access control
- ✅ **Auto token refresh** - Seamless session management

### Admin Panel (Owner Only)
- ✅ **User Management** - View, edit roles, change status, delete users
- ✅ **Registration Requests** - Approve/reject with role assignment
- ✅ **Role-based sidebar** - Dynamic navigation based on user permissions

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **State Management**: Zustand (with persistence)
- **API Layer**: Axios with custom client
- **Data Fetching**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation
- **Styling**: Tailwind CSS + shadcn/ui components
- **Monorepo**: Turborepo with shared packages

## Project Structure

```
apps/admin/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Public auth routes
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── verify-login/
│   │   ├── (dashboard)/         # Protected dashboard routes
│   │   │   └── dashboard/
│   │   │       ├── page.tsx
│   │   │       ├── users/
│   │   │       └── registration-requests/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── auth/                # Auth forms
│   │   └── dashboard/           # Dashboard components
│   └── lib/
│       ├── api-client.ts        # API client setup
│       └── protected-route.tsx  # Route guard
├── .env.local.example
└── package.json

packages/
├── lib/                         # Shared API & hooks
│   ├── src/
│   │   ├── api/
│   │   │   ├── sdk/             # API SDKs (auth, admin)
│   │   │   ├── client.ts        # Axios client factory
│   │   │   └── interceptors.ts  # Error handling
│   │   ├── hooks/               # React Query hooks
│   │   │   ├── auth/
│   │   │   ├── admin/
│   │   │   └── users/
│   │   └── stores/              # Zustand stores
│   │       ├── auth.store.ts
│   │       ├── notification.store.ts
│   │       └── ui.store.ts
│
├── shared/                      # Shared components & utils
│   ├── src/
│   │   ├── components/
│   │   │   ├── Toast.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   ├── providers/
│   │   │   ├── Providers.tsx    # Root providers
│   │   │   └── AuthProvider.tsx
│   │   └── utils/
│   │       ├── error-handler.ts
│   │       └── format.ts
│
└── ui/                          # UI components
    └── src/components/ui/
        ├── input.tsx
        └── label.tsx
```

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Variables

Create `.env.local` in `apps/admin/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Start Development Server

```bash
# From root
pnpm dev --filter admin

# Or from apps/admin
pnpm dev
```

The app will be available at [http://localhost:3001](http://localhost:3001)

## Usage

### Authentication Flow

#### Normal User Login
1. Navigate to `/login`
2. Enter email and password
3. Redirected to `/dashboard` on success

#### Owner Login (with 2FA)
1. Navigate to `/login`
2. Enter email and password
3. Check email for magic link
4. Click magic link (redirects to `/verify-login?token=xxx`)
5. Redirected to `/dashboard` on verification

#### User Registration
1. Navigate to `/register`
2. Fill out registration form
3. Receive "pending approval" message
4. Owner receives email with approval options
5. Once approved, user can log in

### Admin Features

#### User Management (Owner Only)
- **View Users**: See all registered users
- **Change Role**: Update user role (Admin, Staff, Viewer)
- **Change Status**: Activate, deactivate, or suspend users
- **Delete User**: Remove users (cannot delete Owner)

#### Registration Requests (Owner Only)
- **View Requests**: See all pending registration requests
- **Approve**: Accept request and assign role
- **Reject**: Decline request with optional reason
- **Auto-expire**: Requests expire after 3 days

## API Integration

### API Client Setup

The API client is configured with:
- **Base URL**: `process.env.NEXT_PUBLIC_API_URL`
- **Auth Interceptor**: Automatically adds JWT token to requests
- **Token Refresh**: Auto-refreshes expired tokens
- **Error Handling**: Normalized error responses

### Available Hooks

#### Auth Hooks
```typescript
import { useLogin, useRegister, useLogout, useVerifyMagicLink, useCurrentUser } from '@workspace/lib/hooks'

const loginMutation = useLogin({ api, onSuccess: () => router.push('/dashboard') })
const registerMutation = useRegister({ api })
const logoutMutation = useLogout({ api })
const verifyMutation = useVerifyMagicLink({ api })
const { data: user } = useCurrentUser({ api })
```

#### Admin Hooks
```typescript
import { useRegistrationRequests, useApproveRequest, useRejectRequest } from '@workspace/lib/hooks'

const { data: requests } = useRegistrationRequests({ api })
const approveMutation = useApproveRequest({ api })
const rejectMutation = useRejectRequest({ api })
```

#### User Management Hooks
```typescript
import { useUsers, useUpdateUserRole, useUpdateUserStatus, useDeleteUser } from '@workspace/lib/hooks'

const { data: users } = useUsers({ api })
const updateRoleMutation = useUpdateUserRole({ api })
const updateStatusMutation = useUpdateUserStatus({ api })
const deleteUserMutation = useDeleteUser({ api })
```

## State Management

### Zustand Stores

#### Auth Store
```typescript
import { useAuthStore } from '@workspace/lib/stores'

const { user, isAuthenticated, setUser, logout } = useAuthStore()
```

#### Notification Store
```typescript
import { useNotificationStore } from '@workspace/lib/stores'

const { success, error, warning, info } = useNotificationStore()

// Usage
success('User created successfully')
error('Failed to update user')
```

#### UI Store
```typescript
import { useUIStore } from '@workspace/lib/stores'

const { sidebarCollapsed, toggleSidebarCollapsed } = useUIStore()
```

## Role-Based Access Control

### Roles
- **OWNER**: Full access (seeded by backend)
- **ADMIN**: Administrative access
- **STAFF**: Limited access
- **VIEWER**: Read-only access

### Protected Routes

```typescript
import { ProtectedRoute } from '@/lib/protected-route'

<ProtectedRoute requiredRoles={['OWNER']}>
  {/* Only Owner can access */}
</ProtectedRoute>
```

## Components

### Reusable Auth Components
- `LoginForm` - Email/password login with 2FA detection
- `RegisterForm` - User registration with validation
- `MagicLinkVerification` - Magic link verification page

### Dashboard Components
- `Sidebar` - Collapsible navigation with role filtering
- `DashboardHeader` - Header with user menu and theme switcher
- `Toast` - Global notification system
- `ErrorBoundary` - Error handling wrapper

## Development

### Adding New Pages

1. Create page in appropriate route group:
```typescript
// apps/admin/src/app/(dashboard)/dashboard/new-page/page.tsx
export default function NewPage() {
  return <div>New Page</div>
}
```

2. Add to sidebar navigation:
```typescript
// apps/admin/src/components/dashboard/Sidebar.tsx
const navigation = [
  // ...
  { name: 'New Page', href: '/dashboard/new-page', icon: Icon, roles: ['OWNER'] },
]
```

### Creating New API Endpoints

1. Add API method to SDK:
```typescript
// packages/lib/src/api/sdk/your.api.ts
export class YourApi {
  async getData() {
    return await this.client.get('/endpoint')
  }
}
```

2. Create React Query hook:
```typescript
// packages/lib/src/hooks/your/useYourData.ts
export function useYourData({ api }: { api: Api }) {
  return useQuery({
    queryKey: ['your-data'],
    queryFn: () => api.your.getData(),
  })
}
```

## Testing

### Manual Testing Checklist

- [ ] Login with normal user
- [ ] Login with Owner (2FA flow)
- [ ] Register new user
- [ ] Verify magic link
- [ ] Approve registration request
- [ ] Reject registration request
- [ ] Update user role
- [ ] Update user status
- [ ] Delete user
- [ ] Logout
- [ ] Protected route access control
- [ ] Theme switching
- [ ] Responsive design

## Troubleshooting

### Common Issues

**Issue**: "Failed to fetch" or CORS errors
- **Solution**: Ensure backend is running on `http://localhost:3000`
- Check `NEXT_PUBLIC_API_URL` in `.env.local`

**Issue**: "Unauthorized" on protected routes
- **Solution**: Clear localStorage and re-login
- Check if token is expired

**Issue**: Toast notifications not showing
- **Solution**: Ensure `<Toast />` is included in Providers

**Issue**: Sidebar not responsive
- **Solution**: Check if `useUIStore` is properly initialized

## Backend Requirements

This frontend expects the backend IAM system from `ecomate-be` with:
- Authentication endpoints (`/v1/auth/*`)
- Admin endpoints (`/v1/admin/*`)
- JWT token-based authentication
- Magic link support for Owner 2FA

See `ecomate-be/docs/IAM_IMPLEMENTATION_SUMMARY.md` for backend details.

## Production Deployment

### Build

```bash
pnpm build
```

### Environment Variables (Production)

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Deploy

Deploy to Vercel, Netlify, or any Node.js hosting platform that supports Next.js 15.

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit PR

## License

Proprietary - Ecomate Platform
