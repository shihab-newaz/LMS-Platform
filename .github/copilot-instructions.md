# Copilot Instructions

## Project Configuration
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with shadcn/ui
- **State Management**: Zustand for client-side state
- **Data Fetching**: TanStack Query (React Query)
- **UI Components**: shadcn/ui primitives

## Code Standards

### TypeScript
- Use strict TypeScript configuration
- Define proper interfaces and types for all data structures
- Use generic types where appropriate
- Prefer `interface` over `type` for object shapes
- Use proper return types for all functions
- Implement strict null checks

### Component Architecture
- **Default Behavior**: Use shadcn/ui primitives directly in components
- **Custom Components**: Only when explicitly specified, create reusable components in `components/custom/`
- **File Structure**: 
  ```
  components/
  ├── ui/           # shadcn/ui primitives (auto-generated)
  └── custom/       # Custom reusable components built from primitives
  ```
- Use functional components with TypeScript
- Implement proper prop types and interfaces

### State Management (Zustand)
- Create focused, single-responsibility stores
- Use TypeScript interfaces for store state
- Implement proper state updates (immutable patterns)
- Use selectors for component subscriptions
- Separate concerns between different stores

```typescript
interface UserStore {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
}
```

### API Operations (TanStack Query)
- Use React Query for all server state management
- Implement proper query keys with hierarchical structure
- Use mutations with optimistic updates where appropriate
- Implement proper error handling and retry logic
- Use proper caching strategies and stale time configuration
- Implement query invalidation for related data updates

```typescript
// Query Keys
const queryKeys = {
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
  userPosts: (userId: string) => ['users', userId, 'posts'] as const,
};

// Proper invalidation
queryClient.invalidateQueries({ queryKey: queryKeys.users });
```

### Custom Components Guidelines
When building custom components in `components/custom/`:
- Extend shadcn/ui primitives, don't replace them
- Use composition over inheritance
- Implement proper TypeScript props interfaces
- Include proper accessibility attributes
- Use forwardRef when necessary for primitive integration
- Follow shadcn/ui naming conventions and patterns

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

### Next.js Patterns
- Use App Router file conventions
- Implement proper loading.tsx and error.tsx files
- Use Server Components by default, Client Components when needed
- Implement proper metadata for SEO
- Use proper data fetching patterns (server-side when possible)

### Error Handling
- Implement error boundaries at appropriate levels
- Use proper try-catch blocks for async operations
- Provide meaningful error messages to users
- Log errors appropriately for debugging

### Performance
- React 19 Compiler handles most optimizations automatically
- Use proper key props for lists
- Optimize images with Next.js Image component
- Implement proper code splitting and lazy loading
- Avoid manual React.memo, useCallback, useMemo unless specifically needed (React Compiler handles these)