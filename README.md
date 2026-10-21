# Aviation Masters

Aviation Masters is an interactive aviation learning platform combining an aircraft archive, guided onboarding, aircraft exams, cockpit simulation, mission mapping, pilot profiles, flight-hour tracking, and AM token monetization.

## Current technology stack

- **Framework:** Next.js 16 App Router
- **Language:** TypeScript 5.7
- **UI:** React 19, Tailwind CSS 4, shadcn/ui primitives, Base UI, Lucide icons
- **3D/simulation:** Three.js, React Three Fiber, Drei
- **Maps:** react-simple-maps
- **Authentication:** Better Auth
- **Database:** PostgreSQL on Neon, accessed with Drizzle ORM
- **Payments:** Stripe Checkout and Stripe webhooks
- **Analytics:** Vercel Analytics
- **Package manager:** pnpm 12
- **Deployment target:** Vercel

## Product areas

- `/` — archive home and personalized onboarding
- `/flight-school` — user training entry point
- `/category/[type]` — aircraft, helicopter, and drone archives
- `/aircraft/[slug]` — aircraft details
- `/aircraft/[slug]/exam` — aircraft exams
- `/aircraft/[slug]/cockpit` — cockpit experiences
- `/missions` — fictional training mission map
- `/calendar` — school calendar
- `/profile` — pilot profile and progress
- `/shop` — AM token supply shop
- `/api/checkout` — server-side Stripe Checkout session creation
- `/api/stripe/webhook` — verified payment events

## Local development

Requirements:

- Node.js 20 or newer
- pnpm 12
- PostgreSQL/Neon development database

```bash
pnpm install
pnpm dev
```

Useful commands:

```bash
pnpm build
pnpm start
pnpm db:generate
pnpm db:migrate
```

Open `http://localhost:3000` after starting the development server.

## Environment variables

Set these in Vercel project settings or a local `.env.development.local`. Never commit secret values.

### Authentication and database

- `BETTER_AUTH_SECRET`
- `DATABASE_URL`
- `DATABASE_URL_UNPOOLED`
- `NEON_AUTH_BASE_URL`
- `NEON_PROJECT_ID`

### Stripe

- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

Stripe prices must be defined server-side in `lib/products.ts`. The client may select a product ID, but must never submit a price or token quantity as the source of truth.

## Team development workflow

1. Create a feature branch from `main`.
2. Keep changes focused by product area.
3. Reuse existing components and semantic design tokens before adding custom UI.
4. Add or update database schema and migrations together.
5. Keep payment fulfillment in the verified Stripe webhook, not the success page.
6. Run `pnpm build` before opening a pull request.
7. Review mobile and desktop behavior in the Vercel preview.
8. Merge through a pull request; do not push directly to `main`.

Recommended ownership as the team grows:

- **Platform:** Next.js routes, auth, deployment, security headers
- **Data:** Drizzle schema, migrations, query performance, backups
- **Learning experience:** archive, exams, onboarding, profiles
- **Simulation:** Three.js and cockpit interactions
- **Missions:** map data, mission rules, progression
- **Commerce:** Stripe catalog, checkout, webhook fulfillment, refunds
- **Design/system:** tokens, responsive layout, accessibility

## Production scaling plan

### Phase 1 — production foundation

- Add CI checks for type-checking, linting, build, and migration validation.
- Add database migrations to the deployment workflow with an explicit release step.
- Add error monitoring and structured server logs.
- Add baseline security headers and review trusted origins for Better Auth.
- Add rate limits to authentication, battle, checkout, and webhook endpoints.
- Add automated backups and a documented database restore procedure.

### Phase 2 — reliable learning platform

- Move aircraft, mission, exam, and reward data from hardcoded modules into versioned database tables or content management workflows.
- Add per-user authorization checks to every progress, flight-hour, reward, and profile query.
- Add idempotent mission completion and token ledger entries so refreshes cannot duplicate rewards.
- Add a server-side quota service for fuel, supplies, aircraft access, and AM token balances.
- Add admin tools for publishing aircraft, missions, exams, and balance adjustments.

### Phase 3 — higher traffic

