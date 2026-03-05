# Name Generator

## Overview
Full-stack text generator that creates fun social media names from user inputs (birthday, animal, fruit). Vue 3 frontend with Koa backend, bundled with Webpack.

## Tech Stack
- **Frontend**: Vue 3 (Options API, SFC), SCSS, Webpack 5, Babel
- **Backend**: Koa 2, TypeScript, ts-node
- **Linting**: ESLint 10 (flat config via mikey-pro), Prettier, Stylelint
- **External APIs**: Datamuse (emotions), Fruityvice (fruit data), Petfinder (animals)
- **Database**: MongoDB (referenced but not currently wired up)

## Architecture
```text
src/
  index.ts              # Vue app entry point
  vueShim.d.ts          # Vue SFC type declarations
  components/           # Vue SFCs (App, ChooseBirthday, ChooseAnimal, ChooseFruit, ChooseSelection)
  routes/
    submit.ts           # Placeholder route
    external/           # API proxy routes (emotion, fruit, animal)
    db/mongo/           # MongoDB get/post routes
server.ts               # Koa server (static files, SPA fallback)
webpack.config.ts       # Webpack config
public/                 # Static assets + built bundle
```

## Commands
- `npm run build:dev` — Development build with watch
- `npm run build:prod` — Production build
- `npm run fix` — ESLint auto-fix
- `npm run start:client` — Start Koa server on port 8080

## Conventions
- Conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`
- ESLint flat config via `mikey-pro` (re-exported from `eslint.config.js`)
- Prettier config via `mikey-pro/prettier`
- Stylelint config via `mikey-pro/stylelint`

## Common Mistakes to Avoid
- **No inline eslint-disable**: mikey-pro v10 enables `noInlineConfig`. All rule overrides must go in `eslint.config.js`.
- **Missing eslint-import-resolver-typescript**: mikey-pro references it but doesn't bundle it. Must be installed separately.
- **npm install needs `--legacy-peer-deps`**: ESLint 10 has peer dep conflicts with several plugins.
- **Prettier can't parse `.d.ts` files**: The `prettier/prettier` rule is disabled for `.d.ts` files in eslint config.

## Known Issues
- `src/routes/db/mongo/post.ts` imports `User` model that doesn't exist in repo
- `src/routes/external/animal.ts` imports `token.js` that doesn't exist in repo
- The server.ts and route files are not wired together (no route mounting)
