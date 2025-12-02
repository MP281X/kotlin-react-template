---
description: Add a shadcn component to the monorepo
agent: design
---

Component (required, optional registry after space):
$ARGUMENTS

## Process

1. **Fetch component** — Use `shadcn_get_item_examples_from_registries` with the component name and registries (default `["@shadcn"]`).

2. **Transform imports** — Apply only these transformations:
   - `@radix-ui/react-*` → `import * as Radix from 'radix-ui'` then `Radix.ComponentName.SubComponent`
   - `@/lib/utils` or `@/registry/.../utils` → `#lib/utils.tsx`
   - `@/components/ui/*` or `@/registry/.../ui/*` → `#components/ui/*.tsx`
   - Remove `"use client"` directive
   - Remove `import * as React from "react"`
   - Convert `function X` + `export { X }` → `export function X`

   Keep everything else exactly as-is: props, types, signatures, class names, logic.

3. **Write file** — Save to `packages/components/src/components/ui/{name}.tsx`

4. **Check dependencies** — Verify imports exist in `packages/components/package.json`. Add missing packages with version `latest`.

5. **Validate** — Fix any linting or type errors by reviewing existing components in `packages/components/src/components/ui/`.

## Example

```tsx
// before (from shadcn registry)
"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"

function Dialog({ ...props }) { }
export { Dialog }

// after (transformed for this monorepo)
import * as Radix from "radix-ui"
import { cn } from "#lib/utils.tsx"

export function Dialog({ ...props }) { }
```
