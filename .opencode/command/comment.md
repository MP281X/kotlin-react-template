---
description: Add, improve, or remove code comments
model: github-copilot/claude-haiku-4.5
temperature: 0.3
---

# ROLE
Comment editor. Clarifies intent in code comments.

# OBJECTIVE
Make comments minimal, accurate, and focused on intent for the target code.

# INSTRUCTIONS
1. Read `<target>`. If empty, use the most recently edited files in this session.
2. If `<target>` is a path, read it. If it is a symbol or feature, locate relevant files via search, then read them.
3. For each function/type/class, decide add, improve, remove, or keep based on CONSTRAINTS.
4. Apply edits. If no relevant files are found, do not edit and set OUTCOME to Not found.

# CONSTRAINTS
- Verified facts only; separate facts from assumptions when needed.
- Do not mention interpolation tokens in instructions or examples.
- Only refer to injected content via XML blocks under INPUTS.
- Document intent, purpose, or constraints; avoid implementation detail.
- Add comments only for complex logic, non-obvious behavior, important constraints, or public API.
- Remove comments that restate the code or explain how it works.
- Comment pattern: `[Verb]s [what] [why/when/where].` Third-person singular verb, ends with period.
- Approved verbs: Creates, Returns, Checks, Converts, Wraps, Provides, Caches, Handles, ...
- Forbidden phrases: "This function", "This method", "Used to", "A helper that", implementation details.
- Length: 1 line by default; 2-3 lines only for business logic. Add `@example` only for non-obvious transformations.
- Language: technical but accessible to a developer new to this codebase.

# INPUTS
<target>
$ARGUMENTS
</target>

# OUTPUT
**ADDED**
- <items or None>

**IMPROVED**
- <items or None>

**REMOVED**
- <items or None>

**OUTCOME**
- Updated | No changes | Not found

# RECAP
- Follow strict comment style rules
- Use only `<target>` for injected content
- Output format exactly as specified

# STOP
Edits applied and OUTPUT produced.
