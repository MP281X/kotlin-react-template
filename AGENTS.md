# AGENTS.md

Guidelines for agentic coding assistants working in this repository.

## Repository Overview
- Monorepo with Kotlin/Spring Boot backend and React/TypeScript frontend.
- Workspace packages live in `packages/components`, `packages/utils`, `packages/rpc`.
- Tooling: Bun + Turbo for JS tasks, Maven Wrapper for backend build/codegen.

## Repo Layout
```
apps/
  backend/       # Spring Boot + Kotlin
  frontend/      # React + TypeScript
packages/
  components/    # Shared UI components
  rpc/           # Type-safe API client
  utils/         # Shared utilities
docker/          # Local infra (Postgres)
scripts/         # Repo automation
```

## Core Commands (run from repo root)
```bash
bun run dev         # Run backend + frontend in dev mode
bun run fix         # Run Biome + ktlint fixers
bun run check       # TypeScript + Biome + Kotlin compile checks
bun run codegen     # Backend migrate + OpenAPI TS codegen
bun run setup       # Clean install + docker + codegen bootstrap
```

## Per-Package Commands

### Backend (apps/backend)
```bash
bun --cwd apps/backend run dev       # Spring Boot dev server (8080)
bun --cwd apps/backend run migrate   # Flyway clean/migrate + Jooq codegen
bun --cwd apps/backend run codegen   # OpenAPI JSON + TS types
bun --cwd apps/backend run check     # Kotlin compile
bun --cwd apps/backend run fix       # ktlint format
bun --cwd apps/backend run build     # Build JAR (skip tests)
```

### Frontend (apps/frontend)
```bash
bun --cwd apps/frontend run dev      # Rsbuild dev server (3000)
bun --cwd apps/frontend run check    # tsgo --noEmit + Biome lint
bun --cwd apps/frontend run fix      # Biome format + fixes
bun --cwd apps/frontend run build    # Production build
```

### Packages (packages/*)
```bash
bun --cwd packages/components run check
bun --cwd packages/components run fix
bun --cwd packages/utils run check
bun --cwd packages/utils run fix
bun --cwd packages/rpc run check
bun --cwd packages/rpc run fix
```

### Turbo Filters (optional)
```bash
bunx turbo run check --filter=frontend
bunx turbo run fix --filter=components
```

## Tests (Single Test Focus)
- No JS/TS test runner is configured yet; there is no `test` script in packages.
- Backend (Maven/JUnit):
  - All tests: `./mvnw test` (from `apps/backend`).
  - Single test class: `./mvnw -Dtest=MyTest test`.
  - Single test method: `./mvnw -Dtest=MyTest#testName test`.
- Frontend (if tests are added later): prefer Vitest.
  - Single file: `bunx vitest run src/path/to/test.ts`.
  - Single test: `bunx vitest run -t "test name"`.

## Codegen + Generated Files
- `bun run codegen` runs backend migration + OpenAPI TypeScript output.
- Generated files to avoid manual edits:
  - `apps/backend/openapi.g.ts`
  - `apps/backend/src/main/kotlin/com/backend/jooq/**`

## Code Style Guidelines

### TypeScript / React
- Imports
  - Use explicit extensions: `import { foo } from './foo.ts'` (Biome enforces).
  - Use `import type` with `verbatimModuleSyntax` enabled.
  - Group imports: third-party, workspace packages, local aliases, relatives.
  - Workspace packages: `@/components`, `@/utils`, `@/rpc`.
  - Local aliases (per package): `#lib/*`, `#components/*`, `#routes/*`.
- Formatting (Biome)
  - Line width 120, single quotes, semicolons as needed.
  - No trailing commas; arrow parens only when required.
  - Organized imports are auto-applied by Biome.
- Types
  - `strict` mode, `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`.
  - Avoid `any`; prefer explicit types and `unknown` for boundaries.
  - Use array shorthand types (`string[]`) per Biome rule.
- React
  - Router: TanStack Router.
  - State: Effect + `@effect-atom/atom-react` for local atoms.
  - Data: `@tanstack/react-db` + RPC package.
  - Avoid console usage (Biome `noConsole` is error).
- Styling
  - Tailwind CSS for styling; prefer shared UI from `@/components`.
  - Theme assets live in `packages/components` (`theme.css`, `theme_v2.css`, `theme_v3.css`).

### Kotlin / Spring Boot
- Formatting
  - Run `bun --cwd apps/backend run fix` or `./scripts/ktlint --format`.
  - Do not format generated Jooq files.
- Naming
  - `camelCase` for functions/properties, `PascalCase` for classes.
  - `SCREAMING_SNAKE_CASE` for constants.
  - Package namespace: `com.backend.<feature>`.
- Error handling
  - Use `HttpStatusException` subclasses for HTTP errors.
  - Centralize with `@ControllerAdvice`.
  - Log via SLF4J (`logger.error(...)`).
- Imports
  - Sort alphabetically; group stdlib, Spring, Jooq, local.
  - Avoid wildcard imports.
- Architecture
  - Controllers: `com.backend.web`.
  - Services: `com.backend.core.<feature>`.
  - Repositories: `com.backend.db.<feature>`.
  - Config: `com.backend.web.config`.
- Database
  - Flyway migrations: `apps/backend/src/main/resources/db/migration`.
  - Jooq output lives in `apps/backend/src/main/kotlin/com/backend/jooq`.

### General
- Keep generated files untouched; rerun codegen instead.
- Prefer existing utilities/components from `packages/*` before adding new ones.
- Environment variables (Turbo globalEnv): `BACKEND_*`, `PUBLIC_*`, `POSTGRES_*`, `NODE_*`.

## Cursor/Copilot Rules
- No `.cursor/rules`, `.cursorrules`, or `.github/copilot-instructions.md` found.

## Key Config Files
- `biome.json` - JS/TS lint + format rules.
- `tsconfig.json` - strict TS options + Effect language service.
- `turbo.json` - task graph + outputs.
- `apps/backend/pom.xml` - Maven build config.
- `scripts/ktlint` - Kotlin formatter wrapper.
