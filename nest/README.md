# Flight Duty API (`/nest`)

NestJS 12 REST API for the Flight Duty app. Data is seeded in memory from the three provided JSON files when the service boots. There is no database.

## Getting Started

### Prerequisites

Node 22+ and pnpm. Docker only if you want to build the production image.

### Installation

1. Install dependencies

```bash
pnpm install
```

2. Copy `.env.example` to `.env` and set `JWT_SECRET`

```bash
cp .env.example .env
node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
```

3. Start the program

```bash
pnpm start:dev
```

The API runs on http://localhost:4000, with Swagger at http://localhost:4000/docs.

### Environment Variables

| Variable                 | Required | Default                  | Notes                                                                                                                                                                                |
| ------------------------ | -------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `JWT_SECRET`             | yes      | none                     | At least 32 characters. The app refuses to boot without it                                                                                                                           |
| `JWT_EXPIRES_IN`         | no       | `12h`                    | A number with `s`, `m`, `h` or `d`. Anything else stops the app at boot                                                                                                              |
| `PORT`                   | no       | `4000`                   |                                                                                                                                                                                      |
| `HOST`                   | no       | `0.0.0.0`                | Interface to bind                                                                                                                                                                    |
| `BASE_URL`               | no       | `http://localhost:$PORT` | Public URL, used for the avatar URL                                                                                                                                                  |
| `APP_TODAY`              | no       | `2026-05-15`             | Business "today". Never taken from the clock                                                                                                                                         |
| `TRUST_CF_CONNECTING_IP` | no       | `false`                  | Set to `true` only behind Cloudflare. The rate limit then keys on the `CF-Connecting-IP` header; otherwise it uses the connection's IP, because anyone can send that header directly |
| `CORS_ORIGIN`            | no       | `*`                      | Comma-separated list. Add `https://localhost,capacitor://localhost` for the Android app                                                                                              |

### Scripts

| Script                           | What it does                                                                    |
| -------------------------------- | ------------------------------------------------------------------------------- |
| `pnpm start:dev`                 | Watch mode                                                                      |
| `pnpm build` / `pnpm start:prod` | Compile to `dist/` and run it                                                   |
| `pnpm test`                      | Unit tests (rolling sum, limits, document status, date utils, Swagger examples) |
| `pnpm test:e2e`                  | HTTP tests against the full app (auth, guard, validation, error shape)          |
| `pnpm lint` / `pnpm typecheck`   | oxlint / tsc                                                                    |
| `pnpm format`                    | Prettier on `src/` and `test/`                                                  |
| `docker build -t susi-air-api .` | Production image: multi-stage, runs as non-root, healthcheck on `/health`       |

## Endpoints

Every endpoint except `POST /auth/login` (and the `GET /health` probe) needs `Authorization: Bearer <token>`.

