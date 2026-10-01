# Umple model best practices

Use this checklist when validating. Items marked **MUST** usually fail the compiler or produce serious warnings. Items marked **SHOULD** may still compile but are poor Umple style.

## Associations (MUST)

```umple
// BAD — same pair declared twice
class A { * -- * B; }
class B { * -- * A; }

// GOOD — declare once
class A { * -- * B; }
class B { }
```

- One association per class pair.
- Reflexive associations need a role name or `self`:
  ```umple
  class Person { * -- 0..1 Person manager; }
  // or: 0..* self friends;
  ```
- Composition uses `<@>-`. Sorted keys must be String, Integer, Double, Float, Long, or Short (not Date).

## State machines (MUST)

- Do **not** name a state `Final` (reserved). Use `Done`, `Completed`, etc.
- Do **not** name the state machine `Timer`.
- Prefer tagging `implementsReq` on the class or the whole `sm` block, not on every state.

## Requirements (MUST)

```umple
req R01 { ... }
implementsReq R01;   // OK
class X {}

implementsReq R99;   // BAD if no req R99 — warning: Cannot find specified requ...
class Y {}
```

- Every `implementsReq` ID must have a matching `req` definition.
- Place `implementsReq` immediately before the tagged element.
- Missing-req warnings are **failures** for this skill even when Java is still emitted.

## Mixsets (SHOULD)

```umple
mixset Premium { class Member { String email; } }
use Premium;          // activates
// without use, Premium is dead code — report it
```

- `use !Premium;` cancels a previous activation.

## Attributes & patterns (SHOULD)

- Prefer one clear multiplicity; avoid inventing both directed links between the same types.
- Immutable classes cannot associate with mutable classes.
- `autounique name;` takes **no** type.
- Keys: `key { id };` on identifying attributes.

## Compile verification

Always call:

`POST https://cruise.umple.org/umpleonline/scripts/compiler.php`  
with `language=Java`, `languageStyle=codegen`, unique `filename`.

If validating traceability, also call `language=PlainRequirementsDoc` and check `IMPLEMENTED BY`.

## Common false alarms

- `Not able to open file ... .java` / `permission denied` on the UmpleOnline server is a **hosting** problem, not a model problem.
- Prefer a unique filename per request to reduce collisions on the shared server.
