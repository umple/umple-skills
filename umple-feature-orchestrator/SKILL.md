---
name: umple-feature-orchestrator
description: "Coordinate Umple skills so the agent can use the full language (classes, states, reqs, mixsets, mains, validation, codegen). Use when the user wants: (1) A complete Umple system using several features (2) Skills calling skills / an end-to-end Umple workflow (3) Something that does not fit a single diagram, code, req, main, mixset, or validate skill. Read the matching sibling SKILL.md files and run their workflows in order."
---

# Umple Feature Orchestrator

This skill does **not** replace the others. It **routes** to them.

## Sibling skills (read the file when the step matches)

| User need | Load |
| --------- | ---- |
| Class / data / ER / state **diagram** | `../umple-diagram-generator/SKILL.md` |
| Java / Python / PHP / Ruby / C++ / SQL / JSON **code** | `../umple-code-generator/SKILL.md` |
| `req` / `implementsReq` | `../umple-requirements-tracer/SKILL.md` |
| Lint / compile errors / best practices | `../umple-model-validator/SKILL.md` |
| Example `main` / instantiate / fire events | `../umple-main-generator/SKILL.md` |
| Mixsets, mixins, multiple `.ump` files | `../umple-mixset-builder/SKILL.md` |

If those relative paths are missing, look under `~/.agents/skills/<name>/SKILL.md`.

## Typical pipelines

**Diagram from English:** diagram-generator.

**Labelled requirements → tagged model → Java:** requirements-tracer, then code-generator.

**Model + demo main:** diagram or tracer, then main-generator, then validator.

**Product line:** mixset-builder, then validator, then code-generator.

## Other Umple features the agent should still use

When the domain needs them, add (from `umple-code-generator/references/umple-modeling-syntax.md`):

- `isA` inheritance, interfaces, traits
- Keys, singleton, immutable, constraints
- Nested / concurrent state machines, `after(` timers
- Enums, association classes, composition `<@>-`

Keep models small. One association per class pair. No state named `Final`.

## Compile

Always finish by compiling through `compiler.php` (`language=Java` unless the user asked another target). Retry up to 3 times, then stop.
