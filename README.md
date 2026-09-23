# BreachGuard

Email breach detection, risk assessment, and cybersecurity awareness
platform. A full-stack Next.js (App Router) project built for a
university final-year submission.

## Project Overview

BreachGuard lets anyone check whether an email address has appeared in a
known data breach - no account, no separate "check" page. The homepage's
own search field runs the check and renders the full result inline, in
place, the moment it comes back. The request is rate-limited and
validated entirely on the server, checked against an external
breach-data provider, scored by an explainable risk engine, and
rendered with a breakdown, breach history, and concrete recommendations.
Administrators sign in through NextAuth to a separate, middleware-protected
Control Center to view aggregate statistics and security events.

## Features

- One inline email check on the homepage - submit and watch the full
  result render in place, no page navigation
- Server-side validation, normalization, and IP-based rate limiting, with
  zero public API surface for the check itself (it's a Server Action)
- External breach-data API integration, with the API key kept server-only
- A transparent, explainable 0-100 risk scoring engine with a visible
  frequency / recency / sensitivity breakdown
- Structured, priority-ranked recommendations (urgent / recommended /
  good practice)
- A short celebratory confetti moment on a clean result
- A short cybersecurity education section (`/learn`)
- A Control Center admin area protected by a single root `middleware.js`,
  authenticated via **NextAuth** (Credentials provider, JWT sessions):
  - Server-rendered statistics with a donut risk-distribution chart and a
    stacked breached/clean trend chart
  - A paginated, filterable (all / breached / clean) checks table and a
    security events log
  - A collapsible desktop sidebar and a mobile drawer
- bcrypt-hashed admin passwords, no public admin registration
- Space Grotesk (display) + Manrope (body) typography, Framer Motion
  micro-interactions, fully responsive dark UI

## Technology Stack

- **Framework:** Next.js 14 (App Router), JavaScript, project root as the
  App Router root (no `src/` directory)
- **Auth:** NextAuth v4 (Credentials provider, JWT session strategy),
  bcrypt password hashing
- **Database:** MongoDB with Mongoose
- **Styling:** Tailwind CSS, Space Grotesk + Manrope via `next/font`
- **Motion:** Framer Motion, canvas-confetti
- **Charts:** Recharts
- **Notifications:** sonner (shadcn-style `Toaster`)
- **Icons:** Lucide React

## Architecture: Server Actions vs. API Routes

This project deliberately minimizes public API surface, since every
exposed HTTP endpoint is something an attacker can probe directly.

- **NextAuth owns admin auth.** `app/api/auth/[...nextauth]/route.js` is
  the one API route NextAuth itself requires - `signIn("credentials", ...)`
  and `signOut()` from `next-auth/react` call it directly. This is not
  something we chose to expose; it's how NextAuth works, and it's a
  well-audited, purpose-built library for exactly this.
- **The public breach check is a Server Action**, not an API route. The
  homepage's `EmailChecker` calls `checkBreachAction()`
  (`app/actions/breach.js`) directly, as a plain async function - no
  `POST /api/breach-check` exists. The action wraps
  `controllers/breachController.js` and always returns a discriminated
  result (`{ success, ... }` or `{ success: false, code, message }`)
  rather than throwing, so the client never needs to guess at a generic
  serialized error.
- **Admin dashboard data is fetched directly in Server Components** -
  `adminController` and `securityEventController` are called straight
  from `app/control-center/*/page.js`. Pagination and the checks-table
  filter tabs are plain URL search params + `<Link>`, and a client
  `RefreshButton` calls `router.refresh()` to re-run the server fetch
  without a full reload - no client-side polling, no extra JSON API.
- **`GET /api/health`** is the one deliberately-public REST endpoint,
  because uptime/monitoring tooling that isn't this app's own UI needs a
  real HTTP boundary to poll.

## Request Flow

```
Homepage EmailChecker (client component)
        |
checkBreachAction()  — Server Action, app/actions/breach.js
        |
controllers/breachController.checkBreach()
        |
rate limit -> validate -> cache check -> breachApiService -> riskScoringService -> recommendationService
        |
MongoDB (aggregate BreachCheck record only - no raw email stored)
        |
Result rendered inline on the homepage (BreachResult, with confetti on a clean result)
```

Admin auth and data flow:

```
/control-center/login  ->  signIn("credentials", {...})  ->  NextAuth (auth.js authOptions)
        |
bcrypt.compare against models/User.js  ->  signed JWT session cookie
        |
middleware.js verifies the cookie (next-auth/jwt getToken) on every /control-center/* request
        |
Server Components call adminController / securityEventController directly
        |
Rendered dashboard, checks table, security events table
```

## Folder Structure

```
auth.js                   NextAuth configuration (authOptions) - project root
middleware.js              The single file that protects /control-center/*
app/
  layout.js                Root layout: fonts, SessionWrapper, Toaster
  globals.css
  actions/breach.js         Server Action wrapping breachController
  api/auth/[...nextauth]/   NextAuth's own route handler
  api/health/               The one deliberately-public API route
  (public)/                 Home, learn/, about/
  control-center/           login/, page.js (dashboard), checks/, security-events/
components/
  SessionWrapper/           NextAuth SessionProvider wrapper
  public/                   Navbar, Footer, HowItWorks, SecurityTopics, HomeClient
  breach/                   EmailChecker, BreachResult, RiskScoreBadge, CelebrationPetals
  admin/                    AdminShell, AdminSidebar, AdminHeader, LoginForm, StatCard,
                             ChecksTable, SecurityEventsTable, PaginationLinks, RefreshButton
  charts/                   ChecksTrendChart, RiskDistributionChart
  ui/                       Logo, sonner (Toaster)
controllers/                breachController, adminController, securityEventController
services/                   breachApiService, riskScoringService, recommendationService, rateLimitService
models/                     User, BreachCheck, SecurityEvent, BreachCache
lib/                        mongodb.js (connectToDatabase / connectDB), utils.js (cn, validation, hashing)
config/                     env.js
scripts/                    createAdmin.js (seed script)
__tests__/                  Jest tests for the risk engine, validation, and auth
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
MONGODB_URI=mongodb://localhost:27017/breachguard

BREACH_API_URL=
BREACH_API_KEY=

NEXTAUTH_URL=http://localhost:3000
AUTH_SECRET=

ADMIN_EMAIL=admin@breachguard.local
ADMIN_USERNAME=admin
```

Generate a strong `AUTH_SECRET` with:

```bash
openssl rand -base64 32
```

`AUTH_SECRET` is read by **both** `auth.js` (`authOptions.secret`) and
`middleware.js` (`getToken`'s `secret` option) - they must be the exact
same value, since middleware verifies the same JWT that `auth.js` signs.
`.env.local` is git-ignored and must never be committed.

## MongoDB Setup

Any MongoDB instance works - local, Docker, or a hosted provider such as
MongoDB Atlas. Point `MONGODB_URI` at it. Collections and indexes are
created automatically the first time the app writes to them (an
`expiresAt` TTL index on `BreachCache` handles cache cleanup on its own).

## Breach API Setup

This project is written to work with the public XposedOrNot email-breach
endpoint: `https://api.xposedornot.com/v1/check-email/{email}`. Unlike the
older HIBP flow, this endpoint is publicly accessible for the normal email
check and does not require an API key.

Set `BREACH_API_URL` to the base provider URL, for example
`https://api.xposedornot.com`, and leave `BREACH_API_KEY` empty unless you
are intentionally wiring a different provider such as a legacy HIBP-style
API.

The adapter in `services/breachApiService.js` accepts both XposedOrNot and
legacy HIBP-style responses, normalizes them into the app's internal shape,
and keeps the rest of the app unchanged. If a provider is not configured,
the homepage shows a clear "provider hasn't been configured" message instead
of faking a result.

## Admin Setup

There is no public registration page. Create the first administrator with
the seed script:

```bash
npm run create-admin -- --email admin@example.com --username admin --password "a-strong-password"
```

Omit `--password` to be prompted for it interactively. Running the script
again for an existing email updates that admin's password and username.
This creates a document in the `User` collection with `role: "admin"` -
matching `models/User.js` exactly, since NextAuth's `authorize()`
callback in `auth.js` reads from that same model.

## Running Locally

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run create-admin
npm run dev
```

Visit `http://localhost:3000` for the public site - the email field on
the homepage is the entire "check" flow - and
`http://localhost:3000/control-center/login` to sign in as an
administrator.

## Testing

```bash
npm test
```

Covers:
- Risk engine: zero/one/multiple breaches, recent vs. old breaches,
  password exposure, maximum score clamping
- Email validation: valid, invalid, and empty input
- Admin authentication: the NextAuth Credentials provider's `authorize()`
  function directly (correct credentials, wrong password, unknown email,
  missing credentials) and the `jwt`/`session` callbacks

## Deployment

BreachGuard is a standard Next.js app and deploys anywhere Next.js does
(Vercel, a Node server, a container). Set the same environment variables
in your hosting provider's dashboard, use a hosted MongoDB instance (e.g.
Atlas) rather than `localhost`, and set `NEXTAUTH_URL` to your real
deployed URL. `middleware.js` runs on the Edge runtime automatically and
has no database dependency of its own - it only verifies the JWT.

## Risk Scoring Method

The score is built from three explainable factors, each capped and summed:

| Factor              | Range | Basis                                   |
|---------------------|-------|------------------------------------------|
| Frequency           | 0-40  | Number of breaches the email appeared in |
| Recency             | 0-30  | Age of the most recent breach            |
| Data sensitivity    | 0-30  | Most sensitive category of data exposed  |

The three scores are summed and clamped to 0-100:

- **0-29** LOW
- **30-59** MEDIUM
- **60-79** HIGH
- **80-100** CRITICAL

This is an educational heuristic, not a certified security assessment -
the UI states this explicitly beneath every result.

## Security Considerations

- The breach API key is read from a server-only environment variable and
  is never sent to the client or logged.
- The breach check itself has no public API endpoint - it only runs as a
  Server Action invoked from this app's own homepage, which is
  rate-limited and validated before any external call is made.
- Admin passwords are hashed with bcrypt via NextAuth's `authorize()`
  callback; plaintext passwords are never stored, and the `password`
  field is `select: false` by default on the `User` model.
- `middleware.js` is the single, centralized place that checks the admin
  session JWT - individual admin pages do not re-implement this.
- Raw email addresses are not stored in `BreachCheck` records - only
  aggregate status, breach count, and risk data.
- Errors rendered to the browser never include stack traces, API keys, or
  database connection details.

## Limitations

- The rate limiter is in-memory and scoped to a single Node.js process. A
  multi-instance production deployment would need a shared store (e.g.
  Redis) instead.
- Breach coverage depends entirely on the configured external provider and
  is not guaranteed to include every breach.
- This project intentionally stays scoped to its core flow - no payments,
  user accounts, real-time monitoring, or notifications beyond the admin
  toast feedback.
