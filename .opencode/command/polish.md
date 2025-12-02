---
description: Refactor code for clarity, simplicity, and best practices
agent: build
---

$ARGUMENTS

Activate Polish mode. Analyze step-by-step using only verified facts. Do not assume or speculate.

## Process

### 1. Identify Target
- If $ARGUMENTS contains a file path, read that file
- If $ARGUMENTS describes code, find it using glob/grep
- If empty, refactor the most recently edited/created file in this session

### 2. Gather Context (parallel)
Run these in parallel:
- **Read target file** and adjacent files in the same directory
- **Search for similar patterns** in the codebase using grep (find existing conventions)
- **Fetch documentation** using Task tool:
  - Effect-ts code → `subagent_type: "effect-ts"`
  - Everything else → `subagent_type: "fetch-docs"`
  - Query: specific APIs/patterns used in the target code

### 3. Refactor Loop (max 3 passes)

For each pass:

**3a. Analyze** (in priority order)
1. **Correctness** - Bugs, missing error handling, edge cases
2. **Simplicity** - Dead code, over-abstraction, unnecessary indirection, obvious comments
3. **Readability** - Unclear names, deep nesting, implicit behavior
4. **Consistency** - Deviations from project patterns, defensive try/catch in trusted paths
5. **Type safety** - `any` casts, missing generics, implicit types

**3b. Apply changes**
- Remove before adding
- Flatten nesting (early returns, guard clauses)
- Reuse existing project utilities/patterns
- Match naming conventions from the codebase

**3c. Re-read the modified code**
- Look for new improvement opportunities exposed by previous changes
- If no improvements found → exit loop
- If improvements found → continue to next pass

### 4. Review Diff
- Run `git diff` on the modified files
- Verify each change is justified and improves the code
- Revert any changes that don't provide clear value

### 5. Validate
- Detect package manager from lockfile (`pnpm-lock.yaml` → pnpm, `bun.lockb` → bun)
- Run `pnpm/bun run fix` to format and auto-fix linting errors
- Run `pnpm/bun run check` to lint and type-check
- If check fails, fix issues and re-run until passing

## Output
After refactoring, summarize:
- **Passes completed** - How many iterations and why it stopped
- **Changes made** - Bullet list of what changed and why
- **Docs referenced** - Sources that informed the refactor
- **Validation result** - Output from `run check`
