---
name: umple-feature-orchestrator
description: "Coordinate Umple skills so the agent can use the full language (classes, states, reqs, mixsets, mains, validation, codegen, diagrams). Use when the user wants: (1) A complete Umple system using several features (2) Skills calling skills / end-to-end Umple workflow (3) Something that spans diagram + code + requirements + main + mixsets (4) 'Use all Umple features' style requests. Read sibling SKILL.md files and run their workflows in order; always finish with a compile."
---

# Umple Feature Orchestrator

This skill does **not** replace the others. It **routes** to them and sequences their workflows.

## Sibling skills (load when the step matches)

Resolve paths relative to this skill directory first (`../<name>/SKILL.md`). If missing, try `~/.agents/skills/<name>/SKILL.md`.

| User need | Load |
| --------- | ---- |
| Class / data / ER / state / trait **diagram** or SVG | `../umple-diagram-generator/SKILL.md` |
| Java / Python / PHP / Ruby / C++ / SQL / JSON **code** | `../umple-code-generator/SKILL.md` |
| `req` / `implementsReq` / labelled requirements | `../umple-requirements-tracer/SKILL.md` |
| Lint / compile errors / best practices | `../umple-model-validator/SKILL.md` |
| Example `main` / instantiate / fire events | `../umple-main-generator/SKILL.md` |
| Mixsets, mixins, `require`, multiple `.ump` files | `../umple-mixset-builder/SKILL.md` |

Also read `references/skill-map.md` for a one-page map.

## Decision rules

1. **Single clear need** → call only that sibling skill.
2. **Labelled requirements + model** → requirements-tracer (do **not** invent tags on a massive unlabelled dump).
3. **Diagram wording** ("state model", "data model", "FSM") → diagram-generator.
4. **Runnable demo** → after the model exists, main-generator.
5. **Optional features / product line** → mixset-builder, then validator.
6. **Generate Java/Python/…** → code-generator last (or after validate).
7. Always **validate/compile** before claiming success (validator skill or the compile step inside the sibling).

## Typical pipelines

| Goal | Order |
| ---- | ----- |
| Diagram from English | diagram-generator |
| Labelled reqs → tagged model → Java | requirements-tracer → code-generator |
| Model + demo main | diagram or tracer → main-generator → validator |
| Product line | mixset-builder → validator → code-generator |
| Broken model | validator (fix) → re-run domain skill |
| "Full" teaching example | tracer or diagram → mixset (optional) → main → code → validator |

## Other Umple features to include when the domain needs them

Pull syntax from `../umple-code-generator/references/umple-modeling-syntax.md` when present:

- `isA` inheritance, interfaces, traits
- Keys, singleton, immutable, constraints
- Nested / concurrent state machines, `after(` / `afterEvery(`
- Enums, association classes, composition `<@>-`

Keep models small. One association per class pair. No state named `Final`.

## Compile

Finish through `https://cruise.umple.org/umpleonline/scripts/compiler.php` (`language=Java` unless the user asked another target). Unique `filename`. Retry up to 3 times, then stop and show the error.

- Server write error (`Compiler Error (Generation)` + `Permission denied` / `9200`, or `Not able to open file`): not a model bug. Re-send with `language=Php`; only errors/warnings there count. Do not burn retries on it.

## Output

1. Name which sibling skills you used and why.
2. Show final Umple (and generated artifacts if any).
3. Report compile / PlainRequirementsDoc results briefly.
