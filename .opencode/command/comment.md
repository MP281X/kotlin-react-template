---
description: Add, improve, or remove code comments
---

Target (optional — file path, folder, function/class name, or feature description; defaults to last edited files):
$ARGUMENTS

## Principles

- Document "why", never "how" — explain purpose and intent, not implementation
- Prefer self-documenting code — if name and types are clear, skip the comment
- Remove obvious comments — delete anything that repeats what the code says

## Comment Style (STRICT)

1. **Pattern**: `[Verb]s [what] [why/when/where].` — Third-person singular verb, ends with period
2. **Approved verbs**: Creates, Returns, Checks, Converts, Wraps, Provides, Caches, Handles
3. **Forbidden**: "This function", "This method", "Used to", "A helper that", implementation details
4. **Length**: 1 line default, 2-3 only for business logic. Add `@example` only for non-obvious transformations
5. **Language**: Technical but accessible — assume the reader is a developer unfamiliar with this specific codebase or library

## Process

1. **Identify target** — If target is a file/folder path, read it. If it's a function/class name or feature description, find related files using glob/grep. If empty, comment the most recently edited files in this session.

2. **Analyze each function/type/class**
   - Add comment if: complex logic, non-obvious behavior, important constraints, public API
   - Remove comment if: name and types are self-explanatory, comment explains "how", comment is obvious

3. **Write comments** — Follow the strict style rules above exactly. Verify each comment starts with third-person verb.

4. **Apply changes** — Add beneficial comments, improve unclear ones, remove obvious or implementation-focused ones.

## Output
- **Added** — Functions/types that received new comments
- **Improved** — What was clarified
- **Removed** — Obvious/redundant comments deleted

## Examples

Remove obvious comment:
```ts
// before
/** Gets user by ID */
function getUserById(id: string): User

// after — no comment needed, name is self-explanatory
function getUserById(id: string): User
```

Add "why" comment:
```ts
// before
function calculatePrice(items: Item[], discount: number): number

// after — explains non-obvious business rule
/** Applies discount after tax (EU legal requirement). */
function calculatePrice(items: Item[], discount: number): number
```

Use accessible technical language:
```ts
// before — too much jargon
/** Caches factory results per property key for lazy initialization. */
function createCachedProxy<T>(fn: (key: string) => T): T

// after — technical but clear
/** Caches computed values by key to avoid redundant calls. */
function createCachedProxy<T>(fn: (key: string) => T): T
```

Add @example for non-obvious transformation:
```ts
// before
function toCamelCase(obj: Record<string, unknown>): Record<string, unknown>

// after — shows input→output since behavior isn't obvious from signature
/**
 * Converts snake_case keys to camelCase.
 *
 * @example
 * toCamelCase({ user_name: "x" }) // { userName: "x" }
 */
function toCamelCase(obj: Record<string, unknown>): Record<string, unknown>
```
