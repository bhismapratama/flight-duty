# Flight Duty

A small pilot app. Pilots can sign in, see how close they are to their duty limits, check document expiry, and browse their monthly schedule.

|                 |                                                                                               |
| --------------- | --------------------------------------------------------------------------------------------- |
| Frontend (live) | _to be added after deployment_ (Cloudflare Workers)                                           |
| API (live)      | _to be added after deployment_ (Docker on a VPS behind Cloudflare Tunnel, Swagger at `/docs`) |
| Demo account    | `johndoe` / `susiairtest`                                                                     |
| "Today"         | Fixed to **15 May 2026**, as the brief requires                                               |

| Folder          | Stack                                                                                             | README                           |
| --------------- | ------------------------------------------------------------------------------------------------- | -------------------------------- |
| [`/nest`](nest) | NestJS 12, TypeScript, in-memory data seeded from the provided JSON, JWT, class-validator, Vitest | [nest/README.md](nest/README.md) |
| [`/nuxt`](nuxt) | Nuxt 3 (`<script setup>`), Pinia, SCSS, TypeScript, Chart.js, Capacitor 8 (Android)               | [nuxt/README.md](nuxt/README.md) |
| root            | Git hooks only: husky, lint-staged, commitlint                                                    | this file                        |

## Getting Started

### Prerequisites

Node 22+ and pnpm. Android Studio only if you want to build the APK.

### Installation

1. Clone the repository

```bash
git clone <repo-url>
cd flight-duty
```

2. Install the git hooks (once, from the repository root)

```bash
pnpm install
```

3. Start the API on http://localhost:4000

```bash
cd nest
pnpm install
cp .env.example .env
node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
pnpm start:dev
```

Put the generated string in `JWT_SECRET` inside `.env` before starting.

4. Start the web app on http://localhost:3000, in a second terminal

```bash
cd nuxt
pnpm install
cp .env.example .env
pnpm dev
```

### Environment Variables

| App  | Variable                 | Required                    | Default                    |
| ---- | ------------------------ | --------------------------- | -------------------------- |
| nest | `JWT_SECRET`             | yes, at least 32 characters | none                       |
| nest | `JWT_EXPIRES_IN`         | no                          | `12h`                      |
| nest | `PORT`                   | no                          | `4000`                     |
| nest | `HOST`                   | no                          | `0.0.0.0`                  |
| nest | `BASE_URL`               | no                          | `http://localhost:4000`    |
| nest | `APP_TODAY`              | no                          | `2026-05-15`               |
| nest | `CORS_ORIGIN`            | no                          | `*` (comma-separated list) |
| nest | `TRUST_CF_CONNECTING_IP` | no                          | `false`                    |
| nuxt | `NUXT_PUBLIC_API_BASE`   | no                          | `http://localhost:4000`    |

Each app README explains every variable.

### Tests and Checks

```bash
cd nest
pnpm test        # rolling sum, limit cards, document status, date helpers, Swagger examples
pnpm test:e2e    # login, guard, validation, error shape, every endpoint
pnpm lint && pnpm typecheck
cd ../nuxt
pnpm typecheck
pnpm format:check
```

## Deployment

The brief suggests Vercel/Netlify and Railway/Render/Fly. I used Cloudflare for both sides instead, on infrastructure I already run:

- **API**: the `/nest` Docker image (`nest/Dockerfile`) on a VPS, reachable only through a Cloudflare Tunnel. No inbound port is open, and the container has no internet access, runs as non-root and has a read-only filesystem. `TRUST_CF_CONNECTING_IP=true` makes the rate limit key on the real visitor IP behind the tunnel.
- **Web**: the static `/nuxt` build on Cloudflare Workers static assets, deployed with `pnpm run deploy` (`wrangler.jsonc`), with SPA fallback and security headers (`public/_headers`).

The server-side compose file and secrets are kept outside this repository.

## Main Choices and Why

### Backend

