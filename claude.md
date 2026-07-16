# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start

```bash
pnpm install              # Install dependencies
pnpm dev                  # Start development server
pnpm db:start             # Start local PostgreSQL + Mailcatcher (docker)
pnpm db:migrate           # Run Prisma migrations
pnpm db:reset             # Reset database + seed
pnpm test                 # Run Vitest tests
pnpm test:ui              # Run tests with UI
```

## Architecture

**Stack:** Next.js 15 (App Router) + TypeScript + Prisma + PostgreSQL + Keystatic CMS

**Project Structure:**

```
anov/
├── content/              # Keystatic YAML files (hero,histoire,galerie,contact,menu,footer...)
├── keystatic.config.ts   # CMS configuration (GitHub storage mode)
├── prisma/               # Database schema + migrations
├── src/
│   ├── app/              # Next.js app router
│   │   ├── layout.tsx    # Root layout (fetches CMS data)
│   │   ├── ClientLayout.tsx  # Client layout (Navbar, Footer, SplashScreen)
│   │   ├── page.tsx      # Home page
│   │   ├── menu/page.tsx # Menu page
│   │   ├── admin/        # Admin dashboard (JWT auth)
│   │   ├── keystatic/    # Keystatic interface
│   │   └── api/          # API routes (auth, contact, stripe, gift-cards)
│   ├── components/       # React components
│   │   ├── layout/       # Navbar, Footer, LanguageSelector
│   │   ├── features/     # Hero, History, Gallery, OriginsMap, Contact
│   │   └── ui/           # shadcn/ui components
│   ├── context/          # React context (LanguageContext)
│   ├── lib/              # Utilities (prisma, auth, email, availability)
│   └── middleware.ts     # Admin route protection
└── styles/               # CSS files (tailwind, theme, fonts)
```

## Key Concepts

**CMS System (Keystatic):**

- Content stored in `content/*.yaml` files
- Singletons: `hero`, `histoire`, `galerie`, `contact`, `menu`, `footer`, `gift-card-success`
- Configured with GitHub storage (read/write via GitHub App)
- In dev, can use `kind: 'local'` for file-based storage
- Pages fetch CMS data at runtime via `createReader()` from `@keystatic/core`

**Internationalization:**

- 3 languages: French (default), English, German
- URL param: `?lang=fr|en|de`
- Stored in localStorage
- Translation files in `src/lib/translations/`

**Authentication:**

- JWT-based admin auth using `jose` library
- Cookie: `anov_admin_token` (8h expiration)
- Middleware protects `/admin/*`, `/keystatic/*`
- Admin users stored in PostgreSQL `Admin` table (SHA-256 password hash)

**Database (Prisma):**

- PostgreSQL via Neon serverless (production) or local Docker
- Models: `Reservation`, `Admin`, `RestaurantSettings`, `DayOverride`, `GiftCard`
- Auto-detects adapter (local vs Neon) based on `DATABASE_URL`

**Availability Logic:**

- Configurable by restaurant settings (max covers, opening days, time slots)
- Per-day overrides for special cases (closed, custom hours)
- Tracks reservation coverage across meal duration
- Utility functions: `getAvailableSlots()`, `getSlotsWithAvailability()`, `getUnavailableDatesForMonth()`

**Email System:**

- SMTP via `nodemailer` (environment: `SMTP_HOST`, `SMTP_PORT`, etc.)
- Templates: contact, reservation confirmation/reminder/cancellation, gift cards
- Mailcatcher available locally on port 1080

**Payment (Stripe):**

- Gift card sales via Checkout Sessions
- Webhook handles `checkout.session.completed`
- Admin manual gift card creation with `ANOV-M-` prefix

## Common Tasks

| Task                   | Command/Location                                   |
| ---------------------- | -------------------------------------------------- |
| Update site content    | Edit `content/*.yaml` files via `/admin/cms`       |
| Add new page route     | `src/app/new-page/page.tsx`                        |
| Add new component      | `src/components/features/Component.tsx`            |
| Change database schema | Edit `prisma/schema.prisma` then `pnpm db:migrate` |
| Add translation        | Add to `src/lib/translations/{en,de}.ts`           |
| Modify CMS schema      | Edit `keystatic.config.ts`                         |
| Add API route          | `src/app/api/route.ts`                             |
| Modify admin auth      | Edit `src/lib/auth.ts` + `src/middleware.ts`       |

## Deployment

- Push to `pprod` → Vercel preview
- Merge `pprod` → `main` → auto-deploy to production
- Images stored in `public/assets/` and committed to Git
