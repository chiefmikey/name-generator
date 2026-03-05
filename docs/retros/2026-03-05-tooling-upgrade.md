# Retro: Tooling Upgrade — mikey-pro v10 + ESLint 10

_Date: 2026-03-05_

## Summary

Completed the in-progress tooling upgrade: mikey-pro v7 to v10, ESLint 10 flat config, replaced node-sass with sass (Dart Sass), fixed all 192 lint errors down to 0 errors / 4 acceptable warnings, and verified the production build.

## What Worked

- **Incremental approach**: Fixed the build first (sass), then the resolver, then ran `--fix`, then tackled remaining errors manually. Each step reduced the problem space.
- **Reading mikey-pro source directly**: Checking `node_modules/mikey-pro/eslint-config/` revealed exactly what resolver settings were expected, what `noInlineConfig` was set, and what rule configurations existed. Much faster than guessing.
- **Config-level overrides instead of inline comments**: Since mikey-pro enables `noInlineConfig`, all rule overrides had to go in `eslint.config.js`. This is actually cleaner — all exceptions are documented in one place.
- **Running `eslint --fix` after manual fixes**: Let the auto-fixer handle sorting (perfectionist) and formatting while focusing manual effort on structural issues.

## What Didn't Work

- **Inline eslint-disable comments**: Wasted a round of edits adding inline disable comments to route files before discovering mikey-pro enables `noInlineConfig`. All those comments had to be removed and replaced with config-level overrides.
- **npm install without `--legacy-peer-deps`**: ESLint 10 peer dependency conflicts with several eslint plugins that only support up to ESLint 9. Required `--legacy-peer-deps` for every install. Should note this for future installs.

## Surprises

- **mikey-pro `noInlineConfig: true`**: This was not documented anywhere visible. Inline `eslint-disable` comments are silently ignored (they show as warnings but don't suppress errors). This is a critical gotcha for any project using mikey-pro v10.
- **`eslint-import-resolver-typescript` not bundled with mikey-pro**: The mikey-pro TypeScript override references `typescript: { alwaysTryTypes: true }` resolver but doesn't include the package as a dependency. Projects must install it separately.
- **Prettier parsing `.d.ts` files**: Prettier's ESLint plugin can't parse `import type` inside `declare module` blocks in `.d.ts` files, even though prettier CLI handles them fine. Had to disable `prettier/prettier` for `.d.ts` files.
- **node-sass still in the ecosystem**: The project was using node-sass v9 which doesn't support ARM64 Mac at all. The sass (Dart Sass) drop-in replacement worked immediately with the `modern-compiler` API option.

## Applied Updates

- [x] Created CLAUDE.md for the project (didn't exist before)
- [x] Updated CLAUDE.md: added known issues section documenting broken route file imports
- [ ] No docs/context/ created (project too small to warrant separate context docs)
- [x] Updated MEMORY.md: added mikey-pro gotchas (see below)
