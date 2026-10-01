---
name: umple-diagram-generator
description: "Generate diagrams (state machines, class diagrams, ER diagrams) from natural language using Umple. Use when the user requests: (1) State machine / state model / FSM / statechart / lifecycle diagrams (2) Class diagrams / data model / domain model / UML class model (3) ER diagrams, entity-relationship, or database schema diagrams (4) Trait diagrams (5) Any Umple diagram or visual model from text. Treat 'state model' as a state machine and 'data model' as a class or ER diagram. Outputs SVG plus model.ump."
---

# Umple Diagram Generator

## Supported diagram types

| Type          | `language` value              | Read first                               |
| ------------- | ----------------------------- | ---------------------------------------- |
| Class diagram | `classDiagram`                | `references/class-diagram-syntax.md`     |
| State machine | `stateDiagram`                | `references/state-machine-syntax.md`     |
| ER diagram    | `entityRelationshipDiagram`   | `references/class-diagram-syntax.md`     |
| Trait diagram | `traitDiagram`                | `references/class-diagram-syntax.md`     |

## Workflow

1. Read the syntax reference for the requested diagram type.
2. Write valid Umple code.
3. Call the Umple Online API (see below).
4. Extract SVG from the response and save to a `.svg` file.
5. On error, read the message, fix the code, retry (up to 3 times).
6. Render the SVG inline for the user.

## API

**Endpoint:** `POST https://cruise.umple.org/umpleonline/scripts/compiler.php`
**Content-Type:** `application/x-www-form-urlencoded`

| Parameter       | Value                                                          |
| --------------- | -------------------------------------------------------------- |
| `language`      | See table above                                                |
| `languageStyle` | `diagramUpdate`                                                |
| `umpleCode`     | The Umple source code                                          |
| `filename`      | `model.ump`                                                    |

Use whatever HTTP tool is available (WebFetch, curl, fetch, etc.).

### Response parsing

**Success:** response contains two nested `<svg>` tags. Extract the **inner** SVG — the one with a `viewBox` attribute. Clean up any `xlink:href="javascript:..."` attributes.

**Error:** response contains `<span class="umple-message-error">`. Strip HTML tags to read the error.

## Output

1. State the diagram type.
2. Show the Umple source in an `umple` code block.
3. Render the SVG visually.
4. Save files: `<name>/model.ump` and `<name>/diagram.svg`.

## Guardrails

- Always read the syntax reference before writing Umple code.
- Prefer a smaller valid model over guessing syntax.
- One association per class pair — never define the same relationship from both sides.
- Never use `Final` as a custom state name — it is a reserved keyword in Umple. Use `Done`, `Completed`, etc. instead.
