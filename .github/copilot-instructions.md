# Copilot Instructions

## Project Configuration

* **Framework**: Next.js 15+ with App Router
* **Language**: TypeScript (strict mode)
* **Styling**: Tailwind CSS with shadcn/ui
* **State Management**: Zustand for client-side state
* **Data Fetching**: TanStack Query (React Query)
* **UI Components**: shadcn/ui primitives
* **React Version**: 19 (with inherent compiler optimizations)

---

## Recommended Folder Structure

```
app/
├── (auth)/          # Authentication routes (login, register, forgot-password)
├── (protected)/     # Protected routes requiring authentication
├── dashboard/       # Example module-specific pages
├── settings/        # Example module-specific pages
└── layout.tsx       # App-wide layouts, metadata, and routing logic

modules/
├── academic/        # Academic module: grades, attendance, assignments
├── admission/       # Admission module: applications, interviews
├── finance/         # Finance module: fees, donations, budgeting
├── hostel/          # Hostel module: rooms, attendance, meals
├── library/         # Library module: book catalog, circulation
└── communication/   # Messaging, announcements, notifications

components/
├── ui/              # shadcn/ui primitives (auto-generated)
├── custom/          # Custom reusable components built from primitives
└── layout/          # Shared layout components (headers, sidebars, footers)

styles/
├── globals.css      # Tailwind base + global styles
├── components/      # Component-specific overrides
└── utilities.css    # Helper classes if needed

lib/
├── apiClient/       # Defines the API client instance (baseURL, headers, interceptors)
└── services/        # Uses apiClient to define endpoints for modules

store/
└── zustand/         # Zustand state management stores

hooks/
├── useAuth.ts       # Auth hook
├── useZustandStores.ts
└── usePermissions.ts

public/
├── images/
├── icons/
└── static/
```

**Key Notes on Folder Strategy:**

* `modules/` contain **business logic** (state, hooks, API calls).
* `app/` only contains **routing, layouts, and optional SSR data fetching**.
* `components/ui/` only contains **direct shadcn primitives**.
* `components/custom/` contains **enhanced components built from shadcn primitives** for reusability.
* Protected routes `(protected)` ensure **authentication gating**, while `(auth)` is for public auth pages.
* `lib/apiClient/` only defines the **API client instance** (Axios or fetch wrapper).
* `lib/services/` defines **service functions for endpoints**, using `apiClient`.
* `store/zustand/` holds all **Zustand stores** for client-side state.

---

## Code Standards

### TypeScript

* Use strict TS configuration (`strict: true`)
* Always define interfaces for objects, props, and store state
* Prefer `interface` over `type` for object shapes
* Explicitly type return values for all functions
* Enable strict null checks

---

### Component Architecture

* **Default Behavior**: Use shadcn/ui primitives directly
* **Custom Components**: Use only if reusability or composition is needed; place in `components/custom/`
* **Styling**: Follow shadcn primitives for all styling; avoid arbitrary class overrides
* **React 19 Considerations**: Leverage automatic compiler optimizations, avoid unnecessary memoization unless profiling shows a benefit

---

### State Management (Zustand)

* Keep **stores small and focused**
* Use TypeScript interfaces for store states
* Implement immutable state updates
* Use selectors for component subscriptions

```typescript
interface UserStore {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
}
```

---

### API Operations (TanStack Query)

* `lib/apiClient/` defines the API client (baseURL, headers, interceptors)
* `lib/services/` defines service functions using the apiClient for endpoints
* Components import service functions and use React Query hooks for fetching/mutations
* Use consistent query keys and hierarchical structure
* Implement optimistic updates where appropriate
* Handle errors and retries properly
* Use query invalidation for dependent data updates

```typescript
// lib/apiClient/apiClient.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// lib/services/userService.ts
import { apiClient } from '../apiClient/apiClient';

export const getUser = async (id: string) => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};
```

---

### Custom Components Guidelines

* Extend **shadcn primitives**, don’t replace them
* Prefer **composition over inheritance**
* Include proper TypeScript props and accessibility attributes
* Use `forwardRef` when needed for primitive integration

```typescript
interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(buttonVariants({ variant, size }))}
        disabled={isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Button>
    );
  }
);
```

---

### Next.js 15 Patterns

* App Router conventions for `app/`
* Use **Server Components** by default, Client Components only when needed
* Implement `loading.tsx` and `error.tsx` per folder for UX consistency
* Fetch data **server-side if possible**; otherwise client-side with React Query
* Keep routing and SSR logic in `app/`, leave **business logic to `modules/`**

---

### Error Handling

* Implement error boundaries at module or page level
* Use try-catch for async operations
* Provide meaningful user messages and log for debugging

---

### Performance & React 19

* Compiler optimizations handle most re-renders automatically
* Use proper `key` props in lists
* Optimize images with `next/image`
* Implement lazy loading via `dynamic` imports
* Avoid unnecessary `React.memo`, `useMemo`, `useCallback` unless profiling shows a benefit

---

### Style Guidelines

* **Always start with shadcn primitives**
* Custom components are **allowed only if composition is needed**
* Maintain **consistency across modules**
* Tailwind utility classes should complement primitives, not replace them
