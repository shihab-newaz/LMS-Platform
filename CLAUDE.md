# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # starts dev server with Turbopack
npm run build      # production build with Turbopack
npm run lint       # ESLint (Next.js core-web-vitals + TS)
npx prettier --write .  # format all files
```

No test framework is configured in this project.

## Architecture

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · Zustand · TanStack Query · React Hook Form + Zod · Framer Motion · MSW

**Auth:** Custom cookie-based auth (`lms.auth.token`). Middleware protects `/, /projects/*, /clients/*, /settings/*, /payments/*` — unauthenticated requests redirect to `/login`. No NextAuth or Prisma; uses a service-based architecture with `lib/apiClient.ts` and `services/`.

**API mocking:** MSW is initialized in `app/layout.tsx` (dev only) before React hydrates, preventing race conditions. Mock handlers live in `mocks/handlers/`.

**Environment variables:**

- `NEXT_PUBLIC_API_URL` — backend base URL (falls back to `http://localhost:3333` in prod, empty string in dev)

## Code Style

Prettier config (enforced — do not deviate):

- No semicolons (`semi: false`)
- Single quotes (`singleQuote: true`)
- Trailing commas ES5 (`trailingComma: "es5"`)
- 2-space indent, 80-char line width

## Design System (NON-NEGOTIABLE)

Full spec lives in `DESIGN.md`. Every UI component must follow these rules.

**Never:**

- Use `bg-white` or `bg-zinc-*` for page backgrounds — canvas is `#010102`
- Use lavender (`#5e6ad2`) as a section background or card fill
- Introduce a second chromatic accent (orange, pink, green)
- Add atmospheric gradients or decorative blur blobs
- Pill-round CTA buttons (`rounded-full`)
- Use true black `#000000` as canvas
- Ship a light-mode page

**Always:**

- Use the four-step surface ladder for hierarchy (no skipping levels)
- Apply 1px hairline borders on cards and inputs
- Use Inter (display/body) or Geist Sans as the font substitute for Linear Display/Text
- Use Geist Mono or JetBrains Mono for code/mono contexts
- All `className` merges via `cn()` from `@/lib/utils`

### Colors

```
Canvas (page bg):            #010102
Surface-1 (cards):           #0f1011
Surface-2 (featured/hover):  #141516
Surface-3 (sub-nav):         #18191a
Hairline (borders):          #23252a
Hairline-strong:             #34343a

Primary (lavender):          #5e6ad2  — brand mark, primary CTA, focus ring ONLY
Primary hover:               #828fff
Ink (text):                  #f7f8f8
Ink-muted:                   #d0d6e0
Ink-subtle:                  #8a8f98
Ink-tertiary:                #62666d
Success:                     #27a644
```

### Typography

| Role              | Size / Weight  | Tracking         | Font       |
| ----------------- | -------------- | ---------------- | ---------- |
| Hero / page title | 56–80px / 600  | -1.8px to -3.0px | Inter      |
| Section headline  | 40px / 600     | -1.0px           | Inter      |
| Card title        | 22px / 500     | -0.4px           | Inter      |
| Body default      | 16px / 400     | -0.05px          | Inter      |
| Body small / nav  | 14px / 400–500 | 0                | Inter      |
| Eyebrow label     | 13px / 500     | +0.4px           | Inter      |
| Code / IDs / mono | 13px / 400     | 0                | Geist Mono |

### Border Radius

| Context                               | Value            |
| ------------------------------------- | ---------------- |
| Buttons, inputs                       | `rounded-[8px]`  |
| Cards (feature, pricing, testimonial) | `rounded-[12px]` |
| Product screenshot panels             | `rounded-[16px]` |
| Status pills, pricing tab toggles     | `rounded-full`   |
| Small chips, badges                   | `rounded-[4px]`  |

### Component patterns

```tsx
// Primary CTA button
<Button className="rounded-[8px] bg-[#5e6ad2] text-white text-sm font-medium px-[14px] py-[8px] hover:bg-[#828fff] transition-colors">

// Secondary button
<Button className="rounded-[8px] bg-[#0f1011] text-[#f7f8f8] text-sm font-medium px-[14px] py-[8px] border border-[#23252a] hover:bg-[#141516] transition-colors">

// Card
<Card className="bg-[#0f1011] border border-[#23252a] rounded-[12px] p-6 shadow-none">

// Input
<Input className="bg-[#0f1011] border border-[#23252a] rounded-[8px] px-3 py-2 text-[#f7f8f8] focus:border-[#5e6ad2] focus:ring-0 transition-colors" />

// Page / layout background
<main className="min-h-screen bg-[#010102] text-[#f7f8f8]">
```

## Feature Module Structure

Group code by feature, never by file type:

```
components/
  ui/          shadcn primitives — do not modify logic
  custom/      cross-feature shared components
modules/
  auth/
  home/
services/
  api.ts
  modules/
store/
  zustand/
mocks/
  handlers/
```

**Import rule:** feature/module components may import from `components/ui` and `components/custom`, but must not cross-import from other features/modules.

## Data Fetching Pattern

- **Reads:** TanStack Query hooks calling `services/` functions
- **Mutations:** TanStack Query `useMutation` calling `services/` functions (no Server Actions — this project uses a REST service layer, not Prisma)
- **State:** Zustand stores in `store/zustand/`
- `useQueryClient().invalidateQueries` to refresh after mutations
- Toast notifications via `sonner`

## CSS Strategy

- 95% Tailwind utility classes
- 5% `.module.css` for complex CSS Grid, print styles, or animations beyond Tailwind/Framer Motion
- Always use `cn()` from `@/lib/utils` for conditional class merging
