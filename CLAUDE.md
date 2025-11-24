# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ecomate Frontend is a monorepo containing multiple Next.js 15 applications and shared packages, built with Turborepo. The codebase uses TypeScript, React 19, and Tailwind CSS v4.

## Architecture

### Monorepo Structure
- **apps/web**: Main customer-facing application (port 3000)
- **apps/admin**: Admin dashboard for platform management (port 3001)
- **apps/landing**: Marketing landing page (port 3002)
- **apps/extension**: Chrome extension built with Vite
- **packages/ui**: Reusable UI components (shadcn/ui + React Aria)
- **packages/shared**: Business logic components and hooks
- **packages/lib**: API client, stores, normalizers, and utilities
- **packages/config**: Environment configuration and constants

### Key Architectural Patterns

#### Composition Pattern
The codebase implements a composition pattern for building flexible UI components:
- Component factory utilities in `packages/lib/utils/component-factory`
- Type definitions in `packages/lib/types/composition`
- Used for creating modular, composable UI components

#### API Integration
- Centralized API client in `@workspace/lib/api`
- Product data normalization for 1688.com integration
- Permission-based components and constants

#### State Management
- TanStack Query for server state
- Zustand stores in `@workspace/lib/stores`
- React Hook Form + Zod for form handling

## Essential Commands

### Development
```bash
# Run all apps simultaneously
pnpm dev

# Run specific app
pnpm --filter web dev
pnpm --filter admin dev
pnpm --filter extension dev

# Extension development
pnpm --filter extension build:release  # Build and package for release
```

### Testing & Quality
```bash
# Type checking
pnpm typecheck                    # Check all packages
pnpm --filter web typecheck       # Check specific app

# Linting
pnpm lint                         # Lint all packages
pnpm lint:fix                     # Auto-fix issues

# Formatting (handled by Lefthook pre-commit)
pnpm format                       # Manual format with Prettier
```

### Building
```bash
pnpm build                        # Build all apps and packages
pnpm --filter web build          # Build specific app
```

## Custom Commands & Subagents

The project includes specialized AI subagents for different development tasks:

### Quick Actions
- `/watzup`: Review recent changes and wrap up work
- `/cmp`: Stage, commit, and push all code in current branch
- `/fix`: Quick issue analysis and fix

### Development Tasks
- `/plan`: Research and create implementation plans
- `/cook`: Implement a feature
- `/test`: Run tests locally and analyze results
- `/debug`: Debug technical issues

### CI/CD & Testing
- `/fix-test`: Run test flows and fix issues
- `/fix-ci`: Analyze GitHub Actions logs and fix issues

## Import Conventions

- `@/*`: Local app imports (within each app)
- `@workspace/ui`: UI components
- `@workspace/shared`: Shared components and hooks
- `@workspace/lib`: API client and utilities
- `@workspace/config`: Environment and constants

## Environment Configuration

Each app uses `.env.local` for environment-specific variables. Central configuration is managed in `packages/config/src/env.ts`:

- `NEXT_PUBLIC_API_BASE_URL`: Backend API endpoint
- `NEXT_PUBLIC_APP_NAME`: Application name
- `NEXT_PUBLIC_ENABLE_DEVTOOLS`: Enable/disable dev tools

## Git Workflow

- Pre-commit hooks via Lefthook automatically format staged files with Prettier
- Commits follow Conventional Commits specification
- Main branch: `master`
- Development branch: `dev`

## Package Dependencies

When adding dependencies:
- App-specific: Add to individual app's `package.json`
- Shared across apps: Add to appropriate package in `packages/`
- Run `pnpm install` after changes

## Extension Development

The Chrome extension (`apps/extension`) uses Vite and has specific build commands:
- `pnpm --filter extension dev`: Development mode
- `pnpm --filter extension build:release`: Production build with packaging
- Output: `apps/extension/releases/` directory