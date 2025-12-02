---
description: Recover from an error of the LLM
---

You encountered an error that stopped execution. Resume from the last confirmed good step.

## Recovery Steps
1. State the last successful step and the exact call you will retry (tool + params).
2. Fix the call minimally (correct params/quoting/path) and retry.
3. If it fails again, adjust once more and retry.
4. Stop after 3 total attempts. If still failing, report the exact error and ask for the specific missing info or approval needed.
