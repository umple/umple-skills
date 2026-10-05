---
name: umple-mixset-builder
description: "Split an Umple model across files using mixins and mixsets. Use when the user requests: (1) Multiple .ump files (2) Mixsets / optional features / product lines / feature-oriented modeling (3) Mixins of the same class in more than one place (4) use statements to activate or deactivate a feature (5) Conditional Umple fragments. Produces compiling Umple with mixset + use, saved as multiple files when useful, verified via the Umple Online API."
---

# Umple Mixset Builder

## Workflow

1. Read `references/mixset-syntax.md`.
2. Put always-on structure in a **core** file (`core.ump` / `model.ump`).
3. Put optional feature code in `mixset FeatureName { ... }` (same file or `feature.ump`).
4. Activate with `use FeatureName;` only for features the user wants on. Use `use !FeatureName;` to cancel.
5. Same class name in two places is a **mixin** (definitions merge). Prefer mixins over copying whole classes.
6. If one feature depends on another, say so with `require [Other];` inside the dependent mixset (see reference). Use `require subfeature [...]` only when the user wants a feature model.
7. If the user asked for multiple files: save each `.ump` plus a top-level file that `use`s the others / mixsets.
8. For the Umple Online API, send **one combined payload** (concatenate files in dependency order, with `use` lines for mixsets). Still write multiple files on disk for the user.
9. Compile (`language=Java`, no `filename` parameter). Retry up to 3 times on error, then stop.

## API

**Endpoint:** `POST https://cruise.umple.org/umpleonline/scripts/compiler.php`
**Content-Type:** `application/x-www-form-urlencoded`

| Parameter       | Value                                    |
| --------------- | ---------------------------------------- |
| `language`      | `Java`                                   |
| `languageStyle` | `codegen`                                |
| `umpleCode`     | Combined Umple (all fragments + uses)    |

Use curl, WebFetch, or fetch. Do **not** send a `filename` parameter: without it the server compiles in a fresh private directory. A bare name such as `model.ump` makes it work in a directory shared by every API user, which causes `Permission denied` (9200) errors and can return other users' generated files.

### Response parsing

Same as other skills: `URL_SPLIT`, HTML entity decode, `umple-message-error` / `umple-message-warning`.

- Server write error (`Compiler Error (Generation)` with `Permission denied` / `9200`, or `Not able to open file`): a hosting problem, not a model bug. Make sure no `filename` was sent, retry once, and never change the model because of it.
- Warning 1513 (`use` of a mixset with no declaration) and W1514 (`require` not satisfied) are real problems: fix them. W1514 may not appear on the hosted compiler, so check every applicable `require` against the `use` list yourself.

## Output

1. Explain which features are on/off.
2. Show each file (or a clear tree).
3. Show the combined model used for compile.
4. Save files under `<name>/`.

## Guardrails

- A mixset with no matching `use` is omitted — say so explicitly.
- One association per class pair across the **merged** model.
- Never name a state `Final`.
- Do not invent product-line features the user did not ask for.
- Prefer small, named mixsets (`Premium`, `Logging`, `HalfOpenFeature`) over one giant optional dump.
