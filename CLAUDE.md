# Name Generator

## Overview
Static site that generates fun social media names from user inputs (birthday, animal, fruit). Vue 3 SPA with pre-populated JSON datasets, no backend required. Designed for dirt-cheap S3 + CloudFront hosting.

## Tech Stack
- **Frontend**: Vue 3 (Options API, SFC), SCSS, Webpack 5, Babel
- **Linting**: ESLint 10 (flat config via mikey-pro), Prettier, Stylelint
- **Data**: Static JSON datasets bundled at build time (emotions, fruits, animals)
- **Hosting**: S3 (`name-hullowurld-com`) + CloudFront (`E1IMS0MNM7TTIU`) at https://name.hullowurld.com

## Architecture
```text
src/
  index.ts              # Vue app entry point
  vueShim.d.ts          # Vue SFC type declarations
  components/           # Vue SFCs (App, ChooseBirthday, ChooseAnimal, ChooseFruit)
  data/                 # Static JSON datasets
    animals.json        # Animal types mapped to pet name arrays
    emotions.json       # Enthusiastic emotion words
    emo-emotions.json   # Sad/melancholic emotion words
    fruits.json         # Fruit names mapped to sugar content
webpack.config.js       # Webpack config (ESM)
public/                 # Static assets + built bundle
```

## Commands
- `npm run dev` — Start local dev server on port 8080
- `npm run build:dev` — Development build with watch
- `npm run build:prod` — Production build
- `npm run fix` — ESLint auto-fix

## Deployment
```bash
npm run build:prod
aws s3 sync public/ s3://name-hullowurld-com/ --delete --cache-control "max-age=86400"
aws cloudfront create-invalidation --distribution-id E1IMS0MNM7TTIU --paths "/*"
```

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
- **Markdown checkbox syntax**: ESLint markdown plugin treats `[ ]` and `[x]` as label references. Use plain bullets in markdown docs.
- **prettier must be installed separately**: mikey-pro bundles `eslint-plugin-prettier` but not `prettier` itself. Without it, the prettier/prettier rule hangs indefinitely (no error, just infinite wait).
- **@mikey-pro/eslint-config-vue required for .vue files**: mikey-pro base config only covers JS/TS/CSS/MD/etc. Vue SFC linting needs the separate `@mikey-pro/eslint-config-vue` package spread into eslint.config.js.
