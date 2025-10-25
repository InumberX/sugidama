# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sugidama is a personal development project built with React Router v7, featuring server-side rendering (SSR), internationalization (i18n), and component-driven development with Storybook. The project uses Vanilla Extract for CSS-in-JS styling.

## Common Commands

### Development
```bash
npm run dev                      # Start development server (http://localhost:5173)
npm run build                    # Build for production
npm start                        # Start production server
```

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
npm test                         # Run Vitest tests
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
  - HMR disabled by default (`hmr: false` in server config)
  - Environment variables injected via `define` (SITE_URL, SITE_NAME, GOOGLE_ANALYTICS_ID, etc.)
- **Vitest**: Configured in `vitest.config.ts` with jsdom environment, `setup-test-env.ts` for test setup
- **Storybook**: Uses separate Vite config (`vite-storybook.config.ts`) with stories in `**/*.stories.@(ts|tsx)`

### Environment Variables

Key environment variables (defined in `vite.config.ts`):
- `NO_INDEX` - Controls indexing
- `SITE_URL` - Site URL (default: `http://localhost:5173`)
- `SITE_NAME` - Site name (default: `Sugidama(development)`)
- `GOOGLE_ANALYTICS_ID` - GA tracking ID (default: `G-P7SXGX2CCT`)

Accessed in app via `app/config/env.ts` and Vite's `import.meta.env.VITE_*` pattern.

### Special Considerations

- **Node version**: Requires Node.js >=22.0.0 (Volta pinned to 22.20.0)
- **Git Worktree**: Special handling in `vite.config.ts` to skip warmup and relax strict FS mode
- **Bot handling**: Server entry uses `isbot` to optimize rendering strategy (`onAllReady` vs `onShellReady`)
- **Google Analytics**: Conditionally loaded in `app/root.tsx` based on `GOOGLE_ANALYTICS_ID`, tracked via `app/utils/gtags.client.ts`
