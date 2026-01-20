# Kotlin React Template

Monorepo template for a React frontend and Kotlin/Spring backend.

## Prerequisites

- Bun 1.3.5
- Java 21 (JDK)
- Docker and Docker Compose


## Quick start

```bash
bun run setup
bun run dev
```

`bun run setup` will:

- Install dependencies
- Start Postgres, ElectricSQL, Nginx
- Run migrations and OpenAPI/DB codegen
- Start frontend and backend in dev mode


## URLs and ports

Main entry (self-signed TLS): `https://localhost:7070`

Proxy routes:


| Path    | Target                  |
| :------ | :---------------------- |
| `/`     | `http://localhost:3000` |
| `/api/` | `http://localhost:8080` |

Services:


| Service           | Port   |
| :---------------- | :----- |
| Nginx HTTPS proxy | `7070` |
| React dev server  | `3000` |
| Spring Boot API   | `8080` |
| Postgres          | `5432` |
| ElectricSQL       | `5433` |

## Commands

| Command           | Description                          |
| :---------------- | :----------------------------------- |
| `bun run dev`     | Start frontend and backend.          |
| `bun run check`   | Formatting, linting, type checks.    |
| `bun run fix`     | Fix formatting/linting issues.       |
| `bun run codegen` | Generate OpenAPI spec and TS types.  |

## Structure

```txt
apps/backend     Kotlin/Spring API
apps/frontend    React app
packages/*       Shared UI, utils, RPC
```


## Tech Stack

- Bun + Turbo
- React 19 + Rsbuild + Tailwind + shadcn/ui
- Kotlin 2.2 + Spring Boot 3.5 + Jooq + Flyway
- Postgres 17 + ElectricSQL
