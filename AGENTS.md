# Repository Guidelines

## Project Structure & Module Organization
- `src/app` contains App Router routes, layouts, and server actions grouped by segment.
- Shared UI sits in `src/components`, `src/ui`, and `src/design`; domain logic lives in `src/actions`, `src/lib`, and `src/store.config.ts`.
- Stripe, localization, and environment wiring live in `src/env.mjs`, `src/i18n`, and `messages/`.
- Static assets live in `public/`, extra references in `docs/`, and E2E specs in `tests/`.

## Build, Test, and Development Commands
- `bun install` — install dependencies; prefer Bun to stay aligned with the lockfile.
- `bun run dev` — start the turbo Next.js dev server on `http://localhost:3000`.
- `bun run build` / `bun run start` — produce and serve a production build.
- `bun run lint` — run Biome for formatting and linting; commit hooks rely on the same command.
- `bun test` — execute Bun-based unit tests configured through `src/setup-tests.ts`.
- `bunx playwright test` — run E2E flows in `tests/`; run `bunx playwright install` once per machine and set `NEXT_PUBLIC_URL`.

## Coding Style & Naming Conventions
- Biome enforces tab indentation, 110 character lines, double quotes, and trailing commas; rely on it for formatting.
- Prefer typed exports and Server Components; use `"use client"` only when browser APIs are required.
- Name components and hooks with `PascalCase` / `useCamelCase`, mirror route layouts under the matching `src/app` segment, and keep shared utilities in `src/lib`.

## Testing Guidelines
- Place unit specs alongside source files as `<name>.test.ts`; they pick up DOM matchers via `src/setup-tests.ts`.
- Keep fixtures deterministic and mock Stripe or Redis at the module boundary.
- Playwright specs in `tests/` expect seeded credentials: export `EMAIL`, `PASSWORD`, and `NEXT_PUBLIC_URL` before running `bunx playwright test`.
- Prioritize checkout, auth, and localization coverage; log flaky cases in `test-results/`.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (`feat:`, `fix:`, `chore:`); `commitlint` caps bodies at 100 characters per line.
- Keep commits focused, add context when touching external services, and run `bun run lint && bun test` before pushing.
- Pull requests need a concise summary, linked issue or task, environment or migration notes, and screenshots for visual changes.

## Environment & Configuration Tips
- Copy `.env.example` to `.env` and update Stripe keys, `NEXT_PUBLIC_URL`, and feature toggles before running local commands.
- `src/env.mjs` validates variables at startup; keep new secrets centralized there and document defaults in `docs/`.
- When adding translations, update `messages/<locale>.json` and the loader in `src/i18n`.
