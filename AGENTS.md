# Remix 3 Agent Guide

Sugidama is a Remix 3 app on Cloudflare Workers, built from `inumberx/remix-template`. The migration from React Router is tracked in issue #115. Use these conventions when continuing to build it out.

## Commands

```sh
npm i
npm run dev        # wrangler dev on :8787
npm test
npm run typecheck
npm run bundle     # wrangler deploy --dry-run
```

## Building Features

Refer to ./.agents/skills/remix/SKILL.md for the Remix mental model and how to find guides and API READMEs through `node_modules/remix/INDEX.md`. Project-specific conventions are in `CLAUDE.md`.

## Layout

- `app/routes.ts` defines the shared route contract used for type-safe hrefs
- `app/router.ts` wires routes to route handlers and installs the standard Remix component renderer used by actions
- `app/env.ts` is the only module that reads `process.env`; everything else imports the resolved constants
- `app/actions/controller.tsx` owns the direct leaf route actions (`home`, `devUi`)
- `app/actions/<route-key>/controller.tsx` owns a nested route map
- `app/actions/<route-key>-page/<route-key>-page.tsx` renders one page; `document.tsx` and `meta.tsx` are the shared shell and metadata defaults
- `app/ui/` holds cross-route UI: `primitives/` (unstyled skeletons), `<category>/` (styled components), `styles/public/` (tokens and query constants), `types/`
- Root `public/` contains static files served unchanged by the Workers `ASSETS` binding, including the cascade layer order in `static/css/app.css`
- `workers/app.ts` is the Worker entry; `workers/handler.ts` adds Basic auth and static-file routing in front of `router.fetch`
- Browser modules are compiled ahead of time by `scripts/build-client.ts` into `public/client/` (git-ignored); `app/actions/public/entry.ts` is the runtime entry. There is no `app/assets.ts` (see CLAUDE.md, **Browser JavaScript**)

## Route Ownership

- Start from `app/routes.ts` and map each route to the narrowest owner on disk.
- Put top-level route actions in `app/actions/controller.tsx`.
- Add `app/actions/<route-key>/controller.tsx` for nested route maps that need their own actions or middleware.
- Keep route-owned page modules next to the route that owns them.
- Move shared UI to `app/ui/`, not `app/actions/`.

- A controller's `actions` object contains only direct leaf route keys; nested route maps get their own controller and an explicit `router.map(routes.<routeKey>, controller)` line.
- Name directories under `app/actions/` after route-map keys, not URL path segments.
- Controller middleware does not protect other controllers; add it to each controller that needs it.

## Placement Precedence

When code could live in more than one place:

1. Put it in the narrowest owner first; if it belongs to one route, keep it with that route.
2. Shared UI across route areas goes in `app/ui/`.
3. Request lifecycle setup (auth, sessions, uploads, database injection) goes in `app/middleware/`.
4. Schema, queries, persistence and startup data logic go in `app/data/`.
5. `app/utils/<topic>.ts` only as a last resort, for pure cross-layer helpers that import nothing from `app/actions/` or response/render APIs.

## Build-Out Notes

- Run the app with `wrangler dev`, never a Node server: Workers has no filesystem, so Node-only middleware must fail locally rather than in production.

- This starter intentionally begins small; add directories like `app/data/`, `app/middleware/` and `test/` only when you need them.
- Avoid generic dumping-ground directories: no `app/lib/`, no `app/components/` (that is `app/ui/`), no `app/controllers/` (that is `app/actions/`).
- Do not register app leaf routes directly in `app/router.ts`; they belong in a controller.
