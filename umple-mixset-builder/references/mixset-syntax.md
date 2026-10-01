# Mixsets, mixins, use statements, and multiple files

## Mixin (same entity, more than once)

Umple merges multiple definitions of the same class/interface/trait:

```umple
class Member {
  String name;
}

// elsewhere (often another file)
class Member {
  String email;
}
```

Result: one `Member` with `name` and `email`. This is the usual way to split a model across files without mixsets.

## Mixset (optional / product-line feature)

A mixset is a **named** optional fragment. It is included only when activated.

```umple
class Member {
  String name;
}

mixset Premium {
  class Member {
    String email;
  }
}

use Premium;
```

Without `use Premium;`, `email` is **not** in the model.

### Top-level mixset

```umple
mixset specialVersion {
  class X {
    String extra;
  }
}
```

### Inline mixset inside a class

```umple
class X {
  mixset specialVersion {
    String extra;
  }
}
```

### Several fragments, same mixset name

```umple
mixset specialVersion { class X { String b; } }
mixset specialVersion { class X { String c; } }
use specialVersion;
```

Both fragments activate together.

## use statements

```umple
use Premium;       // activate mixset or include file Premium / Premium.ump
use core.ump;      // include another file (once)
use !Premium;      // cancel / do not use Premium
```

- A model file or mixset is included **once**; duplicate `use` of the same name is ignored.
- `use !Name;` cancels a previous request to use `Name`.

## Multiple files pattern

```
product/
  core.ump          # always-on classes
  premium.ump       # mixset Premium { ... }
  app.ump           # use core.ump; use Premium;
```

Example `app.ump`:

```umple
use core.ump;
use premium.ump;
use Premium;
```

When calling the Umple Online API, inline or concatenate the contents (the remote compiler does not see your disk). Still save separate files for the user.

## State machines and mixsets

Optional states/transitions can live in a mixset (inline or compositional). Keep the base machine valid even when the mixset is off.

## What to report

| Situation | Tell the user |
| --------- | ------------- |
| Mixset defined, no `use` | Feature is inactive / dead for this build |
| `use` without declaration | Warning risk — declare empty mixset or remove use |
| Two files mixin the same class | Expected merge |

## Gotchas

- One association per class pair in the **merged** result.
- Do not name a state `Final`.
- Empty unsupported inline mixset forms can error — prefer `{ ... }` blocks as in the manual.
- Compiling only the feature file without core may fail; compile the combined app.
