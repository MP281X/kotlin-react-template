---
description: Deep analysis mode
---

Task (required):
$ARGUMENTS

Analyze step-by-step using only verified facts. Do not assume or speculate.

## Example

```
Task: "Why does the login fail silently?"

Approach:
1. Read AuthController.kt — trace login flow
2. Check AuthMiddleware.kt — session handling
3. Search for empty catch blocks that swallow errors
4. Verify frontend handles all response codes

Report: exact line where error is lost + fix
```
