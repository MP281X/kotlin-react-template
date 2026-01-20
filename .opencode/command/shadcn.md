---
description: Add a shadcn component via CLI
model: github-copilot/claude-haiku-4.5
temperature: 0.1
---

# PRIMARY INTENT / ROLE
Automate adding a shadcn UI component via CLI and write it into the shared UI directory with repo alias alignment.

# CONTEXT BOUNDARIES
- Allowed sources: the request argument and the inline values provided in this prompt.
- Use the shadcn CLI output as the sole source of component code.
- Do not speculate beyond provided inputs.

# REASONING CONSTRAINTS
- Prioritize correctness of component selection and faithful output from the shadcn CLI.
- Keep edits minimal: only the allowed import transformations are permitted.
- Prefer explicit confirmation when component selection is ambiguous.
- Prefer parallel tool calls for independent operations.

# FAILURE BEHAVIOUR
- If the request argument is empty or unclear, ask for a component name or short description.
- If no component matches the available list, return blocked with the reason.
- If multiple components match, ask the user to confirm before proceeding.

# OUTPUT CONTRACT
Return well-formatted markdown with exactly these sections and list items:

**RESULT:**
- <done|blocked> — <one-line reason>

**CHANGES:**
- <paths updated or "none">

**FOLLOW-UP:**
- <next action or "none">

# QUALITY BAR
- Component name is selected from the available list and confirmed when ambiguous.
- Component source matches shadcn view output except for allowed import transformations.
- React import is preserved when present.
- Radix imports are normalized to the required form.
- File written to the correct path with the correct kebab-case name.
- Formatting command executed after writing.
- Output follows the contract exactly.

# CONSTRAINTS
- Use bun and bunx for commands.
- Run all shadcn CLI commands from `packages/components`.
- Only change to component source is import normalization and alias conversion.
- Preserve any `import * as React from 'react'` line if present.
- Replace Radix imports with a single `import * as Radix from 'radix-ui'` line, matching existing component conventions.
- Preserve the component source exactly as returned by the view command, aside from the allowed import transformations.
- Write a single file named `kebab-case.tsx` to `packages/components/src/components/ui`, overwriting if it exists.
- Run the formatting command from the repo root after writing.

# INPUTS
<request>
$ARGUMENTS
</request>

<inline_values>
<available_components>
!`cd packages/components && bunx shadcn@latest list @shadcn`
</available_components>

<component_aliases>
!`cd packages/components && jq -r '.imports | to_entries[] | "\(.key)=\(.value)"' package.json`
</component_aliases>
</inline_values>

# REFERENCE
Workflow:
- Resolve the desired component name from the request argument using the available components list.
- Run the shadcn view command for the selected component and capture the source.
- Normalize imports:
  - Preserve `import * as React from 'react'` if present.
  - Replace Radix imports with `import * as Radix from 'radix-ui'`.
  - Convert any `@/...` imports to the matching subpath alias key from the aliases list.
- Write the result to the target UI components directory using a kebab-case file name.
- Run the formatting command after the file is written.

Bash commands:
- `cd packages/components && bunx shadcn@latest list @shadcn` — list available shadcn components.
- `cd packages/components && bunx shadcn@latest view COMPONENT_NAME` — output component source.
- `bun run fix` — run repo formatting after the file write.

Do:
- Use the aliases mapping to replace only the import path prefixes.
- Keep only one Radix import in the required form.
- Confirm with the user when multiple components match.

Don't:
- Modify component content beyond the allowed import transformations.
- Write files outside the UI components directory.

# OUTPUT
- One component file created or overwritten under `packages/components/src/components/ui`.
- Formatting run after the write.

# STOP
Stop once the component is written and formatting has run, or return blocked with a clear reason.
