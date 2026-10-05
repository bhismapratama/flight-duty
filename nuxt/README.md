# Flight Duty App (`/nuxt`)

Nuxt 3 client for the Flight Duty app: sign in, home (hours to limit and documents), and the monthly schedule. The same build ships as a web app and, through Capacitor, as an Android app. Every value on screen comes from the `/nest` API. The frontend holds no mock data.

## Getting Started

### Prerequisites

Node 22+, pnpm, and the API running (see `../nest`). Android Studio only for the APK.

### Installation

1. Install dependencies

```bash
pnpm install
```

2. Copy `.env.example` to `.env`

```bash
cp .env.example .env
```

3. Run the development server

```bash
pnpm dev
```

Open http://localhost:3000 and sign in with `johndoe` / `susiairtest`.

### Environment Variables

| Variable               | Default                 | Notes                                                                                |
| ---------------------- | ----------------------- | ------------------------------------------------------------------------------------ |
| `NUXT_PUBLIC_API_BASE` | `http://localhost:4000` | Base URL of the API, read at build time. For production, put it in `.env.production` |

### Scripts

| Script                              | What it does                                                                                                       |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `pnpm dev`                          | Dev server with HMR                                                                                                |
| `pnpm build` / `pnpm generate`      | Static SPA build into `.output/public`                                                                             |
| `pnpm preview`                      | Serve the built output                                                                                             |
| `pnpm typecheck`                    | `vue-tsc` through `nuxt typecheck`                                                                                 |
| `pnpm format` / `pnpm format:check` | Prettier, same config as `/nest`                                                                                   |
| `pnpm android`                      | Build the web app, sync it into `android/`, assemble a debug APK, and install it on a connected device or emulator |
| `pnpm android:apk`                  | Same, but stop after building `android/app/build/outputs/apk/debug/app-debug.apk`                                  |
| `pnpm android:live`                 | Install a build that loads from `pnpm dev:host`, so code changes show up on the phone immediately                  |
| `pnpm run deploy`                   | Build with `.env.production`, then `wrangler deploy` to Cloudflare Workers (`wrangler.jsonc`)                      |

## Project Structure

```
pages/
├─ index.vue                 # redirects to /home
├─ login/                    # index.vue + _components/ + _composables/
├─ home/                     # index.vue + _containers/ (sections) + _components/ + _composables/
├─ schedule/                 # index.vue, [date].vue (day summary + "coming soon" placeholder) + _containers/ + _components/ + _composables/
├─ logbook/                  # daily flight hours per month from GET /flight-hours
├─ more/                     # profile, document overview, account and app details, sign out
components/  ui/ layout/ feedback/     # shared, auto-imported without a prefix
layouts/     default.vue (bottom nav), auth.vue
middleware/  auth.global.ts            # route guard
plugins/     api.ts                    # $fetch with the Bearer token; a 401 signs out
stores/      auth.ts, pilot.ts         # Pinia
composables/ useApi, useResponseCache, useMonthQuery, useDocuments, useAutoSlides, useThemeColors
utils/       date, format, calendar, color, storage, api-error
types/       api.ts, entities/         # mirror of the API responses
constants/   routes, navigation, ranges, header-slides, login-slides
assets/scss/ abstracts (tokens, mixins), base (reset, theme)
```

Route-specific code sits next to its page in folders that start with `_`. A `pages:extend` hook in `nuxt.config.ts` removes those folders from the router, so they never become routes.

### Creating a Page

1. Create `pages/<name>/index.vue`. It uses the default layout with the bottom navigation, and the global auth middleware protects it. Add `definePageMeta({ layout: 'auth', public: true })` only for a page that works without signing in.

2. Put the data loading in `pages/<name>/_composables/use<Name>.ts`: `useAsyncData` around `useApi()`, wrapped in `useResponseCache()` when the response can be reused. Add the response type in `types/entities/`.

3. Split the page into sections in `_containers/` (they read the composable) and small pieces in `_components/` (props in, events out). Anything used by more than one page goes to `components/`.

4. Style with scoped SCSS: the root element carries the page or component name, inner elements use short names, and states are `is-*` classes. Use the tokens and mixins from `assets/scss/abstracts`, never a raw colour.

5. Add its path to `constants/routes.ts` and use `ROUTES` instead of a string. If the page belongs in the bottom navigation, also add it to `constants/navigation.ts`. Set `exitOnBack` or `darkHeader` in `definePageMeta` when the Android back button should close the app there, or when the header under the status bar is dark.

## Android (Capacitor)

Requires Android Studio. Its bundled JDK 21 is found automatically, and the SDK is read from `ANDROID_HOME`.

```bash
echo "NUXT_PUBLIC_API_BASE=https://api.bhismapratama.it.com" > .env.production
pnpm android        # or pnpm android:apk for the file only
```

Without `.env.production`, the APK calls `http://localhost:4000` and the script forwards that port over USB (`adb reverse`). That build is for local testing only: it is also the only one that allows HTTP calls.

