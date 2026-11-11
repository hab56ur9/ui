---
title: Design Language Guide
updated: 2026-11-11
---

Design Language Guide

This guide explains how ui supports more than one design language and where its support ends. Tokens carry every part that a value can express; components carry the parts that need structure or behavior. Apps see neither tokens nor styles, only component props.

## Layers and owners

A design language has four layers, and ui owns only the ones that values can express.

| Layer | What it decides | Owner |
| --- | --- | --- |
| Principles | What the language values, such as attention or realism | People; written down, never switched |
| Foundations | Color, type, shape, space, depth, material, motion, icons | ui, through tokens and the style axis |
| Components and patterns | Which parts exist, how they are built and how they behave | ui, including parts unique to one language |
| Voice | The tone of on-screen copy | The app |

## What the system switches

Four independent axes restyle every component without touching its code. An app fixes preset and style with one theme constant; the other axes are not the app's to set.

| Axis | Attribute | Changes |
| --- | --- | --- |
| Theme | `data-theme` | Light and dark color; follows the system setting |
| Preset | `data-preset` | Brand colors: `color.main.*`, `color.sub.*` and the matching chart roles; set by the theme constant |
| Medium | `data-medium` | Type scale, spacing and widget sizes for app, document or slide; set by templates |
| Style | `data-style` | Shape, border, focus ring, elevation, material and motion; set by the theme constant |

`UIProvider` takes one constant, `themes.<preset>.<style>`, and sets both attributes on the root element. The constant is opaque, so an app picks a whole theme and cannot override part of it.

## Style tokens

A style file may override these global tokens. Components read only these names for the matching properties, so a style reaches every component.

| Group | Tokens | Default (minimal) |
| --- | --- | --- |
| Shape | `radius.control`, `radius.card`, `radius.mark`, `radius.sheet`, `radius.pill` | 6, 10, 4, 16, 999 px |
| Border | `border-width.default`, `border-width.strong`, `border-width.accent` | 1, 2, 3 px |
| Focus | `focus-ring.width`, `focus-ring.offset` | 2, 2 px |
| Depth | `elevation.card`, `elevation.lifted`, `elevation.overlay` | Soft shadows tinted by the theme |
| Material | `material.surface-opacity`, `material.backdrop` | 1 (opaque), none |
| Motion | `motion.duration.fast/base/slow`, `motion.easing.standard/enter/exit`, `motion.stagger`, `motion.intensity` | 120, 200, 280 ms; standard curves; 30 ms between staggered items; intensity 0.5 (expressive 1, brutal 0) |

Material applies to floating surfaces only: menus, the floating tab bar, the theme picker panel, chart tooltips, the markdown menu, dialogs and toasts.

## Making a style

A style is one JSON file in `tokens/style/`. The build turns it into a `[data-style="name"]` block and adds it to the docs site's theme picker. Add the style to every family in `themes` in `src/lib/theme.ts` so apps can pick it.

- Copy an existing style file and keep `label` in Korean and English.
- Put only overrides under `tokens`, with the same `$type` as the global token; the build stops on a path the global layer does not define.
- Leave out what stays the same; `minimal` is empty and is the default.
- Check contrast when a style changes material or a shadow color: text keeps 4.5:1 and marks keep 3:1 on every surface, in both themes.
- Look at the docs site with the new style in light and dark before committing.

```json
{
  "label": { "ko": "브루탈", "en": "Brutal" },
  "tokens": {
    "radius": { "$type": "dimension", "card": { "$value": { "value": 0, "unit": "px" } } },
    "border-width": { "$type": "dimension", "default": { "$value": { "value": 2, "unit": "px" } } }
  }
}
```

## What ui adds as components

Tokens change how parts look, not which parts exist or how they move. When a language needs more, ui adds a component; apps never build styled parts themselves.

| Need | Example | Where it lives |
| --- | --- | --- |
| Parts unique to one language | A floating toolbar, a morphing loader | A ui component built from tokens |
| Behavior and choreography | A tab bar that shrinks on scroll, a button that melts into a menu | The ui component's code |
| Effects beyond values | Refraction, specular highlights | The ui component, with SVG filters or shaders |
| Copy tone | Short and friendly versus formal | App copy |

## Language notes

Each common language splits differently between tokens and components.

| Language | Tokens cover | Components to add in ui |
| --- | --- | --- |
| Minimal SaaS | Everything; it is the default style | Nothing |
| Material 3 Expressive | Large radii and the overshooting entrance (`expressive`), strong color through a preset | Shape-morphing buttons and loaders, floating toolbars |
| Neo-brutalism | Square corners, thick borders, hard offset shadows (`brutal`) | Bordered buttons if wanted; buttons use fills by default |
| Glassmorphism | Translucent floating surfaces and backdrop blur through `material.*` | Background imagery that makes the blur visible; a contrast check on every surface |
| Liquid Glass | The glass base through `material.*` | Refraction, light that follows motion, shrinking bars and melting transitions |

## Limits

- A heading typeface per style is not a token yet; headings read `--font-family-heading` and fall back to the body face.
- Spring physics is approximated with an overshooting cubic-bezier curve.
- Styles change no colors; a language with its own palette needs a preset as well.
