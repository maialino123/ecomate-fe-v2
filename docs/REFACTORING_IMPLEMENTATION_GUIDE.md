# Refactoring Implementation Guide

## Overview
This guide provides step-by-step instructions for implementing the refactoring recommendations identified in the code quality analysis.

---

## Task 1: Consolidate useIsMobile Hook

### Goal
Remove duplicate mobile detection hook and use single shared implementation.

### Steps

1. **Verify the shared hook works correctly**
```bash
# Test in packages/ui
cd packages/ui
cat src/hooks/use-mobile.ts
```

2. **Find all usages in landing app**
```bash
cd apps/landing
grep -r "useIsMobile" src/
```

3. **Update imports**
```typescript
// Before
import { useIsMobile } from '@/hooks/useIsMobile'

// After
import { useIsMobile } from '@workspace/ui/hooks/use-mobile'
```

4. **Update function calls**
```typescript
// Before
const isMobile = useIsMobile(768)

// After
const isMobile = useIsMobile({ breakpoint: 768 })
```

5. **Remove duplicate file**
```bash
rm apps/landing/src/hooks/useIsMobile.ts
```

6. **Test**
```bash
pnpm --filter landing dev
# Verify mobile detection works at different viewport sizes
```

### Files to Modify
- All files importing from `@/hooks/useIsMobile` in landing app
- Delete: `apps/landing/src/hooks/useIsMobile.ts`

### Estimated Time: 30 minutes

---

## Task 2: Create Shared Form Utilities

### 2.1 Create useFormSubmit Hook

**File:** `packages/shared/src/hooks/useFormSubmit.ts`

```typescript
'use client'

import { useCallback } from 'react'
import type { UseFormHandleSubmit } from 'react-hook-form'

/**
 * Hook to handle form submission with error prevention
 * Prevents ErrorBoundary from catching form errors and refreshing page
 */
export function useFormSubmit<T extends Record<string, any>>(
  onSubmit: (data: T) => Promise<void> | void,
  handleSubmit: UseFormHandleSubmit<T>
) {
  return useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      e.stopPropagation()
      
      try {
        await handleSubmit(onSubmit)(e)
      } catch (error) {
        // Catch any unhandled errors from form submission
        // This prevents ErrorBoundary from catching and refreshing the page
        console.error('Form submission error:', error)
      }
    },
    [handleSubmit, onSubmit]
  )
}
```

**Update exports:**
```typescript
// packages/shared/src/hooks/index.ts
export { useFormSubmit } from './useFormSubmit'
```

### 2.2 Create ErrorAlert Component

**File:** `packages/shared/src/components/ErrorAlert.tsx`

```typescript
'use client'

import { XCircle } from 'lucide-react'

interface ErrorAlertProps {
  message: string | null
  onDismiss?: () => void
}

/**
 * Displays an error message with consistent styling
 */
export function ErrorAlert({ message, onDismiss }: ErrorAlertProps) {
  if (!message) return null

  return (
    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <div className="flex items-start gap-2">
        <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-red-600 dark:text-red-400 flex-1">{message}</p>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}
```

### 2.3 Create SuccessState Component

**File:** `packages/shared/src/components/SuccessState.tsx`

```typescript
'use client'

import { CheckCircle2 } from 'lucide-react'
import { Button } from '@workspace/ui/components/Button'

interface SuccessStateProps {
  title: string
  message: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

/**
 * Displays a success state with consistent styling
 */
export function SuccessState({
  title,
  message,
  description,
  actionLabel = 'Back',
  onAction,
}: SuccessStateProps) {
  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-500">{description}</p>
        )}
      </div>
      {onAction && (
        <Button onClick={onAction} variant="outline" className="w-full">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
```

### 2.4 Create FormField Component

**File:** `packages/shared/src/components/FormField.tsx`

```typescript
'use client'

import { Input } from '@workspace/ui/components/ui/input'
import { Label } from '@workspace/ui/components/ui/label'
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form'

interface FormFieldProps {
  label: string
  id: string
  type?: string
  placeholder?: string
  error?: FieldError
  required?: boolean
  disabled?: boolean
  registration: UseFormRegisterReturn
}

/**
 * Form field with label and error message
 */
export function FormField({
  label,
  id,
  type = 'text',
  placeholder,
  error,
  required,
  disabled,
  registration,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        {...registration}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  )
}
```

### 2.5 Update Component Exports

**File:** `packages/shared/src/components/index.ts`

```typescript
export { ErrorAlert } from './ErrorAlert'
export { SuccessState } from './SuccessState'
export { FormField } from './FormField'
// ... existing exports
```

### 2.6 Refactor LoginForm

**File:** `apps/admin/src/components/auth/LoginForm.tsx`

