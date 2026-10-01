# Umple model best practices

## Must-fix (usually fail compile)

- One association per class pair — never declare the same pair from both classes.
- Reflexive associations need a role name or `self`.
- Do not name a state `Final` (reserved). Do not name a state machine `Timer`.
- `implementsReq ID` only if `req ID { ... }` exists.
- `autounique name;` — no type on `autounique`.
- Sorted association keys: String, Integer, Double, Float, Long, or Short (not Date).

## Should-fix (often still compile)

- Keep one association definition; use role names when two links exist between the same types.
- Tag `implementsReq` immediately before the element, not at the file end.
- Prefer tagging a class or a whole `sm` block, not every state.
- Mixsets that are never `use`d are dead code — say so.
- Immutable classes cannot associate with mutable classes.

## Compile check

`POST compiler.php` with `language=Java` and `languageStyle=codegen`. Read errors and missing-req warnings before claiming the model is clean.
