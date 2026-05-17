# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sugidama is a personal development project built with React Router v7, featuring server-side rendering (SSR), internationalization (i18n), and component-driven development with Storybook. The project uses Vanilla Extract for CSS-in-JS styling. The backend API is powered by Kuroco CMS.

## Common Commands

### Development
```bash
npm run dev                      # Start Vite dev server with HMR (http://localhost:5173)
npm run build                    # Build for production (build/client + build/server)
npm start                        # Preview the worker locally (uses .env.development.local for SITE_URL etc.)
```

### Deployment (Cloudflare Workers)
```bash
npm run build-development        # Build for the development Worker (CLOUDFLARE_ENV=development)
npm run build-production         # Build for the production Worker (CLOUDFLARE_ENV=production)
npm run deploy-development       # Build and deploy to dev-sugidama (Workers env: development)
npm run deploy-production        # Build and deploy to sugidama (Workers env: production)
```

> When adding either a new Cloudflare binding to `wrangler.jsonc` (KV namespaces, R2 buckets, etc.) **or** a new Worker secret via `wrangler secret put`, also extend the `WorkerEnv` type in `workers/handler.ts`. The type is hand-maintained — there is no auto-generation step that would catch drift at typecheck time.

### Code Quality
```bash
npm run typecheck                # Run TypeScript type checking (generates types first)
npm run lint                     # Check for linting errors (max 0 warnings)
npm run lint-fix                 # Fix linting errors automatically
npm run format                   # Check code formatting
npm run format-fix               # Fix code formatting automatically
npm run pre-commit               # Run all checks and fixes (typecheck + lint-fix + format-fix)
```

### Testing & Development Tools
```bash
npm test                         # Run Vitest tests (watch mode)
npm test -- --run                # Run tests once without watch
npm test -- path/to/file.test.ts # Run specific test file
npm test -- -t "test name"       # Run tests matching pattern
npm run storybook                # Start Storybook on port 6006
```

### Type Generation
```bash
npm run react-router-typegen            # Generate React Router type definitions
npm run react-router-typegen-watch      # Watch mode for type generation
```

### Package Management
```bash
npm run upgrade-check            # Check for package updates
npm run upgrade                  # Update packages (run `npm install` after)
```

## Architecture

### Internationalization (i18n)

The project supports English (`en`) and Japanese (`ja`) with Japanese as the default language.

- **Configuration**: `app/i18n.ts` (client) and `app/i18next.server.ts` (server)
- **Translation files**: `app/locales/{lang}/common.json`
- **Language detection**: Based on URL path parameters (`($lang)` in routes)
- **Special handling**: Japanese URLs omit the `/ja` prefix (e.g., `/` instead of `/ja/`)
- **Utility**: `app/utils/locale.ts` provides `getLang()` helper for route loaders

### Routing Structure

Uses React Router v7 with file-based routing via `@react-router/fs-routes`:

- **Routes configuration**: `app/routes.ts` uses `flatRoutes()`
- **Route naming convention**: Files like `($lang)._public._layout._index/route.tsx`
  - `($lang)` = optional language parameter
  - `_public` = public route group
  - `_layout` = layout wrapper
  - `_index` = index route
- **SSR**: Enabled in `react-router.config.ts` (`ssr: true`)
- **Future flags**: `v8_middleware: true` is enabled for React Router v8 middleware support

### Server-Side

- **CSP**: Content Security Policy configured in `app/server/csp.server.ts`
- **CSRF**: CSRF protection in `app/server/csrf.server.ts`
- **API layer**: Server-side API calls in `app/server/api/`
- **Worker entry**: `workers/app.ts` (Cloudflare Workers fetch handler) — instantiates the React Router request handler and delegates to `createHandleWorkerRequest` in `workers/handler.ts`, which wires the project's env to `createWorkerFetch` from `@inumberx/cloudflare-workers-basic-auth`. Runs Basic-auth gating, then forwards GET/HEAD to the static-asset binding before falling back to SSR.
- **Basic auth**: opt-in via the `BASIC_AUTH_USER` / `BASIC_AUTH_PASS` Workers Secrets. Both must be set or both must be unset; partial configuration causes the worker to fail closed (`503`).

### Component Organization

Components follow a three-tier hierarchy:

