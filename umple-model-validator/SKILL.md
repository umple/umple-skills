---
name: umple-model-validator
description: "Validate Umple models against compiler rules and Umple best practices. Use when the user requests: (1) Check / lint / review an Umple model (2) Why an .ump file does not compile (3) Best-practice review of associations, state machines, mixsets, or implementsReq (4) Fix Umple warnings. Compiles via the Umple Online API and reports concrete issues with suggested fixes."
---

# Umple Model Validator

## Workflow

1. Read `references/best-practices.md`.
2. Take the user's `.ump` (or write a minimal model if they only described a problem).
3. Compile with the Umple Online API (`language=Java`, `languageStyle=codegen`).
4. Treat `umple-message-error` **and** missing-requirement warnings as failures.
5. Also flag best-practice issues that still compile (duplicate associations, `Final` as a state name, reflexive association without a role name, invented `implementsReq` IDs, etc.).
6. On compile failure: explain the message, propose a fix, retry (up to 3 times) if the user asked you to fix it.
7. After 3 failures: stop, show the last source and the exact compiler text.
8. Output a short report: errors, warnings, best-practice notes, and (if fixed) the corrected `model.ump`.

## API

**Endpoint:** `POST https://cruise.umple.org/umpleonline/scripts/compiler.php`
**Content-Type:** `application/x-www-form-urlencoded`

| Parameter       | Value           |
| --------------- | --------------- |
| `language`      | `Java`          |
| `languageStyle` | `codegen`       |
| `umpleCode`     | The Umple source|
| `filename`      | `model.ump`     |

Use whatever HTTP tool is available (WebFetch, curl, fetch, etc.).

**Failure:** `<span class="umple-message-error">`. Missing req IDs often appear as `umple-message-warning` (`Cannot find specified requ...`).

## Guardrails

- Prefer a smaller valid model over guessing syntax.
- One association per class pair.
- Do not invent requirement IDs when reviewing `implementsReq`.
- Never use `Final` as a custom state name.
