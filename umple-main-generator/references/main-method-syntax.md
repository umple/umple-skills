# Umple main-method syntax

Umple does not invent a special `main` keyword. You write a Java-style main inside a class:

```umple
class HelloWorld {
  public static void main(String [ ] args) Java {
    System.out.println("Hello World");
  }
}
```

Optional second language:

```umple
  public static void main(String [ ] args) Python {
    print("Hello World")
  }
```

## Instantiate a class model

Generated constructors take mandatory attributes (not `lazy`). Associations use `addRole` / `setRole`.

```umple
class Member { String name; }
class Book { String title; * -- * Member; }

class Demo {
  public static void main(String [ ] args) Java {
    Member m = new Member("Ada");
    Book b = new Book("Umple");
    b.addMember(m);
    System.out.println(m);
  }
}
```

## Exercise a state machine

Event `off` becomes a method `off()`.

```umple
class Light {
  sm { On { off -> Off; } Off { on -> On; } }
  public static void main(String [ ] args) Java {
    Light light = new Light();
    light.off();
    light.on();
    System.out.println(light);
  }
}
```

## Gotchas

- `String [ ] args` not `String[] args` when following the manual examples.
- The main body is **target language**, not Umple.
- Do not call setters on `immutable` attributes.
