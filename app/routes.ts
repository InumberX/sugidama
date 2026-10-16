// The single source of truth for URLs. Patterns are literals so Remix can type
// `href()` arguments and `context.params` from them. This module imports nothing
// from the app, so nothing can create a cycle back into the route contract.
import { get, route } from 'remix/routes'

// Every public page carries the optional language prefix: `/(:lang)` for the
// root, `/(:lang/)drinks` and so on below it. The parentheses go around the
// segment *and* its slash on the side that keeps the URL well formed —
// `(/:lang)` never matches `/en` — and `href()` drops the whole group when
// `lang` is `undefined`, which is what `toLangParam()` returns for Japanese.
// The lang() middleware turns the param into `context.lang`; patterns cannot
// constrain a variable, so it is also what rejects `/fr`.
export const routes = route({
  home: get('/(:lang)'),
  // A route area: its own controller (app/actions/drinks/) and router.map line.
  // `drinkId` is the drink's slug, or its topics_id when it has none.
  drinks: {
    index: get('/(:lang/)drinks'),
    show: get('/(:lang/)drinks/:drinkId'),
  },
  // Development-only component gallery. Declared unconditionally so the route
  // map stays a stable type; the action returns 404 outside development.
  devUi: get('/dev/ui'),
})
