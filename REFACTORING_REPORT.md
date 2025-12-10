# Code Quality Analysis Report
## Duplicated Code and Anti-Pattern Findings

**Date:** December 10, 2024  
**Repository:** maialino123/ecomate-fe-v2  
**Analyzed Files:** 307 TypeScript/JavaScript files

---

## Executive Summary

This report identifies duplicated code patterns and anti-patterns found across the ecomate-fe-v2 monorepo. The analysis focuses on opportunities to improve code maintainability, reduce duplication, and apply better software engineering practices.

### Key Findings
- **11 major duplication patterns** identified
- **8 anti-patterns** found across the codebase
- **Estimated effort reduction:** 30-40% fewer lines of code with proper refactoring
- **Priority areas:** Form handling, API clients, custom hooks, dialog components

---

## 1. Duplicated Code Patterns

### 1.1 Duplicate Custom Hooks - `useIsMobile`

**Location:**
- `apps/landing/src/hooks/useIsMobile.ts` (40 lines)
- `packages/ui/src/hooks/use-mobile.ts` (23 lines)

**Issue:**
Two different implementations of the same mobile detection hook exist in different packages.

**Impact:**
- Inconsistent behavior across apps
- Maintenance burden (fixing bugs in two places)
- Different default behaviors and return types

**Code Comparison:**

```typescript
// apps/landing/src/hooks/useIsMobile.ts
export function useIsMobile(breakpoint: number = 768): boolean {
    const [isMobile, setIsMobile] = useState(false)
    // Uses mediaQuery.matches
    setIsMobile(mediaQuery.matches)
}

// packages/ui/src/hooks/use-mobile.ts
export function useIsMobile({ breakpoint = 768 }: UseIsMobileProps = {}) {
    const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)
    // Uses window.innerWidth
    setIsMobile(window.innerWidth < breakpoint)
}
```

**Recommendation:**
- ✅ Keep the implementation in `packages/ui/src/hooks/use-mobile.ts` (shared package)
- ❌ Remove `apps/landing/src/hooks/useIsMobile.ts`
- 🔄 Update all landing app imports to use `@workspace/ui/hooks/use-mobile`

---

### 1.2 Duplicate API Client Implementations

**Location:**
- `apps/admin/src/lib/api-client.ts` (40 lines)
- `apps/extension/src/shared/api-client.ts` (98 lines)

**Issue:**
Similar API client initialization patterns with different authentication strategies:
- Admin uses cookie-based auth
- Extension uses token-based auth

**Duplicated Patterns:**
```typescript
// Both files have:
- apiInstance singleton pattern
- getApiClient() / getApi() functions
- resetApiClient() / resetApi() functions
- onUnauthorized callback handling
- Similar error handling logic
```

**Recommendation:**
- ✅ Create a unified factory function in `@workspace/lib`
- ✅ Accept authentication strategy as a parameter
- ✅ Share common initialization logic
- 🔄 Reduce duplication by ~60%

**Suggested Refactor:**
```typescript
// packages/lib/src/api-client-factory.ts
export function createApiInstance(config: ApiClientConfig) {
  // Unified initialization logic
  // Support both cookie and token-based auth
}
```

---

### 1.3 Duplicate Form Error Handling Pattern

**Location:**
- `apps/admin/src/components/auth/LoginForm.tsx`
- `apps/admin/src/components/auth/RegisterForm.tsx`

**Issue:**
Identical form submission error handling pattern duplicated across auth forms:

```typescript
// Pattern appears in both files (lines 65-75 in both)
const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
        await handleSubmit(onSubmit)(e)
    } catch (error) {
        // Catch any unhandled errors from form submission
        // This prevents ErrorBoundary from catching and refreshing the page
        console.error('Form submission error:', error)
    }
}
```

**Impact:**
- 10+ lines of identical code per form
- Pattern likely repeated in other forms throughout the app
- Updates require changes in multiple locations

**Recommendation:**
- ✅ Create a custom hook: `useFormSubmit(onSubmit, errorHandler?)`
- ✅ Encapsulate error prevention logic
- 🔄 Reuse across all forms