```typescript
// Add imports
import { useFormSubmit } from '@workspace/shared/hooks'
import { ErrorAlert, SuccessState } from '@workspace/shared/components'

// Replace handleFormSubmit
const formSubmit = useFormSubmit(onSubmit, handleSubmit)

// Replace error display
<ErrorAlert message={apiError} onDismiss={() => setApiError(null)} />

// Replace success state
if (show2FAMessage) {
  return (
    <SuccessState
      title="Check Your Email"
      message="We've sent a magic link to your email address. Please click the link to complete your login."
      description="The link will expire in 5 minutes."
      actionLabel="Back to Login"
      onAction={() => setShow2FAMessage(false)}
    />
  )
}

// Use formSubmit
<form onSubmit={formSubmit} className="w-full max-w-md space-y-6">
```

### Testing
```bash
# Test form submission
pnpm --filter admin dev
# Navigate to /login
# Test: Valid login, invalid credentials, 2FA flow
```

### Estimated Time: 3-4 hours

---

## Task 3: Implement Logger Utility

### 3.1 Create Logger

**File:** `packages/shared/src/utils/logger.ts`

```typescript
type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogMeta {
  [key: string]: any
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  debug(message: string, meta?: LogMeta) {
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, meta || '')
    }
  }

  info(message: string, meta?: LogMeta) {
    if (this.isDevelopment) {
      console.info(`[INFO] ${message}`, meta || '')
    }
  }

  warn(message: string, meta?: LogMeta) {
    if (this.isDevelopment) {
      console.warn(`[WARN] ${message}`, meta || '')
    }
    // TODO: Send to logging service in production
  }

  error(message: string, meta?: LogMeta) {
    if (this.isDevelopment) {
      console.error(`[ERROR] ${message}`, meta || '')
    }
    // TODO: Send to error tracking service (Sentry, etc.) in production
  }
}

export const logger = new Logger()
```

**Update exports:**
```typescript
// packages/shared/src/utils/index.ts
export { logger } from './logger'
```

### 3.2 Replace Console Statements

Find all instances:
```bash
grep -r "console\." apps/admin/src --include="*.tsx" --include="*.ts"
```

Replace pattern:
```typescript
// Before
console.error('Login error:', error)

// After
import { logger } from '@workspace/shared/utils'
logger.error('Login error', { error })
```

### 3.3 Update ESLint (Optional)

Add rule to prevent console usage:
```javascript
// packages/eslint-config/base.js
rules: {
  'no-console': ['warn', { allow: ['warn', 'error'] }],
}
```

### Testing
```bash
# Development mode
pnpm --filter admin dev
# Should see console output

# Build for production
pnpm --filter admin build
# Verify no console statements in bundle
```

### Estimated Time: 1 hour

---

## Task 4: Refactor Translation Buttons

### 4.1 Create useTranslation Hook

**File:** `packages/shared/src/hooks/useTranslation.ts`

```typescript
'use client'

import { useState, useCallback } from 'react'
import { useNotificationStore } from '@workspace/lib/stores'
import type { Api } from '@workspace/lib'

interface UseTranslationOptions {
  api: Api
  onSuccess?: (result: any) => void
}

export function useTranslation({ api, onSuccess }: UseTranslationOptions) {
  const [isTranslating, setIsTranslating] = useState(false)
  const [isTranslated, setIsTranslated] = useState(false)
  const { success, error: showError, warning } = useNotificationStore()

  const translateSingle = useCallback(async (productId: string) => {
    try {
      setIsTranslating(true)

      const result = await api.translation.translateProduct(productId, {
        sourceLang: 'chinese',
        targetLang: 'vietnamese',
        forceRefresh: false,
      })

      setIsTranslated(true)
      success(
        result.cached
          ? 'Product translated successfully (from cache)'
          : 'Product translated successfully',
        'Translation Successful'
      )

      onSuccess?.(result)
      setTimeout(() => setIsTranslated(false), 3000)

    } catch (err: any) {
      showError(
        err.response?.data?.message || err.message || 'Failed to translate product',
        'Translation Failed'
      )
    } finally {
      setIsTranslating(false)
    }
  }, [api, onSuccess, success, showError])

  const translateBatch = useCallback(async (productIds: string[]) => {
    if (!productIds || productIds.length === 0) {
      showError('Please select at least one product to translate', 'No Products Selected')
      return
    }

    try {
      setIsTranslating(true)

      const result = await api.translation.batchTranslate({
        productIds,
        sourceLang: 'chinese',
        targetLang: 'vietnamese',
        forceRefresh: false,
      })

      setIsTranslated(true)

      if (result.failed === 0) {
        success(
          `Successfully translated ${result.successful} products`,
          'Batch Translation Successful'
        )
      } else {
        warning(
          `Translated: ${result.successful}, Failed: ${result.failed}`,
          'Batch Translation Completed with Errors'
        )
      }

      onSuccess?.(result)
      setTimeout(() => setIsTranslated(false), 3000)

    } catch (err: any) {
      showError(
        err.response?.data?.message || err.message || 'Failed to translate products',
        'Batch Translation Failed'
      )
    } finally {
      setIsTranslating(false)
    }
  }, [api, onSuccess, success, showError, warning])

  return {
    isTranslating,
    isTranslated,
    translateSingle,
    translateBatch,
  }
}
```

