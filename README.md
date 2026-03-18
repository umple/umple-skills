<div align="center">
  <img src="assets/umple_logo.svg" alt="Umple Logo" width="200">
</div>

# Umple Skills

AI skills for [Umple](https://www.umple.org) — generate UML diagrams and production-quality code from natural language, powered by the Umple Online API. No local dependencies required.

## Skills

### Diagram Generator

Describe what you want in plain English and get a clean SVG diagram back.

**Supported diagram types:**
- **Class diagrams** — classes, attributes, associations, inheritance, interfaces
- **State machine diagrams** — states, transitions, guards, actions, nested states, concurrent regions
- **ER diagrams** — entity-relationship diagrams for database modeling
- **Trait diagrams** — reusable trait definitions

**Example prompt:**
> Draw a class diagram for a university system with Students, Courses, and Professors. Students enroll in multiple courses, and each course has one professor.

### Code Generator

Describe your domain model and get complete, working code in your target language.

**Supported languages:**
- Java (full-featured, default)
- Python
- PHP
- Ruby
- C++ (real-time)
- SQL (CREATE TABLE DDL)

Generated code includes constructors, getters/setters, association management methods, and state machine logic — no boilerplate to write.

**Example prompt:**
> Generate Java classes for a library system with Books, Members, and Loans. Members can borrow up to 5 books. Each loan tracks the borrow date and due date.

## Using with Claude

### Claude chatbot (claude.ai / Claude Desktop)

1. Download the skill zip files from the [**Releases page**](https://github.com/umple/umple-skills/releases/latest)
2. In Claude, go to **Settings > Capabilities > Skills**
3. Click **"+"** → **"Upload a skill"**
4. Upload the `.zip` file for each skill

Once uploaded, Claude will automatically use the skills when you ask for diagrams or code generation.

### Claude Code (CLI)

```bash
npx skills add umple/umple-skills
```

The skills will be available as `/umple-diagram-generator` and `/umple-code-generator`.

## How it works

Both skills use the [Umple Online API](https://cruise.umple.org/umpleonline/) — no local tooling required. Each skill is self-contained:

```
<skill>/
├── SKILL.md         # Workflow — when and how to use the skill
└── references/      # Domain knowledge — Umple syntax and patterns
```

## Local development

```bash
git clone https://github.com/umple/umple-skills.git
cd umple-skills
./sync-skills.sh    # Sync skills to ~/.agents/skills
```

To build the zip files locally:

```bash
./build-zips.sh     # Outputs to dist/
```
