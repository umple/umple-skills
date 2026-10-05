---
name: umple-model-validator
description: "Validate Umple models against the compiler and Umple best practices. Use when the user requests: (1) Check / lint / review / validate an Umple .ump model (2) Why Umple code does not compile (3) Best-practice review of associations, state machines, mixsets, or implementsReq (4) Fix Umple errors or warnings (5) Catch duplicate associations, missing req IDs, reserved Final state names. Compiles via the Umple Online API and returns a concrete issue report with fixes."
---

# Umple Model Validator

## Workflow

1. Read `references/best-practices.md`.
2. Obtain the Umple source (pasted, from a file, or a minimal repro if the user only described the bug).
3. Call the Umple Online API with `language=Java` and `languageStyle=codegen`, and **no** `filename` parameter (see API below).
4. Classify every compiler signal:
   - `umple-message-error` → error
   - `umple-message-warning` with `Cannot find specified requ` → treat as **failure** (bad `implementsReq`)
   - `Compiler Error (Generation)` with `Permission denied` (9200), or `Not able to open file` → **server write issue**, not a model bug. Make sure no `filename` was sent and retry once
5. Independently scan the source against best practices (even if it compiles): the same association declared from both classes, `Final` state name, symmetric reflexive association without role name, mixset never `use`d, `use` of an undeclared mixset, `implementsReq` with no matching `req`, etc.
6. If the user asked you to **fix**: apply the smallest change, recompile, retry up to 3 times. After 3 failures: stop, show last source + exact message.
7. Output a short report (see below) and save `model.ump` if you fixed anything.

## API

**Endpoint:** `POST https://cruise.umple.org/umpleonline/scripts/compiler.php`
**Content-Type:** `application/x-www-form-urlencoded`

| Parameter       | Value                |
| --------------- | -------------------- |
| `language`      | `Java` (default)     |
| `languageStyle` | `codegen`            |
| `umpleCode`     | The Umple source     |

Optional second call: `language=PlainRequirementsDoc` when checking `req` / `implementsReq` traceability.

Use WebFetch, curl, or fetch. Do **not** send a `filename` parameter: without it the server compiles in a fresh private directory. A bare name such as `model.ump` makes it work in a directory shared by every API user, which causes `Permission denied` (9200) errors and can return other users' generated files.

### Response parsing

- **Error:** `<span class="umple-message-error">` — strip tags.
- **Warning:** `<span class="umple-message-warning">` — strip tags; do not ignore missing-req warnings.
- **Success path:** content after `URL_SPLIT`; decode `&lt;` `&gt;` `&amp;` `&quot;`.
- **Server write failure:** `Compiler Error (Generation)` with `Permission denied` / `(9200)`, or `Not able to open file` — report under `Server:`, not as a model error. Usually caused by sending a `filename`; retry once without it.

## Report format

```
Status: FAIL | PASS_WITH_NOTES | PASS
Compiler: <errors/warnings or "none">
Best practices: <list or "none">
Server: <write issues or "ok">
Suggested fix: <umple snippet if any>
```

## Guardrails

- Prefer a smaller valid model over guessing syntax.
- One association per class pair — never define the same pair from both sides.
- Do not invent requirement IDs when reviewing `implementsReq`.
- Never use `Final` as a custom state name (error 74). Do not name a state machine `Timer`: it compiles, but generated Java with `after(...)` clashes with `java.util.Timer`.
- After 3 failed fix attempts, stop and ask the user.