### 4.2 Create TranslationButton Component

**File:** `packages/shared/src/components/TranslationButton.tsx`

```typescript
'use client'

import { Button } from '@workspace/ui/components/Button'
import { Languages, Loader2, CheckCircle2 } from 'lucide-react'

interface TranslationButtonProps {
  isTranslating: boolean
  isTranslated: boolean
  onTranslate: () => void
  productCount?: number
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export function TranslationButton({
  isTranslating,
  isTranslated,
  onTranslate,
  productCount = 1,
  variant = 'outline',
  size = 'default',
  className,
}: TranslationButtonProps) {
  const isBatch = productCount > 1

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onPress={onTranslate}
      isDisabled={isTranslating}
    >
      {isTranslating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isBatch ? `Translating ${productCount} products...` : 'Translating...'}
        </>
      ) : isTranslated ? (
        <>
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Translated
        </>
      ) : (
        <>
          <Languages className="mr-2 h-4 w-4" />
          {isBatch ? `Translate ${productCount} Products` : 'Translate'}
        </>
      )}
    </Button>
  )
}
```

### 4.3 Refactor TranslateButton

**File:** `apps/admin/src/components/translation/TranslateButton.tsx`

```typescript
'use client'

import { useApi } from '@workspace/shared/providers'
import { useTranslation } from '@workspace/shared/hooks'
import { TranslationButton } from '@workspace/shared/components'
import type { TranslateProductResponse } from '@workspace/lib'

interface TranslateButtonProps {
  productId: string
  onTranslateSuccess?: (result: TranslateProductResponse) => void
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export function TranslateButton({
  productId,
  onTranslateSuccess,
  variant = 'outline',
  size = 'default',
  className,
}: TranslateButtonProps) {
  const api = useApi()
  const { isTranslating, isTranslated, translateSingle } = useTranslation({
    api,
    onSuccess: onTranslateSuccess,
  })

  return (
    <TranslationButton
      isTranslating={isTranslating}
      isTranslated={isTranslated}
      onTranslate={() => translateSingle(productId)}
      variant={variant}
      size={size}
      className={className}
    />
  )
}
```

### 4.4 Refactor BatchTranslateButton

Similar pattern to TranslateButton but call `translateBatch`

### Estimated Time: 2 hours

---

## Task 5: Implement Accessible Dialogs

### 5.1 Install Radix UI Dialog

```bash
cd packages/ui
pnpm add @radix-ui/react-dialog
```

### 5.2 Create Dialog Component

**File:** `packages/ui/src/components/Dialog.tsx`

```typescript
'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 bg-white dark:bg-gray-800 p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg"
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 data-[state=open]:text-gray-500 dark:ring-offset-gray-950 dark:focus:ring-gray-300 dark:data-[state=open]:bg-gray-800 dark:data-[state=open]:text-gray-400">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className="flex flex-col space-y-1.5 text-center sm:text-left" {...props} />
)
DialogHeader.displayName = 'DialogHeader'

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className="text-lg font-semibold leading-none tracking-tight"
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className="text-sm text-gray-500 dark:text-gray-400"
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
}
```

### 5.3 Refactor ApproveDialog

**File:** `apps/admin/src/components/product1688/ApproveDialog.tsx`

