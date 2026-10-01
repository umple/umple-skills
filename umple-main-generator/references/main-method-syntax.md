# Umple main-method syntax

Umple has no special `main` keyword. You embed a Java-style main inside a class, tagged with the target language.

## Minimal Hello World

```umple
class HelloWorld {
  public static void main(String [ ] args) Java {
    System.out.println("Hello World");
  }

  public static void main(String [ ] args) Python {
    print("Hello World")
  }
}
```

Notes:

- Prefer `String [ ] args` (space before `[]`) to match the Umple manual examples.
- The body is **target language** (Java/Python/…), not Umple.
- You can put only the Java body if the user did not ask for Python.

## Instantiate a class / data model

Generated constructors take mandatory attributes (not `lazy`). Associations use generated `addRole` / `setRole` methods.

```umple
class Member {
  String name;
}

class Book {
  String title;
  * -- * Member;
}

class Demo {
  public static void main(String [ ] args) Java {
    Member m = new Member("Ada");
    Book b = new Book("Umple Book");
    b.addMember(m);
    System.out.println(m);
    System.out.println(b);
  }
}
```

One-to-many often uses `addX` on the “one” side or the side Umple generates; if unsure, generate Java once and read the API, or use patterns from `umple-code-generator/references/generated-api-patterns.md` when available.

## Exercise a state machine

Events become methods. Transition `off -> Off` means call `off()`.

```umple
class Light {
  sm {
    On  { off -> Off; }
    Off { on  -> On;  }
  }

  public static void main(String [ ] args) Java {
    Light light = new Light();
    System.out.println(light);
    light.off();
    System.out.println(light);
    light.on();
    System.out.println(light);
  }
}
```

Nested states / guards: only fire events that exist; keep the demo short (2–4 event calls).

## Main on the domain class vs a Demo class

| Situation | Prefer |
| --------- | ------ |
| Tiny teaching example | `main` on the domain class |
| Larger model | separate `class Demo { ... main ... }` |
| State machine walkthrough | `main` on the class that owns `sm` |

## Serialization / advanced demos

You may `depend java.io.*;` etc. inside the class (mixin style) when the user asks for serialization demos — keep that optional.

## Gotchas

- Do not invent methods Umple did not generate.
- Immutable attributes: pass them to the constructor; do not `setX`.
- Nested generics / arrays in signatures: follow Umple manual spacing (`String [ ]`).
- Never name a state `Final`.
- After writing `main`, always compile via the Umple Online API.
