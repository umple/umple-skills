---
name: umple-gv-state-diagram
description: Generate a UML state machine diagram (GvStateDiagram) from a natural-language requirement by writing Umple code, running the Umple CLI, and saving the resulting SVG to ~/downloads.
allowed-tools: Bash(npx -y bun:*), Bash(command -v umple:*), Bash(umple --help:*), Bash(umple:*), Bash(mktemp:*), Bash(mkdir:*), Bash(cat:*), Bash(ls:*), Bash(cp:*), Bash(command -v dot:*), Bash(dot:*), Bash(date:*)
---

# Umple GV State Diagram Skill

## Script Directory

**Important**: All scripts are located in the `scripts/` subdirectory of this skill.

**Agent Execution Instructions**:
1. Determine this SKILL.md file's directory path as `SKILL_DIR`
2. Script path = `${SKILL_DIR}/scripts/main.ts`
3. Replace all `${SKILL_DIR}` in this document with the actual path

**Script Reference**:
| Script | Purpose |
|--------|---------|
| `scripts/main.ts` | CLI entry point for Umple diagram generation |

## Quick Start (Recommended)

Use the script to validate and generate diagrams:

```bash
# Basic generation from .ump file
npx -y bun ${SKILL_DIR}/scripts/main.ts --input /path/to/model.ump

# With custom output path
npx -y bun ${SKILL_DIR}/scripts/main.ts --input model.ump --output diagram.svg

# With suboptions (hideactions, hideguards, etc.)
npx -y bun ${SKILL_DIR}/scripts/main.ts --input model.ump -s hideactions -s hideguards

# JSON output
npx -y bun ${SKILL_DIR}/scripts/main.ts --input model.ump --json
```

**Workflow with Script**:
1. Write the Umple model to a temp file
2. Run the script with `--input <path>`
3. If validation fails (exit code 2), fix the Umple code and retry
4. On success, script prints the output SVG path

**Script Options**:
| Option | Description |
|--------|-------------|
| `-i, --input <path>` | Input `.ump` file (required) |
| `-o, --output <path>` | Output SVG path (default: `~/downloads/state_machine_<timestamp>.svg`) |
| `-s, --suboption <opt>` | GvStateDiagram suboption (repeatable) |
| `--json` | JSON output with details |
| `-h, --help` | Show help |

**Exit Codes**:
| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Missing dependencies (umple or dot) |
| 2 | Umple validation/compilation failed |
| 3 | SVG generation failed |

---

## Goal

When the user asks for a **state machine diagram** from a requirement, you will:

1. Convert the requirement into **valid Umple state machine code**.
2. Run the **Umple CLI** to generate a **GvStateDiagram**.
3. Ensure an **SVG** is produced.
4. Save the SVG to `~/downloads/`.
5. If generation fails or output is incorrect, iterate: **fix the Umple** and re-run.

## Pre-flight checks (must do before running Umple)

### 1) Verify Umple CLI is installed and on PATH

Run:

```bash
command -v umple
umple --help
```

If `command -v umple` fails (no output / non-zero exit), tell the user to install Umple CLI:

https://cruise.umple.org/umpleonline/download_umple.shtml

Then stop; do not attempt generation.

### 2) Verify Graphviz is available (recommended)

The script can use Umple's `-c` flag to convert Graphviz to `.svg` directly. However, if that fails or `dot` is missing, the script falls back to using the Graphviz `dot` command.

Confirm Graphviz `dot` exists:

```bash
command -v dot
dot -V
```

If `dot` is missing, tell the user how to install it via Homebrew:

```bash
brew install graphviz
```

Then re-check:

```bash
command -v dot
dot -V
```

---

## Internal CLI usage (implementation detail)

The script encapsulates all CLI operations. The canonical command run internally is:

```bash
umple /path/to/model.ump -g GvStateDiagram [-s suboption]
```

With optional suboptions:

```bash
umple /path/to/model.ump -g GvStateDiagram -s hideactions -s hideguards
```

If the `.svg` is not generated directly, the script falls back to:

```bash
dot -Tsvg /path/to/model.gv -o /path/to/model.svg
```

---

## Workflow (do this every time)

### Step 1 — Clarify only what you must

If the requirement is ambiguous, first propose your plan, then ask minimal questions that unblock diagram generation.

Proposed plan (say this explicitly):

- I will model this as a single class with an inline `sm { ... }`.
- I will pick clear state names and event names from your requirement.
- I will add guards/actions only if you specify them; otherwise I’ll keep transitions simple.
- I will generate `GvStateDiagram` with `umple -g GvStateDiagram -c` and save the `.svg` to `~/downloads/`.

Then ask questions (include this option):

- Do you want me to do it my way (make reasonable assumptions and proceed), or do you want to specify the missing details first?

