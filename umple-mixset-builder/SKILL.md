---
name: umple-mixset-builder
description: "Split an Umple model across files using mixins and mixsets. Use when the user requests: (1) Multiple .ump files (2) Mixsets / optional features / product lines (3) Mixins of the same class in more than one file (4) use statements to activate a feature. Produces compiling Umple with mixset + use, saved as more than one file when useful."
---

# Umple Mixset Builder

## Workflow

1. Read `references/mixset-syntax.md`.
2. Put the core model in a base file (`core.ump` or `model.ump`).
3. Put optional feature code in `mixset FeatureName { ... }` (same file or `feature.ump`).
4. Activate with `use FeatureName;` only for features the user wants on.
5. Same class name in two places is a **mixin** (definitions merge). Prefer that over copying the whole class.
6. If the user asked for multiple files, save each `.ump` and a top file that `use`s the others.
7. Concatenate (or `use`) into one string and compile via the Umple Online API. Retry up to 3 times on error, then stop.

## API

**Endpoint:** `POST https://cruise.umple.org/umpleonline/scripts/compiler.php`

| Parameter       | Value                                      |
| --------------- | ------------------------------------------ |
| `language`      | `Java`                                     |
| `languageStyle` | `codegen`                                  |
| `umpleCode`     | Combined Umple (all files + `use` lines)   |
| `filename`      | `model.ump`                                |

The online API compiles one payload. Still **write** multiple files on disk for the user.

## Guardrails

- A mixset with no `use` is omitted — say so.
- `use !FeatureName;` cancels a previous use.
- One association per class pair across the merged model.
- Never name a state `Final`.
