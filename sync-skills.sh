#!/usr/bin/env bash
# Sync skills from agent/skills/ to umple-skills/
# Run this script to update skills in the umple-skills folder

set -e

SOURCE_DIR="$HOME/.agents/skills"
TARGET_DIR="$(dirname "$0")"

echo "Syncing skills from $SOURCE_DIR to $TARGET_DIR"

for skill_dir in "$SOURCE_DIR"/*/; do
    if [ -d "$skill_dir" ]; then
        skill_name=$(basename "$skill_dir")
        target_skill_dir="$TARGET_DIR/$skill_name"

        echo "  → Syncing: $skill_name"

        rm -rf "$target_skill_dir"
        cp -r "$skill_dir" "$TARGET_DIR/"

        # If skill has .git, remove it (each skill is its own repo)
        if [ -d "$target_skill_dir/.git" ]; then
            rm -rf "$target_skill_dir/.git"
        fi
    fi
done

echo "Done! Synced $(ls -1 "$SOURCE_DIR" | wc -l) skills to $TARGET_DIR"