1. **Primitives** (`app/components/primitives/`): Base components with minimal logic (e.g., `PrimitiveButton`)
2. **UI Components** (`app/components/ui/`): Reusable UI elements including layouts, icons, buttons
3. **Common Components** (`app/components/common/`): Application-specific components (e.g., `LayoutHeader`, `LayoutFooter`, `LayoutPortal`)

Each component typically has:
- `index.tsx` - Component implementation
- `style.css.ts` - Vanilla Extract styles (where applicable)

### Styling with Vanilla Extract

- **Global variables**: `app/styles/variables/cssVariables.css.ts` defines theme tokens (colors, fonts, spacing, z-index)
- **Mixins**: `app/styles/mixins/` contains reusable style functions (color, font, mediaQuery, size, transition)
- **Breakpoints**: `app/styles/variables/breakpoints.css.ts`
- **Layers**: `app/styles/variables/layers.css.ts` for CSS cascade layers
- **Convention**: Co-locate styles as `style.css.ts` alongside components

### Entry Points

- **Client**: `app/entry.client.tsx` - Hydrates the React app
- **Server**: `app/entry.server.tsx` - SSR with i18n support, bot detection via `isbot`
- **Root**: `app/root.tsx` - App shell with providers, Google Analytics integration, meta tags

### Configuration Files

- **TypeScript**: Uses path aliases `~/*` for `./app/*`
- **Vite**:
  - Main config: `vite.config.ts` with React Router, Vanilla Extract, and cache busting
  - Environment variables injected via `define` (SITE_URL, SITE_NAME, GOOGLE_ANALYTICS_ID, API_URL, etc.)
- **Vitest**: Configured in `vitest.config.ts` with jsdom environment, `setup-test-env.ts` for test setup
- **Storybook**: Uses separate Vite config (`vite-storybook.config.ts`) with stories in `**/*.stories.@(ts|tsx)`

### Environment Variables

Key environment variables (defined in `vite.config.ts`):
- `NO_INDEX` - Controls indexing
- `SITE_URL` - Site URL (default: `http://localhost:5173`)
- `SITE_NAME` - Site name (default: `Sugidama(development)`)
- `GOOGLE_ANALYTICS_ID` - GA tracking ID (default: `G-P7SXGX2CCT`)
- `API_URL` - Kuroco CMS API endpoint (default: `https://afterworks.g.kuroco.app/rcms-api/7`)

Accessed in app via `app/config/env.ts` and Vite's `import.meta.env.VITE_*` pattern.

### Deployment

Deployed on **Cloudflare Workers** with the static-asset binding for `build/client`. Configuration lives in `wrangler.jsonc`, the Worker entry is `workers/app.ts`, and CI runs `.github/workflows/deploy.yml`:

- `develop` branch → `dev-sugidama` Worker (GitHub Actions environment: `development`)
- `main` branch → `sugidama` Worker (GitHub Actions environment: `production`)

`run_worker_first: true` is enabled on the assets binding so the Basic-auth gate in `workers/app.ts` covers all requests, including static assets. Environment-specific build values (`SITE_URL` etc.) are injected at build time via GitHub Environments; runtime secrets (`BASIC_AUTH_USER`/`PASS`) are stored as Cloudflare Workers secrets.

### Special Considerations

- **Node version**: Requires Node.js >=22.0.0 (Volta pinned to 22.20.0)
- **Git Worktree**: Special handling in `vite.config.ts` — skips warmup and relaxes strict FS mode when `GIT_WORKTREE` env var is set
- **Bot handling**: Server entry uses `isbot` to optimize rendering strategy (`onAllReady` vs `onShellReady`)
- **Google Analytics**: Conditionally loaded in `app/root.tsx` based on `GOOGLE_ANALYTICS_ID`, tracked via `app/utils/gtags.client.ts`
- **Linter**: Uses oxlint (Rust-based, config in `.oxlintrc.json`) instead of ESLint. `typescript/no-explicit-any` is enforced as error.
- **Formatter**: Uses oxfmt (Rust-based, config in `.oxfmtrc.json`) instead of Prettier. Print width is 120, single quotes, no semicolons.
- **Import ordering**: oxfmt enforces import ordering via `sortImports` with newlines between groups. Internal imports use the `~/` prefix (matching the TypeScript path alias). Group order: builtins/externals → parent/sibling/index → internals (`~/`) → unknown.
- **API types**: Generated using [quicktype](https://app.quicktype.io) from Kuroco CMS JSON responses, saved to `app/types/`