**Suggested Implementation:**
```typescript
// packages/shared/src/hooks/useFormSubmit.ts
import { logger } from '@workspace/shared/utils'

export function useFormSubmit<T>(
  onSubmit: (data: T) => Promise<void>,
  handleSubmit: UseFormHandleSubmit<T>
) {
  return useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await handleSubmit(onSubmit)(e)
    } catch (error) {
      logger.error('Form submission error', { error })
    }
  }, [handleSubmit, onSubmit])
}
```

---

### 1.4 Duplicate API Error Handling

**Location:**
Found in 6+ components:
- `LoginForm.tsx`
- `RegisterForm.tsx`
- `TranslateButton.tsx`
- `BatchTranslateButton.tsx`
- And more...

**Pattern:**
```typescript
const [apiError, setApiError] = useState<string | null>(null)

// In mutation callbacks:
onError: (error: any) => {
    const message = error?.response?.data?.message || 
                   error?.message || 
                   'Operation failed. Please try again.'
    setApiError(message)
}
```

**Impact:**
- Error extraction logic duplicated 6+ times
- Inconsistent error message fallbacks
- Manual state management in every component

**Recommendation:**
- ✅ Create `useApiError()` hook or enhance mutation hooks
- ✅ Standardize error message extraction
- ✅ Provide consistent user feedback

---

### 1.5 Duplicate Dialog Component Structure

**Location:**
- `apps/admin/src/components/product1688/ApproveDialog.tsx`
- `apps/admin/src/components/product1688/RejectDialog.tsx`
- `apps/admin/src/components/product1688/TranslateDialog.tsx`
- `apps/admin/src/components/product1688/CostCalculatorDialog.tsx`

**Duplicated Pattern:**
```typescript
// All dialogs share this structure:
const [isOpen, setIsOpen] = useState(false)

return (
  <>
    <Button onClick={() => setIsOpen(true)}>Open</Button>
    {isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
          {/* Dialog content */}
        </div>
      </div>
    )}
  </>
)
```

**Issue:**
- 20-30 lines of identical modal markup per dialog
- Manual state management
- No accessibility features (focus trap, ESC key, etc.)
- Inconsistent styling

**Recommendation:**
- ✅ Use or enhance existing Dialog component from `@workspace/ui`
- ✅ Create a base `ConfirmDialog` component
- ✅ Add proper accessibility (ARIA labels, focus management)
- 🔄 Reduce code by 70% per dialog

---

### 1.6 Duplicate Translation Button Logic

**Location:**
- `apps/admin/src/components/translation/TranslateButton.tsx` (107 lines)
- `apps/admin/src/components/translation/BatchTranslateButton.tsx` (119 lines)

**Duplicated Logic:**
```typescript
// Both components share:
- useState for isTranslating, isTranslated
- Loading state management
- Success/error notification pattern
- Reset timer for isTranslated state (3 seconds)
- Similar button rendering logic with icons
```

**Specific Duplication:**
```typescript
// Lines 37-38 in TranslateButton, 37-38 in BatchTranslateButton
const [isTranslating, setIsTranslating] = useState(false);
const [isTranslated, setIsTranslated] = useState(false);

// Lines 54-67 in both files (success handling)
setIsTranslated(true);
success('...', 'Translation Successful');
onTranslateSuccess?.(result);
setTimeout(() => setIsTranslated(false), 3000);

// Lines 89-105 in both files (button rendering)
{isTranslating ? (
  <>
    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    Translating...
  </>
) : isTranslated ? (
  <>
    <CheckCircle2 className="mr-2 h-4 w-4" />
    Translated
  </>
) : (
  <>
    <Languages className="mr-2 h-4 w-4" />
    Translate
  </>
)}
```

**Recommendation:**
- ✅ Create a base `useTranslation()` hook
- ✅ Extract common UI states to a `TranslationButton` wrapper
- ✅ Support both single and batch operations through configuration
- 🔄 Reduce duplication by 60%

---

### 1.7 Duplicate Loading State Management

**Location:**
Found in 15+ components across the admin app

