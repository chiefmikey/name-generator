# Retro: Static Revamp (2026-03-10)

## What Worked
- **Pre-populated JSON datasets**: Fetching data from Datamuse and Fruityvice APIs once and bundling as static JSON was clean and effective. Zero runtime API dependencies.
- **Component simplification**: Converting from multi-submit axios pattern to single-flow v-model was a massive simplification. Each component went from ~30 lines to ~15 lines.
- **Glassmorphism UI**: The dark gradient + glassmorphism card + teal accents looks polished with minimal CSS. The emo mode toggle adds personality.
- **Browser testing with Playwright**: Automated visual verification caught nothing broken, confirmed all features work end-to-end.

## What Didn't Work
- **eslint-plugin-prettier hangs when prettier is missing**: After the rebase conflict resolution regenerated package-lock.json, prettier was no longer installed. The eslint-plugin-prettier rule doesn't error out — it hangs indefinitely with no message. Took extensive binary search debugging (narrowing 388 rules to find the one hanging) to identify the root cause.
- **Multiple zombie ESLint processes**: Background ESLint runs that timed out left zombie processes consuming 450MB+ RAM each, making subsequent runs even slower.
- **Rebase conflict resolution dropped implicit deps**: Taking `--theirs` for package-lock.json and regenerating with `npm install` resolved to different transitive dependency versions, causing prettier to disappear from node_modules.

## What Was Surprising
- **mikey-pro bundles eslint-plugin-prettier but not prettier itself**: This is a footgun. The plugin silently hangs instead of throwing "prettier not found". Same pattern with eslint-import-resolver-typescript (documented in previous retro).
- **@mikey-pro/eslint-config-vue is a separate package**: The base mikey-pro config covers JS/TS/CSS/SCSS/MD/YAML/TOML/HTML but NOT Vue. Easy to miss.
- **Dropbox filesystem + ESLint = slow**: ESLint with the full mikey-pro config (388+ rules, 25 plugins) is noticeably slower on Dropbox-synced directories.

## Applied Updates
- Updated CLAUDE.md with prettier and Vue ESLint config gotchas
- Updated MEMORY.md with current project state and new mikey-pro gotchas
- Added `markdown/no-missing-label-refs` gotcha (checkbox syntax in docs)

## Key Numbers
- 24 files changed, 646 insertions, 1982 deletions (net -1336 lines)
- Removed 7 server/route files + 1 unused component
- Added 4 static JSON data files
- Runtime dependencies: went from 7 (koa, axios, vue, etc.) to 1 (vue)
- Build output: 91.3 KiB minified bundle
