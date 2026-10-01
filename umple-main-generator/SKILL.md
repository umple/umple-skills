---
name: umple-main-generator
description: "Generate an example Umple main method that instantiates objects or exercises state transitions. Use when the user requests: (1) A main / driver / demo / Hello World for an Umple model (2) Instantiate objects from a class or data model (3) Fire events to walk a state machine (4) A runnable entry point in Java or Python inside Umple. Adds public static void main(String [ ] args) Java { ... } (and optionally Python) and verifies via the Umple Online API."
---

# Umple Main Generator

## Workflow

1. Read `references/main-method-syntax.md`.
2. Start from the user's Umple model, or build a tiny model if they only described the domain.
3. Choose where `main` lives:
   - Prefer a separate driver class (`Demo`, `App`, `Main`) **or**
   - The class that owns the state machine when the goal is to fire events
4. Add:
   ```umple
   public static void main(String [ ] args) Java { ... }
   ```
5. Body rules:
   - **Class / data model:** `new Class(mandatoryArgs)`, then `addX` / `setX` for associations
   - **State machine:** `new Class()`, then call event methods (`off()`, `on()`, …)
   - Only call APIs Umple actually generates (no invented methods)
6. Compile via the Umple Online API (`language=Java`). Use a unique `filename`.
7. On error: fix and retry up to 3 times. After 3 failures: stop and show the compiler message.
8. Save `<name>/model.ump`. Show the Umple source. Optionally generate Java and point to `main`.

## API

**Endpoint:** `POST https://cruise.umple.org/umpleonline/scripts/compiler.php`
**Content-Type:** `application/x-www-form-urlencoded`

| Parameter       | Value              |
| --------------- | ------------------ |
| `language`      | `Java`             |
| `languageStyle` | `codegen`          |
| `umpleCode`     | Full Umple source  |
| `filename`      | unique `*.ump`     |

Use curl, WebFetch, or fetch.

### Response parsing

- Success: content after `URL_SPLIT`; decode HTML entities; files split by `//%% NEW FILE`.
- Error: `umple-message-error`.
- Server `permission denied` / `Not able to open file` on `.java` is a server write issue — still keep valid Umple.

## Output

1. State which class holds `main` and what the demo does.
2. Show Umple in an `umple` fence.
3. Save `model.ump`.

## Guardrails

- Signature uses `String [ ] args` (space before `[]`) as in the Umple manual.
- Tag the body `Java { ... }`. Add `Python { ... }` only if asked.
- Do not call setters on `immutable` / key attributes that have no setter.
- One association per class pair. Never name a state `Final`.
- Prefer a smaller working demo over a huge script.