- Keep Next.js pages stateless and horizontally scalable on Vercel.
- Use Neon pooled connections for request traffic and unpooled connections for migrations.
- Add indexes for user ID, aircraft slug, mission status, transaction ID, and created timestamps.
- Cache public archive/catalog data with explicit invalidation after publishing changes.
- Use object storage/CDN for large aircraft images, audio, and simulation assets.
- Move long-running jobs such as reports, imports, and notifications to a durable queue/workflow.

### Phase 4 — larger engineering team

- Define API and database ownership for each domain.
- Use shared TypeScript types for API payloads and validation schemas.
- Introduce a component library with visual regression tests.
- Add Playwright smoke tests for sign-in, onboarding, mission completion, and checkout.
- Use feature flags for risky releases and staged rollouts.
- Maintain an ADR folder for important decisions such as token economics, data ownership, and caching.

## Monetization safety

AM tokens are fictional in-app credits and have no cash value. For a production economy:

- Store all token changes in an append-only ledger.
- Credit purchased tokens only after a verified Stripe webhook event.
- Use Stripe event IDs as idempotency keys.
- Never trust client-submitted price, currency, balance, or reward values.
- Add refund and chargeback handling that can freeze or reverse credits safely.
- Add spending limits, clear pricing, purchase history, and support contact details.
- Review consumer-protection, tax, age, and regional requirements before launch.

## Project organization

Shared cross-page UI belongs in `components/` (for example, `components/site-nav.tsx`). Route-specific composition stays under `app/`, while domain logic and data contracts belong in `lib/`. New features should follow this boundary instead of duplicating navigation, authentication checks, pricing, or database access inside page components.

### Data ownership map

- **Identity and sessions:** `lib/auth.ts`, `lib/auth-client.ts`, Better Auth
- **Persistent user data:** `lib/db/schema.ts` and server actions under `app/actions/`
- **Catalog and mission configuration:** domain modules under `lib/`; migrate editable content to database-backed tables as the catalog grows
- **Payments and fulfillment:** `lib/products.ts`, `app/api/checkout`, `app/api/stripe/webhook`
- **Presentation:** `components/` and route pages under `app/`

## Architecture conventions

- Server Components should load initial server data; interactive components use `use client`.
- Keep database access in `lib/db` and server actions/API routes, not in client components.
- Validate external input at route boundaries.
- Scope every user-owned query to the authenticated user.
- Prefer semantic HTML, accessible labels, keyboard navigation, and responsive layouts.
- Do not use localStorage as the source of truth for account progress or purchases.

## Commercial handoff checklist

This repository is prepared for a sanitized private ZIP or private repository transfer. Before delivery:

1. Confirm `git ls-files` contains no `.env*`, `.vercel/`, credentials, private certificates, or generated deployment artifacts.
2. Keep the development GitHub repository private unless a marketplace explicitly requires a public URL.
3. Provide `.env.example`, this README, and setup instructions—not real environment values.
4. Ask the buyer to create their own Neon/Postgres, Better Auth, Stripe, and Vercel resources.
5. Rotate any credential that was ever exposed outside the project or shared with a buyer.
6. Transfer IP only through a separate signed IP assignment agreement after payment; this README is not an ownership transfer.
7. Audit fonts, images, generated artwork, dependencies, trademarks, and contributor rights before claiming full ownership.
8. Remove internal branches, private deployment links, support credentials, and personal data from the delivery archive.

Do not include `STRIPE_SECRET_KEY`, `DATABASE_URL`, `BETTER_AUTH_SECRET`, `STRIPE_WEBHOOK_SECRET`, or any other secret in a ZIP or public repository.

## Deployment checklist

- Confirm production environment variables are configured.
- Confirm the Stripe production webhook points to `/api/stripe/webhook`.
- Confirm the webhook secret matches the deployed endpoint.
- Run database migrations before enabling new schema-dependent features.
- Test sign-in, onboarding, mission reward, token purchase, webhook fulfillment, and refund handling.
- Verify the app at mobile, tablet, and desktop widths.
- Monitor errors, webhook delivery, database connections, payment conversion, and token ledger anomalies.