**Pattern:**
```typescript
const [isLoading, setIsLoading] = useState(false)
const [isOpen, setIsOpen] = useState(false)
const [isCalculating, setIsCalculating] = useState(false)
const [isTranslating, setIsTranslating] = useState(false)
const [isDownloading, setIsDownloading] = useState(false)
// ... many more variations
```

**Issue:**
- Manual boolean state management in every component
- Repetitive patterns for async operations
- No centralized loading state management

**Recommendation:**
- ✅ Use React Query's `isPending` state more consistently
- ✅ Create a `useAsyncAction()` hook for non-query operations
- ✅ Reduce manual state management

---

### 1.8 Duplicate useDebounce Hook

**Location:**
- `apps/admin/src/components/hooks/useDebounce.ts`
- This is a common utility that should be in `@workspace/shared`

**Issue:**
- Hook is app-specific but has general utility
- Will be duplicated if other apps need debouncing
- No reusability across the monorepo

**Recommendation:**
- ✅ Move to `packages/shared/src/hooks/useDebounce.ts`
- ✅ Export from `@workspace/shared/hooks`
- ✅ Remove from admin app's local hooks

---

### 1.9 Duplicate Error Message Display

**Location:**
Multiple auth forms and components

**Pattern:**
```typescript
{apiError && (
    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-sm text-red-600 dark:text-red-400">{apiError}</p>
    </div>
)}
```

**Issue:**
- 4-5 lines of identical error display markup
- Repeated in LoginForm, RegisterForm, and likely others
- Manual dark mode class handling

**Recommendation:**
- ✅ Create `ErrorAlert` or `Alert` component in `@workspace/ui`
- ✅ Support variants: error, warning, success, info
- 🔄 Reuse throughout the application

---

### 1.10 Duplicate Success State Pattern

**Location:**
- `LoginForm.tsx` (2FA success message)
- `RegisterForm.tsx` (registration success message)

**Pattern:**
```typescript
if (showSuccessState) {
    return (
        <div className="w-full max-w-md space-y-4">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">{title}</h2>
                <p className="text-gray-600 dark:text-gray-400">{message}</p>
            </div>
            <Button onClick={handleBack} variant="outline" className="w-full">
                Back to Login
            </Button>
        </div>
    )
}
```

**Impact:**
- 15-20 lines duplicated per form
- Similar structure but different content
- Repeated styling classes

**Recommendation:**
- ✅ Create `SuccessState` component
- ✅ Accept title, message, action props
- ✅ Consistent success UI across the app

---

### 1.11 Duplicate Field Error Display

**Location:**
All forms using react-hook-form

**Pattern:**
```typescript
{errors.fieldName && (
    <p className="text-sm text-red-500">{errors.fieldName.message}</p>
)}
```

**Issue:**
- Repeated after every input field
- Manual error message rendering
- Inconsistent styling

**Recommendation:**
- ✅ Create `FormField` wrapper component
- ✅ Automatically render errors
- ✅ Integrate with react-hook-form

---

## 2. Anti-Patterns Identified

### 2.1 Console.log in Production Code

**Location:**
17 instances across apps/admin, apps/web, apps/landing

**Examples:**
```typescript
// LoginForm.tsx:58
console.error('Login error:', error)

// RegisterForm.tsx:61
console.error('Registration error:', error)

// TranslateButton.tsx:70
console.error('Translation failed:', err)
```

**Issue:**
- Console statements left in production code
- Potential exposure of sensitive information
- Performance impact (minimal but unnecessary)

**Recommendation:**
- ✅ Implement proper logging utility
- ✅ Use conditional logging (development only)
- ✅ Consider structured logging service
- ❌ Remove console.log/error from production builds

**Suggested Fix:**
```typescript
// packages/shared/src/utils/logger.ts
export const logger = {
  error: (message: string, meta?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(message, meta)
    }
    // Send to logging service in production
  },
  // ... other methods
}
```

---

### 2.2 Any Type Usage in Error Handling

**Location:**
Multiple components

