<div align="center">
  <img src="assets/umple_logo.svg" alt="Umple Logo" width="200">
</div>

# umple-diagram-generator

An AI skill that generates UML diagrams from natural-language requirements.

## What This Skill Does

This skill helps AI agents convert textual requirements into visual UML diagrams by:
1. Reading diagram-specific guidance from the `references/` folder
2. Generating valid Umple code based on user requirements
3. Running Umple CLI to produce SVG diagrams

## Dependencies

- **Umple CLI**: Diagram generation engine
- **Graphviz**: SVG conversion
- **Bun**: TypeScript runtime
- **npx**: Package executor for running the skill installer

## Installation

```bash
# Install via skills command (requires NPX)
npx skills add elwinLiu/umple-skills
```

## See Also

- `SKILL.md` for detailed agent instructions
- `references/` for domain-specific guidance
- Other skills in the umple-skills repository

```bash
# Sync to agents directory
./sync-skills.sh
```
