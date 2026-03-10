# Plan: Static Revamp — UI Overhaul + S3-Ready Architecture

_Status: COMPLETED_
_LastCompletedStep: 7_
_TotalSteps: 7_
_Completed: 2026-03-10_
_Summary: Converted to fully static site. Removed Koa backend + routes + server deps. Bundled pre-populated JSON datasets. Client-side generation with localStorage caching. Revamped UI with dark gradient, glassmorphism, emo mode toggle. All verification passed (build, lint, visual)._

## Goal

Transform the Name Generator from a Koa-backed app with external API dependencies into a fully static, S3+CloudFront-hostable site with a modern playful UI. Drop all server code, pre-populate data as static JSON, generate names client-side, cache results in localStorage.

## Design Decisions

- **Aesthetic**: Playful/bold — dark gradient background, bright accents, large typography, animations
- **Layout**: Single-flow form (no per-field submit buttons), responsive mobile-first
- **Data**: Static JSON bundled via webpack imports (no runtime API calls)
- **Persistence**: localStorage for caching generated results
- **Footer**: "made by chief mikey" linked to github.com/chiefmikey
- **Removed**: Koa server, all route files, axios dependency, ChooseSelection component

## Steps

### Step 1: Create static data files
- Create `src/data/emotions.json` (enthusiastic synonyms from Datamuse)
- Create `src/data/emo-emotions.json` (sad synonyms from Datamuse)
- Create `src/data/fruits.json` (fruit name -> sugar mapping from Fruityvice)
- Create `src/data/animals.json` (curated pet names by animal type)
- **Verify**: JSON files parse without errors, data looks reasonable

### Step 2: Remove server-side code
- Delete `server.ts`
- Delete `src/routes/` directory (submit.ts, external/*, db/*)
- Remove from package.json: koa, koa-static, koa-send, koa-bodyparser, @koa/router, axios, @types/koa-static, @types/koa__router, ts-node
- Remove `start:client` script
- Update eslint.config.js (remove route/server overrides)
- **Verify**: `npm install` succeeds, no broken imports

### Step 3: Simplify sub-components
- Rewrite `ChooseBirthday.vue` as pure v-model input (month/day selects)
- Rewrite `ChooseAnimal.vue` as pure v-model input (text input, no axios)
- Rewrite `ChooseFruit.vue` as pure v-model input (text input, no axios)
- Delete `ChooseSelection.vue`
- **Verify**: Components have no external dependencies, emit via v-model

### Step 4: Rewrite App.vue — logic
- Import static JSON data
- Client-side name generation (random emotion + pet name + sugar)
- localStorage cache (key: birthday-animal-fruit, value: generated results)
- Standard Vue 3 v-model binding with child components
- Single "Generate My Name" button, Emo Mode toggle
- **Verify**: Name generation works with static data

### Step 5: Restyle — playful/bold design
- Dark gradient background (deep purple to dark blue)
- Card: near-black with rounded corners, subtle glow
- Styled inputs: dark with light text, rounded, focus states
- Button: bright gradient (green to teal), hover animation
- Emo toggle: custom CSS toggle switch
- Result: large text with green glow animation on appearance
- Copy-to-clipboard button on result
- Responsive (mobile-first, max-width 500px on desktop)
- Footer: "made by chief mikey" linked to github.com/chiefmikey
- **Verify**: Build succeeds, visual inspection via browser

### Step 6: Update project config
- Update CLAUDE.md to reflect new architecture
- Update webpack config if needed (JSON imports should work already)
- Clean up any stale references
- **Verify**: Lint passes (0 errors), build succeeds

### Step 7: Final verification and commit
- `npm run build:prod` — must succeed
- `npx eslint .` — 0 errors
- Visual verification in browser
- Commit with conventional message
- Push to origin
- **Verify**: All green

## Verification Plan
- Build compiles without errors
- Lint passes (0 errors)
- Name generation produces correct format
- Emo mode toggle switches result format
- localStorage caching works
- Responsive layout works on mobile viewport
- Footer links to github.com/chiefmikey
- No server-side code remains

## Risks
- Webpack JSON imports may need resolver config — mitigated by existing `.json` in resolve.extensions
- Vue component refactor may break v-model binding — verify each component independently
- SCSS changes may conflict with vue-style-loader — test build after each major style change

## Execution Journal
(populated during execution)
