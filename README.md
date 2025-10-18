# Ecomate Frontend Monorepo

Modern, scalable monorepo structure for Ecomate's frontend applications built with Turborepo, Next.js 15, and TypeScript.

## Project Structure

```
ecomate-fe-v2/
├── apps/
│   ├── web/                    # Main web application (port 3000)
│   ├── admin/                  # Admin dashboard (port 3001)
│   └── landing/                # Landing page (port 3002)
│
├── packages/
│   ├── ui/                     # Shared UI components (shadcn-based)
│   ├── shared/                 # Shared components, hooks, and providers
│   ├── config/                 # Environment and app configuration
│   ├── lib/                    # API client and utilities
│   ├── eslint-config/          # Shared ESLint configurations
│   └── typescript-config/      # Shared TypeScript configurations
│
└── tooling/                    # Build and development tools (future)
```

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Monorepo**: [Turborepo](https://turbo.build/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/) + [React Aria](https://react-spectrum.adobe.com/react-aria/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 10.4.1

### Installation

```bash
# Install dependencies
pnpm install

# Run all apps in development mode
pnpm dev

# Run specific app
pnpm --filter web dev
pnpm --filter admin dev
pnpm --filter landing dev
```

### Development Commands

```bash
# Development
pnpm dev                    # Run all apps
pnpm --filter web dev       # Run web app only

# Building
pnpm build                  # Build all apps and packages
pnpm --filter web build     # Build web app only

# Type checking
pnpm typecheck              # Type check all packages

# Linting
pnpm lint                   # Lint all packages
pnpm lint:fix              # Auto-fix linting issues

# Formatting
pnpm format                 # Format code with Prettier
```

## Apps

### Web App (Main Application)
- **Port**: 3000
- **Path**: `apps/web`
- **Description**: Main customer-facing web application

### Admin Dashboard
- **Port**: 3001
- **Path**: `apps/admin`
- **Description**: Internal admin dashboard for managing the platform

### Landing Page
- **Port**: 3002
- **Path**: `apps/landing`
- **Description**: Marketing landing page

## Packages

### @workspace/ui
Reusable UI components built with shadcn/ui and React Aria.

```tsx
import { Button } from '@workspace/ui/components/Button'
import { Card } from '@workspace/ui/components/Card'
```

### @workspace/shared
Shared components, hooks, and providers across all apps.

```tsx
import { Providers } from '@workspace/shared/providers'
import { ThemeSwitcher } from '@workspace/shared/components/ThemeSwitcher'
import { useMounted } from '@workspace/shared/hooks/useMounted'
```

### @workspace/config
Environment variables and application constants.

```tsx
import { env } from '@workspace/config/env'
import { APP_CONSTANTS } from '@workspace/config/constants'
```

### @workspace/lib
API client, validation schemas, and utilities.

```tsx
import { api } from '@workspace/lib/api'
```

## Adding New Apps

To add a new app to the monorepo:

1. Create app directory in `apps/`
2. Copy configuration from existing app
3. Update port in `package.json` scripts
4. Add app to workspace in `pnpm-workspace.yaml`
5. Run `pnpm install`

## Adding New Packages

To add a new shared package:

1. Create package directory in `packages/`
2. Add `package.json` with proper exports
3. Add to workspace in `pnpm-workspace.yaml`
4. Run `pnpm install`

## Environment Variables

Each app can have its own `.env.local` file:

```bash
# apps/web/.env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

Shared environment configuration is in `packages/config/src/env.ts`.

## Project Guidelines

### Import Aliases

- `@/*` - Local app imports (within each app)
- `@workspace/*` - Workspace package imports

### Code Organization

- **Apps**: Application-specific code, pages, and features
- **Packages**: Reusable code shared across multiple apps
- **UI Components**: Low-level, presentational components in `@workspace/ui`
- **Shared Components**: Business logic components in `@workspace/shared`

### Best Practices

1. Keep apps thin, extract reusable logic to packages
2. Use `@workspace/ui` for presentational components
3. Use `@workspace/shared` for business logic components
4. Keep API logic in `@workspace/lib`
5. Centralize configuration in `@workspace/config`

## Turborepo Pipeline

The build pipeline is optimized for caching and parallel execution:

- **build**: Builds apps and packages in dependency order
- **lint**: Lints all code
- **typecheck**: Type checks all TypeScript code
- **dev**: Runs development servers (no caching)

## Contributing

1. Create a feature branch
2. Make your changes
3. Run `pnpm typecheck` and `pnpm lint`
4. Create a pull request

## License

Private - Ecomate Team
