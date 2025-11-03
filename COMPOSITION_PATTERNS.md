# Composition Pattern Guidelines / Hướng Dẫn Composition Pattern

> **English** | [Tiếng Việt](#tiếng-việt)

## Introduction

This document establishes the composition pattern standards for the Ecomate frontend codebase, based on modern React best practices and the principle **"Composition is all you need"**.

### Why Composition?

Traditional prop-based configuration leads to:
- ❌ Boolean explosion (too many boolean props)
- ❌ Complex conditional logic
- ❌ Difficult to maintain and extend
- ❌ Poor TypeScript inference

Composition pattern provides:
- ✅ Flexibility and reusability
- ✅ Clear component structure
- ✅ Better TypeScript support
- ✅ Easier testing and maintenance

---

## Anti-Patterns to Avoid

### 1. Boolean Explosion

**❌ Bad - Multiple boolean props:**

```tsx
interface UserFormProps {
  isUpdateUser?: boolean
  hideWelcomeMessage?: boolean
  onlyEditName?: boolean
  showAvatar?: boolean
  isEditingMessage?: boolean
}

function UserForm({ isUpdateUser, hideWelcomeMessage, onlyEditName }: UserFormProps) {
  if (isUpdateUser && onlyEditName) {
    // Complex nested conditions
  }
}
```

**✅ Good - Variant pattern:**

```tsx
type UserFormVariant = 'create' | 'update' | 'edit-name'

interface UserFormProps {
  variant: UserFormVariant
}

function UserForm({ variant }: UserFormProps) {
  const config = formConfigs[variant]
  // Simple, clear logic
}
```

### 2. Conditional className with Ternary

**❌ Bad:**

```tsx
<div className={isImageRight ? 'md:order-1' : 'md:order-2'}>
```

**✅ Good - Object mapping:**

```tsx
const orderClasses = {
  left: 'md:order-2',
  right: 'md:order-1',
}

<div className={orderClasses[imagePosition]}>
```

### 3. Boolean Component Selection

**❌ Bad:**

```tsx
const Component = animate ? motion.div : 'div'
return <Component {...props} />
```

**✅ Good - Separate components:**

```tsx
// Explicitly choose component
{animate ? (
  <AnimatedWrapper {...props} />
) : (
  <StaticWrapper {...props} />
)}
```

---

## Recommended Patterns

### 1. Compound Components Pattern

Use when you have a component with multiple related parts that share state.

**Example: HoverBorderButton**

```tsx
// ✅ Composition API (New)
<HoverBorderButton borderColor="rgba(16, 185, 129, 0.8)" glowIntensity={0.7}>
  <HoverBorderButton.Button onClick={handleClick} className="px-8 py-4">
    Click me
  </HoverBorderButton.Button>
</HoverBorderButton>

// Link variant
<HoverBorderButton>
  <HoverBorderButton.Link href="/page" target="_blank">
    Visit page
  </HoverBorderButton.Link>
</HoverBorderButton>
```

**Implementation Pattern:**

```tsx
// 1. Create context for shared state
const [Provider, useContext] = createSafeContext<ContextValue>('ComponentName')

// 2. Root component (Provider)
function Component({ children, ...config }: Props) {
  const [state, setState] = useState()
  return (
    <Provider value={{ state, setState, ...config }}>
      {children}
    </Provider>
  )
}

// 3. Sub-components
function ComponentButton({ children, ...props }: ButtonProps) {
  const { state } = useContext()
  return <button {...props}>{children}</button>
}

// 4. Compose
export const Component = Object.assign(Root, {
  Button: ComponentButton,
  Link: ComponentLink,
})
```

### 2. Provider Pattern for State Management

Use when components need to share state but aren't visually nested.

**Example: Forward Message Modal**

```tsx
// Provider wraps both modal and external buttons
<Composer.Provider initialValue={message}>
  <Modal>
    <Composer.Input />
    <Composer.Footer />
  </Modal>

  {/* External buttons can access composer state */}
  <ForwardButton /> {/* Uses useComposer() hook */}
  <CancelButton />
</Composer.Provider>
```

### 3. Variant Pattern

Use for components with distinct visual or behavioral variations.

```tsx
const buttonVariants = createVariantMapper({
  variant: {
    primary: 'bg-blue-500 text-white',
    secondary: 'bg-gray-500 text-white',
    ghost: 'bg-transparent text-gray-900',
  },
  size: {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  },
})

function Button({ variant = 'primary', size = 'md', ...props }) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
    </button>
  )
}
```

---

## Migration Guide

### From Old API to Composition API

**Before (Deprecated):**

```tsx
<HoverBorderButton
  as="button"
  onClick={handleClick}
  borderColor="rgba(16, 185, 129, 0.8)"
  glowIntensity={0.7}
  className="px-8 py-4"
>
  Click me
</HoverBorderButton>
```

**After (Recommended):**

```tsx
<HoverBorderButton borderColor="rgba(16, 185, 129, 0.8)" glowIntensity={0.7}>
  <HoverBorderButton.Button onClick={handleClick} className="px-8 py-4">
    Click me
  </HoverBorderButton.Button>
</HoverBorderButton>
```

### Migration Steps

1. **Identify** components with >2 boolean props
2. **Analyze** use cases and group them into variants
3. **Design** compound component structure
4. **Implement** using composition utilities (`createSafeContext`, `createCompoundComponent`)
5. **Test** with >80% coverage
6. **Migrate** existing usages gradually
7. **Deprecate** old API with warnings

---

## TypeScript Utilities

Located in `@workspace/lib/types/composition`:

```tsx
import type {
  CompoundComponentProps,
  VariantProps,
  PolymorphicComponentProps,
  ComponentWithProviderProps,
} from '@workspace/lib'

// Compound component props
type AccordionProps = CompoundComponentProps<{
  defaultOpen?: boolean
}>

// Variant props
const variants = {
  size: ['sm', 'md', 'lg'] as const,
}
type SizeProps = VariantProps<typeof variants>

// Polymorphic component (renders as different elements)
type ButtonProps = PolymorphicComponentProps<'button', {
  variant?: 'primary' | 'secondary'
}>
```

---

## ESLint Rules

### Enabled Rules

```js
// .eslintrc or eslint.config.js
rules: {
  'composition-patterns/no-excessive-boolean-props': ['warn', { max: 2 }],
  'composition-patterns/prefer-object-mapping': 'off',
  'composition-patterns/no-boolean-component-selection': 'off',
}
```

### Rule: `no-excessive-boolean-props`

Warns when a component interface has more than 2 boolean props (excluding standard HTML boolean props like `disabled`, `required`, `readOnly`).

**Triggers warning:**

```tsx
interface BadProps {
  isLoading?: boolean
  isError?: boolean
  showHeader?: boolean  // 3rd boolean - triggers warning!
}
```

**Suggested fix:** Use variants or compound components.

---

## Testing Composition Components

```tsx
import { render, screen, userEvent } from '@/test/utils'
import { Component } from './Component'

describe('Component', () => {
  it('should compose with subcomponents', () => {
    render(
      <Component>
        <Component.Item>Item 1</Component.Item>
        <Component.Item>Item 2</Component.Item>
      </Component>
    )

    expect(screen.getByText('Item 1')).toBeInTheDocument()
  })

  it('should share context between subcomponents', async () => {
    const user = userEvent.setup()
    render(
      <Component>
        <Component.Trigger>Open</Component.Trigger>
        <Component.Content>Content</Component.Content>
      </Component>
    )

    await user.click(screen.getByText('Open'))
    expect(screen.getByText('Content')).toBeVisible()
  })
})
```

---

## Resources

- [Radix UI](https://www.radix-ui.com/) - Composition pattern examples
- [React Aria Components](https://react-spectrum.adobe.com/react-aria/components.html) - Headless component patterns
- [HoverBorderButton Implementation](./packages/ui/src/components/ui/hover-border-button/README.md) - Reference implementation

---

---

# Tiếng Việt

## Giới thiệu

Tài liệu này thiết lập các tiêu chuẩn về composition pattern cho codebase frontend Ecomate, dựa trên các best practice hiện đại của React và nguyên tắc **"Composition is all you need"** (Composition là tất cả những gì bạn cần).

### Tại sao Composition?

Cách tiếp cận truyền thống dựa trên props dẫn đến:
- ❌ Boolean explosion (quá nhiều boolean props)
- ❌ Logic điều kiện phức tạp
- ❌ Khó bảo trì và mở rộng
- ❌ TypeScript inference kém

Composition pattern mang lại:
- ✅ Tính linh hoạt và tái sử dụng
- ✅ Cấu trúc component rõ ràng
- ✅ Hỗ trợ TypeScript tốt hơn
- ✅ Dễ test và bảo trì hơn

---

## Anti-Patterns Cần Tránh

### 1. Boolean Explosion

**❌ Tệ - Nhiều boolean props:**

```tsx
interface UserFormProps {
  isUpdateUser?: boolean
  hideWelcomeMessage?: boolean
  onlyEditName?: boolean
  showAvatar?: boolean
  isEditingMessage?: boolean
}
```

**✅ Tốt - Variant pattern:**

```tsx
type UserFormVariant = 'create' | 'update' | 'edit-name'

interface UserFormProps {
  variant: UserFormVariant
}
```

### 2. Conditional className với Ternary

**❌ Tệ:**

```tsx
<div className={isImageRight ? 'md:order-1' : 'md:order-2'}>
```

**✅ Tốt - Object mapping:**

```tsx
const orderClasses = {
  left: 'md:order-2',
  right: 'md:order-1',
}

<div className={orderClasses[imagePosition]}>
```

---

## Patterns Được Khuyến Nghị

### 1. Compound Components Pattern

Sử dụng khi bạn có component với nhiều phần liên quan chia sẻ state.

**Ví dụ: HoverBorderButton**

```tsx
// ✅ API Composition (Mới)
<HoverBorderButton borderColor="rgba(16, 185, 129, 0.8)" glowIntensity={0.7}>
  <HoverBorderButton.Button onClick={handleClick} className="px-8 py-4">
    Nhấn vào đây
  </HoverBorderButton.Button>
</HoverBorderButton>

// Biến thể Link
<HoverBorderButton>
  <HoverBorderButton.Link href="/page" target="_blank">
    Truy cập trang
  </HoverBorderButton.Link>
</HoverBorderButton>
```

### 2. Provider Pattern cho Quản Lý State

Sử dụng khi các component cần chia sẻ state nhưng không lồng nhau về mặt giao diện.

```tsx
// Provider bao bọc cả modal và các nút bên ngoài
<Composer.Provider initialValue={message}>
  <Modal>
    <Composer.Input />
    <Composer.Footer />
  </Modal>

  {/* Các nút bên ngoài có thể truy cập composer state */}
  <ForwardButton /> {/* Sử dụng hook useComposer() */}
  <CancelButton />
</Composer.Provider>
```

---

## Hướng Dẫn Migration

### Từ API Cũ sang Composition API

**Trước (Deprecated):**

```tsx
<HoverBorderButton
  as="button"
  onClick={handleClick}
  borderColor="rgba(16, 185, 129, 0.8)"
  className="px-8 py-4"
>
  Nhấn vào
</HoverBorderButton>
```

**Sau (Được khuyến nghị):**

```tsx
<HoverBorderButton borderColor="rgba(16, 185, 129, 0.8)">
  <HoverBorderButton.Button onClick={handleClick} className="px-8 py-4">
    Nhấn vào
  </HoverBorderButton.Button>
</HoverBorderButton>
```

### Các Bước Migration

1. **Xác định** các component có >2 boolean props
2. **Phân tích** các use case và nhóm chúng thành variants
3. **Thiết kế** cấu trúc compound component
4. **Triển khai** sử dụng composition utilities
5. **Test** với coverage >80%
6. **Migration** các usage hiện tại từ từ
7. **Deprecate** API cũ với warnings

---

## TypeScript Utilities

Nằm trong `@workspace/lib/types/composition`:

```tsx
import type {
  CompoundComponentProps,
  VariantProps,
  PolymorphicComponentProps,
} from '@workspace/lib'

// Compound component props
type AccordionProps = CompoundComponentProps<{
  defaultOpen?: boolean
}>

// Variant props
const variants = {
  size: ['sm', 'md', 'lg'] as const,
}
type SizeProps = VariantProps<typeof variants>
```

---

## ESLint Rules

### Rules Được Bật

```js
rules: {
  'composition-patterns/no-excessive-boolean-props': ['warn', { max: 2 }],
}
```

### Rule: `no-excessive-boolean-props`

Cảnh báo khi một component interface có nhiều hơn 2 boolean props (không bao gồm các HTML boolean props tiêu chuẩn như `disabled`, `required`, `readOnly`).

---

## Testing Composition Components

```tsx
import { render, screen, userEvent } from '@/test/utils'

describe('Component', () => {
  it('nên compose với các subcomponents', () => {
    render(
      <Component>
        <Component.Item>Item 1</Component.Item>
        <Component.Item>Item 2</Component.Item>
      </Component>
    )

    expect(screen.getByText('Item 1')).toBeInTheDocument()
  })
})
```

---

## Tài Liệu Tham Khảo

- [Radix UI](https://www.radix-ui.com/) - Ví dụ về composition pattern
- [React Aria Components](https://react-spectrum.adobe.com/react-aria/components.html) - Headless component patterns
- [HoverBorderButton Implementation](./packages/ui/src/components/ui/hover-border-button/) - Tham khảo implementation
