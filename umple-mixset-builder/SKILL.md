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
6. If the user asked for multiple files: save each `.ump` plus a top-level file that `use`s the others / mixsets.
7. For the Umple Online API, send **one combined payload** (concatenate files in dependency order, with `use` lines for mixsets). Still write multiple files on disk for the user.
8. Compile (`language=Java`). Unique `filename`. Retry up to 3 times on error, then stop.

## API

**Endpoint:** `POST https://cruise.umple.org/umpleonline/scripts/compiler.php`
**Content-Type:** `application/x-www-form-urlencoded`

| Parameter       | Value                                    |
| --------------- | ---------------------------------------- |
| `language`      | `Java`                                   |
| `languageStyle` | `codegen`                                |
| `umpleCode`     | Combined Umple (all fragments + uses)    |
| `filename`      | unique `*.ump`                           |

Use curl, WebFetch, or fetch.

### Response parsing

Same as other skills: `URL_SPLIT`, HTML entity decode, `umple-message-error`, ignore pure server write noise when diagnosing model errors.

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
