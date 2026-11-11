---
title: Development Bootstrap
updated: 2026-11-11
---

Development Bootstrap

This document lists the local setup an agent needs before developing in this repository. Run it lazily: check each item, and set up only what is missing.

## Skills

Skill sources live in `skills/` for development and in `plugin/skills/` for the published plugin. Claude Code loads project skills from `.claude/skills/`, which git ignores, so each skill is a symbolic link back to its source.

- Every folder in `skills/` and `plugin/skills/` has a link of the same name in `.claude/skills/`.
- The installed `design-system@ui` plugin is turned off for this folder, so the local plugin skills win.
- A new session picks up new links; tell the person to restart when the setup added any.

```bash
mkdir -p .claude/skills
for dir in skills/*/ plugin/skills/*/; do
  name=$(basename "$dir")
  [ -e ".claude/skills/$name" ] || ln -s "../../${dir%/}" ".claude/skills/$name"
done
[ -f .claude/settings.local.json ] || printf '{\n  "enabledPlugins": {\n    "design-system@ui": false\n  }\n}\n' > .claude/settings.local.json
ls -l .claude/skills
```

## Working notes

`context/` holds the agent's notes and is ignored by git, and `context/coding/` holds its coding notes, described in the ui-coding skill. Create them when they are missing.

```bash
mkdir -p context/coding
```

## Other agents

Agents without project skills read `skills/<name>/SKILL.md` directly when a task matches its description.
