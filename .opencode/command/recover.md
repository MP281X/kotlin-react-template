---
description: Recover from an LLM error
---

Resume from the last confirmed good step.

## Process

1. **State context** — Identify the last successful step and the exact call to retry (tool + params).

2. **Retry with fix** — Correct the call minimally (params, quoting, path) and retry.

3. **Adjust if needed** — If it fails again, adjust once more and retry.

4. **Report if stuck** — After 3 total attempts, report the exact error and ask for specific missing info or approval.

## Example

```
Error: Edit tool — "oldString not found in content"

Recovery:
1. Last good step: attempting to replace function signature in utils.ts
2. Fix: re-read the file to get exact current content
3. Retry edit with correct oldString from fresh read
```
