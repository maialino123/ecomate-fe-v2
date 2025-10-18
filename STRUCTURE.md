# Cấu trúc Project ecomate-fe-v2

```
ecomate-fe-v2/
│
├── apps/                           # Applications
│   ├── web/                        # Main web app (port 3000)
│   │   ├── src/
│   │   │   └── app/               # Next.js App Router
│   │   │       ├── layout.tsx
│   │   │       └── page.tsx
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── next.config.mjs
│   │   └── eslint.config.js
│   │
│   ├── admin/                      # Admin dashboard (port 3001)
│   │   ├── src/
│   │   │   └── app/
│   │   ├── package.json
│   │   └── ...configs
│   │
│   └── landing/                    # Landing page (port 3002)
│       ├── src/
│       │   └── app/
│       ├── package.json
│       └── ...configs
│
├── packages/                       # Shared packages
│   ├── ui/                        # UI component library
│   │   └── src/
│   │       ├── components/        # 48+ components (shadcn-based)
│   │       ├── hooks/
│   │       ├── lib/
│   │       └── styles/
│   │
│   ├── shared/                    # Shared business logic
│   │   └── src/
│   │       ├── components/        # ThemeSwitcher, etc.
│   │       ├── hooks/             # useMounted, etc.
│   │       └── providers/         # Providers (React Query, Theme)
│   │
│   ├── config/                    # Configuration
│   │   └── src/
│   │       ├── env.ts            # Environment variables
│   │       └── constants.ts      # App constants
│   │
│   ├── lib/                       # Utilities & API
│   │   └── src/
│   │       ├── api/              # API client
│   │       │   └── sdk/          # API SDKs
│   │       └── validation/       # Zod schemas
│   │
│   ├── eslint-config/            # ESLint configurations
│   │   ├── base.js
│   │   ├── next.js
│   │   └── react-internal.js
│   │
│   └── typescript-config/        # TypeScript configurations
│       ├── base.json
│       ├── nextjs.json
│       └── react-library.json
│
├── package.json                   # Root package.json
├── pnpm-workspace.yaml           # Workspace configuration
├── turbo.json                    # Turborepo configuration
├── README.md                     # Documentation
├── MIGRATION.md                  # Migration guide
└── STRUCTURE.md                  # This file
```

## Import Patterns

### Trong Apps (web, admin, landing):
```typescript
// Workspace packages
import { Button } from '@workspace/ui/components/Button'
import { Providers } from '@workspace/shared/providers'
import { env } from '@workspace/config/env'
import { api } from '@workspace/lib/api'

// Local imports
import { Component } from '@/components/Component'
```

### Trong Packages:
```typescript
// Relative imports (trong cùng package)
import { helper } from '../utils/helper'

// Workspace packages (từ package khác)
import { Button } from '@workspace/ui/components/Button'
```

## Package Dependencies

```
apps/web
apps/admin     →  @workspace/ui
apps/landing   →  @workspace/shared
               →  @workspace/config
               →  @workspace/lib

@workspace/shared  →  @workspace/ui

@workspace/ui
@workspace/config     (độc lập)
@workspace/lib
```

## Ports

- **Web**: 3000 (`pnpm --filter web dev`)
- **Admin**: 3001 (`pnpm --filter admin dev`)
- **Landing**: 3002 (`pnpm --filter landing dev`)

## Key Features

- ✅ Monorepo với Turborepo
- ✅ 3 apps (web, admin, landing)
- ✅ 6 shared packages
- ✅ TypeScript strict mode
- ✅ ESLint + Prettier
- ✅ Tailwind CSS v4
- ✅ Next.js 15 (App Router)
- ✅ React 19
- ✅ pnpm workspaces
- ✅ Turbo cache optimization
