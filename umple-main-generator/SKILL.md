---
name: umple-main-generator
description: "Generate an example Umple main method that instantiates objects or exercises state transitions. Use when the user requests: (1) A main method / driver / demo for an Umple model (2) Instantiate objects from a class model (3) Fire events to walk a state machine (4) A runnable Hello-World style entry point. Adds public static void main(...) Java { ... } (and Python if asked) and compiles via the Umple Online API."
---

# Umple Main Generator

## Workflow

1. Read `references/main-method-syntax.md`.
2. Start from the user's Umple model (or a tiny model if they only described the domain).
3. Add `public static void main(String [ ] args) Java { ... }` on a sensible class (a driver class or the class that owns the state machine).
4. For class models: construct objects with generated constructors, then `add*` / `set*` for associations.
5. For state machines: construct the object, then call event methods to walk transitions.
6. Compile via the Umple Online API. On error, fix and retry (up to 3 times). After 3 failures, stop and show the compiler message.
7. Save `model.ump` and show the Umple source. If helpful, generate Java (`language=Java`) and point to the `main` in the output.

## API

**Endpoint:** `POST https://cruise.umple.org/umpleonline/scripts/compiler.php`

| Parameter       | Value            |
| --------------- | ---------------- |
| `language`      | `Java`           |
| `languageStyle` | `codegen`        |
| `umpleCode`     | The Umple source |
| `filename`      | `model.ump`      |

Use curl, WebFetch, or fetch.

## Guardrails

- Use `String [ ] args` (space before `[]`) as in the Umple manual.
- Tag the body `Java { }` (add a `Python { }` twin only if requested).
- Call only methods the generated API actually has (constructors, `setX`, `addX`, event names).
- One association per class pair. Never name a state `Final`.
