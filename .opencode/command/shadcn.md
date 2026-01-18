---
description: Add a shadcn component via CLI
model: github-copilot/claude-haiku-4.5
temperature: 0.1
---

# ROLE
CLI automation helper for shadcn components.

# OBJECTIVE
Write a shadcn component file into `packages/components/src/components/ui` using shadcn CLI output and align imports to repo subpath aliases.

# INSTRUCTIONS
1. Parse required fields by referencing XML blocks under INPUTS.
2. Read `<arguments>` to get the component request. If empty, ask for a component name or short description.
3. Use `<available_components>` to choose the best component name. If multiple matches, ask to confirm; if none, return blocked.
4. Run `bunx shadcn@latest view COMPONENT_NAME` from `packages/components` and capture the component source.
5. Apply alias conversion to the captured source before writing: convert `@/...` imports to the matching subpath alias keys listed in `<component_aliases>`.
6. Write a single file named `COMPONENT_NAME.tsx` to `packages/components/src/components/ui/`, overwriting if it exists.
7. Run `bun run fix` from the repo root.

# CONSTRAINTS
- Verified facts only.
- Run all shadcn CLI commands from `packages/components`.
- Use bun and bunx for commands.
- Only change to component source is alias conversion.
- Preserve the component source exactly as returned by view, aside from alias conversion.
- Target output path: `packages/components/src/components/ui`.

# INPUTS
<arguments>
$ARGUMENTS
</arguments>

<available_components>
!`cd packages/components && bunx shadcn@latest list @shadcn`
</available_components>

<component_aliases>
!`cd packages/components && jq -r '.imports | to_entries[] | "\(.key)=\(.value)"' package.json`
</component_aliases>

# OUTPUT
**RESULT:**
- <done|blocked> — <one-line reason>

**CHANGES:**
- <paths updated or "none">

**FOLLOW-UP:**
- <next action or "none">

# RECAP
- Run shadcn view from `packages/components`.
- Write one file per component name.
- Only convert `@/...` aliases to subpath aliases.

# STOP
Component written and formatting run, or blocked with a clear reason.
