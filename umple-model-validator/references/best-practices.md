# Umple model best practices

Use this checklist when validating. Items marked **MUST** usually fail the compiler or produce serious warnings. Items marked **SHOULD** may still compile but are poor Umple style.

## Associations

```umple
// BAD — compiles, but creates TWO separate A–B associations
class A { * -- * B; }
class B { * -- * A; }
```

```umple
// GOOD — declare once
class A { * -- * B; }
class B { }
```

- **SHOULD:** one association per class pair. Declaring it from both classes is almost always a modeling mistake; it only becomes a compile error (19) when the role names clash.
- **MUST:** a reflexive association with the same multiplicity on both ends needs a role name or `self` (otherwise: `Reflexive association to class 'Person' must use a role name or else the keyword self`):
  ```umple
  class Person { * -- * Person friends; }
  // or: 0..* self friends;
  ```
- **SHOULD:** asymmetric reflexive associations (`* -- 0..1 Person`) compile, but add a role name (`manager`) so the generated API is readable.
- **MUST:** sorted keys must be Integer, Short, Long, Double, Float, or String (error 24; not Date). Composition uses `<@>-`.

## State machines

- **MUST:** do not name a state `Final` (error 74, reserved). Use `Done`, `Completed`, etc.
- **SHOULD:** do not name the state machine `Timer` — it compiles, but generated Java using `after(...)` clashes with `java.util.Timer`.
- Prefer tagging `implementsReq` on the class or the whole `sm` block, not on every state.

## Requirements (MUST)

```umple
req R01 { ... }
implementsReq R01;   // OK
class X {}

implementsReq R99;   // BAD if no req R99 — warning 401: Cannot find specified requirement identifier(s)
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

- `use Ghost;` with no `mixset Ghost` gives warning 1513 — report it.

- `use !Premium;` cancels a previous activation.

## Attributes & patterns (SHOULD)

- Prefer one clear multiplicity; avoid inventing both directed links between the same types.
- Immutable classes cannot have two-way associations (error 17); use a directed association `->` from a mutable class instead.
- `autounique name;` takes **no** type.
- Keys: `key { id };` on identifying attributes.

## Compile verification

Always call:

`POST https://cruise.umple.org/umpleonline/scripts/compiler.php`  
with `language=Java`, `languageStyle=codegen`, unique `filename`. If the only error is a server write error, re-check with `language=Php`.

If validating traceability, also call `language=PlainRequirementsDoc` and check `IMPLEMENTED BY`.

## Common false alarms

- `Compiler Error (Generation)` with `Permission denied` (9200), or `Not able to open file ...`, is a **hosting** problem, not a model problem. `language=Php` gives a clean signal for the same model.
- Prefer a unique filename per request to reduce collisions on the shared server.
