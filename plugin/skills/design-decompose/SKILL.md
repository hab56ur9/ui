---
name: design-decompose
description: Breaks the parts an app drew for itself into ui components once the app works. It finds every hand-made part, decides for each piece whether an existing component, a new prop, a new component or app code covers it, writes a decomposition sheet, then adds the approved components to ui and moves the app onto them. Invoke on "디자인 분해", "컴포넌트로 분해", "컴포넌트화", "앱 컴포넌트 정리", "ui로 올려", "decompose", or "componentize".
user-invocable: true
---

# ui Design Decomposition

This skill pays back the parts an app built for itself while it was being made. An app under a deadline may draw a part with its own markup and CSS; once the app works, this skill breaks those parts into ui components so the app ends with component props only.

## When to use

- An app or mockup works, and it keeps its own stylesheet, its own component folder or inline styles.
- `ui lint` reports problems in the app.
- A design (screenshot, Figma frame or HTML mockup) needs the same breakdown before any code exists.

## Sources

The decision for each piece rests on what ui already has.

- Every component and its props: https://hab56ur9.github.io/ui/dist/components.json
- API tables with defaults and meaning: https://github.com/hab56ur9/ui/blob/master/src/site/api.en.ts
- Standard names for interface parts, and which ones ui lacks or covers in part: https://github.com/hab56ur9/ui/blob/master/docs/ui-vocabulary.md
- What tokens and styles can change, and what needs a component: https://github.com/hab56ur9/ui/blob/master/docs/design-language-guide.md
- The source in `src/lib/` decides when the lists above disagree with it.

## 1. Inventory

The inventory lists every place where the app draws instead of composing ui components.

- Capture every screen in every state it can show: open overlays, empty, loading, error and each tab. Reach a state through the URL or by clicking through the Chrome DevTools Protocol.
- Mark each hand-made part on the captures with an id: P1, P2 and so on. The screen decides what a part is, not the file it lives in.
- Run `ui lint` on the app's pages and scripts, and group its problems by part. The app's own stylesheet is listed per selector prefix rather than per line.
- Collect the app's own stylesheets, CSS modules, utility classes, styled components and inline style objects.
- Collect the raw elements (div, span, button, input, svg) that carry classes of their own; the lint does not report them.
- Check every prop the app passes against components.json; a prop that does not exist marks a part the app expected ui to have.
- Leave mockup scaffolding, demo switchers and dead exports out of the parts; the sheet lists them under Drop.

```bash
npx --yes github:hab56ur9/ui lint $(find . -path ./node_modules -prune -o \( -name '*.tsx' -o -name '*.jsx' -o -name '*.js' -o -name '*.html' \) -print)
```

## 2. Break parts down

Each part splits into pieces that do one job: a frame (layout), a surface (card, panel, sheet), a control, a data display, text, an icon or a motion. A part is decomposed when every piece has an outcome from the next step.

## 3. Decide an outcome

Each piece answers these questions in order, and the first yes decides its outcome.

1. Is it domain logic, data, copy or storage? App.
2. Does an existing component do the job? Use.
3. Does an existing component do the same job but lack a prop value, variant or state? Extend. A change that gives the component a second job, such as a new region, a new kind of child or an interaction of its own, is New instead.
4. Does the piece have a standard name in the vocabulary, or repeat across screens or apps? New.
5. Otherwise, existing components arranged together do the job: Compose, even when the arrangement appears only once.

Token stands beside these outcomes: a piece whose only gap is a visual value, or a new value on a token axis such as a medium, adds a token to ui.

| Outcome | When | Result |
| --- | --- | --- |
| Use | An existing component does the job | The app switches to it |
| Compose | Existing components arranged together do the job | The arrangement stays in the app, laid out with Page, Stack, Row, WidgetGrid or CardGrid |
| Extend | A component lacks a prop, variant or state (often "Partial" in the vocabulary) | A new prop or prop value on that component |
| New | A standard part that no component covers | A new ui component |
| Token | Only a visual value, or a value on a token axis, is missing | A new token in ui, which a style may override |
| App | Domain logic, data, copy or storage | Stays in the app, with no styling |
| Drop | Mockup scaffolding, demo controls, dead code | Deleted, not decomposed |

- A look that differs from ui is not a reason for a new part; the app takes the ui look. Ask the owner only when the difference is the product's identity, and then the answer is a preset, a style or a component in ui. When the owner cannot be asked, the sheet records the question and the piece takes the ui look meanwhile.
- A part unique to one design language is still a component; its look comes from style tokens.

## 4. Shape each proposal

Every Extend and New proposal follows the ui component rules.

- The name is the standard term from the vocabulary, not the app's domain: `Chip`, not `ModelTag`.
- Props are the whole contract. Variants are named by meaning (`tone`, `variant`, `size`), color is a tone or a series slot, and className, style and HTML attributes stay inside the component.
- The component stores nothing. A value arrives as `value` or `defaultValue`, and every change leaves through an event such as `onChange`.
- The look is built from tokens. A new value becomes a token first, and shape, border, elevation, material and motion read the style tokens so every style restyles the part.
- Entrance and emphasis motion plays only inside the motion scope of Board, Diagram or Infographic, with the shapes the style names. A part whose motion is its job, such as a thinking indicator or a cursor, reads the motion tokens and stops under reduced motion.
- Built-in text such as Close or Retry lives in ui's i18n in both languages; the app passes only its own sentences.
- A status color travels with a second cue, an icon or a label. A one-line label truncates with a tooltip.
- Native elements and keyboard support come first; the focus ring comes from tokens.
- The API is the smallest one that covers every usage found in step 1, and the proposal lists those usages.

## 5. Write the decomposition sheet

The sheet is one Markdown file in the app; the default path is `docs/ui-decomposition.md`.

- Summary: the count per outcome and the order of the work.
- Parts: one row per piece with its id, screen, piece, piece type (frame, surface, control, data display, text, icon or motion), outcome, target (`Component.prop` or the token name) and app location.
- Proposals: for each Extend or New, the name, why no existing component covers it, a props table (name, type, default, meaning), the usages, the vocabulary row it fills or adds and the open questions.
- Drop: the scaffolding and dead code to delete.
- ui defects: bugs in ui that the inventory hit, each reported to the maintainer on its own.
- Captures: the marked screens from step 1.

A new public prop or component is the maintainer's decision. The maintainer reviews the proposals before any change reaches ui; Use and Compose need no review.

## 6. Build in ui

Approved proposals land in a clone of github.com/hab56ur9/ui and follow its `ui-dev` and `ui-coding` skills.

- Order: tokens, then Extend, then New.
- Each component brings its styles in `src/lib/styles/`, its export in `src/lib/index.ts`, its text in `src/lib/i18n.tsx`, a docs page with API and example entries in both languages, and an updated row in `docs/ui-vocabulary.md`.
- `npm run check` passes before each commit.

## 7. Move the app over

The app swaps each part for its outcome and deletes its own CSS and components as they empty.

- Use and Compose can move before ui ships anything.
- Extend and New move once the ui change is published, or under `ui serve` against a local clone.

## Check

The work is done when all of these hold.

- Every piece in the sheet has one outcome, and no piece is left as "custom".
- `ui lint` is clean on the app, and the app's own stylesheet is gone.
- Each screen captured after the move matches its step 1 capture, or differs only where the sheet says so.
