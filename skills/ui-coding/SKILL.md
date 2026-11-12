---
name: ui-coding
description: Coding guidelines for the ui repository and the agent's own coding notes in context/coding/. Invoke before writing, refactoring or reviewing code in this repository, on "코딩 가이드", "코드 규칙", "ui coding", or when a coding lesson is worth keeping.
---

# ui coding

This skill holds the few coding rules that every change in this repository follows, and the place where agents keep what they learn about the code. The procedure for a change lives in the ui-dev skill.

## Core guidelines

- A component's props are its whole contract. Apps see props only: tokens, CSS classes and inline styles stay inside `src/lib`, and a new look arrives as a new prop value or a new component.
- Styles live in `src/lib/styles/` and read `var(--*)` tokens. A new visual value becomes a token first.
- Motion reads the `motion.*` tokens, and every animation stops under reduced motion and in print. A component marks an element with an internal `data-motion` (enter, draw, grow, count, attention) only inside a motion scope, and the keyframes it plays come from `motion.shape.*`, so a redesign swaps motion through tokens.
- Code ships without comments. Names carry the meaning, and a function is extracted only when its name adds information.
- Control flow stays flat: return early, test one condition at a time, name a comparison as a predicate, and loop over ranges or collections.
- The library depends on react and react-dom only, and `bin/` on Node built-ins only. A new dependency is the maintainer's decision.
- Component text lives in `src/lib/i18n.tsx` and docs text in both languages.
- A change that narrows or renames public API is a breaking change and commits as `feat!`.

## Coding notes

`context/coding/` is the agent's own notebook about the code. It is ignored by git, it is reference only, and the code always wins over a note.

- The agent decides alone what to write, merge, rewrite or delete there; it asks nobody.
- A note earns its place when the code does not say it plainly: the cause of a bug that took effort to find, an invariant that spans files, a verification trick, or the reason a design looks odd.
- One topic per file, named in kebab-case. The first sentence states the topic and the date it was checked.
- Read the notes that touch the code before changing it.
- After a change, update a note that became wrong and delete a note that the code now makes obvious.
- Keep notes short. A note that grows past a screen splits into topics or loses its stale parts.

```bash
mkdir -p context/coding
ls context/coding
```
