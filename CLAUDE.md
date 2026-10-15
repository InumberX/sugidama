# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Migration status

Sugidama is being migrated from React Router v8 to Remix 3 on the `feature/remix3` integration branch. The plan, branch rules and progress live in issue #115. Work happens on `feature/remix3-<task>` branches that merge into `feature/remix3`; only the finished migration goes to `develop` (which deploys to staging).

The React Router app no longer exists on this branch. When porting a page, read the original from `develop` (`git show origin/develop:app/routes/...`) rather than reconstructing it. The structure and conventions here follow [`inumberx/remix-template`](https://github.com/InumberX/remix-template); where this file and the template disagree, the difference is because this app runs on Cloudflare Workers.

## Read First

- `AGENTS.md` — layout and route-ownership conventions.
- `.agents/skills/remix/SKILL.md` — the Remix 3 mental model and how to find documentation. It is the file `remix new` generates for 3.0.0, kept verbatim so a later version can be diffed in; this project's own layout rules live in `AGENTS.md` and here, not in the skill.
- `node_modules/remix/INDEX.md` — the installed documentation index. Search it by task or export (`grep -i session node_modules/remix/INDEX.md`), read the matching guide under `node_modules/remix/guides/`, then the package README for exact APIs. The README directory is not always the subpath name (`remix/router` → `src/fetch-router/README.md`); the index maps them. Runtime adapters, including Workers, are in `guides/03-request-handling.md`.

## Commands

```sh
npm run dev                 # wrangler dev (workerd) on :8787 — the only way to run the app locally
npm test                    # remix test over the whole project (server runner, Node)
npm run typecheck           # tsc -b
npm run routes              # remix routes --table (inspect the route contract)
npm run bundle              # wrangler deploy --dry-run --env=production --outdir=tmp/worker
npm run doctor              # remix doctor
npm run lint                # oxlint, warnings are errors
npm run lint-fix
npm run format              # oxfmt --check
npm run format-fix
npm run stylelint           # stylelint over public/**/*.css
npm run stylelint-fix
npm run pre-commit          # typecheck -> format-fix -> lint-fix -> stylelint-fix
npm run deploy-development  # scripts/deploy.sh development (dev-sugidama)
npm run deploy-production   # scripts/deploy.sh production (sugidama)
```

Run a single test file or filter by name:

```sh
npm test -- app/actions/controller.test.tsx
npm test -- --only 'renders the home page'
```

**Run the app with `wrangler dev`, not Node.** It runs the same runtime as production (workerd), so a Node-only API (`node:fs`, `remix/middleware/static`, the asset server) fails locally instead of after a deploy. There is no `server.ts` and no `hmr.ts`: the template's Node server was deliberately dropped. Tests still run in Node through `remix test`; they drive `router.fetch` and `renderToString`, which are runtime-agnostic.

Local secrets and variables go in `.dev.vars` (see `.dev.vars.example`); `wrangler dev` exposes them through `process.env`, the same as `vars` and secrets on a deployed Worker. Every variable has a local default in `app/env.ts`, so `.dev.vars` is optional.

**Node version.** `.node-version` pins 24.16.0 (the same as `volta` in `package.json`) and `package.json` requires `>=24.3.0`, because `remix test` and the `remix` CLI load TypeScript through `module.registerHooks`. On an older runtime they fail with `does not provide an export named 'registerHooks'`. `oxlint`, `oxfmt`, `tsc` and `wrangler` work regardless.

**Write tests with `remix/test`, never `node:test`.** The `test` script is `NODE_ENV=test remix test` — the runner only *defaults* `NODE_ENV` (`??=`), so without the prefix a shell or image that exports `NODE_ENV=production` would run the suite as production — and it discovers `**/*.test.{ts,tsx}` for its server runner. Import `describe`/`it` from `remix/test` and pair them with `import * as assert from 'remix/assert'` (the namespace import is what carries `assert.match`; the *named* `assert` export is only the bare callable). Mocks come from the test context — `t.mock.fn()`, `t.mock.method(console, 'error', () => {})` — and are restored when the test ends (`workers/handler.test.ts` is the worked example).

A `node:test` suite is the trap in the other direction: `remix test` imports the file and `node:test` prints its failure, but the run still reports only the `remix/test` results and exits 0. `.oxlintrc.json` therefore bans `node:test` through `no-restricted-imports`. The test context has no `t.skip()`; skip conditionally with the `{ skip: <reason> }` option, as `app/env.test.ts` does.

## Routes and actions

`app/routes.ts` imports nothing from the app, so nothing can create a cycle back into the route contract. That matters: making `pages.ts`-style metadata the source of a pattern (`get(PAGES.home.getUrl())`) produced a circular type reference that silently degraded `routes` to `any` — `href({ typoParam: 1 })` and `routes.doesNotExist.href()` both stopped being errors while the app kept serving 200s.

- **Declare the method.** A bare string (`home: '/'`) is typed `Route<"ANY", "/">` and answers POST, PUT and DELETE alike; `get('/')` answers GET and 404s the rest. Use `get`/`post`/`form`/`resources`, never a bare pattern.
- **Keep patterns literal.** Remix derives `href()` arguments and `context.params` from the pattern's literal type. Any indirection that widens it to `string` silently removes that checking.
- **Nest route areas.** `articles: { index: get('/articles'), show: get('/articles/:id') }` gives the area its own controller and a place to hang middleware later. `router.map` wires only direct leaves, so each nested map needs an explicit `router.map(routes.articles, articlesController)`.

Naming under `app/actions/` — **a bare directory is a route area, a `-page` directory is a page**:

```
app/actions/
  controller.tsx              direct leaves of the root map: assets, home, devUi
  document.tsx                the shared document shell
  meta.tsx                    site-wide metadata defaults
  home-page/home-page.tsx     home
  dev-ui-page/dev-ui-page.tsx devUi
  articles/                   route area — has a controller, gets a router.map line
    controller.tsx            nested route map: index, show
    index-page/index-page.tsx articles.index
    show-page/show-page.tsx   articles.show
  public/                     browser-reachable source
```

Route-area directories are named after route-map *keys*, never URL path segments; page directories are that key plus `-page`. The suffix is what tells you, without opening the directory, whether something needs a `router.map` line. Inside a page directory the filenames repeat the directory name (`show-page/show-page.tsx`, plus `.types.ts` / `.styles.ts` / `.test.tsx` as needed), and its own sub-components go one level down in `components/<name>/<name>.tsx` — the same shape `app/ui/` uses, so one convention covers both trees. The extra level keeps the page's own files from mixing with its parts:

```
home-page/
  home-page.tsx
  components/main-visual/main-visual.tsx
  public/components/<name>/<name>.tsx     the hydrated ones
```

`public/` is a visibility boundary rather than a category (it only starts to matter once a client entry exists — see **Browser JavaScript**), so it wraps `components/` instead of replacing it. The template's `app/assets.ts` allows `app/**/public/**`, and the `**` matches at any depth — verified — so nesting inside it costs nothing and the sub-component shape stays the same on both sides of the boundary.

There is no file-system routing in Remix 3, so a Next-style `page.tsx` would carry no framework meaning and would need `routes.ts` kept in sync by hand anyway; naming after the action key ties the file to the unit the framework actually dispatches on, and keeps editor tabs distinguishable.

### Page metadata

`app/actions/meta.tsx` is generalview's `getMetadata` translated: React Router collects `MetaDescriptor[]` and renders them, Remix 3 has no meta API, so `renderMeta()` returns the tags and `Document` places them. A page passes overrides and the request URL:

```tsx
<Document url={url} meta={{ title: '記事一覧', description: '…', ogType: 'article' }} />
```

`url` comes from `context.url` in the action, because a component has no request of its own. `<title>` is rendered by `Document` from the shared `resolveTitle()` and is deliberately absent from `renderMeta()` — emitting it in both places would produce two `<title>` elements. Anything but production gets `noindex, nofollow`, and `NO_INDEX=true` forces it in production too.

Per-page titles stay a `PAGE_TITLE` constant in the page module. A central screen registry (generalview's `app/config/paths.ts`) is not worth its weight until spec screen ids need tracing — the earlier `app/pages.ts` experiment worked, but only one route ever reads a given title.

`/dev/ui` is a component gallery for development. The route is declared in every build so `typeof routes` stays stable, and the action returns 404 when `IS_PRODUCTION`. It renders every `app/ui/` variant through the real `context.render()` pipeline, so a specimen cannot diverge from what ships — which is why this exists instead of Storybook (no Remix 3 renderer exists, and a Vite builder would add a second, differently-resolving module graph).

## The `app/ui/` layout

Adapted from `auba-general-view`'s `app/components/` taxonomy. Two component tiers over a token layer:

```
app/ui/
  styles/public/                       design tokens, breakpoints, query constants (runtime values)
  types/                               DOM vocabulary shared across components (type-only)
  primitives/<category>/<component>/   unstyled skeletons
  <category>/<component>/              styled components built on them
```

`styles/` sits under `public/` because `css(...)` descriptors and tokens are runtime values that a hydrated component has to import; `types/` does not, because type imports are erased.

Each component directory splits four ways, e.g. `primitives/buttons/primitive-button/`:

| file | holds | may live outside `public/` when hydrated? |
| --- | --- | --- |
| `<name>.tsx` | the component | no |
| `<name>.types.ts` | types only | **yes** — erased from browser output |
| `<name>.styles.ts` | recipes / `css(...)` values | no |
| `<name>.test.tsx` | tests | n/a (`denyFiles` blocks `*.test.*`) |

Create a category directory when it gets its first member; do not pre-create empty ones. Never `index.tsx` — NodeNext has no directory resolution, so it buys nothing and every import still spells the file out.

### What separates the two tiers

`primitives/` owns element selection, accessibility attributes and the user-agent reset, and takes **no** design decisions — no colors, no type scale, no motion. `color` and `font` are set to `inherit`, never to a token. Verified consequence: the primitive's only runtime import is its own sibling `.styles.ts`, so the whole directory can move into a `public/` directory and hydrate on its own (HTTP 200) without dragging the token layer along.

`<category>/` owns the design decisions and passes them down. `buttons/base-button/` is the reference pair — it adds tone, padding, radius and motion, and forwards everything else to `primitives/buttons/primitive-button/`.

`layouts/` holds the structural wrappers ported from generalview — `layout-wrapper` (full-height column), `layout-main` (the `@container` container), `layout-page-wrapper` (header offset), `layout-inner` (centred, width-capped). Their measurements are `--layout-*` custom properties in `app.css` rather than TS values, so `util` can retune the grid. Each takes the same `styleOverrides` recipe as the button primitive, which is how `/dev/ui` shrinks a `100svb` wrapper to 160px for display.

### Rules that came from measurement, not taste

**Hydrated components need every *runtime* dependency inside `public/`** (applies once a client entry and its asset build exist). The template's `app/assets.ts` allows `app/**/public/**`; a value import that crosses out of it fails the browser build with `IMPORT_NOT_ALLOWED` / HTTP 500. Type-only imports are erased (`verbatimModuleSyntax`) and are exempt — a `clientEntry` importing a type from outside `public/` compiles to 200 and the specifier is absent from the output. This is why `.types.ts` is a `.ts` and not a `.tsx`: the extension is the reminder that nothing runtime may enter it.

**Override styles by spreading recipes into one `css(...)` call, never by stacking descriptors.** Each `css(...)` emits its own `@layer rmx.<hash>`, and those sublayers are ordered by *first render*, not by position in a `mix` array — rendering a descriptor earlier elsewhere on the page flips the precedence of a later `mix={[base, override]}`. So `PrimitiveButton` takes a `styleOverrides` recipe and merges reset + disabled + caller into a single `css(...)`; output is content-hashed and deduplicated, and JS spread order decides the winner. `mix` stays for behavior (`on('click', …)`) and for styling that touches no property the reset already set.

The spread is shallow, and that reaches the at-rule keys too: a modifier carrying `[MEDIA_QUERY.SM]` replaces the base's entire `[MEDIA_QUERY.SM]` object rather than merging into it, so it has to repeat every declaration of that block it still wants (`layout-page-wrapper.styles.ts` is the worked case).

For deliberate app-wide overrides use cascade layers instead — the documented mechanism (https://guides.remix.run/rendering-ui/). Every `css(...)` rule lands in the `rmx` layer (`REMIX_UI_STYLE_LAYER`), and `public/static/css/app.css` declares the order around it. See **Global CSS** below. What layers do *not* give is ordering *within* `rmx`: `@layer` names passed to `css(...)` nest inside the per-descriptor layer and are inert for cross-descriptor precedence, so generalview's `componentPage → … → componentUiPrimitive` hierarchy has no direct equivalent. Merge recipes for that.

**Style recipes live in `<name>.styles.ts` and are imported as a namespace.** Every `.styles.ts` in the app exports plain recipes, never `css(...)` descriptors — including the ones under `app/actions/`. A descriptor cannot be spread, so exporting one takes the override mechanism away from the call site and pushes it to an inline `style` attribute. Every component reads them the same way, so a call site says where a value came from without checking the import list:

```ts
import * as styles from './layout-inner.styles.ts'

css(styles.layoutInner)                                    // one recipe
css({ ...styles.layoutInner, ...styleOverrides })          // merged
```

Spread only when merging — a single recipe goes in directly. Names are BEM-shaped: `block`, `block_element`, `block__modifier` (`primitiveButton__disabled`, `section_title`). Note the separators are **not** BEM's: `_` marks an element and `__` a modifier, the opposite of BEM proper and of `after_works`' `Block__element` / `Block--modifier`. The reason is mechanical — these are JavaScript identifiers, and `-` cannot appear in one, so `--` was unavailable and the two remaining separators were assigned shortest-to-longest. No `style` prefix — the namespace already supplies it, and `styles.styleLayoutInner` stutters. The block name stays even though a `.styles.ts` belongs to one component, because it keeps the constants greppable and survives being moved. A variant record such as `layoutInnerSizes` holds the modifier constants rather than inlining them, so each variant still has a name of its own.

**A `.styles.ts` may declare more than one block.** BEM elements do not nest, so a sub-tree that needs its own element names gets its own block prefix rather than a compound element name. `main-visual.styles.ts` in `remix-template` is the worked example:

```ts
mainVisual            mainVisual_container    // the outer div
mainVisualTitle       mainVisualTitle_image   // the <h1> and its image
```

Flattening this would force `mainVisual_titleImage` — an element of an element, which is what the convention exists to avoid. Three of those four recipes are deliberately empty: they are the template's slots, already named and already wired to their element, so a project filling them in does not have to invent a name and a `css(...)` call at the same time. (The image sits directly in the `<h1>`: `h1` takes phrasing content, and a `figure` is flow content.)

**Extraction is decided by reuse and props, not by naming.** The gallery's `Section`, `Specimen`, `Stage` and `Block` moved into `components/<name>/` because each takes props and is rendered many times; a pseudo-block like `mainVisualTitle` stays inline because it is neither.

The caller-facing prop is `styleOverrides`, not `styles`: the namespace import owns `styles` inside every component file, and two bindings with that name in one module is a shadowing bug waiting to happen.

**Media and container queries are constants, not functions.** A `css(...)` computed key needs a *literal* type. A helper returning `string` makes TypeScript infer a string index signature for the object literal, which clashes with the numeric index signature `CSSProps` inherits from `CSSStyleDeclaration` (`'string' and 'number' index signatures are incompatible`) — `as`, `satisfies` and an annotation all fail. So `media-query.ts` exports `MEDIA_QUERY.MD`, `CONTAINER_QUERY_BETWEEN.SM_LG` and friends, every value built from a `BREAKPOINTS` literal inside `as const`:

```ts
css({ color: 'red', [MEDIA_QUERY.MD]: { color: 'blue' } })
```

Most of `media-query.ts` has no caller yet. It is the query vocabulary a project writes against, kept complete so a breakpoint is never spelled out inline — not dead code to prune. Note also that `CONTAINER_QUERY.*` carries no container name and so resolves to the nearest ancestor with `container-type`; targeting `layout-main` specifically needs the named form written out by hand.

Upper bounds are written as exclusive (`width < ${BREAKPOINTS.md}px`), which Media Queries Level 4 range syntax gives directly — the same syntax the lower bounds already use. Two reasons, and the second is why there is no `BREAKPOINTS_MAX` companion object: `<= 767px` next to `>= 768px` leaves a fractional viewport width (browser zoom, some high-DPI devices) matching neither; and expressing it would need the `- 1` values written out by hand, because TypeScript has no type-level arithmetic and `${BREAKPOINTS.md - 1}` degrades the string to a `${number}` pattern, breaking the computed key again.

**Example code is prefixed and lives with whatever shows it.** `app/ui/` is production UI that more than one route needs, so a component named to say "do not use me" does not belong in it. Reference material is prefixed `Example` and owned by whatever displays it. `remix-template`'s `ExampleCopyButton` (its one worked `clientEntry`) was not ported, because nothing here hydrates yet.

**Route-owned UI never goes here.** generalview's `components/pages/*` and `components/features/*` map onto `app/actions/<route-key>/`, next to the controller that owns them. `app/ui/` is only for UI that more than one route area needs.

**Derive DOM types where Remix pins them, hand-declare only deliberate narrowings.** `remix/component` does not re-export its internal DOM types (`AriaRole`, `HTMLAttributeAnchorTarget`), so the JSX namespace is the supported seam: `NonNullable<JSX.IntrinsicElements['button']['type']>` is a real union and rejects `'nope'`, while `<a target>` and `<a rel>` stay open to arbitrary strings and must be narrowed by hand in `app/ui/types/dom.ts`. Note also that Remix constrains `role` per element following ARIA-in-HTML, unlike React's uniformly wide `AriaRole` — a component that renders several element types can only accept the intersection (see `PrimitiveButtonRole`).

Nothing in `app/ui/styles/` may import a component.

## Tests

Co-locate tests beside what they test, one per component directory — `app/actions/controller.test.tsx`, `app/ui/**/<name>/<name>.test.tsx`, `app/env.test.ts`, `app/middleware/*.test.ts(x)` (`with-headers.ts` is the shared header helper), `workers/handler.test.ts`, `workers/wrangler.test.ts` (for the root `wrangler.jsonc`). The CLI discovers by filename pattern rather than location. Root `test/` is reserved for shared helpers, fixtures, and integration/E2E coverage, and does not exist yet.

Drive route behavior with `router.fetch(new Request(...))` and assert on the `Response`; use `renderToString` for component specimens. See the note in **Commands** about `remix/test` vs `node:test`.

## Global CSS

```
public/
  favicon.ico, apple-icon.png
  assets/img/         images, served as-is
  static/
    css/app.css       cascade layer order, reset, tokens
```

`public/static/css/app.css` owns the layer order:

```css
@layer reset, lib, base, rmx, util;
```

Weakest to strongest: `reset` (user-agent normalization), `lib` (third-party sheets, pulled in with `@import url('…') layer(lib)`), `base` (app defaults and `:root` tokens), `rmx` (everything `css(...)` generates), `util` (utility classes — the only layer that outranks component styles).

Three things this file has to get right, each learned the hard way:

- **Every layer must be named in that statement.** A layer that is not pre-declared takes its position from first appearance, which puts it *last*. A `@layer reset { … }` block written without listing `reset` made the reset outrank every component rule.
- **Custom properties must sit inside a layer.** Declarations outside any `@layer` belong to an implicit final layer that beats all named ones, so an unlayered `:root { --x }` could never be overridden from `util`.
- **It has to be served verbatim, so it lives in root `public/`.** The asset server's CSS compiler rewrites `@layer` statements; the Workers `ASSETS` binding serves the file byte for byte. The `<link>` also has to be parsed before any `css(...)` rule — Remix appends its `<style data-rmx-style>` tags at the *end* of `<head>`, so a link written in `document.tsx` always wins that race.

The link carries `?${CACHE_BUSTER}` (`app/env.ts`, from `BUILD_ID`) because root `public/` URLs never change on their own — see **Caching** below.

There is no PostCSS here. `@mixin`, `@custom-media` and `@media (--name)` are PostCSS syntax: they survive into the served file and are then dropped or never match, silently. `getClampRem`/`getFontSize` values have to be written out as plain `clamp()` / `rem`.

## Cloudflare Workers

`wrangler.jsonc` points `main` at `workers/app.ts`, which wraps `router.fetch` in `withErrorResponse` (log, then a generic 500 — what the Node starter's `createRequestListener` did by default) and hands it to `createHandleWorkerRequest`; both live in `workers/handler.ts`, so `workers/handler.test.ts` covers them without loading the router. The catch only sees errors thrown before a response exists: `context.render` streams, so a component that throws mid-render has already sent its 200, and the renderer logs it (`console.error` by default) while the browser gets truncated HTML. `createHandleWorkerRequest` wires `@inumberx/cloudflare-workers-basic-auth`'s `createWorkerFetch`:

1. **Basic auth.** Opt-in through the `BASIC_AUTH_USER` / `BASIC_AUTH_PASS` secrets. Both set or both unset; one without the other fails closed with `503`.
2. **Static files.** GET/HEAD go to the `ASSETS` binding first, which serves root `public/` as-is; a `404` from it falls through to the router. `run_worker_first: true` is what puts static files behind the Basic-auth gate too.
3. **The app.** Everything else reaches `router.fetch`.

`WorkerEnv` in `workers/handler.ts` is hand-maintained and lists what the Worker reads from its `env` argument — today the Basic-auth secrets and `ASSETS`. When you add a binding read that way (a KV namespace, an R2 bucket, a secret the wrapper uses), extend it; nothing regenerates it. Plain `vars` are not listed: the app reads them through `process.env` in `app/env.ts`, which is their single typed home.

What does **not** work on Workers, and is therefore absent from `app/router.ts` even though the template uses it:

- `remix/middleware/static` (`staticFiles`) and the compression middleware — Node filesystem and zlib APIs. The platform serves and compresses static files instead (`guides/03-request-handling.md` says the same).
- `remix/assets` (`createAssetServer`) — compiles browser modules per request with native `oxc-*` / `lightningcss` binaries and reads the filesystem. See **Browser JavaScript**.

**`NODE_ENV` is fixed at bundle time.** Wrangler's esbuild replaces `process.env.NODE_ENV`. Each deploy environment in `wrangler.jsonc` pins it to `"production"` through `define` (so both `dev-sugidama` and `sugidama` are `IS_PRODUCTION`); without that, wrangler would take the deploying shell's `NODE_ENV` first and only then default to `"production"`, so a leftover `NODE_ENV=development` would ship `/dev/ui` to the live site. `define` is not inherited by environments, so a new one must repeat it. The top level has no `define`, so `wrangler dev` keeps wrangler's `"development"`. Staging is kept out of search engines by `NO_INDEX=true`, not by `NODE_ENV`. Every other variable in `app/env.ts` is read from `process.env` at module load, which `nodejs_compat` fills from `vars`, secrets and `.dev.vars`.

**Per-environment values live in `wrangler.jsonc`.** Each of `env.development` and `env.production` lists `SITE_URL`, `NO_INDEX`, `SITE_NAME`, `API_URL` and `GOOGLE_ANALYTICS_ID` under `vars` — in full, because `vars` is not inherited either. They are not build-time values any more (React Router baked them in through Vite's `define`; there is no build now), and keeping them in the repo means a deploy from a laptop and one from CI produce the same Worker. GitHub Environment variables are no longer read. `workers/wrangler.test.ts` reads the file through wrangler's own parser and fails if an environment is missing `define` or a variable, or still holds a `__SET_ME__` placeholder. When `app/env.ts` gains a variable, add it to both environments and to `.dev.vars.example`; the test takes its list from `app/env.ts`'s own `process.env.*` reads, so a forgotten environment fails it.

The top level of `wrangler.jsonc` is named `sugidama-local`, not after a deployed Worker. It is what `wrangler dev` runs and carries no `vars` or `define`, so a bare `wrangler deploy` (no `--env`) must not land on `sugidama` or `dev-sugidama`; the test pins that too.

**`vars` are public; secrets never go there.** This repository is public, and `vars` are also shown in plain text on the Cloudflare dashboard. Only values that a visitor can already see may go in `wrangler.jsonc`, and every current one qualifies: `SITE_URL`, `SITE_NAME` and `NO_INDEX` are in each page's HTML, `GOOGLE_ANALYTICS_ID` is in the analytics tag, and `API_URL` was already published in the CSP `connect-src` header. React Router baked the same values into its client bundle, so nothing became more exposed. Anything that must stay private — `BASIC_AUTH_USER` / `BASIC_AUTH_PASS` today, a Kuroco API key if one is ever needed — is a Worker secret (`wrangler secret put <NAME> --env=<environment>`), listed in `WorkerEnv` and in `.dev.vars.example` for local use, never in `vars`. `workers/wrangler.test.ts` rejects a `vars` key containing a credential-like word (`KEY`, `TOKEN`, `SECRET`, `PASS`, `PASSWORD`, `CREDENTIAL`, `AUTH`, `PRIVATE`, as a whole `_`-separated word), as a backstop rather than a substitute for this rule.

Do not edit `vars` on the Cloudflare dashboard: `wrangler deploy` replaces them with what `wrangler.jsonc` says, so a dashboard change disappears on the next deploy. Changing a value is a commit and a deploy, which is also what React Router's build-time values required.

The two per-deploy values come from `scripts/deploy.sh` (behind `npm run deploy-*`) as `--var` flags rather than from the file. The script refuses to deploy from a tree with uncommitted or untracked files, or with ignored files under `public/` (wrangler uploads the whole assets directory, `.DS_Store` included), and stops if `git rev-parse` fails, because `BUILD_ID` must name exactly what ships. It is POSIX `sh`, like the `test` script — run it from macOS, Linux or WSL. The values: `BUILD_ID` (the commit sha, `git rev-parse HEAD`) and `DEPLOYED_AT` (UTC, ISO 8601), which replaces the Vite build time the sitemap used as `<lastmod>`. `DEPLOYED_AT` has no local default on purpose — in a Worker's global scope `new Date()` is the Unix epoch, measured.

## Security

`app/router.ts` runs `securityHeaders()`, `cop()`, `renderWithCsp()` in that order; the order is commented there.

- **`app/middleware/security-headers.ts`** — `X-Content-Type-Options: nosniff` and `X-Frame-Options: DENY` on every router response (a header the response already sets is kept, as with the CSP), and `Strict-Transport-Security` only when `IS_PRODUCTION` (both deployed Workers; HSTS on `localhost` would pin every local port to HTTPS; tests pass `{ production }`). It runs first so `cop()`'s 403 gets the headers too, and it is the router's error boundary: a thrown error becomes a generic 500 *with* the headers, as develop's 500 had. Both it and `withErrorResponse` (failures outside the router) answer through `internalServerError()` in `app/middleware/internal-server-error.ts`. Any response that reaches it without a CSP of its own — the 403, the 500, a plain-text 404, a redirect — gets `FALLBACK_CSP` (`default-src 'none'; frame-ancestors 'none'`). Static files from `ASSETS` never reach the router and get none of this.
- **`app/middleware/csp.tsx`** — a Content-Security-Policy with a fresh nonce per request: develop's directive list minus the unused `https://*.sentry.io`, joined once at load with only the nonce substituted per request. `API_URL` goes in as `${API_URL}/`: a source path without a trailing slash matches that exact path only, so develop's form allowed `/rcms-api/7` but nothing under it. Remix 3.0.0 has no nonce option, so `renderWithCsp()` is `render()` plus a step that re-installs `context.render` (same `Renderer` key and `render` property, which replaces rather than duplicates) to wrap every page in `CspNonceProvider`; a component reads the nonce in setup with `useCspNonce(handle)`. The provider and the hook live in `app/ui/contexts/csp-nonce/`, not in the middleware, so a component never imports server middleware. The nonce policy goes only on `text/html` responses that carry no CSP yet; a route that sets its own keeps it. Building on `render()` instead of running after it leaves no middleware order to get wrong. **Any `<script>` you write needs `nonce={useCspNonce(handle)}`** or the browser blocks it — `Document`'s `GoogleAnalytics` is the worked example. Unlike develop, the policy is sent under `wrangler dev` too, so a violation shows up locally.
  - `style-src` keeps `'unsafe-inline'`: the `<style data-rmx-style>` tags `css(...)` emits cannot carry a nonce. https://github.com/remix-run/remix/pull/11926 (open, actively reviewed) adds a `nonce` option to `renderToStream()` that stamps those tags, the import map and the preloads. When it ships, pass the nonce to the renderer and drop `'unsafe-inline'` — tracked in issue #115. That PR does not touch `render()`, so check how the middleware exposes it.
  - **Frames are not covered.** `render()` resolves a `<Frame src>` with an internal `router.fetch`, which mints a second nonce the page's header does not list, so scripts inside a server-rendered Frame would be blocked. Nothing renders a Frame today; #11926 also makes frames reuse the document's nonce. Solve it before the first Frame.
  - A future hydration step needs this too: the import map is an inline script. `<ImportMap nonce={…}>` already accepts one, and the browser runtime copies it to maps added later.
- **`cop()`** (`remix/middleware/cop`, built in) rejects unsafe cross-origin requests (`POST`/`PUT`/`PATCH`/`DELETE`) from `Sec-Fetch-Site` / `Origin`, with no tokens or session. GET is never checked — the drinks search is a GET form and needs no CSRF token; putting one in a URL would leak it through history, `Referer` and logs.
- **CSRF tokens come with sessions.** There is no session and no state-changing endpoint yet, so there is nothing for a synchronizer token to protect, and Remix's `csrf()` (`remix/middleware/csrf`, built in) stores its token in the session. The day a session arrives — login, favourites, comments — add `session(...)` and then `csrf()` after `cop()`, and put `getCsrfToken(context)` in each unsafe form. develop's hand-written double-submit token (`csrf.server.ts`, `timing-safe-equal.server.ts`) was not ported: it had no POST endpoint to protect, and the built-in middleware replaces it.

## Browser JavaScript

No page ships app JavaScript yet — the only scripts are the third-party Google Analytics tag (nonce'd, see **Security**). The agreed approach for the migration (issue #115) is to build every page server-rendered first, using native HTML for interaction (GET forms, `<details>`, `popover`, CSS transitions and scroll-snap), and add hydration only where that is not enough.

So `render()` is created without `assets`, `Document` renders no import map or module script, and `document.test.tsx` pins that. A module script without a server behind it would 404 in production.

When a component really needs the browser, it becomes a `clientEntry` as in the template, but its modules have to be compiled ahead of time into a directory the `ASSETS` binding serves, and `clientEntry` given those public URLs (the `render()` README: omit `assets` "when client entries already use public URLs"). That build step does not exist yet; adding it is its own task.

## CI

| Workflow | Trigger | What it does |
| --- | --- | --- |
| `push.yml` | push to any branch | `setup` -> (`lint` / `test`) -> `build` |
| `deploy.yml` | push to `develop` / `main` | `lint` / `test` -> `npm run deploy-development` / `deploy-production` |
| `automation-pr-label.yml` | PR opened | labels `enhancement` / `bug` from the branch prefix |
| `automation-release-pr.yml` | push to `develop` | opens the `develop` -> `main` release PR |
| `automation-release-note.yml` | push to `main` | cuts a `v{YYYY.MM.DD}-{n}` tag and generates the release note |

The `lint` job runs `format`, `stylelint`, `lint`, `typecheck` in that order.

Remix 3 has no build step, so the `build` job checks the two things a build used to: `npm run routes` (`remix routes --table` loads `app/routes.ts` and every controller it names) and `npm run bundle` (`wrangler deploy --dry-run` bundles the Worker without deploying, so a Node-only import or a size regression fails here).

Node comes from `.node-version` via `actions/setup-node`'s `node-version-file`, so CI cannot drift from the pin the repo already carries.

## Caching

There is no build, so nothing produces hashed filenames, and root `public/` URLs are fixed. Cache headers for those files come from the Workers static-asset defaults (revalidation with ETag).

`?${CACHE_BUSTER}` (`app/env.ts`, from `BUILD_ID`) goes only on subresources a page loads while rendering and that must change in step with the deployed HTML — today that is `app.css`. It rotates the URL on every deploy, which is the point for a stylesheet and the wrong thing for anything whose URL is its identity:

- **OGP images** (`DEFAULT_OG_IMAGE`, per-page `ogImage`). SNS crawlers cache the card by image URL, so a per-deploy query would make every deploy look like a new image and split the cached card. To change an OGP image, give the file a new name.
- **favicon / apple-touch-icon.** Fetched directly by the browser and the OS outside the page's cache, and expected at a stable URL.

**Every deploy should set one `BUILD_ID`.** `BUILD_ID` falls back to `'dev'`, so a deploy that forgets to set it will not invalidate root `public/` files. Deploy through `npm run deploy-*` (`scripts/deploy.sh`), which passes the commit sha; a bare `wrangler deploy` does not.

## Lint and Format

`oxlint` (`.oxlintrc.json`) and `oxfmt` (`.oxfmtrc.json`) are ported from the `auba-general-view` project, so the style rules match across both repos: no semicolons, single quotes, `printWidth` 100, `trailingComma: "es5"`, and grouped/sorted imports (builtin+external, then relative). There is no internal group: `tsconfig.json` declares no `paths`, so this project has no `~/` alias to sort into one.

The `react` plugin stays enabled for the runtime-agnostic JSX rules (`jsx-key`, `jsx-no-undef`, `jsx-no-duplicate-props`, …), but the rules that assume React's runtime are turned **off** in `.oxlintrc.json` — do not re-enable them:

- `react/no-unknown-property` — flags the `mix` prop and kebab-case SVG attributes (`stroke-width`, `fill-rule`), both of which Remix's JSX runtime accepts.
- `react/display-name` — Remix components are `function Name(handle) { return () => jsx }`, and the returned render closure is misread as an anonymous component.
- `react/rules-of-hooks`, `react/exhaustive-deps`, `react/no-direct-mutation-state`, `react/no-find-dom-node`, `react/no-is-mounted`, `react/no-render-return-value`, `react/no-string-refs`, `react/no-unsafe` — React-only APIs that do not exist here.

`prefer-const` is intentionally left on: it only flags bindings that are never reassigned (props destructuring), and does not conflict with the component model's mutable setup-scope state, which stays `let`.

### Stylelint

`stylelint` (`.stylelintrc.json`) covers `public/static/css/**/*.css` and nothing else. Component styles live in `.styles.ts` as plain objects, and stylelint only parses CSS text, so that whole tier is outside its reach — do not expect it to catch anything under `app/ui/`.

The config is `stylelint-config-standard` plus the few adjustments the hand-written reset needs:

- `property-no-vendor-prefix` is **off**. `-webkit-text-size-adjust`, `-moz-tab-size` and the `appearance` prefixes are deliberate; `--fix` would strip them and change behaviour in Safari.
- `value-keyword-case` ignores `currentColor` and any `--font-family-*` value, so real font names keep their capitals.
- `font-family-no-duplicate-names` ignores `monospace`, because `monospace, monospace` is the normalize-era fix for inherited font sizing.
- `no-descending-specificity` off, `order/properties-alphabetical-order` on — same as the `after_works` config.

`.vscode/settings.json` turns VS Code's own CSS validation off and points `stylelint.validate` at CSS instead, so the editor reports what CI reports.

**`stylelint --fix` escapes the literal sequence `<style` to `\3c style` when it writes the file**, comments included. The header comment in `app.css` is worded to avoid that sequence; keep it that way or every `stylelint-fix` run will mangle it.

## Architecture

Remix 3 (`remix@3.0.0`), server-first, built on Web `Request`/`Response`. Everything runtime imports from a `remix/<subpath>`. The top-level `remix` module exists only as the augmentation target for `RouterTypes`.

Request flow: `workers/app.ts` → `workers/handler.ts` (Basic auth, then `ASSETS` for GET/HEAD, then `withErrorResponse`) → `router.fetch(request)` → middleware stack in `app/router.ts` (`securityHeaders()`, `cop()`, `renderWithCsp()` — see **Security**) → the controller mapped for the matched route → a `Response`.

The pieces that must stay in sync:

- **`app/routes.ts`** — the single source of truth for URLs. Add routes here before wiring anything else, and build every internal URL with `routes.<name>.href(...)` rather than a string literal.
- **`app/router.ts`** — builds the middleware stack, derives `AppContext` from it via `MiddlewareContext<[...]>`, publishes that type through `declare module 'remix'`, then calls `router.map(routes, controller)`. `router.map` wires only *direct leaf* routes; each nested route map needs its own `router.map(routes.<key>, controller)` line and its own `app/actions/<route-key>/controller.tsx`.
- **`app/actions/controller.tsx`** — `createController(routes, { actions })`, one action per leaf route key. Actions return `Response` objects; UI responses go through `context.render(<Node />)`, which the `render()` middleware provides.
- **`app/env.ts`** — the only module that reads `process.env`. Everything else imports the resolved constants (`NODE_ENV`, `IS_PRODUCTION`, `BUILD_ID`, `HAS_BUILD_ID`, `DEPLOYED_AT`, `CACHE_BUSTER`, `SITE_URL`, `NO_INDEX`, `SITE_NAME`, `API_URL`, `GOOGLE_ANALYTICS_ID`) — tests included: `app/env.test.ts` skips on `HAS_BUILD_ID` rather than reading the variable.
- **`app/ui/`** — shared cross-route UI, organized by category (see "The `app/ui/` layout").
- **`app/middleware/`** — request-lifecycle middleware (`security-headers.ts`, `csp.tsx`; see **Security**).
- **`workers/`** — the Worker entry and its env type (see **Cloudflare Workers**).

## Code Conventions

- TypeScript imports carry their real extension (`./routes.ts`, `./home-page.tsx`) — `allowImportingTsExtensions` plus `verbatimModuleSyntax` are on. Wrangler's esbuild resolves them as written. There is no `~/` alias.
- **Functions are `const` arrows; components are `function` declarations.** A component is anything used as `<X />` — a helper that merely returns a `RemixNode` (`renderMeta()`) stays a `const`. Three reasons for the exception: it is the form Remix's own docs and the skill use, so pasted examples fit; hoisting lets a file lead with its main component and put sub-components after it; and `clientEntry` reads the function's name to know which export to hydrate.
- **Types are `type`, except inside `declare module`.** Module augmentation needs declaration merging, which only `interface` has — `app/router.ts` publishes `AppContext` through `interface RouterTypes`, and turning it into a `type` deletes `context.render` from every controller.
- JSX compiles through `jsxImportSource: "remix/component"`. **Remix components are not React**: write `function Name(handle: Handle<Props>) { return () => <jsx/> }`, read props from `handle.props`, keep state in setup-scope variables, and call `handle.update()` explicitly to re-render. There are no hooks and no implicit rerendering.
- Styling and behavior attach to host elements through the `mix` prop: `mix={css({...})}`, `mix={[styleA, styleB]}` to compose. Keep one-off styles inline; hoist recipes into `.styles.ts` once reused or large enough to obscure the component.

## Growing This App

Follow the placement precedence in `AGENTS.md`: narrowest owner first, then `app/ui/` for cross-route UI, `app/middleware/` for lifecycle concerns, `app/data/` for schema and persistence, `app/utils/` only as a last resort. Do not create `app/lib/`, `app/components/`, or `app/controllers/`.

`app/` top level is for single-instance, app-wide contracts that no narrower owner can hold — `routes.ts`, `router.ts`, `env.ts`.

`app/actions/home-page/home-page.tsx` is a placeholder until the SG10_100 port replaces it.
