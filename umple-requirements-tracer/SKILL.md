---
name: umple-requirements-tracer
description: "Trace Umple requirements to model elements with req and implementsReq. Use when the user requests: (1) Tagging Umple features with implementsReq (2) Requirement-to-model traceability (3) Generating an Umple model from labelled requirements (4) Adding implementsReq to an existing Umple model (5) req blocks, requirement IDs, or PlainRequirementsDoc (6) Mapping REQ-001 / R01 style requirements onto classes, attributes, associations, or state machines. Produces a compiling .ump file. Does not invent implementsReq mappings from a massive unlabelled requirements dump."
---

# Umple Requirements Tracer

## When to tag (`implementsReq`) vs not

| Input | Action |
| ----- | ------ |
| **Small labelled requirements** — distinct reqs with IDs (`R01`, `REQ-101`, `H001`) or a short numbered/bulleted list (about 12 or fewer) | **Must** emit `req` definitions (unless they already exist in the file) and tag matching elements with `implementsReq` |
| **Massive unlabelled block** — a long prose spec with no per-requirement IDs and no short list | Generate the domain model only. **Do not** invent `implementsReq` mappings |

If the source file already contains `req ID { ... }`, reuse those IDs exactly. Do not rename them and do not re-emit the blocks.

## Workflow

1. Classify the input using the table above.
2. Read `references/requirements-syntax.md`.
3. Write valid Umple (prefer a smaller correct model over a large guessed one).
4. Call the Umple Online API to compile (see below). Treat `umple-message-error` **and** warnings about missing requirement IDs as failures. Server write errors are not model failures (see below).
5. On failure, read the message, fix the code, retry (up to 3 times).
6. After 3 failures: stop. Show the last Umple source and the exact compiler message. Ask the user; do not keep guessing.
7. If tagging was required, optionally call the API with `language=PlainRequirementsDoc` and check that tagged IDs appear under `IMPLEMENTED BY`.
8. Save `<name>/model.ump` and present the Umple source.

## API

**Endpoint:** `POST https://cruise.umple.org/umpleonline/scripts/compiler.php`
**Content-Type:** `application/x-www-form-urlencoded`

| Parameter       | Compile model     | Traceability doc            |
| --------------- | ----------------- | --------------------------- |
| `language`      | `Java`            | `PlainRequirementsDoc`      |
| `languageStyle` | `codegen`         | `codegen`                   |
| `umpleCode`     | The Umple source  | The Umple source            |

Use whatever HTTP tool is available (WebFetch, curl, fetch, etc.). Do **not** send a `filename` parameter: without it the server compiles in a fresh private directory. A bare name such as `model.ump` makes it work in a directory shared by every API user, which causes `Permission denied` (9200) errors and can return other users' generated files.

### Response parsing

**Compile success:** code appears after `<p>URL_SPLIT`. Decode HTML entities (`&lt;` → `<`, `&gt;` → `>`, `&amp;` → `&`, `&quot;` → `"`).

**Failure:** response contains `<span class="umple-message-error">`. Strip tags and read the message.

**Missing requirement ID:** a **warning** (`umple-message-warning`, `Cannot find specified requirement identifier(s): R99`, code 401), not an error. Still treat it as a failure: every `implementsReq` ID must match a `req` definition.

**PlainRequirementsDoc success:** HTML listing each req and `IMPLEMENTED BY:` with class/attribute/etc. names.

### Server write errors (not model errors)

Server write error (`Compiler Error (Generation)` with `Permission denied` / `9200`, or `Not able to open file`): a hosting problem, not a model bug. Make sure no `filename` was sent, retry once, and never change the model because of it.

## Output

1. State whether `implementsReq` tagging was applied, and why (labelled vs massive unlabelled).
2. Show the Umple source in an `umple` code block.
3. Save `model.ump`.
4. If a traceability doc was generated, summarize which reqs are implemented by which elements.

## Guardrails

- Place `implementsReq` immediately before the element it tags.
- Reuse IDs exactly; never invent IDs that were not in the labelled input (assigning `R01`, `R02`, … is allowed only when the user gave a **short unlabelled list** of distinct reqs).
- Do not tag every element with every requirement — map each req to the element(s) that actually implement it.
- One association per class pair — never define the same relationship from both sides.
- Prefer tagging a class or a whole state-machine block, not individual states.
- Never use `Final` as a custom state name.
- After 3 compile/tagging failures, stop and ask the user.
