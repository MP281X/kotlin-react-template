# AGENTS.md

This document provides guidelines for agentic coding assistants working in this repository.

## Project Overview

This is a monorepo containing:
- **Backend**: Kotlin/Spring Boot application with Jooq, Flyway, OpenAPI
- **Frontend**: React 19 application with TypeScript, TanStack Router, Tailwind CSS
- **Packages**: Shared components, utilities, and RPC layer

## Build Commands

### Root Commands
```bash
pnpm dev              # Run both backend and frontend in dev mode
pnpm fix              # Run all fixers (Biome + ktlint)
pnpm check            # Run all type checks (TypeScript + Biome + Kotlin compile)
pnpm codegen          # Run backend migration + OpenAPI TypeScript codegen
```

### Backend Commands (apps/backend)
```bash
pnpm backend#dev              # Start Spring Boot dev server (port 8080)
pnpm backend#migrate          # Run Flyway migrations + Jooq codegen
pnpm backend#codegen          # Generate OpenAPI spec + TypeScript types
pnpm backend#check            # Compile Kotlin code
pnpm backend#fix              # Format Kotlin with ktlint
pnpm backend#build            # Build JAR (skip tests)
```

### Frontend Commands (apps/frontend)
```bash
pnpm frontend#dev             # Start rsbuild dev server (port 3000)
pnpm frontend#check           # TypeScript check + Biome lint
pnpm frontend#fix             # Biome format + fix
pnpm frontend#build           # Production build
```

### Package Commands (packages/*)
```bash
pnpm components#check         # TypeScript check + Biome lint
pnpm components#fix           # Biome format
pnpm utils#check              # TypeScript check + Biome lint
pnpm utils#fix                # Biome format
pnpm rpc#check                # TypeScript check + Biome lint
pnpm rpc#fix                  # Biome format
```

### Running Single Tests
Currently no test framework is configured. When adding tests:
- Backend: Use `./mvnw test` for Kotlin tests
- Frontend: Use `vitest run` or `jest` for React tests

## Code Style Guidelines

### TypeScript/React

**Imports:**
- Use import extensions: `import { foo } from './foo.ts'` (required by biome)
- Use workspace aliases: `import { something } from '@/components'`
- Organize imports with empty line between groups
- Empty line between third-party and local imports

**Formatting:**
- Line width: 120 characters
- Quote style: single quotes
- Semicolons: as needed
- No trailing commas
- Arrow parentheses: as needed

**TypeScript Compiler:**
- Strict mode enabled
- No unused locals/parameters
- No implicit returns
- No unchecked indexed access
- Use `verbatimModuleSyntax` - import types explicitly

**Naming:**
- `camelCase` for variables, functions
- `PascalCase` for components, types, interfaces
- `UPPER_SNAKE_CASE` for constants
- `kebab-case` for file names (except components)

**React:**
- Use TanStack Router for routing
- Use TanStack React Form for forms
- Use TanStack React Table for tables
- Use TanStack React Virtual for virtualization
- Avoid `any` - use explicit types
- Use `// biome-ignore` for intentional violations

**State Management:**
- Use Effect-TS for functional effects
- Use TanStack React DB for data fetching/caching
- Use atoms from `@effect-atom/atom-react` for local state

### Kotlin

**Formatting:**
- Run `./scripts/ktlint --format` before committing
- Exclude generated Jooq code from formatting

**Naming:**
- `camelCase` for functions and properties
- `PascalCase` for classes, interfaces, enums
- `SCREAMING_SNAKE_CASE` for constants
- Package names: `com.backend.<feature>`

**Error Handling:**
- Extend `HttpStatusException` for HTTP errors
- Use `@ControllerAdvice` for global exception handling
- Log with SLF4J: `logger.error(...)`
- Return consistent `ResponseEntity` responses

**Architecture:**
- Controllers in `com.backend.web`
- Services in `com.backend.core.<feature>`
- Repositories in `com.backend.db.<feature>`
- Config in `com.backend.web.config`

**Imports:**
- Sort imports alphabetically
- Group: Kotlin stdlib → Spring → Jooq → Local
- Use wildcard imports sparingly

### General

**Monorepo Structure:**
```
apps/
  backend/       # Spring Boot + Kotlin
  frontend/      # React + TypeScript
packages/
  components/    # Shared UI components (shadcn)
  rpc/           # Type-safe API client
  utils/         # Shared utilities
```

**Environment Variables:**
- `BACKEND_*` - Backend configuration
- `PUBLIC_*` - Frontend exposed variables
- `POSTGRES_*` - Database configuration
- `NODE_*` - Node.js configuration

**Database:**
- Use Flyway for migrations (src/main/resources/db/migration)
- Use Jooq for type-safe queries
- Generate types with `pnpm backend#migrate`

**Linting:**
- Biome for TypeScript/React/CSS
- ktlint for Kotlin
- All checks run in CI via `pnpm check`

**Formatting:**
- Biome runs format + lint fixes
- ktlint for Kotlin formatting
- Run `pnpm fix` before committing

## Configuration Files

- `biome.json` - Biome lint/format rules
- `tsconfig.json` - TypeScript compiler options
- `turbo.json` - Turborepo task definitions
- `pnpm-workspace.yaml` - Workspace structure
- `.editorconfig` - Editor settings