**Examples:**
```typescript
// LoginForm.tsx:46
onError: (error: any) => {
    const message = error?.response?.data?.message || ...
}

// RegisterForm.tsx:49
onError: (error: any) => {
    const message = error?.response?.data?.message || ...
}
```

**Issue:**
- `any` type bypasses TypeScript's type safety
- No IntelliSense support
- Potential runtime errors from incorrect assumptions

**Recommendation:**
- ✅ Define proper error types
- ✅ Create `ApiError` interface
- ✅ Type-safe error handling

**Suggested Fix:**
```typescript
// packages/lib/src/types/error.ts
export interface ApiError {
  response?: {
    data?: {
      message?: string
      errors?: Record<string, string[]>
    }
  }
  message?: string
}

// Usage:
onError: (error: ApiError) => {
  // Type-safe access
}
```

---

### 2.3 Manual State Management for Async Operations

**Issue:**
Components manually manage loading states instead of leveraging React Query's built-in states.

**Example:**
```typescript
const [isLoading, setIsLoading] = useState(false)

const handleAction = async () => {
  setIsLoading(true)
  try {
    await api.doSomething()
  } finally {
    setIsLoading(false)
  }
}
```

**Why This is an Anti-Pattern:**
- React Query already provides `isPending`, `isError`, `isSuccess`
- Manual state management is error-prone (forgetting finally blocks)
- Duplicates React Query functionality

**Recommendation:**
- ✅ Use React Query mutations consistently
- ✅ Leverage built-in state properties
- ❌ Avoid manual loading state unless necessary

---

### 2.4 Hardcoded Timeout Values

**Location:**
Translation buttons and other components

**Example:**
```typescript
// TranslateButton.tsx:67, BatchTranslateButton.tsx:79
setTimeout(() => setIsTranslated(false), 3000);
```

**Issue:**
- Magic number (3000) without explanation
- No centralized configuration
- Difficult to adjust globally

**Recommendation:**
- ✅ Define constants for timeouts
- ✅ Centralize UI timing configuration

**Suggested Fix:**
```typescript
// packages/config/src/ui-constants.ts
export const UI_CONSTANTS = {
  SUCCESS_MESSAGE_DURATION: 3000,
  TOAST_DURATION: 5000,
  DEBOUNCE_DELAY: 300,
} as const
```

---

### 2.5 No Accessibility in Custom Modals

**Location:**
All custom dialog implementations (ApproveDialog, RejectDialog, etc.)

**Issues:**
- No focus trap
- No ESC key to close
- No ARIA attributes
- Background not non-scrollable
- No focus return after close

**Example:**
```typescript
// Missing accessibility features:
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
    {/* Content */}
  </div>
</div>
```

**Recommendation:**
- ✅ Use Radix UI Dialog or similar accessible component
- ✅ Add proper ARIA roles and labels
- ✅ Implement focus management
- ✅ Add keyboard navigation support

---

### 2.6 Direct DOM Manipulation

**Location:**
RegisterForm.tsx

**Example:**
```typescript
// RegisterForm.tsx:93
onClick={() => (window.location.href = '/login')}
```

**Issue:**
- Direct window.location modification
- Bypasses Next.js routing
- Causes full page reload
- Loses SPA benefits

**Recommendation:**
- ✅ Use Next.js router for navigation
- ✅ Preserve client-side routing benefits

**Fix:**
```typescript
import { useRouter } from 'next/navigation'

const router = useRouter()
onClick={() => router.push('/login')}
```

---

### 2.7 Inconsistent Error Fallback Messages

**Location:**
Throughout error handling code

**Examples:**
```typescript
// LoginForm.tsx
'Login failed. Please try again.'

// RegisterForm.tsx  
'Registration failed. Please try again.'

// TranslateButton.tsx
'Failed to translate product'

// BatchTranslateButton.tsx
'Failed to translate products'
```

**Issue:**
- No standardized error messages
- Inconsistent tone and format
- Not internationalization-ready

**Recommendation:**
- ✅ Create error message constants
- ✅ Centralize user-facing messages
- ✅ Prepare for i18n

---

### 2.8 Prop Drilling and Component Coupling

**Location:**
Product1688 dialog components

