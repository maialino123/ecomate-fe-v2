# Quick Start Guide

Get the Ecomate Admin Dashboard running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- Backend API running (see [ecomate-be](../../ecomate-be))

## Steps

### 1. Clone & Install

```bash
cd ecomate-workspace/ecomate-fe-v2
pnpm install
```

### 2. Configure Environment

Create `.env.local` in `apps/admin/`:

```bash
cp apps/admin/.env.local.example apps/admin/.env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Start Development Server

```bash
# From workspace root
pnpm dev --filter admin

# Or from apps/admin
cd apps/admin
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001)

### 4. Login

#### As Owner (with 2FA):
1. Email: `<OWNER_EMAIL from backend .env>`
2. Password: `Lmmt9981` (default, change after first login)
3. Check email for magic link
4. Click link to complete login

#### As Regular User:
1. Register at `/register`
2. Wait for owner approval
3. Login at `/login`

## Project Structure

```
apps/admin/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Login, Register
│   │   └── (dashboard)/     # Dashboard, Users, Requests
│   ├── components/          # React components
│   └── lib/                 # API client, utilities
├── .env.local               # Environment variables
└── package.json
```

## Available Routes

### Public Routes
- `/login` - Login page
- `/register` - Registration page
- `/verify-login` - Magic link verification

### Protected Routes (requires authentication)
- `/dashboard` - Dashboard home
- `/dashboard/users` - User management (Owner only)
- `/dashboard/registration-requests` - Approval management (Owner only)

## Common Commands

```bash
# Start development
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Type check
pnpm typecheck

# Lint code
pnpm lint

# Fix lint issues
pnpm lint:fix
```

## Testing

### Manual Testing Flow

1. **Register User**
   - Go to `/register`
   - Fill form and submit
   - Verify "pending approval" message

2. **Owner Approves**
   - Login as Owner
   - Go to `/dashboard/registration-requests`
   - Click approve button
   - Select role (Admin/Staff/Viewer)

3. **User Logs In**
   - Go to `/login`
   - Use registered credentials
   - Access dashboard

4. **Owner Manages Users**
   - Go to `/dashboard/users`
   - Change user role
   - Change user status
   - Delete user (if needed)

## Troubleshooting

### Issue: "Failed to fetch" errors
**Solution:**
- Ensure backend is running on port 3000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify CORS is enabled on backend

### Issue: "Unauthorized" on protected routes
**Solution:**
- Clear browser localStorage
- Re-login
- Check if JWT token is expired

### Issue: Toasts not showing
**Solution:**
- Check browser console for errors
- Verify `<Toast />` is in Providers
- Check Zustand store setup

### Issue: Sidebar not visible
**Solution:**
- Check `useUIStore` initialization
- Clear localStorage for `ecomate-ui-storage`
- Verify responsive breakpoints

## Next Steps

- [ ] Change default owner password
- [ ] Test all user roles (Owner, Admin, Staff, Viewer)
- [ ] Configure production environment variables
- [ ] Review [README.md](./README.md) for detailed documentation
- [ ] Check [ARCHITECTURE.md](./ARCHITECTURE.md) for architecture details

## Support

For issues or questions:
1. Check [README.md](./README.md)
2. Review [ARCHITECTURE.md](./ARCHITECTURE.md)
3. Check backend [IAM_IMPLEMENTATION_SUMMARY.md](../../ecomate-be/docs/IAM_IMPLEMENTATION_SUMMARY.md)

## Quick Reference

### Default Credentials (Backend Seeded)
- Email: `<from OWNER_EMAIL in backend .env>`
- Password: `Lmmt9981`
- Role: `OWNER`
- 2FA: Enabled

### API Endpoints (Backend)
- Auth: `http://localhost:3000/v1/auth/*`
- Admin: `http://localhost:3000/v1/admin/*`

### Technology Stack
- **Framework**: Next.js 15
- **State**: Zustand + React Query
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **HTTP**: Axios

---

Happy coding! 🚀
