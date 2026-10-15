#!/bin/sh
# Deploys the Worker to one wrangler environment, stamping it with the two
# per-deploy values app/env.ts reads: BUILD_ID (the commit, which feeds the
# CACHE_BUSTER on app.css) and DEPLOYED_AT (UTC, the sitemap's <lastmod>).
# Everything else comes from wrangler.jsonc (`env.<name>.vars`).
#
# Run through `npm run deploy-development` / `deploy-production`; CI does too.
# Arguments after the environment go to wrangler, which is how CI's build job
# runs this same script with `--dry-run --outdir=...` on every push.
set -eu

env_name=${1:?usage: scripts/deploy.sh <development|production> [wrangler args...]}
shift

# The project's own wrangler, not whatever is on PATH: run directly, outside
# npm, PATH may have none, or a global one of another version.
wrangler="$(dirname "$0")/../node_modules/.bin/wrangler"

# Fails the deploy rather than shipping `BUILD_ID=""`, which app/env.ts would
# quietly turn into `dev` and so stop invalidating app.css.
build_id=$(git rev-parse HEAD)

# BUILD_ID names a commit, so what ships must be that commit. Uncommitted or
# untracked files would go out under a sha that does not contain them — an
# untracked file under public/ is uploaded as an asset, and one the entry
# imports is bundled — and a later deploy of the real commit would reuse the
# same `?ver=` URL. Ignored paths (node_modules/, .wrangler/, .dev.vars) do not
# count.
if [ -n "$(git status --porcelain)" ]; then
  echo "deploy: the working tree is not clean; commit or stash first:" >&2
  git status --short >&2
  exit 1
fi

# The same holds for ignored files under public/: wrangler uploads everything
# in the assets directory, so a stray .DS_Store or an old build output there
# would be published under this commit's BUILD_ID.
if [ -n "$(git status --porcelain --ignored -- public)" ]; then
  echo "deploy: public/ contains ignored files that wrangler would upload:" >&2
  git status --short --ignored -- public >&2
  exit 1
fi

deployed_at=$(date -u +%Y-%m-%dT%H:%M:%SZ)

exec "$wrangler" deploy --env="$env_name" \
  --var "BUILD_ID:$build_id" \
  --var "DEPLOYED_AT:$deployed_at" \
  "$@"
