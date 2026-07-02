# Campus Market Seed — Agent Guide

## Quick start

```bash
pnpm install          # install deps (pnpm is required, not npm)
pnpm mock             # start JSON Server on :3001 (required before dev)
pnpm dev              # Vite dev server on :5173
pnpm build            # type-check then build (runs `vue-tsc --build` first)
pnpm lint             # oxlint . --fix  then  eslint . --fix --cache
pnpm type-check       # vue-tsc --build
pnpm preview          # vite preview
```

**Required order**: `mock` must be running before `dev`, or the app's API calls will fail.

## Project anatomy

| Path | Purpose |
|---|---|
| `src/main.ts` | App entry: mounts Vue + Pinia + Router |
| `src/router/index.ts` | 10 routes: home, login, register, trade, lost-found, group-buy, errand, publish, message, user |
| `src/api/` | Axios wrappers, baseURL `http://localhost:3001` |
| `src/stores/user.ts` | Pinia store — login via JSON Server `/users`, persists to `localStorage` key `campus-market-current-user` |
| `src/stores/favorite.ts` | Pinia store — in-memory only, no persistence |
| `src/components/AppLayout.vue` | Root layout: `AppHeader` + `<RouterView />` |
| `db.json` | Mock data source for JSON Server (users, trades, lostFounds, groupBuys, errands) |
| `check.js` | Standalone validation script for project checklist / Day7 report |
| `docs/evidence/` | Daily evidence cards (Day1–Day7) |
| `src/views/prototype/` | Draft HTML prototypes (not part of the app) |

## Key details

- **Framework**: Vue 3 + Composition API (`<script setup lang="ts">`)
- **UI library**: Element Plus
- **State**: Pinia (user + favorite stores)
- **Router**: vue-router@5 with `createWebHistory`
- **HTTP**: Axios → `http://localhost:3001/<resource>` (json-server REST)
- **Path alias**: `@/` → `src/`
- **TypeScript**: `vue-tsc` for type-checking (incremental, outputs `.tsbuildinfo` to `node_modules/.tmp/`)

## Test account

| Username | Password |
|---|---|
| `student` | `123456` |

## Conventions

- **EditorConfig**: 2-space indent, LF line endings, UTF-8, max 100 chars
- **Lint**: oxlint (correctness errors) then ESLint (flat config + Vue/TS rules); both run on `pnpm lint`
- **VSCode**: fix-all on save enabled; recommended extensions: Volar, ESLint, EditorConfig, Oxc
- **No tests**: no test framework is installed

## Gotchas

- `package.json` uses `run-p` / `run-s` via `npm-run-all2` for script orchestration
- `tsconfig.json` is a solution file referencing `tsconfig.app.json` + `tsconfig.node.json`; don't edit it directly for compiler options
- Mock data in `db.json` has `status` field with values: `open`, `done`, `closed` — the app's views may filter on this
- Favorites are not persisted (in-memory only — lost on refresh)
- User login is persisted to `localStorage` and restored via `userStore.restoreLogin()` in `App.vue`'s `onMounted`