```typescript
import { useState } from 'react'
import { useApi } from '@workspace/shared/providers'
import { useProduct1688Approve, Product1688Entity } from '@workspace/lib'
import { Button } from '@workspace/ui/components/Button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@workspace/ui/components/Dialog'
import { Loader2, CheckCircle } from 'lucide-react'

interface ApproveDialogProps {
  product: Product1688Entity
  onSuccess?: () => void
}

export function ApproveDialog({ product, onSuccess }: ApproveDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [sku, setSku] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [supplierId, setSupplierId] = useState('')
  const api = useApi()

  const approveMutation = useProduct1688Approve({
    api,
    onSuccess: () => {
      setIsOpen(false)
      setSku('')
      setCategoryId('')
      setSupplierId('')
      onSuccess?.()
    },
  })

  const handleApprove = () => {
    if (!sku || !categoryId) return

    approveMutation.mutate({
      id: product.id,
      data: {
        sku,
        categoryId,
        supplierId: supplierId || undefined,
      },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          <CheckCircle className="w-4 h-4 mr-2" />
          Duyệt
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-green-600 dark:text-green-400">
            Duyệt sản phẩm
          </DialogTitle>
          <DialogDescription>
            <strong>Sản phẩm:</strong> {product.nameVi || product.nameZh}
            <br />
            <strong>Giá:</strong> {product.priceMinCNY} CNY
            {product.priceMaxCNY && ` - ${product.priceMaxCNY} CNY`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Mã SKU <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={sku}
              onChange={e => setSku(e.target.value)}
              placeholder="VD: SKU-1688-001"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Mã danh mục <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              placeholder="Chọn từ danh mục có sẵn"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Mã nhà cung cấp (Tùy chọn)
            </label>
            <input
              type="text"
              value={supplierId}
              onChange={e => setSupplierId(e.target.value)}
              placeholder="Liên kết nhà cung cấp"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            onClick={handleApprove}
            isDisabled={!sku || !categoryId || approveMutation.isPending}
            className="flex-1"
          >
            {approveMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Duyệt & Nhập
          </Button>
          <Button onClick={() => setIsOpen(false)} variant="outline" className="flex-1">
            Hủy
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

### Repeat for RejectDialog, TranslateDialog, CostCalculatorDialog

### Estimated Time: 4 hours

---

## Task 6: Unify API Client Initialization

### 6.1 Create API Client Factory

**File:** `packages/lib/src/api-client-factory.ts`

```typescript
import { Api, createApiClient } from './api'
import type { AxiosInstance } from 'axios'

export interface ApiClientConfig {
  baseURL: string
  authStrategy: 'cookie' | 'token'
  getAccessToken?: () => string | null
  getRefreshToken?: () => string | null
  onTokenRefresh?: (tokens: { accessToken: string; refreshToken: string }) => void
  onUnauthorized?: () => void
}

let apiInstance: Api | null = null

export function createUnifiedApiClient(config: ApiClientConfig): Api {
  const axiosConfig: Parameters<typeof createApiClient>[0] = {
    baseURL: config.baseURL,
    onUnauthorized: config.onUnauthorized,
  }

  if (config.authStrategy === 'cookie') {
    axiosConfig.useCookies = true
  } else {
    axiosConfig.getAccessToken = config.getAccessToken
    axiosConfig.getRefreshToken = config.getRefreshToken
    axiosConfig.onTokenRefresh = config.onTokenRefresh
  }

  const client = createApiClient(axiosConfig)
  return new Api(client)
}

export function getOrCreateApiClient(config: ApiClientConfig): Api {
  if (!apiInstance) {
    apiInstance = createUnifiedApiClient(config)
  }
  return apiInstance
}

export function resetApiClient(): void {
  apiInstance = null
}
```

### 6.2 Update Admin API Client

**File:** `apps/admin/src/lib/api-client.ts`

```typescript
import { createUnifiedApiClient, resetApiClient as resetUnified } from '@workspace/lib/api-client-factory'
import { useAuthStore } from '@workspace/lib/stores'

let apiInstance: Api | null = null

export function getApiClient(): Api {
  if (!apiInstance) {
    apiInstance = createUnifiedApiClient({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
      authStrategy: 'cookie',
      onUnauthorized: () => {
        console.warn('[API Client] Session expired - logging out user')
        useAuthStore.getState().logout()
        if (typeof window !== 'undefined') {
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login'
          }
        }
      },
    })
  }
  return apiInstance
}

export function resetApiClient(): void {
  apiInstance = null
  resetUnified()
}
```

### 6.3 Update Extension API Client

Similar pattern with `authStrategy: 'token'`

### Estimated Time: 2 hours

---

## Testing Checklist

After each task:

- [ ] Code compiles without errors
- [ ] No TypeScript errors
- [ ] Linting passes
- [ ] Manual testing in browser
- [ ] Check console for errors
- [ ] Verify functionality works as before
- [ ] Test edge cases

---

## Rollback Plan

If issues occur:

1. **Revert specific files:**
```bash
git checkout HEAD -- path/to/file
```

2. **Revert entire task:**
```bash
git revert <commit-hash>
```

3. **Keep branch for reference:**
```bash
git branch refactor-backup
```

---

## Success Criteria

- [ ] All duplicated hooks removed/consolidated
- [ ] All forms use shared utilities
- [ ] Zero console.log in production
- [ ] All dialogs use accessible Dialog component
- [ ] API clients use unified factory
- [ ] All tests pass
- [ ] No regression bugs
- [ ] Code review approved

---

**Questions or Issues?**  
Refer to REFACTORING_REPORT.md for detailed analysis and context.