| Method | Path                                             | Notes                                                                                                                                         |
| ------ | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/auth/login`                                    | `{ username, password }`. Account: `johndoe` / `susiairtest`                                                                                  |
| GET    | `/pilot/me`                                      | Name, flight hours flown up to `today`, planned hours after it (`plannedFlightHours`, `plannedUntil`), avatar URL, and the configured `today` |
| GET    | `/flight-hours?from=YYYY-MM-DD&to=YYYY-MM-DD`    | Every day in the range, at most 366 days                                                                                                      |
| GET    | `/flight-hours/summary?range=1w\|1m\|3m\|6m\|1y` | Limit cards and the rolling-sum chart. Default `1w`                                                                                           |
| GET    | `/documents`                                     | Documents with `daysRemaining` and `status` (`safe` / `soon` / `expired`)                                                                     |
| GET    | `/schedules?year=YYYY&month=MM`                  | One month of duties plus the legend                                                                                                           |

Success responses are `{ statusCode, message, data }`. Errors are always `{ statusCode, error, message, details?, path, timestamp }`. A global exception filter builds them.

## Project Structure

```
src/
├─ main.ts, app.module.ts, app.setup.ts   # app.setup is shared by main.ts and the e2e tests
├─ common/          # config, decorators, filters, guards, responses (barrel: @common)
├─ infra/data/      # in-memory data source + seed JSON (barrel: @infra)
├─ utils/           # date math, DailySeries (barrel: @utils)
├─ auth/  pilot/  flight-hours/  documents/  schedules/
│   └─ <name>.module|controller|service(.spec)|examples.ts, dto/, interface/
test/               # e2e (app.e2e-spec.ts) and the Swagger example check
```

Imports only point one way: features use `@common`, `@infra` and `@utils`; `@infra` and `@common` use `@utils`; `@utils` imports nothing. Features never import each other.

### Creating a Module

1. Generate the module, controller and service

```bash
pnpm exec nest g module <name> --no-spec
pnpm exec nest g controller <name> --no-spec
pnpm exec nest g service <name> --no-spec
```

The CLI registers the module in `app.module.ts`. The project is ESM, so change the generated relative imports to end in `.js`. Tests are Vitest, so write `<name>.service.spec.ts` by hand instead of using the generated Jest spec.

2. Add `dto/` (one class per query or body, using the decorators from `@common`) and `interface/` (the response types), each with an `index.ts` barrel.

3. Inject `DataService` from `@infra` and the config you need (`@Inject(appConfig.KEY)`). `DataModule` is global, so the module does not import it.

4. Return `new SuccessResponse(...)` from the controller and document it with `@ApiSuccess` and `@ApiFailures`, using an example from `<name>.examples.ts`.

5. The route is protected by default. Mark it `@Public()` only if it must work without a token.

## Main Choices and Why

- **Hardening.** Helmet headers. CORS from `CORS_ORIGIN`. A global rate limit of 120 requests per minute, and 10 per minute on `POST /auth/login`, keyed by the client IP. Behind Cloudflare (`TRUST_CF_CONNECTING_IP=true`) that is `CF-Connecting-IP`; without it the header is ignored, so a caller cannot dodge the limit by sending a fake one. A 429 uses the same error shape.
- **Global guard.** `JwtGuard` is registered as `APP_GUARD`, so every route is protected unless it is marked `@Public()`. A new endpoint cannot ship unprotected by mistake.
- **Typed config through DI.** Each config group is a `registerAs` factory injected with `@Inject(appConfig.KEY)`, so services never read `process.env`. The env is validated once at boot.
- **Rolling sum.** `DailySeries` keeps a continuous day-by-day series as integer tenths of an hour with prefix sums. Any window sum is O(1) and free of floating-point drift. Missing days count as 0 and are never skipped.
- **Dates in UTC.** Dates travel as `YYYY-MM-DD` strings and are parsed at UTC midnight, so the server's time zone cannot move a day.
- **Window before the data starts** (before 2024-12-27). The missing days count as 0, and the point is flagged `isPartialWindow`.
- **Dates after today.** The dataset already has hours up to 2026-05-31. These are treated as planned hours, so a future point is the projected rolling sum if the roster is flown, flagged `isFuture`. This is what makes the 1w series cross the 40 h line on 18 to 21 May. Days beyond the data count as 0 and are flagged `isPartialWindow`.
- **Values above the chart max.** `chart.yAxisMax` is `max(brief max, highest value)`, so the chart never clips. `isOverLimit` marks points above the red line.
- **Limit card status.** `safe` below 80% of the limit, `warning` from 80%, `exceeded` above 100%.
- **One "today".** `mock-documents.json` says `today: 2026-05-31`. It is ignored, and every module uses `APP_TODAY` (2026-05-15, as the brief says).
- **Duty codes.** The data uses `DTY`, `RLV`, `TRD`, `TRX`, `ULV` where the brief writes `DUTY`, `RL`, `TR`, `TX`, `UL`. The API returns the codes and the legend exactly as in the data.
- **Swagger with examples.** Every endpoint in `/docs` shows a success example and its error examples (400, 401, 429) in the shared response shapes. A unit test (`test/swagger-examples.spec.ts`) checks that the examples still match what the services return.
- **Seed checks at boot.** Besides the dates, the API checks that every limit and every chart range in the seed is a positive number, and that hours and duty counts are not negative. A broken seed stops the app with a message that names the file and the field, instead of failing later on a request.
- **Total and planned hours.** The seed says `totalFlightHours: 1444.5`, which is every day in the file up to 31 May. `/pilot/me` returns 1385.4 flown up to `today` and 59.1 planned after it, both from the same daily series, so the two add up to the seed value.
- **Validation decorators.** Rules that repeat are combined into decorators in `common/decorators/` (`IsStringDefined`, `IsIsoDateDefined`, `IsIntDefined`, `IsEnumOptional`), so a DTO is one line per field and every error message has the same wording.
- **Avatar.** The data has no avatar, so `/static/avatar.jpeg` (160 px, 9 KB) is served from `public/`.

## With More Time

- Move the seed into SQLite with Prisma behind the same `DataService`, so the services do not change.
- Refresh tokens and a token blocklist, so signing out ends the session on the server.
- A real user store instead of the single account in `common/config/auth.config.ts`.
