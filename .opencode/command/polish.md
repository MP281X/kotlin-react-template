---
description: Refactor code for clarity, simplicity, and best practices
---

Target (optional — file path, folder, or feature description; defaults to last edited files):
$ARGUMENTS

## Process

1. **Identify target** — If target is a file/folder path, read it. If it describes a feature, find related files using glob/grep. If empty, refactor the most recently edited files in this session.

2. **Gather context** (parallel)
   - Read target file and adjacent files in the same directory
   - Search for similar patterns in the codebase using grep
   - Fetch documentation: Effect-ts code → `effect-ts` agent, everything else → `fetch-docs` agent

3. **Refactor loop** (max 3 passes)
   - **Analyze** (priority order): correctness → simplicity → readability → consistency → type safety
   - **Apply**: remove before adding, flatten nesting, reuse project patterns, match naming conventions
   - **Keep inline**: prefer inline code unless extraction significantly improves readability — avoid forcing readers to jump between files/functions
   - **Re-read**: look for new opportunities. Exit if none found.

4. **Review diff** — Run `git diff`, verify each change is justified, revert anything without clear value.

5. **Validate** — Run `pnpm run fix` then `pnpm run check`. Fix issues until passing.

## Output
- **Passes** — How many iterations and why it stopped
- **Changes** — What changed and why
- **Docs** — Sources referenced
- **Validation** — Output from `run check`

## Examples

Flatten nested conditionals:
```ts
// before
if (user !== null && user !== undefined) {
  if (user.isActive === true) {
    return user.name
  }
}
return "Unknown"

// after
return user?.isActive ? user.name : "Unknown"
```

Early return instead of deep nesting:
```ts
// before
function process(data: Data) {
  if (data) {
    if (data.isValid) {
      if (data.items.length > 0) {
        return doWork(data)
      }
    }
  }
  return null
}

// after
function process(data: Data) {
  if (!data?.isValid || data.items.length === 0) return null
  return doWork(data)
}
```

Simplify verbose logic:
```ts
// before
let result: string
if (value === true) {
  result = "yes"
} else {
  result = "no"
}
return result

// after
return value ? "yes" : "no"
```
