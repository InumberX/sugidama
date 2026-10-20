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
npm run build-client        # compile browser modules into public/client/ (wrangler runs it before dev and deploy)
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
- **Prefix every public page with the optional language.** `home: get('/(:lang)')`, `drinks: get('/(:lang/)drinks')` — see **Languages**.

Naming under `app/actions/` — **a bare directory is a route area, a `-page` directory is a page**:

```
app/actions/
  controller.tsx              direct leaves of the root map: home, robots, sitemap, devUi
  document.tsx                the shared document shell
  meta.tsx                    site-wide metadata defaults
  robots.ts, sitemap.ts       the robots and sitemap actions' bodies (no page, so no -page directory)
  error-page.tsx              the page every route answers an error with (not a route, so no directory)
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

`public/` is a visibility boundary rather than a category (see **Browser JavaScript**), so it wraps `components/` instead of replacing it. `scripts/build-client.ts` allows `app/**/public/**`, and the `**` matches at any depth — verified — so nesting inside it costs nothing and the sub-component shape stays the same on both sides of the boundary.

A page that needs data before it renders loads it in `<name>-page.data.ts` beside the page (`home-page/home-page.data.ts`): one async function the action awaits, which returns the page's props or the `Response` to answer with instead. It is develop's route `loader`, minus the framework — the action decides when to call it, and the page component stays a pure function of its props.

There is no file-system routing in Remix 3, so a Next-style `page.tsx` would carry no framework meaning and would need `routes.ts` kept in sync by hand anyway; naming after the action key ties the file to the unit the framework actually dispatches on, and keeps editor tabs distinguishable.

### Page metadata

`app/actions/meta.tsx` is generalview's `getMetadata` translated: React Router collects `MetaDescriptor[]` and renders them, Remix 3 has no meta API, so `renderMeta()` returns the tags and `Document` places them. A page passes overrides and the request URL:

```tsx
<Document url={url} meta={{ title: '記事一覧', description: '…', ogType: 'article' }} />
```

`url` comes from `context.url` in the action, because a component has no request of its own. `<title>` is rendered by `Document` from the shared `resolveTitle()` and is deliberately absent from `renderMeta()` — emitting it in both places would produce two `<title>` elements. Anything but production gets `noindex, nofollow`, and `NO_INDEX=true` forces it in production too.

Both take the page's language. A page without a title gets develop's base title, `${siteName} | ${titleNote}`, and the description defaults to develop's per-language one (`SITE_INFO` in `meta.tsx`); SITE_NAME stays in every title, since it is what marks staging. `og:url` is the canonical URL, as develop's `getMetadata` had it. A page's `canonical`, `ogImage`, `prev` and `next` are resolved like an `href` (`absoluteUrl()`: `//host/x` takes the site's scheme, a relative path lands under the site, and anything but an http(s) address — a `javascript:` or `data:` value from the CMS, or one no URL parser accepts — becomes the site's root), but the request's own path is appended, never resolved, so `//evil.example/x` cannot make the canonical another site. There is no `hreflang` (develop had none, decided in step 9), and the list's later pages keep the first page as canonical, as develop did.

Per-page titles stay a `PAGE_TITLE` constant in the page module. A central screen registry (generalview's `app/config/paths.ts`) is not worth its weight until spec screen ids need tracing — the earlier `app/pages.ts` experiment worked, but only one route ever reads a given title. The exception is a name something else also shows: the header's global menu names the home and drinks pages, so those names live once in `app/utils/page-names.ts`, and the drinks page reads its title from there too (`PAGE_NAMES[lang].drinks`). The home page has no page title of its own — it uses the site's base title, as develop did.

`/dev/ui` is a component gallery for development. The route is declared in every build so `typeof routes` stays stable, and the action returns 404 when `IS_PRODUCTION`. It renders every `app/ui/` variant through the real `context.render()` pipeline, so a specimen cannot diverge from what ships — which is why this exists instead of Storybook (no Remix 3 renderer exists, and a Vite builder would add a second, differently-resolving module graph).

## Languages

The site is published in Japanese (the default, no URL prefix) and English (`/en/…`), as develop was. `app/utils/i18n.ts` holds the vocabulary — `LANGS`, `Lang`, `DEFAULT_LANG`, `toLangParam()`, `defineMessages()` — and imports nothing, so pages, components and a future browser module can all use it. `app/middleware/lang.ts` is the request side.

- **Patterns.** The optional group wraps the segment and the slash on the side that keeps the URL well formed: `/(:lang)` for the root, `/(:lang/)drinks` below it. `(/:lang)` looks equivalent but never matches `/en` — measured. Route patterns cannot constrain a variable, so `/(:lang)` matches any single segment; `/nope` reaches the home route with `lang: 'nope'`. A literal single-segment route (`/robots.txt`) still wins, because static text outranks a variable — `lang.test.ts` pins it.
- **`lang()` middleware** turns the param into `context.lang`: none is `ja`, `en` is `en`, `ja` redirects (302 for GET/HEAD, as develop did; 307 otherwise, so a POST keeps its method) to the same URL without the prefix, and anything else is a 404. The redirect drops the first segment as it appears in the URL, not a fixed `/ja`, because the param is decoded (`/%6Aa` is `ja` too); for the same reason an encoded `en` (`/%65n`) is redirected to `/en`, so it cannot become a second indexable URL. Both go through `localRedirect()` (`app/middleware/local-redirect.ts`), which resolves the target against the request's origin and falls back to `/` for anything that would leave the site — develop's guard. It is controller middleware, not router middleware, because router middleware runs before matching and sees no params; and not action middleware, because a controller's `actions` object cannot carry the context an action's own middleware adds (`context.lang` loses its type). **Every controller with a language-prefixed route needs `middleware: [lang()]`** — controller middleware does not reach other controllers. The root controller's `devUi` has no `lang` param and so always resolves to `ja`.
- **Trailing slashes.** Route patterns are exact, so `/en/` would be a 404 where develop's React Router answered it. `trailingSlash()` (router middleware, `app/middleware/trailing-slash.ts`) redirects `/path/` to `/path` before matching, for every method, with a 308 — unlike a 301 it keeps the method and body, so a POST stays a POST. Never link with a trailing slash.
- **Links.** Build them with `routes.<name>.href({ lang: toLangParam(lang) })`. `toLangParam` maps `ja` to `undefined`, which drops the optional group, so Japanese links never carry `/ja`. The header's language switch is the one link that cannot name its route — it is the current page, whatever that is — so `toLangPath(context.url, lang, to)` rewrites the request path's prefix instead, keeping the query.
- **`<html lang>`.** `Document` takes a required `lang` prop for the same reason it requires `url`: an English page that forgot it would still render, as Japanese.
- **Messages.** There is no i18next. A page or component declares its own messages next to itself with `defineMessages({ ja: {…}, en: {…} })` and reads `MESSAGES[lang]`. The Japanese messages define the shape and every other language must match it exactly — a missing, misspelled or wrongly typed key is a type error (`app/utils/i18n.test.ts` pins each case). A message that interpolates is a function (`` (category: string) => `${category}のお酒` ``), which types its arguments where i18next's `{{drinkCategory}}` did not. develop's namespaces (`pages/SG10_100`, …) map onto the owning page's directory; site-wide strings (the title note and the description) are `SITE_INFO` in `meta.tsx`.

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

Each component directory splits four ways, e.g. `primitives/buttons/public/primitive-button/`:

| file | holds | may live outside `public/` when hydrated? |
| --- | --- | --- |
| `<name>.tsx` | the component | no |
| `<name>.types.ts` | types only | **yes** — erased from browser output |
| `<name>.styles.ts` | recipes / `css(...)` values | no |
| `<name>.test.tsx` | tests | n/a (`denyFiles` blocks `*.test.*`) |

Create a category directory when it gets its first member; do not pre-create empty ones. Never `index.tsx` — NodeNext has no directory resolution, so it buys nothing and every import still spells the file out.

### What separates the two tiers

`primitives/` owns element selection, accessibility attributes and the user-agent reset, and takes **no** design decisions — no colors, no type scale, no motion. `color` and `font` are set to `inherit`, never to a token. Verified consequence: the primitive's only runtime import is its own sibling `.styles.ts`, so the whole directory can move into a `public/` directory and hydrate on its own (HTTP 200) without dragging the token layer along.

`<category>/` owns the design decisions and passes them down. `buttons/public/base-button/` is the reference pair — it adds size, variant (`contained` gradient / `outlined`), color, the disabled dimming and motion, merges a caller's `styleOverrides` over them, and forwards everything else to `primitives/buttons/public/primitive-button/`. The primitive renders an `<a>` for `url` (without `href` when disabled, so the keyboard cannot follow it), a `<button>` for `buttonType`, and the inert tag named by `nonClickableTag`; its props type requires exactly one of the three. React's version guessed a button from `onClick`, but a Remix click handler is a `mix={on('click', …)}` the component cannot see, and either default is wrong somewhere — a `<span>` drops a click handler's button, a `<button>` nests one inside a card's link. Only a `url` that resolves to this origin gets client navigation; it is resolved the way the browser resolves an `href`, so `//host`, `/\host` and a tab hidden in `/\t/host` all count as another site and, like `mailto:`, `tel:` and `#hash`, carry `data-rmx-document`. The comparison has no request to read the real origin from, so an absolute URL to this site (`${SITE_URL}/drinks`) counts as another site too and loads as a full document — still correct, only slower. Pass internal links as `routes.<name>.href()` paths.

`layouts/` holds the structural wrappers ported from develop — `layout-wrapper` (full-height column), `layout-main` (the `@container` container and the white sheet inside it), `layout-page-wrapper` (header offset above and below), `layout-section` (vertical rhythm per band), `layout-inner` (centred, width-capped) — and `layout-public`, develop's public layout route: header, `LayoutMain`, footer. Remix 3 has no nested route outlets, so every public page renders `<LayoutPublic lang url>` inside `Document` itself. The header and footer are in `common/`, as in develop; the frame around the white sheet (bars and rounded corners in the header) is `--layout-main-gutter` thick, so it always matches the sheet's gutter. Their measurements are `--layout-*` custom properties in `app.css` rather than TS values, so `util` can retune the grid. Each takes the same `styleOverrides` recipe as the button primitive, which is how `/dev/ui` shrinks a `100svb` wrapper to 160px for display.

A component a hydrated one renders lives in a `public/` directory of its category (`buttons/public/`, `icons/public/svg-icon/`, `primitives/buttons/public/`), so the category keeps its place and only the visibility changes. Move one there when a client entry first needs it, not before.

**Interactive widgets are built by hand, not taken from a library.** Remix's headless set (`@remix-run/ui`) was tried for the drinks list's tabs and accordion and dropped: it is 0.x, its 0.12.1 accordion wrote a valueless `aria-expanded` and left closed panels on screen, and correcting that meant overriding most of what it did. Reconsider it for a widget whose focus management is the hard part (combobox, menu, positioned popover). Both widgets have one consumer, so they live with it (see **Data**) and move here when a second route needs them. The one exception is the drink page's image slider, which runs keen-slider's vanilla core (see **Data**): a looping, draggable track with momentum is the hard part there, and scroll-snap cannot loop.

### Rules that came from measurement, not taste

**Hydrated components need every *runtime* dependency inside `public/`.** `scripts/build-client.ts` allows `app/**/public/**`; a value import that crosses out of it fails the browser build (`IMPORT_NOT_ALLOWED`), so `npm run build-client`, `wrangler dev` and every deploy stop there. Type-only imports are erased (`verbatimModuleSyntax`) and are exempt — a `clientEntry` importing a type from outside `public/` compiles to 200 and the specifier is absent from the output. This is why `.types.ts` is a `.ts` and not a `.tsx`: the extension is the reminder that nothing runtime may enter it.

**Override styles by spreading recipes into one `css(...)` call, never by stacking descriptors.** Each `css(...)` emits its own `@layer rmx.<hash>`, and those sublayers are ordered by *first render*, not by position in a `mix` array — rendering a descriptor earlier elsewhere on the page flips the precedence of a later `mix={[base, override]}`. So `PrimitiveButton` takes a `styleOverrides` recipe and merges reset + caller + disabled into a single `css(...)` (the disabled treatment last, so no caller recipe can switch it off); output is content-hashed and deduplicated, and JS spread order decides the winner. `mix` stays for behavior (`on('click', …)`) and for styling that touches no property the reset already set.

The spread is shallow, and that reaches the at-rule keys too: a modifier carrying `[MEDIA_QUERY.SM]` replaces the base's entire `[MEDIA_QUERY.SM]` object rather than merging into it, so it has to repeat every declaration of that block it still wants. Pseudo-element keys behave the same way: `'&::before'` in a later recipe replaces an earlier one whole, which is why `base-button.styles.ts` declares the gradient layers and their hover fade only in the color recipe (`baseButton__primaryContained`).

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

**Give a unitless property a string.** Remix appends `px` to a number for every property it does not know to be unitless, and `-webkit-line-clamp` is one it does not: `WebkitLineClamp: 3` came out as `3px`, which the browser drops, so `getLineClamp` never clamped. `getLineClamp` now passes a string; do the same for any other unitless property, and check the emitted CSS rather than the recipe.

Upper bounds are written as exclusive (`width < ${BREAKPOINTS.md}px`), which Media Queries Level 4 range syntax gives directly — the same syntax the lower bounds already use. Two reasons, and the second is why there is no `BREAKPOINTS_MAX` companion object: `<= 767px` next to `>= 768px` leaves a fractional viewport width (browser zoom, some high-DPI devices) matching neither; and expressing it would need the `- 1` values written out by hand, because TypeScript has no type-level arithmetic and `${BREAKPOINTS.md - 1}` degrades the string to a `${number}` pattern, breaking the computed key again.

**Example code is prefixed and lives with whatever shows it.** `app/ui/` is production UI that more than one route needs, so a component named to say "do not use me" does not belong in it. Reference material is prefixed `Example` and owned by whatever displays it: `ExampleCopyButton`, ported from `remix-template`, is the worked `clientEntry` and lives in `app/actions/dev-ui-page/public/components/`.

**Route-owned UI never goes here.** generalview's `components/pages/*` and `components/features/*` map onto `app/actions/<route-key>/`, next to the controller that owns them. `app/ui/` is only for UI that more than one route area needs.

**Derive DOM types where Remix pins them, hand-declare only deliberate narrowings.** `remix/component` does not re-export its internal DOM types (`AriaRole`, `HTMLAttributeAnchorTarget`), so the JSX namespace is the supported seam: `NonNullable<JSX.IntrinsicElements['button']['type']>` is a real union and rejects `'nope'`, while `<a target>` and `<a rel>` stay open to arbitrary strings and must be narrowed by hand in `app/ui/types/dom.ts`. Note also that Remix constrains `role` per element following ARIA-in-HTML, unlike React's uniformly wide `AriaRole` — a component that renders several element types can only accept the intersection (see `PrimitiveButtonRole`).

Nothing in `app/ui/styles/` may import a component.

## Data

`app/data/` is the Kuroco API, ported from develop's `app/server/api/`: `api-client.ts` (the one `fetch`, under `API_URL`, uncached), then one module per resource — `drinks.ts`, `drink-categories.ts`, `tags.ts` — each beside a `.types.ts` trimmed to the fields the site reads. Every call resolves to an `ApiResult` instead of throwing, so the caller decides what a failure means; a page's loader returns `apiErrorResponse(result)`, an empty plain-text response with `toVisitorStatus()`'s status: a 404 stays a 404 only where the caller says it means the page itself is missing (`{ notFound: true }`, the drink lookup by the URL's own id — where an id it no longer has stays a 410, so crawlers drop it; a 400 is not, since it can as well be the API's own fault, and as a 404 it would drop every drink at once); anywhere else the API's 404 is a renamed endpoint or a wrong `API_URL`, and like any other 4xx (a key it rejects, a limit it hit — not the visitor's fault) becomes a 502, so the home page never turns into a "not found" crawlers drop. Its 5xx passes through, and no usable answer is a 500. The list's failed search uses the same function. develop passed every status through. The error page middleware (see **Error pages**) turns that response into the site's page; nothing the API said reaches the visitor.

The API's raw records become what the pages show in two steps: `to*Terms()` beside each fetcher turn categories and tags into one-language `Term`s, and `app/utils/drink-card.ts` turns a drink into the props both card components take. Dates are formatted with `Intl` in `app/utils/date.ts` (Japan time; Workers ship full ICU), not date-fns.

The API's dates are ISO strings in JSON; develop typed them as `Date`, which they never were at runtime.

**The drinks list (SG20_100).** `app/utils/drink-search.ts` owns the query: `parseDrinkSearch()` reads `keyword`, `drink`, `taste`, `drinkability` and `page` (a page written any way but as a canonical positive integer — `0`, `-1`, `02` — is a 404, as is a keyword over 100 characters (`MAX_KEYWORD_LENGTH`, which the form's field also carries as `maxlength`); develop passed 0 or -1 to the API. Ids are forgiving instead: one that is malformed (`02`, `2abc`), repeated or outside the vocabularies is left out (no cap is needed, since only ids the vocabularies have reach the API) of the search, as develop dropped what was not a number; there is no redirect, and the form and pagination links show only the ids that were searched. The canonical link names the bare list path, so such a URL is not a second indexable page), and `toDrinkSearchListHref()` writes it back, leaving out an empty keyword and page 1. `getDrinkTerms()` (`app/data/drink-terms.ts`) loads the category master and both tag groups for the home page and the list alike. `index-page.data.ts` loads the terms and the search: a failed term load ends the request with its error response, but a failed search is shown in place of the results (`BaseAlert`, with a fixed message — develop showed the API's own words) so the form stays usable, answered with an error status so it is not cached or indexed as the page: the API's 5xx as is, its 4xx as a 502 (not the visitor's fault), nothing answered as a 500. A page past the last one is a 404; the vocabularies load first, and the search runs once with only the ids they have, so the API never sees an unknown one. Pagination is links to the same search (`#search-drinks-result`), not develop's form resubmission, so it works without JavaScript and opens in a new tab. The form is a GET form and the one client entry: it switches between an accordion (wide) and tabs with a fold (narrow) at the `md` container query, keeps the checked state across that switch, and counts the selection per condition. Without JavaScript it still submits: the conditions are never folded away (`MEDIA_QUERY.NOT_SCRIPTING`), and each group is a `<details>` that opens natively. Its parts are in `index-page/public/components/`: `base-accordion/` is native `<details>`/`<summary>` (the browser owns opening, the keyboard and what assistive technology is told) and mirrors each item's open state from the `toggle` event, because a re-render resets `open` to whatever the props say; `base-tabs/` follows the WAI-ARIA Tabs pattern by hand (one tab in the tab order, arrows/Home/End move and select, inactive panels `hidden`). **State that the visitor can change before hydration is read from the DOM in setup** — the checked boxes in the form, the open groups in the accordion — because hydration rewrites `checked` and `open` from the props (measured), and setup runs before that write. The accordion is found by an `id` its caller passes: `handle.id` differs between the server and the browser.

**A drink (SG20_101).** `show-page.data.ts` loads the drink (`getDrinkDetail()`, by slug or topics_id, encoded; a dot segment is a 404 without asking the API), the vocabularies and the newest four in parallel, and the four of the drink's category as soon as the drink names it, without waiting for the vocabularies (the key is checked against the master afterwards) — the drink itself among them, as develop did; leaving it out waits on Kuroco's filter syntax for "not this topic" (issue #115). A missing drink — an error status, or an answer whose `details` is not a drink (`null`, `{}`, `[]`), which `getDrinkDetail()` itself turns into a 404 — answers its 404 without waiting for the rest. The canonical URL is the one the cards link to (the slug, else the topics_id), so `/drinks/<topics_id>` and a percent-encoded slug are not indexed as pages of their own. The drink and the vocabularies are the page: their failure is the response (the API's 404 passes through as the page's 404). The two card rows are extras, as develop streamed them: a row whose fetch fails, or that is empty, is left out and the page is still a 200. `toDrinkTags()` in `app/utils/drink-card.ts` lists the same category and tags as a card. The page's parts are in `show-page/components/` (`base-article`, `article-info`, `section-title`, `card-row`) and the slider's in `show-page/public/components/` (`article-slider`, `svg-icon-circle-button`). **The slider** is a client entry around keen-slider's vanilla core, not develop's React wrapper. A single image needs no slider: `BaseArticle` renders it as a plain image, with no client entry or hydration data, and the page ships no JavaScript — both ask `hasArticleSlider()`, so the rule lives once. Until it starts — and without JavaScript — the main images are a scroll-snap strip and the thumbnails are hidden (`visibility`, so their inert buttons are neither announced nor clickable; `display: none` under `MEDIA_QUERY.NOT_SCRIPTING`, and gone for good if keen-slider fails to start, the strip coming back where it was left); on start it adds the copies the loop needs (develop's rule: two or fewer images ×3, four or fewer ×2; a copy's thumbnail is `aria-hidden` and out of the tab order, while of the main slides only the one on screen is announced, since it is often a copy), swaps the strip for keen-slider's container rules (copied from `keen-slider.css` into the recipes, so nothing outside the `rmx` layer is loaded), and starts where the visitor had swiped the strip to, resetting the strip's `scrollLeft` first (keen-slider's transforms assume 0). A thumbnail is current when it shows the current image, a copy included; only the original carries `aria-current` (`PrimitiveButton`'s `ariaCurrent`, which the thumbnails use like every other button). Keep in mind, all measured: keen-slider takes its slides as an array or a NodeList and treats an `HTMLCollection` as none; a re-render leaves keen-slider's inline `style` alone, because the JSX sets none; **the main slider is the one source of the current image and the thumbnails only follow it** — develop let each move the other from `slideChanged`, and a jump past several slides stopped short, because every slide passed sent the other slider back. The thumbnails follow where the main slider is going (`animator.targetIdx`), not each slide it passes, so a long move never drags them back through the slides between — and are only redirected when they are not already heading there, or each slide passed would restart their move. keen-slider's thumbnail breakpoints are `MEDIA_QUERY`'s conditions without the `@media`, so they cannot drift from the static row's. The one exception is a drag of the thumbnails, which leads until its snap settles (`animationEnded`); the main slider does not send them back meanwhile. A drag is `dragged`, not `dragStarted`, which keen-slider fires on every pointer down — a click would count as one; a button press ends any lead. keen-slider's default export is a plain function that logs and returns `undefined` when it cannot start, and `new` turns that into an empty object, so an instance is recognised by its `track`, not by being truthy. Set the follow flag *after* `moveToIdx()`, which fires `animationStopped` synchronously when it redirects a running animation. The package is CommonJS to Node and TypeScript (no `"type"`, no `"exports"`) and an ES module to the browser build (`module`), so the default import is unwrapped once at the top of `article-slider.tsx`.

## Error pages

`app/middleware/error-page.tsx` (`errorPage()`, the last router middleware) turns every plain-text error response into `app/actions/error-page.tsx` — the router's own 404 for a path nothing matches, `lang()`'s 404 for `/fr`, a route's 404, `apiErrorResponse()`'s statuses — with the same status and headers (a 405 keeps its `Allow`). So a route answers an error with a plain-text or empty response (`new Response(null, { status })` is enough) and every error looks the same, in the language of its path (`langOfPath()`, decoded as `lang()` decodes: the router's 404 matched no route, so there is no `context.lang`). Its header's language switch leads to the other language's home, not to the broken path rewritten (`/ja/nope` would become `/en/ja/nope`). A 404 or 410 says the page is not there; any other 4xx (a 405 for a POST to a page that exists) says the page could not be shown; a 5xx says to try again later. The plain response's headers carry over, winning over the page's, except its type, length and CSP — a carried-over policy would stop `renderWithCsp()` adding the page's nonce one — and its body is cancelled. An error page names no canonical URL and no `og:url` (`canonical: null`): an error at `/drinks?page=0` must not point at `/drinks`. A request for a file — a path ending in one of the extensions the site serves (`.js`, `.css`, images, fonts, …; named, so a slug like `dassai.23` is still a page) with no `text/html` in `Accept`, such as a stale `/client/…js` that missed the `ASSETS` binding — keeps the plain 404 rather than getting a whole page it cannot use, and both answers for a file carry `Vary: Accept`. Repeated headers survive the swap (every `Set-Cookie`, for the day sessions arrive). `mediaTypeOf()` in `with-headers.ts` is the one parse of `Content-Type` this and `csp.tsx` share. It sits inside `renderWithCsp()`, whose renderer it uses and whose CSP the page gets on the way out; what fails before the renderer — `cop()`'s 403, a thrown error's 500 — stays plain text, and a response with a type of its own (the sitemap's XML) is left alone. develop had no error boundary at all.

## Crawler files

`/robots.txt` and `/sitemap.xml` are routes (`robots.ts`, `sitemap.ts`), literal single segments that outrank `/(:lang)`. robots.txt is develop's — crawl delays, the sitemap line — and disallows everything unless the site is production and not `NO_INDEX`, in step with the pages' `noindex`. A closed site has only the `User-agent: *` group: a crawler obeys the most specific group that names it (RFC 9309), so develop's named CCBot / Nutch / baidu groups let those three crawl staging. The sitemap lists the home page and the list in both languages, then every drink in both (one `getDrinks({ pageSize: -1 })`, as develop did, leaving out an id `getDrinkDetail()` would answer with a 404 — `isDrinkId()`), each URL once (two drinks can name one), with `<lastmod>` from `DEPLOYED_AT` and none at all where it is unset, every `<loc>` XML-escaped, and each `<url>`'s children in the schema's order (loc, lastmod, changefreq, priority — develop put priority second, which validators reject). robots.txt is cached for a day, not develop's week for shared caches, since whether the site is closed changes with a deploy. A failed fetch answers `toVisitorStatus()`'s status with the XML type, so a crawler gets the status, not an HTML page.

## Tests

Co-locate tests beside what they test, one per component directory — `app/actions/controller.test.tsx`, `app/ui/**/<name>/<name>.test.tsx`, `app/env.test.ts`, `app/middleware/*.test.ts(x)` (`with-headers.ts` is the shared header helper), `app/data/*.test.ts`, `app/utils/*.test.ts`, `workers/handler.test.ts`, `workers/wrangler.test.ts` (for the root `wrangler.jsonc`). The CLI discovers by filename pattern rather than location. Root `test/` holds shared helpers and fixtures: `test/kuroco.ts` has API fixtures (`drinkDetailFixture()` is mocked under the drink's own path, `'/drinks/kubota'`) and `mockKuroco(t, overrides)`, which replaces the global `fetch` for one test (the test context restores it) and throws on any endpoint it does not know. **A test that renders a page backed by the API must call it** — otherwise the page fetches the real API and the test depends on the network.

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

The `base` layer carries develop's design tokens as custom properties (`--color-font-base`, `--color-gradation-primary`, `--opacity-disabled`, `--layout-*`, …) and develop's element defaults (body font and colors, link colors, form controls), adjusted only where ress needs it:

- **`:focus-visible`** gets an outline back. ress removes the focus outline from links, buttons and form controls with nothing in its place; develop only ever removed it from inputs.
- **`[hidden]`** hides again in `base` with `!important`, not only in ress's `reset`: a later rule that sets `display` — a `base` element rule (`label`, `video`, …) or any `css(...)` recipe in `rmx` (`inline-flex` on every button) — would otherwise show a hidden element. An important declaration outranks every normal one regardless of layer, and ress stays verbatim. **`[hidden='until-found']`** is the exception, with `display: revert` — ress hides every `[hidden]` in `reset`, and excluding it in `base` alone cannot undo that; `revert` rolls back to the user agent, which keeps the element findable.

There is no PostCSS here. `@mixin`, `@custom-media` and `@media (--name)` are PostCSS syntax: they survive into the served file and are then dropped or never match, silently. `getClampRem`/`getFontSize` values have to be written out as plain `clamp()` / `rem`.

## Cloudflare Workers

`wrangler.jsonc` points `main` at `workers/app.ts`, which wraps `router.fetch` in `withErrorResponse` (log, then a generic 500 — what the Node starter's `createRequestListener` did by default) and hands it to `createHandleWorkerRequest`; both live in `workers/handler.ts`, so `workers/handler.test.ts` covers them without loading the router. The catch only sees errors thrown before a response exists: `context.render` streams, so a component that throws mid-render has already sent its 200, and the renderer logs it (`console.error` by default) while the browser gets truncated HTML. `createHandleWorkerRequest` wires `@inumberx/cloudflare-workers-basic-auth`'s `createWorkerFetch`:

1. **Basic auth.** Opt-in through the `BASIC_AUTH_USER` / `BASIC_AUTH_PASS` secrets. Both set or both unset; one without the other fails closed with `503`.
2. **Static files.** GET/HEAD go to the `ASSETS` binding first, which serves root `public/` as-is; a `404` from it falls through to the router. `run_worker_first: true` is what puts static files behind the Basic-auth gate too.
3. **The app.** Everything else reaches `router.fetch`.

`WorkerEnv` in `workers/handler.ts` is hand-maintained and lists what the Worker reads from its `env` argument — today the Basic-auth secrets and `ASSETS`. When you add a binding read that way (a KV namespace, an R2 bucket, a secret the wrapper uses), extend it; nothing regenerates it. Plain `vars` are not listed: the app reads them through `process.env` in `app/env.ts`, which is their single typed home.

What does **not** work on Workers, and is therefore absent from `app/router.ts` even though the template uses it:

- `remix/middleware/static` (`staticFiles`) and the compression middleware — Node filesystem and zlib APIs. The platform serves and compresses static files instead (`guides/03-request-handling.md` says the same).
- `remix/assets` (`createAssetServer`) at request time — it compiles browser modules per request with native `oxc-*` / `lightningcss` binaries and reads the filesystem. It runs at build time instead; see **Browser JavaScript**.

**`NODE_ENV` is fixed at bundle time.** Wrangler's esbuild replaces `process.env.NODE_ENV`. Each deploy environment in `wrangler.jsonc` pins it to `"production"` through `define` (so both `dev-sugidama` and `sugidama` are `IS_PRODUCTION`); without that, wrangler would take the deploying shell's `NODE_ENV` first and only then default to `"production"`, so a leftover `NODE_ENV=development` would ship `/dev/ui` to the live site. `define` is not inherited by environments, so a new one must repeat it. The top level has no `define`, so `wrangler dev` keeps wrangler's `"development"`. Staging is kept out of search engines by `NO_INDEX=true`, not by `NODE_ENV`. Every other variable in `app/env.ts` is read from `process.env` at module load, which `nodejs_compat` fills from `vars`, secrets and `.dev.vars`.

**Per-environment values live in `wrangler.jsonc`.** Each of `env.development` and `env.production` lists `SITE_URL`, `NO_INDEX`, `SITE_NAME`, `API_URL` and `GOOGLE_ANALYTICS_ID` under `vars` — in full, because `vars` is not inherited either. They are not build-time values any more (React Router baked them in through Vite's `define`; there is no build now), and keeping them in the repo means a deploy from a laptop and one from CI produce the same Worker. GitHub Environment variables are no longer read. `workers/wrangler.test.ts` reads the file through wrangler's own parser and fails if an environment is missing `define` or a variable, or still holds a `__SET_ME__` placeholder. When `app/env.ts` gains a variable, add it to both environments and to `.dev.vars.example`; the test takes its list from `app/env.ts`'s own `process.env.*` reads, so a forgotten environment fails it.

The top level of `wrangler.jsonc` is named `sugidama-local`, not after a deployed Worker. It is what `wrangler dev` runs and carries no `vars` or `define`, so a bare `wrangler deploy` (no `--env`) must not land on `sugidama` or `dev-sugidama`; the test pins that too.

**`vars` are public; secrets never go there.** This repository is public, and `vars` are also shown in plain text on the Cloudflare dashboard. Only values that a visitor can already see may go in `wrangler.jsonc`, and every current one qualifies: `SITE_URL`, `SITE_NAME` and `NO_INDEX` are in each page's HTML, `GOOGLE_ANALYTICS_ID` is in the analytics tag, and `API_URL` was already published in the CSP `connect-src` header. React Router baked the same values into its client bundle, so nothing became more exposed. Anything that must stay private — `BASIC_AUTH_USER` / `BASIC_AUTH_PASS` today, a Kuroco API key if one is ever needed — is a Worker secret (`wrangler secret put <NAME> --env=<environment>`), listed in `WorkerEnv` and in `.dev.vars.example` for local use, never in `vars`. `workers/wrangler.test.ts` rejects a `vars` key containing a credential-like word (`KEY`, `TOKEN`, `SECRET`, `PASS`, `PASSWORD`, `CREDENTIAL`, `AUTH`, `PRIVATE`, as a whole `_`-separated word), as a backstop rather than a substitute for this rule.

Do not edit `vars` on the Cloudflare dashboard: `wrangler deploy` replaces them with what `wrangler.jsonc` says, so a dashboard change disappears on the next deploy. Changing a value is a commit and a deploy, which is also what React Router's build-time values required.

The two per-deploy values come from `scripts/deploy.sh` (behind `npm run deploy-*`) as `--var` flags rather than from the file. The script refuses to deploy from a tree with uncommitted or untracked files, or with ignored files under `public/` (wrangler uploads the whole assets directory, `.DS_Store` included), and stops if `git rev-parse` fails, because `BUILD_ID` must name exactly what ships. It is POSIX `sh`, like the `test` script — run it from macOS, Linux or WSL. The values: `BUILD_ID` (the commit sha, `git rev-parse HEAD`) and `DEPLOYED_AT` (UTC, ISO 8601), which replaces the Vite build time the sitemap used as `<lastmod>`. `DEPLOYED_AT` has no local default on purpose — in a Worker's global scope `new Date()` is the Unix epoch, measured.

## Security

`app/router.ts` runs `securityHeaders()`, `cop()`, `trailingSlash()`, `renderWithCsp()`, `errorPage()` in that order; the order is commented there. (`trailingSlash()` is not a security measure; see **Languages**.)

- **`app/middleware/security-headers.ts`** — `X-Content-Type-Options: nosniff` and `X-Frame-Options: DENY` on every router response (a header the response already sets is kept, as with the CSP), and `Strict-Transport-Security` only when `IS_PRODUCTION` (both deployed Workers; HSTS on `localhost` would pin every local port to HTTPS; tests pass `{ production }`). It runs first so `cop()`'s 403 gets the headers too, and it is the router's error boundary: a thrown error becomes a generic 500 *with* the headers, as develop's 500 had. Both it and `withErrorResponse` (failures outside the router) answer through `internalServerError()` in `app/middleware/internal-server-error.ts`. Any response that reaches it without a CSP of its own — the 403, the 500, a plain-text 404, a redirect — gets `FALLBACK_CSP` (`default-src 'none'; frame-ancestors 'none'`). Static files from `ASSETS` never reach the router and get none of this.
- **`app/middleware/csp.tsx`** — a Content-Security-Policy with a fresh nonce per request: develop's directive list minus the unused `https://*.sentry.io`, joined once at load with only the nonce substituted per request. `API_URL` goes in as `${API_URL}/`: a source path without a trailing slash matches that exact path only, so develop's form allowed `/rcms-api/7` but nothing under it. Remix 3.0.0 has no nonce option, so `renderWithCsp()` is `render()` plus a step that re-installs `context.render` (same `Renderer` key and `render` property, which replaces rather than duplicates) to wrap every page in `CspNonceProvider`; a component reads the nonce in setup with `useCspNonce(handle)`. The provider and the hook live in `app/ui/contexts/csp-nonce/`, not in the middleware, so a component never imports server middleware. The nonce policy goes only on `text/html` responses that carry no CSP yet; a route that sets its own keeps it. Building on `render()` instead of running after it leaves no middleware order to get wrong. **Any `<script>` you write needs `nonce={useCspNonce(handle)}`** or the browser blocks it — `Document`'s `GoogleAnalytics` is the worked example. Unlike develop, the policy is sent under `wrangler dev` too, so a violation shows up locally.
  - `style-src` keeps `'unsafe-inline'`: the `<style data-rmx-style>` tags `css(...)` emits cannot carry a nonce. https://github.com/remix-run/remix/pull/11926 (open, actively reviewed) adds a `nonce` option to `renderToStream()` that stamps those tags, the import map and the preloads. When it ships, pass the nonce to the renderer and drop `'unsafe-inline'` — tracked in issue #115. That PR does not touch `render()`, so check how the middleware exposes it.
  - **Frames are not covered.** `render()` resolves a `<Frame src>` with an internal `router.fetch`, which mints a second nonce the page's header does not list, so scripts inside a server-rendered Frame would be blocked. Nothing renders a Frame today; #11926 also makes frames reuse the document's nonce. Solve it before the first Frame.
  - The browser runtime's `<script type="module">` carries the nonce, and `'strict-dynamic'` extends that trust to every module it imports, so the compiled modules need no `script-src` entry of their own. There is no import map (see **Browser JavaScript**); if fingerprinting brings one, it is an inline script and needs the nonce too (`<ImportMap nonce={…}>`).
- **`cop()`** (`remix/middleware/cop`, built in) rejects unsafe cross-origin requests (`POST`/`PUT`/`PATCH`/`DELETE`) from `Sec-Fetch-Site` / `Origin`, with no tokens or session. GET is never checked — the drinks search is a GET form and needs no CSRF token; putting one in a URL would leak it through history, `Referer` and logs.
- **CSRF tokens come with sessions.** There is no session and no state-changing endpoint yet, so there is nothing for a synchronizer token to protect, and Remix's `csrf()` (`remix/middleware/csrf`, built in) stores its token in the session. The day a session arrives — login, favourites, comments — add `session(...)` and then `csrf()` after `cop()`, and put `getCsrfToken(context)` in each unsafe form. develop's hand-written double-submit token (`csrf.server.ts`, `timing-safe-equal.server.ts`) was not ported: it had no POST endpoint to protect, and the built-in middleware replaces it.

## Browser JavaScript

Pages are server-rendered first, using native HTML for interaction (GET forms, `<details>`, `popover`, CSS transitions and scroll-snap). A component that really needs the browser becomes a `clientEntry` and hydrates on its own; the rest of the page stays static HTML. `ExampleCopyButton` on `/dev/ui` is the worked example; the drinks list's `SearchDrinksForm` and the drink page's `ArticleSlider` are the real ones.

Workers cannot compile modules per request the way the template's asset server does, so **`scripts/build-client.ts` compiles them ahead of time** (`npm run build-client`): it runs `createAssetServer` once in Node, starting from every module under `app/**/public/**`, follows every import, and writes each module to `public/client/` for the `ASSETS` binding to serve. wrangler's `build.command` runs it before `wrangler dev` (and again when `app/` changes) and before every deploy, dry runs included, so the output always matches the source it ships with. `public/client/` is ignored by git; `scripts/deploy.sh` exempts it from its ignored-files check for that reason.

- **URLs are the source path.** A module is served at `/client/` plus its repository path with `.js` (`ASSETS` picks the Content-Type from the extension, and `.ts` is not JavaScript to it); the build rewrites every import specifier to match. So a component names its own client entry with `clientModuleUrl('app/…/x.tsx')` (`app/ui/public/client-module-url.ts`) and `render()` needs no `assets` — the `render()` README: omit it "when client entries already use public URLs". `clientEntry(import.meta.url, …)` does not work here: wrangler bundles the Worker into one file, and `import.meta.url` stops naming the module. Every client entry gets a test that renders it and checks the URL in `rmx-data` against its own file (`example-copy-button.test.tsx`).
- **No fingerprint, no import map.** Fixed URLs revalidate with ETag like every other root public/ file instead of being cached as immutable, and modules load as a waterfall without preloads. Fingerprinting would need a build manifest the server reads; add it if the request count starts to matter (a cold `/dev/ui` loads 44 modules).
- **Package imports are resolved at build time.** The asset server writes `remix/*` imports as URLs but leaves any other package as authored (`"some-package/x"`) and expects an import map to resolve it. The build applies the asset server's own `getImportMap()` instead — scopes first, longest match — and fails if a bare specifier stays unresolved, so a new package cannot reach the browser as a 404. A package must also be in `allowPackages` (`remix`, `keen-slider`).
- **`wrangler dev` reads `public/` once.** A file the build adds while it runs (a new module, a newly imported package) answers 404 until `wrangler dev` restarts; changed files are served fresh.
- **Loading the runtime.** A page that renders a client entry passes `hasClientEntries` to `Document`, which adds `<script type="module" nonce src="/client/app/actions/public/entry.js">`. Every other page ships no JavaScript of its own. `document.test.tsx` pins both.
- **Navigation stays document navigation.** `entry.ts` stops Remix from intercepting links and forms (it would otherwise fetch the next page and patch the DOM), so Google Analytics page views and the per-request CSP nonce keep working as they do without JavaScript. Revisit that if a page needs it.

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

Request flow: `workers/app.ts` → `workers/handler.ts` (Basic auth, then `ASSETS` for GET/HEAD, then `withErrorResponse`) → `router.fetch(request)` → middleware stack in `app/router.ts` (`securityHeaders()`, `cop()`, `trailingSlash()`, `renderWithCsp()` — see **Security** — then `errorPage()`, see **Error pages**) → the controller mapped for the matched route → a `Response`.

The pieces that must stay in sync:

- **`app/routes.ts`** — the single source of truth for URLs. Add routes here before wiring anything else, and build every internal URL with `routes.<name>.href(...)` rather than a string literal — a query too, through `href(params, { searchParams })`.
- **`app/router.ts`** — builds the middleware stack, derives `AppContext` from it via `MiddlewareContext<[...]>`, publishes that type through `declare module 'remix'`, then calls `router.map(routes, controller)`. `router.map` wires only *direct leaf* routes; each nested route map needs its own `router.map(routes.<key>, controller)` line and its own `app/actions/<route-key>/controller.tsx`.
- **`app/actions/controller.tsx`** — `createController(routes, { actions })`, one action per leaf route key. Actions return `Response` objects; UI responses go through `context.render(<Node />)`, which the `render()` middleware provides.
- **`app/env.ts`** — the only module that reads `process.env`. Everything else imports the resolved constants (`NODE_ENV`, `IS_PRODUCTION`, `BUILD_ID`, `HAS_BUILD_ID`, `DEPLOYED_AT`, `CACHE_BUSTER`, `SITE_URL`, `NO_INDEX`, `SITE_NAME`, `API_URL`, `GOOGLE_ANALYTICS_ID`) — tests included: `app/env.test.ts` skips on `HAS_BUILD_ID` rather than reading the variable.
- **`app/ui/`** — shared cross-route UI, organized by category (see "The `app/ui/` layout").
- **`app/middleware/`** — request-lifecycle middleware (`security-headers.ts`, `csp.tsx`, see **Security**; `lang.ts`, `trailing-slash.ts`, `local-redirect.ts`, see **Languages**; `error-page.tsx`, see **Error pages**).
- **`app/data/`** — the Kuroco API client and its resources (see **Data**).
- **`app/utils/i18n.ts`** — the language list and the message helper (see **Languages**); `app/utils/page-names.ts` — page names shown in more than one place (see **Page metadata**); `drink-card.ts`, `drink-search.ts`, `date.ts` — see **Data**.
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
