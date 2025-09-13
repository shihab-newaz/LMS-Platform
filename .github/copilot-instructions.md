# Copilot instructions for this repo

This is a minimal Next.js (App Router) TypeScript app created with create-next-app, using Tailwind CSS v4 and ESLint flat config. Follow these repo-specific practices when coding here.

## Architecture and conventions
- App Router under `app/`:
  - Global layout in `app/layout.tsx` wires fonts via `next/font` (Geist) and imports `app/globals.css`.
  - Pages are server components by default. `app/page.tsx` is a simple server component; make a file client-only by adding `"use client"` at the top.
- Styling: Tailwind CSS v4 (via `@import "tailwindcss"` in `app/globals.css`) and inline CSS variables. Prefer utility classes; define theme vars in `@theme inline`.
- TypeScript strict mode with path alias `@/*` (see `tsconfig.json`). Use `import x from "@/path/to"` instead of relative chains when practical.
- Linting: ESLint flat config extending `next/core-web-vitals` and `next/typescript` (see `eslint.config.mjs`). Keep files under `app/` and config directories clean; generated folders like `.next/` are ignored.
- Next config is minimal (`next.config.ts`). If adding images, consider `next/image`. Leave `turbopack` flags in scripts unless you validate a change.

## Workflows
- Dev: `npm run dev` starts Next with Turbopack on port 3000. Hot reload is enabled. Primary edit loop is in `app/page.tsx`.
- Build: `npm run build` creates a production bundle; `npm start` serves it.
- Lint: `npm run lint` uses the flat config; fix issues as you go.
- Fonts: Geist and Geist_Mono are configured in `layout.tsx`. When adding new fonts, follow this pattern and append their CSS variables to the body class.

## Patterns and examples
- Server vs Client components:
  - Server (default): fetch data directly and return JSX. Example: the current `app/page.tsx` is a server component with static JSX.
  - Client: add `"use client"` and interact with hooks/state. Example pattern:
    ```tsx
    "use client";
    import { useState } from "react";
    export default function Counter(){
      const [n, setN] = useState(0);
      return <button onClick={() => setN(n+1)}>{n}</button>;
    }
    ```
  - Compose by importing client components into server components, not the reverse.
- Images: use `next/image` from `next/image` as in `app/page.tsx` for optimized assets under `public/`.
- Styling: Prefer Tailwind utilities in markup; global tokens live in `:root` and `@theme inline` within `app/globals.css`.

## File placement
- Put new routes under `app/<route>/page.tsx` and shared UI in `app/components/` (create the folder if needed). Keep icons/svgs in `public/`.
- Use the `@/*` alias to import cross-cutting modules once you add non-`app/` source directories (e.g., `src/`), and update `tsconfig.json` accordingly.

## Guardrails
- Don’t introduce custom Webpack config unless truly required—Turbopack is enabled via scripts and works with Next 15.
- Keep ESLint and TypeScript strict settings intact; prefer fixing types vs loosening config.
- Maintain server-first components; only opt into client components for interactivity.

## Commands (WSL/bash)
```bash
npm ci            # install deps (CI-consistent)
npm run dev       # start dev server with Turbopack
npm run build     # production build
npm start         # run prod server
npm run lint      # lint using flat config
```

If anything here seems off as the app evolves, update examples and file references to match the current code (especially routes and fonts).