- **One feature per module**, each with its own controller, service, DTOs and interfaces, under `common/` (config, decorators, filters, guards, responses), `infra/data/` (the in-memory data source) and `utils/`.
- **Global JWT guard.** The guard is registered with `APP_GUARD` and routes opt out with `@Public()`. Only `POST /auth/login` (and the `/health` probe) opt out, so a new endpoint cannot ship unprotected by mistake.
- **Sign out is client side.** The API is stateless, so signing out deletes the token on the device, but the JWT itself stays valid until it expires (`JWT_EXPIRES_IN`, 12 h by default). Short-lived access tokens with refresh tokens, or a token blocklist, would close that gap.
- **One response shape.** Success is `{ statusCode, message, data }`. A global exception filter turns every error, including validation errors and unknown routes, into `{ statusCode, error, message, details?, path, timestamp }`.
- **Rolling sums on the server.** A `DailySeries` keeps every day as integer tenths of an hour with prefix sums. Any window sum is O(1) and free of floating-point drift. The four limit cards and the chart both come from `GET /flight-hours/summary`.
- **Production hardening.** Helmet headers, CORS restricted by env, rate limits (10 login attempts per minute per client IP; `CF-Connecting-IP` is trusted only when `TRUST_CF_CONNECTING_IP=true` behind the tunnel, so the header cannot be spoofed to dodge the limit), and no fallback JWT secret.
- **"Today" is configuration** (`APP_TODAY`), never the clock. `GET /pilot/me` also returns it, so the frontend never reads the device date.

### Rolling-Sum Edge Cases

- **Days without hours** count as 0 and are never skipped.
- **A window that starts before the data** (before 27 Dec 2024) counts the missing days as 0. The point is flagged `isPartialWindow`.
- **Future dates.** The dataset already holds hours up to 31 May 2026, so dates after today are treated as planned hours. A future point is the projected rolling sum if the roster is flown, flagged `isFuture` and drawn dashed. This is what pushes the 1w series over the 40 h line on 18 to 21 May, and the app warns about it.
- **Values above the line.** Points above the limit are flagged and drawn red. `yAxisMax` is raised if a value ever goes past the brief's max, so the chart never clips.

### Frontend

- **SPA (`ssr: false`).** The app is behind a login, the data is per pilot, and nothing needs SEO. The same static build can be wrapped as an Android app with Capacitor. Nuxt is still used for file routing, layouts, route middleware, plugins, `runtimeConfig`, `useAsyncData` and `error.vue`.
- **Colocated page code.** Each page keeps its own `_components`, `_containers` and `_composables` next to it. Shared UI lives in `components/`.
- **Android app from the same code.** Capacitor wraps the static build into an APK (`pnpm android`). Native concerns (token storage, back button, status bar, safe areas) live in a small platform layer, and the screens are the same as on the web.
- **No mock data in the client.** Badge states, limit status, chart bounds, duty colours and the legend all come from the API.
- **Every endpoint has a screen.** Logbook lists the daily hours of a month from `GET /flight-hours?from&to`, with flown and planned days apart. More shows the profile, a document overview and the configured operational date.
- **Styles.** Each component uses scoped SCSS with short class names under one root class (`.home-header .slides`). States and variants are `is-*` classes (`is-active`, `is-success`). Colours, spacing and radii come from SCSS tokens, never hardcoded values.

### Code Style

- One Prettier config for both apps (single quotes, semicolons, 100 columns), checked on every commit by the git hooks.
- No comments in the source. Names carry the meaning, and the reasoning lives in these READMEs.
- Validation rules are reusable decorators (`IsStringDefined`, `IsIsoDateDefined`, `IsIntDefined`, `IsEnumOptional`), so a DTO reads as a list of rules.

### Data Quirks, Handled Explicitly

