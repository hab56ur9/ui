---
title: Motion Graphics Guide
updated: 2026-11-11
---

Motion Graphics Guide

This guide describes how ui animates diagrams such as architecture flows, and how to make a loop that reads well and exports cleanly. All motion is declared in CSS, so a diagram also works as a static HTML file with no script. Motion here shows something that really moves, such as a request or a message travelling between parts; it never decorates.

## Principles

Motion follows four principles.

| # | Principle | In practice |
| --- | --- | --- |
| 1 | Move only what moves in reality | Animate data along an arrow; keep boxes, labels and groups still |
| 2 | One thing at a time | Play steps in their numbered order; the next step starts when the previous one has arrived |
| 3 | Nothing pops | Every element fades and scales in and out; colors and strokes transition |
| 4 | The still frame is complete | Step numbers and labels tell the story without motion; motion adds emphasis only |

## Anatomy of a packet

A packet is the icon that carries one step along its arrow. Its life has four phases inside one step.

| Phase | Share of the step | What happens | Easing |
| --- | --- | --- | --- |
| Emerge | 0–16% | The packet grows from a third of its size and fades in, while a ring and four short rays burst at the source and fade | Ease-out, so it settles quickly |
| Travel | 0–92% | The packet follows the arrow's own curve and speeds up toward the target | Ease-in, so it leaves gently and enters without slowing down |
| Sink | 80–92% | The packet shrinks while still moving and vanishes the moment it reaches the target; the target's border lights up and then fades | Linear shrink, fade in the last 4% |
| Gap | 92–100% | Nothing moves before the next step starts | None |

The arrow of the current step is highlighted for the whole step, and the highlight fades in and out over the slow motion duration.

## Timing

| Value | Default | Reason |
| --- | --- | --- |
| One step | 1.8 s | Slow enough for the eye to follow one packet from end to end |
| Rest after the last step | 0.9 s | Marks the end of the story before the loop restarts |
| Highlight fade | `motion.duration.slow` | Matches the rest of the system |
| Dot march period | Three times `motion.duration.slow` | Reads as steady flow, not as flicker |

A full loop lasts the number of steps times 1.8 s, plus 0.9 s.

## Presets

`Diagram` takes one `flow` preset, and each `Diagram.Arrow` can override it with `motion` (`packet`, `dots` or `still`).

| Preset | Look | Use it when |
| --- | --- | --- |
| `packets` | Icons travel step by step | The order of steps is the point, as in a request path |
| `dots` | Every arrow becomes a dotted line whose dots march toward the target | Data flows continuously, as in streaming or replication |
| `pulses` | One glowing dot glides along each arrow at a steady speed, fading in and out, with arrows offset in time | Continuous traffic that should stay calm, such as a pipeline overview |
| `both` | Marching dots on every arrow, with packets on the steps | A continuous system that also has one highlighted path |

An arrow can also take `motion: "dots-pulse"`: its dots march, one enlarged dot rides on top of them at the same speed, and the enlarged dot is relayed from arrow to arrow, leaving a node the moment the previous one enters it. After the last arrow it rests briefly before the next run.

An arrow gets a packet when the data names an icon for it. Arrows without a packet stay still in `packets` and march in `dots` and `both`.

## Styles

The theme's style sets how much the diagram moves when it first appears. The flow loop keeps the same timing in every style, because the timing carries meaning.

| Style | Entrance |
| --- | --- |
| minimal | Short fade and slide, small stagger |
| expressive | Overshooting entrance, larger stagger |
| brutal | No entrance motion |

## Shared motion vocabulary

The ui library has one motion vocabulary that every component uses, so a diagram, a poster and a dashboard move the same way. As of 2026-11-12 it has four motions.

| Motion | What moves | Used by |
| --- | --- | --- |
| enter | The element fades in and rises slightly, in order | Diagram nodes, arrows and groups; Infographic title and panels |
| draw | A line traces itself, or a bar grows from its start | Line chart and sparkline lines, Meter fill |
| count | Each digit of a number rolls up to its value; a later change rolls to the new value | Stat values |
| attention | One soft ring pulses once after the content settles | Warning and critical Badges, Meter status when not good |

- Components attach the motions themselves; apps only turn them on or off with the `motion` prop of Diagram and Infographic.
- Motion runs only inside a Diagram or an Infographic, so a dashboard of Stats stays still.
- The order comes from the container: Diagram nodes follow the layout order, and each Infographic panel starts after the panel before it.
- Every motion is a CSS keyframe declared once in the library, so the built SVG plays it too; the still SVG and print show the final values.
- Durations scale with the style's motion intensity: brutal turns every motion off.

## Accessibility

- Every looping diagram shows a pause button.
- When the system asks for reduced motion, the diagram starts paused and shows the still frame; the reader can still press play.

## Exporting a GIF

A GIF is captured frame by frame, not screen-recorded, so every frame is evenly spaced.

- Capture at 40 ms per frame (25 frames per second); 100 ms frames look choppy.
- Start the capture at the beginning of step 1 and record exactly one loop, so the GIF repeats without a jump.
- Hide the pause button in the capture.
- Use the light theme for sharing unless the destination is dark.
