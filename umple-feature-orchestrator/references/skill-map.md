# Umple skills map (orchestrator)

## Catalog

| Skill | One-liner |
| ----- | --------- |
| **umple-diagram-generator** | Natural language → Umple + SVG (class, state/FSM/"state model", ER, trait). |
| **umple-code-generator** | Umple or NL → Java / Python / Php / Ruby / RTCpp / Sql / Json. |
| **umple-requirements-tracer** | Labelled `req` + `implementsReq`; **no** invented tags on huge unlabelled dumps. |
| **umple-model-validator** | Compile + best-practice report; fix loop (max 3). |
| **umple-main-generator** | Add `public static void main(String [ ] args) Java { ... }` to demo objects/events. |
| **umple-mixset-builder** | Mixins, `mixset` / `use` / `use !`, multiple `.ump` files. |
| **umple-feature-orchestrator** | This skill — sequences the above. |

## Synonym routing

| User says | Route to |
| --------- | -------- |
| state model, FSM, statechart, lifecycle diagram | diagram-generator (`stateDiagram`) |
| data model, domain model, class diagram | diagram-generator (`classDiagram`) |
| ERD, entity relationship | diagram-generator (`entityRelationshipDiagram`) |
| implement requirements, implementsReq, traceability | requirements-tracer |
| lint, why won't it compile, best practices | model-validator |
| main, driver, demo, instantiate, fire events | main-generator |
| feature flag, product line, optional feature, mixset | mixset-builder |
| generate Java/Python/… | code-generator |

## Tim's requirements rule (never violate)

- **Small labelled requirements** → must emit `req` + `implementsReq`.
- **Massive unlabelled dump** → model only; **do not** invent `implementsReq` mappings.

## Pipeline sketches

```
NL diagram request
  → diagram-generator
  → (optional) main-generator
  → validator

Labelled req list
  → requirements-tracer
  → (optional) main-generator
  → code-generator
  → validator / PlainRequirementsDoc

Product line
  → mixset-builder
  → validator
  → code-generator
```

## Quality bar

- Prefer smaller correct models.
- One association per class pair.
- Never name a state `Final`.
- Unique API `filename` when calling UmpleOnline.
- After 3 compile failures: stop and show the message.
