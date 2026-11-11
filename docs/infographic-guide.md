---
title: Infographic Guide
updated: 2026-11-11
---

Infographic Guide

This guide lists the rules ui follows for infographics and animated diagrams, drawn from research on memorability, reading flow and animation. An infographic here is one tall figure made of panels, each with a title, an icon, a one-line message and a diagram.

## Structure

An infographic reads as a partitioned poster: a title on top, then panels stacked in one direction.

| # | Rule | Reason |
| --- | --- | --- |
| 1 | Give every panel a title and a one-line message before its diagram | Readers took the message from titles and text first; a memorable picture without a stated message was remembered but not understood |
| 2 | Keep one reading flow per panel, and number the steps when order matters | Infographics that work follow a single visual path; mixed directions make readers search |
| 3 | Give each panel one color and use it for its border, arrows and groups | Color raises memorability, and one color per panel ties its parts together |
| 4 | Use icons and recognizable objects that belong to the content | Recognizable objects make figures memorable; decoration helps only when it relates to the content |
| 5 | Prefer a distinctive layout over a stock chart when the point is a structure | Common charts were less memorable than unusual but clear forms |

## Animation

Animation helps only when the motion is the content.

| # | Rule | Reason |
| --- | --- | --- |
| 6 | Animate only what really moves, such as data along an arrow | Motion that matches the concept helps; motion that does not distracts |
| 7 | Play motion slowly and in step order, one thing at a time | Animation that is too fast or too busy cannot be followed |
| 8 | Make the still frame complete; motion only adds emphasis | Animated and narrated figures did not beat static ones on comprehension |
| 9 | Give looping motion a pause control and stop it under reduced motion | People need to stop motion that lasts more than a few seconds |

## In ui

- `Graph` draws one panel's diagram: groups as tinted regions, nodes with icons, arrows with labels and step numbers.
- Motion follows the theme's style through `motion.stagger` and `motion.intensity`, and stops under reduced motion.
- Planned: flowing arrows with moving icons, an infographic panel component, logo nodes and video export.