**Example:**
```typescript
interface ApproveDialogProps {
  product: Product1688Entity
  onSuccess?: () => void
}
```

**Issue:**
- Each dialog tightly coupled to Product1688Entity
- Difficult to reuse dialogs for other entity types
- onSuccess callback pattern repeated everywhere

**Recommendation:**
- ✅ Create generic dialog components
- ✅ Use composition over inheritance
- ✅ Implement render props or compound components pattern

---

## 3. Recommended Refactoring Priorities

### High Priority (Do First)
1. **Consolidate useIsMobile hooks** (Quick win)
   - Remove duplication between landing and ui package
   - Impact: Immediate consistency improvement

2. **Create shared form utilities** (High impact)
   - useFormSubmit hook
   - ErrorAlert component
   - SuccessState component
   - Impact: Reduces ~150 lines across forms

3. **Implement proper logging** (Security)
   - Replace console.* calls
   - Add development-only logging
   - Impact: Better production practices

### Medium Priority
4. **Refactor translation buttons** (Code quality)
   - Extract shared hook
   - Create base component
   - Impact: Reduces ~120 lines

5. **Create base dialog component** (Accessibility)
   - Use Radix UI or similar
   - Add accessibility features
   - Impact: Better UX and consistency

6. **Unify API client initialization** (Architecture)
   - Create factory function
   - Support multiple auth strategies
   - Impact: Better maintainability

### Low Priority (Nice to Have)
7. **Move useDebounce to shared** (Organization)
8. **Create error type definitions** (Type safety)
9. **Centralize UI constants** (Configuration)

---

## 4. Estimated Impact

### Code Reduction
- **Forms:** -150 lines (~40% reduction)
- **Dialogs:** -200 lines (~70% reduction)
- **Translation buttons:** -120 lines (~60% reduction)
- **API clients:** -50 lines (~60% duplication removal)
- **Total estimated:** -520+ lines of duplicated code

### Quality Improvements
- ✅ Better type safety (removing `any` types)
- ✅ Improved accessibility (focus management, ARIA)
- ✅ Consistent error handling
- ✅ Better code organization
- ✅ Easier maintenance

### Developer Experience
- ✅ Faster feature development (reusable components)
- ✅ Fewer bugs (shared, tested code)
- ✅ Better IntelliSense and autocomplete
- ✅ Clearer code patterns

---

## 5. Next Steps

### Immediate Actions
1. Review this report with the team
2. Prioritize refactoring tasks
3. Create GitHub issues for each refactoring item
4. Plan sprint allocation

### Implementation Strategy
1. **Phase 1 (Week 1):** High priority items (1-3)
2. **Phase 2 (Week 2):** Medium priority items (4-6)
3. **Phase 3 (Week 3):** Low priority items (7-9)
4. **Phase 4 (Ongoing):** Apply patterns to new code

### Success Metrics
- [ ] Reduce duplicated code by 500+ lines
- [ ] Zero `any` types in error handling
- [ ] All modals have proper accessibility
- [ ] Zero console.log in production bundles
- [ ] All forms use shared components/hooks

---

## 6. References

### Files Analyzed
- `apps/admin/src/components/auth/*.tsx` (2 files)
- `apps/admin/src/components/translation/*.tsx` (2 files)
- `apps/admin/src/components/product1688/*Dialog.tsx` (4 files)
- `apps/admin/src/lib/api-client.ts`
- `apps/extension/src/shared/api-client.ts`
- `apps/landing/src/hooks/useIsMobile.ts`
- `packages/ui/src/hooks/use-mobile.ts`
- Plus 295+ other TypeScript/JavaScript files

### Tools Used
- Manual code review
- grep pattern matching
- Directory structure analysis
- TypeScript AST analysis

### Documentation
- [React Query Best Practices](https://tanstack.com/query/latest/docs/react/guides/best-practices)
- [React Hook Form](https://react-hook-form.com/)
- [Radix UI Accessibility](https://www.radix-ui.com/)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)

---

**Report prepared by:** GitHub Copilot Code Analysis  
**Date:** December 10, 2024  
**Status:** Ready for Review