- What is the **initial state**?
- What are the **events**?
- What are the **terminal/final** states (if any)?
- Any **guards** (conditions) or **actions** (side effects)?
- Any **error/otherwise** transitions?

If it’s still ambiguous after one round, make reasonable assumptions and include them as `// Assumption: ...` in the Umple code.

### Step 2 — Write the Umple model

Create a small, self-contained model that includes a class + a state machine.

Rules:

- Prefer **inline** state machine inside the class unless reuse is needed.
- Use simple, consistent event names.
- Ensure every referenced state exists.

### Step 3 — Generate the diagram using the script

Use the script in a temp folder so generation does not pollute the repo:

```bash
tmpdir="$(mktemp -d)"
cat >"$tmpdir/model.ump" <<'EOF'
// (generated Umple goes here)
EOF

npx -y bun ${SKILL_DIR}/scripts/main.ts --input "$tmpdir/model.ump"
```

The script will:
1. Validate Umple code and run generation
2. Convert `.gv` to `.svg` if needed
3. Save the result to `~/downloads/`

Expected outputs are produced alongside the `.ump` file, typically:

- `$tmpdir/model.gv`
- `$tmpdir/model.svg`

Keep `tmpdir` and include it in your final response so the user knows exactly what was created.

### Step 4 — Validate output correctness

The script exits with specific codes:
- `0` - Success (SVG generated)
- `1` - Missing dependencies
- `2` - Umple validation failed
- `3` - SVG generation failed

If the script exits non-zero, read the error output, fix the Umple model, and retry.

### Step 5 — Save to ~/downloads

The script automatically saves the SVG to `~/downloads/` with a timestamped filename. The output path is printed to stdout.

If you need a custom filename, use the `--output` option:

```bash
npx -y bun ${SKILL_DIR}/scripts/main.ts --input "$tmpdir/model.ump" --output ~/downloads/my_diagram.svg
```

Report the final path to the user (example): `~/downloads/state_machine_YYYYMMDD_HHMMSS.svg`.

## Repair loop (required)

Retry up to **3** times.

On each failure:

1. Identify the root cause from script output (syntax error, unknown state, missing semicolon, etc.).
2. Apply a focused fix to the Umple model.
3. Re-run:

```bash
npx -y bun ${SKILL_DIR}/scripts/main.ts --input "$tmpdir/model.ump"
```

If after 3 attempts it still fails, stop and:

- Show the exact error text from the script.
- Ask one targeted question to resolve the blocker.

## Umple state machine guidance (include in prompt / follow strictly)

### Placement

- Inline inside class:

```umple
class C {
  sm { S1 { e -> S2; } S2 {} }
}
```

- Standalone + reuse:

```umple
class A { st as M; }
statemachine M { S1 { e -> S2; } S2 {} }
```

### Core grammar

- State:

```umple
State { ... }
```

- Transition:

```umple
event -> Target;
```

### Guards & actions

- Guard: `[boolean]`
- Action: `/ { code }` (before or after arrow)

```umple
e [cond] / { act(); } -> S2;
e -> / { act(); } S2;
```

- Entry / Exit:

```umple
S {
  entry / { onEnter(); }
  exit  / { onExit(); }
}
```

- Do activity:

```umple
S { do { work(); } }
```

### Auto-transitions (eventless)

```umple
-> Next;
```

May include guards/actions.

### Event parameters

```umple
S { e(int x) [x > 0] -> T; }
```

Constraint: same event name ⇒ same parameter types everywhere.

### `unspecified` (catch-all)

```umple
S {
  unspecified -> Error;
}
```

### Threading / ordering

- `queued sm { ... }` enqueues events, FIFO.
- `pooled sm { ... }` may process later events first if handleable.

### Final states

- `Final` (capital) is an implicit top-level final:

```umple
go -> Final;
```

- Or use named finals:

```umple
final Done {}
final Failed {}
```

### Concurrency (orthogonal regions)

Use `||` inside a composite state:

```umple
S {
  A { ... final Af {} }
  ||
  B { ... final Bf {} }
}
```

### Reuse + extension (`as`)

```umple
class X { st as M; }
```

Extend inline:

```umple
class X {
  st as M {
    cancel S1 -> S0;
    New { go -> S2; }
    S0 { entry / { reset(); } }
  };
}
```

### Split definitions

```umple
class X {
  sm {
    A { e1 -> B; }
    e2 B -> A;
  }
}
class X {
  sm {
    e3 A -> B;
  }
}
```

## Output contract (when answering the user)

1. Show the generated Umple code (single ` ```umple ` block).
2. Confirm the exact command(s) you ran.
3. Provide the final SVG path in `~/downloads/...`.
4. List all additional files/folders (No need to mention the system-generated temporary directory) you left on the user’s computer.

Do not suggest irreversible deletion commands; if the user asks about cleanup, tell them they can remove the temp folder using their preferred method.