- **One codebase.** Everything native sits behind a small layer:
  - `utils/platform.ts`
  - `utils/storage.ts`: Capacitor Preferences on the device, `localStorage` on the web.
  - `composables/useAndroidBackButton.ts`: back navigates, and exits on Home or Sign In.
  - `composables/useStatusBar.ts`: light or dark icons depending on the header under the status bar.
- **Edge to edge.** `SystemBars.insetsHandling: 'css'` exposes the insets. The SCSS `safe-inset()` reads `env(safe-area-inset-*)` and the injected `--safe-area-inset-*`, whichever is larger. On WebView versions before 140, Capacitor draws below the bars instead, and the window background is navy so the bar still matches the brand.
- **Security.** HTTP calls are allowed only in debug builds (`src/debug/AndroidManifest.xml`), and mixed content only for the local-API build. A release build talks to the HTTPS API only.
- **Icon and splash** are generated from `resources/` with `@capacitor/assets`.
- Only Android is set up. iOS needs macOS and Xcode.

## Main Choices and Why

- **SPA (`ssr: false`).** The app sits behind a login, the data is per pilot, and nothing needs SEO. The same static build is meant to be wrapped by Capacitor for Android. All the Nuxt conventions are still used: file routing, layouts, route middleware, plugins, `runtimeConfig`, `useAsyncData`, and `error.vue`.
- **State and data.** Pinia holds what several screens share and keep: the session (`auth`) and the pilot profile with `today` (`pilot`). Screen data is loaded with `useAsyncData` in composables next to each page, which already gives loading, error and refetch on parameter change.
- **Response cache.** `useResponseCache` keeps each response for the session, so going back to a screen or to a chart range shows it at once without a new request. The schedule is the exception: every month change still calls `/schedules`, as the brief asks, and a cached month is only shown while that call runs. Schedule and Logbook prefetch the previous and next month. Signing out clears the cache.
- **Network errors.** API calls time out after 15 s. A timeout or a lost connection shows "Cannot reach the server" with a Retry button instead of an endless skeleton; errors that come back from the API show the API's own message.
- **Token storage.** `utils/storage.ts` keeps the token in `localStorage` on the web and in Capacitor Preferences in the Android app. Callers only see `tokenStorage`.
- **One source of "today".** The UI never reads the device clock. It uses `today` from `GET /pilot/me` and from the API responses (2026-05-15).
- **Chart.** Chart.js through `vue-chartjs`. The red limit line is a second dataset. Points after today are dashed, because they are projections from planned hours. Points over the limit are red. Points whose window reaches outside the recorded data (`isPartialWindow`) are drawn hollow, marked "partial data" in the tooltip, and listed in the legend only when they appear. The Y axis uses the API's `yAxisMax`, so values above the brief's max never clip.
- **Calendar.** The cell colour comes from `base_color`, and the text colour is picked for contrast. A cell shows a tick when `count_logbooks === count_schedules`, otherwise the number of duties left. The month is kept in the URL (`?month=2026-05`), so the back button and reloads keep the view.
- **Icons.** Lucide through `@lucide/vue`, imported one by one so only the icons in use are bundled.
- **Accessibility.** The chart has a text summary for screen readers, badges carry text as well as colour, calendar days have full labels, and the range toggle works like a radio group: arrow keys, Home and End move the selection.
- **Installable.** A web app manifest and icons let the web app be added to the home screen with its own name, icon and navy splash. There is no service worker yet, so it still needs a connection.
- **Font.** Plus Jakarta Sans (a Google Font) is self-hosted through Fontsource, so the APK also has it offline.
- **Photos.** Susi Air fleet photos are resized to at most 1200 px and saved as WebP (28 to 97 KB each). The Sign In photo, the largest element on the first screen, is 69 KB. The Home header crossfades between five of them every 4.5 s, and the Sign In hero rotates three captioned slides every 5 s with the form always in view, so there is no separate onboarding step. Only the first photo is fetched on load, and each next one is decoded before it fades in. Both sliders pause while the tab is hidden and stay on the first photo when the system asks for reduced motion.
- **Styles.** Scoped SCSS per component. The root element carries the component name (`.limit-card`), inner elements use short names nested under it (`.title`, `.remaining`), and states or variants are `is-*` classes (`is-active`, `is-success`). Scoping keeps short names from leaking, so no BEM prefixes are needed. Tokens and mixins from `assets/scss/abstracts` are injected into every component, and no colour is hardcoded.
- **Planned hours.** The Home header shows the hours flown up to today and, under it, the hours planned until the end of the data ("+59.1 h planned to 31 May"). More lists both under Account. The line is hidden when nothing is planned.
- **Loading states.** Skeletons follow the shape of the content they replace (limit cards, chart bars, document rows, calendar tiles), and match their height, so the layout does not shift when data arrives (CLS 0 on Home).

## With More Time

- Component tests for the calendar and chart, and a Playwright smoke test against the deployed app.
- ESLint (`@nuxt/eslint`) next to Prettier and `vue-tsc`.
- A service worker so the installed app opens offline with the last loaded data.
- A dark theme, which means moving the SCSS colour variables to CSS custom properties.
- Encrypted token storage on Android and a signed release build. Also set up iOS.
