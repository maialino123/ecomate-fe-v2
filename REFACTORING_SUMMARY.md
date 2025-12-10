# Quick Refactoring Summary

## 🎯 Top 5 Priorities

### 1. Consolidate useIsMobile Hooks ⚡ QUICK WIN
**Files:**
- Remove: `apps/landing/src/hooks/useIsMobile.ts`
- Keep: `packages/ui/src/hooks/use-mobile.ts`
- Update: All imports in landing app

**Effort:** 30 minutes  
**Impact:** Eliminates inconsistent behavior

---

### 2. Create Shared Form Utilities 🔥 HIGH IMPACT
**Create:**
```
packages/shared/src/hooks/useFormSubmit.ts
packages/shared/src/components/ErrorAlert.tsx
packages/shared/src/components/SuccessState.tsx
packages/shared/src/components/FormField.tsx
```

**Refactor:**
- `LoginForm.tsx`
- `RegisterForm.tsx`
- All future forms

**Effort:** 3-4 hours  
**Impact:** -150 lines, consistent UX

---

### 3. Fix Console.log Anti-pattern 🔒 SECURITY
**Create:**
```typescript
// packages/shared/src/utils/logger.ts
export const logger = {
  error: (msg: string, meta?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(msg, meta)
    }
  }
}
```

**Replace:** 17 instances of console.error/log

**Effort:** 1 hour  
**Impact:** Production-ready logging

---

### 4. Refactor Translation Buttons 📦 CODE QUALITY
**Create:**
```
packages/shared/src/hooks/useTranslation.ts
packages/shared/src/components/TranslationButton.tsx
```

**Consolidate:**
- `TranslateButton.tsx`
- `BatchTranslateButton.tsx`

**Effort:** 2 hours  
**Impact:** -120 lines, single source of truth

---

### 5. Add Accessible Dialog Component ♿ ACCESSIBILITY
**Use:** Radix UI Dialog or Headless UI

**Refactor:**
- `ApproveDialog.tsx`
- `RejectDialog.tsx`
- `TranslateDialog.tsx`
- `CostCalculatorDialog.tsx`

**Effort:** 4 hours  
**Impact:** -200 lines, proper accessibility

---

## 📊 Quick Stats

| Metric | Current | After Refactor | Improvement |
|--------|---------|----------------|-------------|
| Duplicated Lines | ~650 | ~130 | -80% |
| Custom Hooks | Duplicated | Shared | Consistent |
| Console.logs | 17 | 0 | Production-ready |
| Accessible Dialogs | 0/4 | 4/4 | WCAG compliant |
| Type Safety | Mixed | Strong | Better DX |

---

## 🗺️ File Changes Map

### Delete ❌
```
apps/landing/src/hooks/useIsMobile.ts
```

### Create ✅
```
packages/shared/src/hooks/
  ├── useFormSubmit.ts
  ├── useTranslation.ts
  └── useDebounce.ts (move from admin)

packages/shared/src/components/
  ├── ErrorAlert.tsx
  ├── SuccessState.tsx
  └── FormField.tsx

packages/shared/src/utils/
  ├── logger.ts
  └── error-types.ts

packages/ui/src/components/
  └── Dialog.tsx (or use Radix)
```

### Refactor 🔄
```
apps/admin/src/components/auth/
  ├── LoginForm.tsx (use shared utilities)
  └── RegisterForm.tsx (use shared utilities)

apps/admin/src/components/translation/
  ├── TranslateButton.tsx (consolidate)
  └── BatchTranslateButton.tsx (consolidate)

apps/admin/src/components/product1688/
  ├── ApproveDialog.tsx (use shared Dialog)
  ├── RejectDialog.tsx (use shared Dialog)
  ├── TranslateDialog.tsx (use shared Dialog)
  └── CostCalculatorDialog.tsx (use shared Dialog)

apps/admin/src/lib/api-client.ts (unified factory)
apps/extension/src/shared/api-client.ts (unified factory)
```

---

## 🔢 Duplication Metrics

### Critical (Fix First)
- ✅ **useIsMobile**: 2 implementations
- ✅ **Form error handling**: 6 instances
- ✅ **Dialog structure**: 4 instances
- ✅ **Translation logic**: 2 implementations

### Important (Fix Soon)
- ⚠️ **API clients**: 2 implementations
- ⚠️ **Error display**: 6+ instances
- ⚠️ **Success states**: 2 instances
- ⚠️ **Loading states**: 15+ instances

### Nice to Have (Future)
- 💡 **Error types**: Use `any` → typed
- 💡 **Constants**: Hardcoded → centralized
- 💡 **Timeouts**: Magic numbers → constants

---

## 🚀 Implementation Plan

### Week 1: Foundation (8 hours)
- [ ] Day 1-2: Create shared utilities (hooks, components)
- [ ] Day 3: Implement logger utility
- [ ] Day 4: Fix console.log instances
- [ ] Day 5: Documentation and tests

### Week 2: Components (10 hours)
- [ ] Day 1-2: Refactor auth forms
- [ ] Day 3: Consolidate translation buttons
- [ ] Day 4-5: Implement accessible dialogs

### Week 3: Architecture (6 hours)
- [ ] Day 1-2: Unify API clients
- [ ] Day 3: Create error types
- [ ] Day 4: Final cleanup and documentation

**Total Effort:** 24 hours (3 weeks)  
**ROI:** 500+ fewer lines, better code quality

---

## 💡 Patterns to Follow Going Forward

### ✅ DO
- Use shared hooks from `@workspace/shared`
- Leverage React Query's built-in states
- Use proper TypeScript types (no `any`)
- Implement accessible components
- Use Next.js router for navigation
- Centralize constants and configuration

### ❌ DON'T
- Create local hooks that should be shared
- Manually manage loading states
- Use `any` type in error handling
- Create custom modals without accessibility
- Use `window.location.href` for navigation
- Hardcode timeout values or magic numbers

---

## 📝 Code Review Checklist

Before merging new code, ensure:
- [ ] No duplicated hooks (check `@workspace/shared` first)
- [ ] No `console.log` or `console.error`
- [ ] Proper TypeScript types (no `any`)
- [ ] Using shared components from `@workspace/ui`
- [ ] React Query for data fetching/mutations
- [ ] Accessible components (ARIA, keyboard nav)
- [ ] Next.js router for navigation
- [ ] Constants for magic numbers

---

**Next Action:** Review REFACTORING_REPORT.md for detailed analysis
