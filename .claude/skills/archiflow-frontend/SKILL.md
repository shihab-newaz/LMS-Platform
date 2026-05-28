---
name: archiflow-frontend
description: Scaffold a new feature or component for Archi.Flow, enforcing the Linear-inspired dark design system from DESIGN.md, feature-based directory structure, and TanStack Query + service-layer data patterns. Invoke with /archiflow-frontend <feature-name> or describe what to build.
disable-model-invocation: false
---

You are building a feature for Archi.Flow — an architectural firm management tool. The UI must feel like a CAD workspace: precise, structured, no generic SaaS styling.

## Before writing any code

Identify what the user wants to build:

- A new feature module? (clients, payments, reports, etc.)
- A new page/route?
- A standalone component?
- An update to an existing feature?

Ask for clarification if the scope is ambiguous.

## Directory structure to create for a new feature

```
modules/{feature-name}/
  components/
    {feature}-list.tsx       "use client"
    {feature}-card.tsx       "use client"
  hooks/
    use-{feature}.ts         TanStack Query read hook
    use-create-{feature}.ts  TanStack Query mutation hook
  types.ts                   Zod schema + TypeScript types
```

For new routes, add: `app/(protected)/{feature}/page.tsx`

## Linear design checklist — verify every component before finishing

- [ ] Page/layout background is `bg-[#010102]` — NOT `bg-zinc-*` or `bg-white`
- [ ] Cards use `bg-[#0f1011] border border-[#23252a] rounded-[12px]`
- [ ] Primary CTA uses lavender `bg-[#5e6ad2]` — no other chromatic color on chrome
- [ ] Buttons are `rounded-[8px]` — NOT `rounded-full`, NOT `rounded-[2px]`
- [ ] No soft shadows — depth comes from surface lift + hairline border, not shadow
- [ ] Font: Inter for display/body, Geist Mono for code/IDs
- [ ] Negative letter-spacing on display headings (`tracking-tight` or explicit negative value)
- [ ] All `className` merges use `cn()` from `@/lib/utils`

## Data patterns

**Reading data** (TanStack Query):

```typescript
// modules/{feature}/hooks/use-{feature}.ts
import { useQuery } from '@tanstack/react-query'
import { featureService } from '@/services/modules/{feature}'

export function use{Feature}() {
  return useQuery({
    queryKey: ['{feature}'],
    queryFn: () => featureService.getAll(),
  })
}
```

**Mutating data** (TanStack Query useMutation):

```typescript
// modules/{feature}/hooks/use-create-{feature}.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useCreate{Feature}() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: featureService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['{feature}'] })
      toast.success('{Feature} created')
    },
    onError: () => toast.error('Failed to create {feature}'),
  })
}
```

No Prisma, no Server Actions — all data goes through `services/`.

## Typography reference

| Use case            | Size / Weight                       | Tracking             | Font       |
| ------------------- | ----------------------------------- | -------------------- | ---------- |
| Page / hero title   | `text-[56px] font-semibold`         | `tracking-[-1.8px]`  | Inter      |
| Section headline    | `text-[40px] font-semibold`         | `tracking-[-1.0px]`  | Inter      |
| Card title          | `text-[22px] font-medium`           | `tracking-[-0.4px]`  | Inter      |
| Body / labels       | `text-base font-normal`             | `tracking-[-0.05px]` | Inter      |
| Nav / button text   | `text-sm font-medium`               | `tracking-normal`    | Inter      |
| Eyebrow             | `text-[13px] font-medium uppercase` | `tracking-[0.4px]`   | Inter      |
| IDs, amounts, dates | `font-mono text-[13px]`             | `tracking-normal`    | Geist Mono |

## Animations

Staggered list entry:

```tsx
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.05 }}
>
```

Hover: `transition-all duration-100 ease-out`

## After scaffolding

1. Confirm file structure matches the feature module pattern
2. Verify all Linear design checklist items pass
3. Show the user a brief summary: files created, query keys used, any env vars or services needed
