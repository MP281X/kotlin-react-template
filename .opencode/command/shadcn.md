---
description: Add a shadcn component to the monorepo
agent: design
---

Add a shadcn component to the components package.

Component to add (and optional registry): $ARGUMENTS

## Process

1. **Fetch the component** — Use `shadcn_get_item_examples_from_registries` with the component name and registries (default `["@shadcn"]` if not specified)

2. **Transform the code** — Apply ONLY these exact transformations, preserving everything else exactly as-is:
   - `@radix-ui/react-*` → `import * as Radix from 'radix-ui'` then use `Radix.ComponentName.SubComponent`
   - `@/lib/utils` or `@/registry/.../utils` → `#lib/utils.tsx`
   - `@/components/ui/*` or `@/registry/.../ui/*` → `#components/ui/*.tsx`
   - Remove `"use client"` directive
   - Remove `import * as React from "react"`
   - Convert `function X` + `export { X }` → `export function X`

   **IMPORTANT**: Do NOT modify anything else. Keep the original:
   - Code style and formatting
   - Component props and their types
   - Function signatures and parameter defaults
   - Class names and Tailwind utilities
   - Internal logic and structure

3. **Write to** `packages/components/src/components/ui/{name}.tsx`

4. **Check dependencies** — Verify all imported packages are listed in `packages/components/package.json`. If there are missing dependencies:
   - Analyze the package.json to understand how dependencies are grouped by scope
   - Edit the package.json to add missing packages with version `latest`, placing each in the appropriate group

5. **Verify** — If there are linting or type errors, review existing components in `packages/components/src/components/ui/` and `packages/components/src/theme.css` to resolve inconsistencies