- `mock-flight-hours.json` gives `pilot.totalFlightHours` as 1444.5. That is the sum of every day in the file, up to 31 May, so it includes 59.1 h that are only planned after today. `GET /pilot/me` returns the hours flown up to today instead (1385.4), computed from the same daily series as the limit cards. The remaining 59.1 h come back as `plannedFlightHours` (with `plannedUntil`), shown under the total in the Home header and on the More page, so flown plus planned adds up to the seed total.
- `mock-documents.json` says `today` is 2026-05-31. It is ignored in favour of the single configured today (15 May).
- The brief writes the duty codes as `DUTY`, `RL`, `TR`, `TX`, `UL`. The data uses `DTY`, `RLV`, `TRD`, `TRX`, `ULV`. The app shows whatever the API legend returns.
- The data has no avatar, so the API serves one from `/static/avatar.jpeg`.
- The schedule and flight-hours files do not line up day by day. For example, 16 May has 6.2 h but no duty, 4 May has 4.0 h on requested leave, and 22 May has a duty but 0 h. The seed files are loaded exactly as provided. The duty detail page shows both values as the API returns them and does not try to reconcile them.
- The schedule entry for 4 June is `TRX` (Training) but carries the Travel Day colour `#FBA577`. The calendar fills each day with the entry's own `base_color`, as the brief asks, so that day shows the Travel Day colour while the legend keeps the Training colour.
- The schedules run to 29 June, but the flight-hours file ends on 31 May. `GET /flight-hours` still returns every requested day, with 0 h after the last date, so the June logbook and duty details show no hours instead of an error.

## Commit Message Convention

Every commit is checked by commitlint in the `commit-msg` hook.

### Format

`<type>(optional scope): <gitmoji> <description>`</br>
Example: `feat(backend): :sparkles: return planned flight hours on the pilot profile`

### 1. Type

- feat → A new feature or screen
- fix → A bug fix, stating the bug
- perf → A change that makes the app faster or lighter
- refactor → Same output, different approach
- style → Formatting or visual polish, no logic change
- docs → README and other documentation
- test → Adding or updating tests
- chore → Tooling, dependencies, config
- ci, build, revert → as in Conventional Commits

### 2. Optional Scope

`backend` for `/nest` and `frontend` for `/nuxt`. Leave it out when a commit touches both or neither.

### 3. Description

- Imperative, present tense: "add" not "added"
- Lowercase, no full stop at the end
- One change per commit

### Branches and Hooks

Work happens on a topic branch (`feat/...`, `fix/...`, `chore/...`, `docs/...`), merged into `main` with `--no-ff` so every topic stays visible in the history.

| Hook       | Runs                                                                           |
| ---------- | ------------------------------------------------------------------------------ |
| pre-commit | Prettier on the staged files of both apps, plus oxlint on staged `/nest` files |
| commit-msg | commitlint (Conventional Commits, scope `backend` or `frontend`)               |
| pre-push   | `/nest` typecheck and tests, then `/nuxt` typecheck                            |

The root `package.json` only holds this tooling, so the two apps stay independent.

## With More Time

- A dark theme. The brief defines one light palette, and the styles use SCSS variables at build time, so a dark theme would mean moving every colour to CSS custom properties and re-checking the duty colours, the chart and the photos on a dark surface.
- Short-lived access tokens with refresh tokens, so signing out revokes the session on the server, and a real user store instead of the single hardcoded account.
- Move the seed data into SQLite with Prisma, keeping the same services.
- A service worker so the installed web app opens offline with the last loaded data.
- Frontend tests: component tests for the calendar and chart, plus a Playwright smoke test against the deployed app.
- ESLint for the frontend (`@nuxt/eslint`). Today it relies on Prettier and `vue-tsc`.
- CI that runs the same checks as the git hooks on every pull request.
- Android: encrypted token storage (Keystore-backed) instead of Preferences, a signed release build, and offline caching of the last fetched schedule. Also set up iOS.
- Hybrid rendering: SSR for the web, SPA for the app shell.
- The schedule detail screen, and logging flights from the Logbook instead of only reading them.
