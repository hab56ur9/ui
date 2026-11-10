# ui Agent Guide

This guide tells coding agents what the ui project is and how to work in it. It holds only facts that stay true as the code changes.

## Project

ui is a personal design system for apps, technical documents and slide decks.

- Design tokens define color, type, space and motion, and build into CSS variables and a JSON snapshot.
- Theme, medium (app, document, slide) and language are independent token axes, and presets restyle the brand colors.
- React components cover inputs, navigation, feedback, data, content and frames. They take props only and leave storage to the app.
- Templates compose the components into slide decks, documents, resumes, portfolios and dashboards.
- `JsonUI` draws a JSON template with the components, as the engine for server-driven screens.
- A single-page documentation site shows every token, component and template with live examples on GitHub Pages.
- A CLI serves local pages with the design system, and a plugin brings the system to Claude Code and Codex.

## Working notes

Agents keep what they learn in `context/`, a local folder that git ignores.

- Read `context/` before starting work.
- Save what a task needed and the code did not say plainly as Markdown, one topic per file.
- Update or delete a note when a change makes it wrong.

## Rules

- The repository is public: local machine paths, personal names and company data stay out of it.
- Code ships comment-free.
- `npm run check` passes before every commit.
- Commit messages follow Conventional Commits; release-please derives versions and the changelog from them.
- README.md stays under 3,000 characters.
