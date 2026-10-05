# Umple requirements syntax

## Define a requirement

```umple
req R01 {
  A member has a name and may borrow books.
}

req R02 {
  A book has a title and an ISBN.
}
```

- ID is an identifier: `R01`, `H001`, `REQ101`. Hyphens and underscores are accepted (`REQ-101`, `REQ_101`).
- Body is free text. Keep it one requirement per `req` block.

## Tag the next element

`implementsReq` applies to the **next** model element. Put it immediately before that element.

```umple
implementsReq R01;
class Member {
  String name;
}

implementsReq R02;
class Book {
  String title;
  String isbn;
}

association { * Member -- * Book; }
```

Multiple IDs on one element (assuming `req R01` and `req R02` exist):

```umple
implementsReq R01, R02;
class Member { String name; }
```

Same requirement on several elements: repeat `implementsReq R01;` before each.

## What you can tag

| Target | Pattern |
| ------ | ------- |
| Class | `implementsReq R1;` then `class Name { ... }` |
| Attribute | inside the class, `implementsReq R1;` then `String title;` |
| Association | `implementsReq R1;` then `* -- * Book;` (inside a class) or before `association { ... }` |
| State machine | `implementsReq R1;` then `sm { ... }` (tag the machine, not each state) |
| Method | `implementsReq R1;` then the method |
| Trait / interface | `implementsReq R1;` then `trait` / `interface` |
| Enum | `implementsReq R1;` then `enum Color { ... }` |

Inline after an attribute also works (from the Umple manual), but prefer the line-before form. Here `var1` implements R02 and `var2` implements R01 and R02:

```umple
class Example {
  implementsReq R02;
  String var1;
  String var2; implementsReq R01, R02;
}
```

## Do not

- Reference an ID that has no `req` block — warning 401: `Cannot find specified requirement identifier(s)`
- Re-emit `req { ... }` blocks that already exist in the file
- Invent fine-grained `implementsReq` mappings from a long unlabelled spec dump
- Duplicate the same association from both classes
- Name a state `Final` (error 74, reserved keyword)
- Tag individual states: the hosted compiler accepts it but does not list states in PlainRequirementsDoc; tag the `sm` block or the class instead

## Verify traceability

Compile with `language=PlainRequirementsDoc`. Implemented reqs list `IMPLEMENTED BY:` plus the element name. Untagged reqs appear without implementations.

## Minimal labelled example

```umple
req R01 {
  A library member is identified by name.
}
req R02 {
  A book is identified by title and ISBN.
}
req R03 {
  Members borrow many books; books are borrowed by many members.
}

implementsReq R01;
class Member {
  String name;
  implementsReq R03;
  * -- * Book;
}

implementsReq R02;
class Book {
  String title;
  String isbn;
}
```

## Massive unlabelled input

If the user pasted a long spec with no IDs, emit a normal Umple model **without** `req` / `implementsReq`. Do not invent a large ID scheme just to look complete.
