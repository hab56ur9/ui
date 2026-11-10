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
- A builder turns the spec into editable React code.
- The person reviews the rendered code and corrects it by editing the UI into a sample of what they want.
- The agent reads the sample and writes a new spec from it, instead of guessing from a description.

## Flow

The loop repeats steps 2 to 4 until the person approves the UI.

| Step | Actor | Input | Output |
| --- | --- | --- | --- |
| 1. Spec | Agent | The request and its context | A JSON spec: screens, components, data slots, actions, and a description on each part |
| 2. Generate | Builder | The JSON spec | Editable React code at mockup level, with example data and no API |
| 3. Review | Person | The rendered code | A sample: the same UI edited into what the person wants, with notes where needed |
| 4. Revise | Agent | The sample | A new spec, which goes back to step 2 |
| 5. Approve | Person | The rendered code | Approval of the UI |
| 6. Connect | Agent | The approved code | API calls and use cases connected to the code through its data slots and actions |
| 7. Build | Agent | The connected code | The final app, built with the app's own build tool |

## The spec

The spec is both the screen source and the behavior specification.

- Every node is a design system component with its props, so the spec renders without extra instructions.
- Navigation, overlays and actions are part of the spec, so the mockup behaves like the app.
- A `description` on the app, screens, widgets, components, actions and data fields explains intent. The builder keeps descriptions out of the screen; they make the same JSON readable as a specification.
- Data slots carry example values. The mockup shows them in place of live data.
- Every screen is a widget grid. Forms, lists and headers each sit in a widget, so one unit of editing covers the whole app.

## The builder

The builder reads a spec and writes editable React code. Its job ends there.

- The code holds one component per screen, built only from design system components, with routes, overlays and actions wired as the spec says.
- Handlers are functions bound to action names, and data comes through data slot names, so the code reads like ordinary React.
- The structure is fixed in the code. Nothing reads JSON at run time to decide what to draw.
- Until approval, the code is regenerated from the spec after every round of feedback, so nobody edits it by hand.
- After approval, the code becomes the app's source. The screen a person approved is the screen that ships.

## The editor

The editor is a means of communication between the person and the agent, not a complete design tool.

- It opens the file the agent gave and lets the person rearrange and change it with design system components and widgets.
- It needs only the edits that make a person's intent clear: moving, resizing, removing and adding widgets, and changing visible content.
- The person can leave notes on the sample where an edit alone does not explain the intent.
- The edited sample goes back to the agent. The agent compares it with what it sent, writes a new spec, and generates the next version for review.
- Because the sample uses the same components as the spec, the agent reads it in the vocabulary it wrote in.

## Logic stays separate

The generated UI and the app's logic are separate artifacts that meet at a contract.

- The contract is the set of data slots and action names in the spec.
- The agent writes use cases, API calls and data flow against that contract, independent of the generated UI code.
- While the UI is in review, the agent can build use cases and API calls against the contract, so logic work does not wait for UI feedback.
- After approval, the agent connects that logic to the approved code, and the builder makes the final build.

## Role of the design system

The design system is what keeps the loop short.

- Components and widgets give the agent a fixed vocabulary, so a spec cannot ask for a screen the system cannot draw.
- Tokens, presets and styles let the person change the look without changing the spec's structure.
- Because both sides edit the same components, a correction means the same thing to the person who made it and to the agent who reads it.
