---
title: Agent and Human Review Loop
updated: 2026-11-11
---

Agent and Human Review Loop

This document records the concept behind the ui repository as stated on 2026-11-11. The repository exists to shorten the loop in which an agent builds a screen, a person reviews it, and the agent applies the feedback.

## Problem

Feedback given in words often reaches the agent with a different meaning. The agent then makes the wrong change, the person explains again, and the loop repeats without progress.

## Answer

The design system is a common language that both the agent and the person read and edit. Feedback moves as edits to a shared artifact instead of as sentences.

- The agent describes the app as a JSON spec built only from design system components.
- A builder turns the spec into one static UI file.
- The person reviews that file and corrects it by editing the UI directly.
- The agent receives the corrected spec, not a description of the correction.

## Flow

| Step | Actor | Input | Output |
| --- | --- | --- | --- |
| 1. Spec | Agent | The request and its context | A JSON spec: screens, components, data slots, actions, and a description on each part |
| 2. Build | Builder | The JSON spec | One static HTML file at mockup level, with example data and no API |
| 3. Review | Person | The HTML file | A corrected spec, made by taking the UI apart and putting it back together in an editor |
| 4. Logic | Agent | The corrected spec | API calls and use cases connected to the static UI through its data slots and actions |

## The spec

The spec is both the screen source and the behavior specification.

- Every node is a design system component with its props, so the spec renders without extra instructions.
- Navigation, overlays and actions are part of the spec, so the mockup behaves like the app.
- A `description` on the app, screens, widgets, components, actions and data fields explains intent. The builder keeps descriptions out of the screen; they make the same JSON readable as a specification.
- Data slots carry example values. The mockup shows them in place of live data.

## The builder

The builder reads a spec and writes one static file.

- The file is self-contained: components, styles and behavior travel together.
- The structure is fixed at build time. Nothing in the file reads JSON at run time to decide what to draw.
- The file embeds its spec, so an editor can open the file and recover the spec without the agent.

## The editor

The editor lets a person correct the result directly instead of describing the correction.

- It opens a built file, splits it into its widgets and components, and lets the person reassemble them.
- Widgets are the main unit of editing: a person moves, resizes, removes and adds them on a grid, and edits each one's props.
- The edit result is a new spec. The difference between the old and new spec is the feedback.

## Logic stays separate

The static UI file and the app's logic are separate artifacts that meet at a contract.

- The contract is the set of data slots and action names in the spec.
- The agent writes use cases, API calls and data flow against that contract, independent of the UI file.
- UI feedback changes the spec, and logic work changes the logic; neither has to wait for the other.
- The app is finished when the agent connects real data and actions to the reviewed static UI.

## Role of the design system

The design system is what keeps the loop short.

- Components and widgets give the agent a fixed vocabulary, so a spec cannot ask for a screen the system cannot draw.
- Tokens, presets and styles let the person change the look without changing the spec's structure.
- Because both sides edit the same components, a correction means the same thing to the person who made it and to the agent who reads it.
