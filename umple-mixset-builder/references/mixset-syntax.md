# Mixsets, mixins, and multiple files

## Mixin (same class, more than once)

```umple
class Member { String name; }
class Member { String email; }
```

Merges into one `Member` with both attributes. Typical when splitting files.

## Mixset (optional feature)

```umple
class X {}

mixset specialVersion {
  class X { String extra; }
}

use specialVersion;
```

Without `use specialVersion;`, `extra` is not in the model.

Inline inside a class:

```umple
class X {
  mixset specialVersion { String extra; }
}
```

## Multiple files

`use other.ump;` includes a file (once). The same `use` syntax activates a mixset by name.

```umple
use core.ump;
use billing.ump;
use extraFeature;
```

`use !extraFeature;` turns that mixset off.

## Product-line pattern

- `core.ump` — always-on classes
- `mixset Premium { ... }` — paid feature
- `app.ump` — `use core.ump;` plus `use Premium;` when building the premium variant
