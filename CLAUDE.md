# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run typecheck    # TypeScript check (tsc --noEmit)
```

## Architecture

**Aim Earn** is a Next.js 15 App Router + TypeScript + Tailwind CSS affiliate/distributor platform with three role-based dashboards.

### Role-based routing

- `/admin/*` — Admin dashboard (customers, products, brands, orders, payouts, approvals, settings)
- `/distributor/*` — Distributor dashboard (affiliates, products, promotions, orders, customers, reports)
- `/affiliate/*` — Affiliate dashboard (similar to distributor, tailored scope)

Each role has its own layout shell (`app/{role}/shell.tsx`) providing sidebar navigation and header.

### Auth routes

- `/login` — Email + OTP login flow
- `/register-distributor`, `/register-affiliate` — Registration with country selection
- `/confirmation` — Post-registration confirmation

### Session management (client-side)

Sessions are stored in `localStorage` (key: `aim-earn:session`) with mock users from `components/mock.ts`. Route protection is handled by hooks in `lib/use-session-guard.ts`:
- `useSessionGuard()` — redirects unauthenticated users
- `useRoleGuard("role")` — role-specific route protection
- `useRedirectIfAuthed()` — redirects logged-in users away from auth pages
- `landingPathForRole()` in `lib/session.ts` — routes users to their role dashboard

### Design system

Tailwind tokens in `tailwind.config.ts` are mapped from Figma SDS variables:
- **Brand**: `bg-brand` (#f8d237), `text-brand-foreground`
- **Surface**: `bg-surface-page`, `bg-surface-card`, `bg-surface-input`
- **Ink**: `text-ink`, `text-ink-secondary`, `text-ink-tertiary`
- **Line**: `border-line`, `border-line-muted`
- **Fonts**: `font-sans` (Urbanist), `font-body` (Nunito Sans), `font-heading` (Inter) — self-hosted via `@fontsource-variable`
- **Radius**: `rounded-card` (24px)

### Shared components

`components/shared/` contains the UI primitives (Button, Input, Table, Dialog, Dropdown, Tabs, FilterBar, StatusPill, etc.). Feature components live in `components/{feature}/`.

### Key conventions

- Path alias: `@/*` maps to project root
- Client components are marked with `"use client"`; prefer server components where possible
- Mock data lives in `components/mock.ts` and `components/type.ts` has shared TypeScript types
- Remote images allowed from `images.unsplash.com` (configured in `next.config.ts`)
