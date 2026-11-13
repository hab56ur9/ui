---
title: UI Vocabulary and Gaps
updated: 2026-11-11
---

UI Vocabulary and Gaps

This document lists standard names for common interface parts, states, gestures and motions, and records which ones ui covers as of 2026-11-11. It serves as a backlog: a missing or partial entry is a candidate for a component, a prop or a token.

## Reading the tables

Each table gives the standard term, a one-line definition and the state of ui.

| Mark | Meaning |
| --- | --- |
| Yes | A component, prop or token covers it |
| Partial | Something close exists but lacks a part the term implies |
| No | Nothing in ui covers it yet |

## Feedback and messages

Feedback patterns differ by how much they interrupt the person.

| Term | Definition | ui |
| --- | --- | --- |
| Toast | A short message that appears and leaves by itself | Yes: `useToast` |
| Snackbar | A toast with one action, such as Undo | Yes: `useToast` with `action` |
| Banner | A persistent strip at the top of a page or section | Partial: `Callout` is inline, not pinned to the top |
| Modal dialog | A centered window that blocks the page until answered | Yes: `Modal`, `useConfirm` |
| Bottom sheet | A panel that slides up from the bottom edge | Yes: `Sheet` |
| Inline error | A field message that explains what to fix | Partial: `TextField` has `hint` but no error state |
| Tooltip | A short label shown on hover or focus | Partial: chart tooltips only; no general tooltip |
| Popover | A small floating panel anchored to a control, with content or actions | No |
| Coach mark | An overlay that points at a control to teach it | No |
| Badge | A count or dot on an icon or tab | Partial: `Badge` is a text label, not a count dot |
| Chip | A compact, often removable or selectable token | Yes: `Chip` |

## Loading

Loading patterns differ by whether the wait has a known length.

| Term | Definition | ui |
| --- | --- | --- |
| Spinner | An indeterminate rotating indicator | No |
| Skeleton | Gray placeholder shapes in the layout of the coming content | No |
| Progress bar | A linear indicator of a known fraction | Yes: `ProgressBar` |
| Project cards | One selectable card per project with name, progress, owner and due date; a header for the selected project; a row per project in an overview | Yes: `ProjectCards`, `ProjectHeader`, `Lane` |
| Progress ring | A circular indicator of a known fraction | No |
| Step indicator | A row of numbered stages with the current one marked | Partial: `Steps` is a static list, without a current step |
| Button loading | A button that shows progress and blocks repeat presses | No |
| Progressive image | A blurred preview that sharpens as the image loads | Partial: `Image` draws a placeholder without `src` |
| Optimistic update | The UI shows the result before the server confirms it | App code |
| Top loading bar | A thin bar along the top edge during page loads | No |

## Inputs

Input controls differ by whether the change applies at once or on submit.

| Term | Definition | ui |
| --- | --- | --- |
| Text field states | Default, focused, filled, disabled, error and read-only | Partial: no error or read-only state |
| Select | A closed list that keeps the chosen value | Yes: `Select` |
| Multi-select | A list of checkboxes that picks several items, with an optional select-all row | Yes: `MultiSelect` |
| Dropdown menu | A list of commands that runs the chosen one | No |
| Segmented control | A row of joined buttons with one selected | Yes: `Segmented` |
| Switch | An on/off control that applies at once | No |
| Checkbox | An on/off choice that applies on submit; can be indeterminate | Partial: `Checkbox` has no indeterminate state |
| Radio button | One choice from a short visible list | No |
| Slider | A value picked by dragging along a track | No |
| Stepper | A number changed with minus and plus buttons | No |
| Date picker | A field that opens a calendar to choose a date | Partial: `Calendar` exists without the field and popup |

## Button states

A button needs a distinct look for every state it can enter.

| Term | Definition | ui |
| --- | --- | --- |
| Default | The resting state | Yes |
| Hover | The pointer is over it | Yes |
| Pressed | It is being pressed | No: no `:active` style |
| Focus | It holds keyboard focus, shown with a ring | Yes: `focus-ring.*` tokens |
| Disabled | It cannot be used | Yes: native `disabled` |
| Loading | Its action is running | No |
| Success | Its action finished | No |
| Error | Its action failed | No |
| Selected | A toggle button is on | No |

## Assistant screens

Screens built around an AI assistant share a recurring set of parts.

| Term | Definition | ui |
| --- | --- | --- |
| Thinking indicator | A sign that the assistant is working before it answers | No |
| Streaming response | Text that arrives and renders as it is generated | No |
| Suggested prompts | Chips with example requests | No |
| Regenerate | A control that asks for a new answer | No |
| Citations | Inline marks that link a claim to its source | Partial: `Ref` and `Footnotes` exist for documents |
| Response feedback | Thumbs up and down on an answer | No |
| Edit prompt | Changing a sent message and asking again | No |
| File attachment | Adding a file to a message, with a preview chip | Partial: `DropZone` takes dropped files and `Chip` shows them; no file picker |
| Agent steps | A live list of the steps an agent is taking | Partial: `Steps` without live status |

## Empty and error states

An empty state explains why a view is empty and what to do next.

| Term | Definition | ui |
| --- | --- | --- |
| First-use empty state | Nothing has been created yet | No |
| No search results | A search matched nothing | No |
| No filter results | Filters removed every item | No |
| Offline state | The device has no connection | No |
| Permission request | The view needs a permission it lacks | No |
| All done | Every item has been handled | No |
| After delete | The last item was just removed, often with Undo | Partial: toast with an Undo action |
| Error state | Loading failed, with a retry | No |
| Locked state | The view needs an upgrade or sign-in | No |

## Gestures

Touch gestures need a visible alternative for people who cannot perform them.

| Term | Definition | ui |
| --- | --- | --- |
| Tap | A single touch | Yes |
| Long press | A touch held to open more options | No |
| Swipe | A quick horizontal or vertical flick | Partial: `Deck` swipes; `Carousel` scroll-snaps |
| Swipe to delete | Swiping a row to reveal a delete action | No |
| Drag | Moving an item by holding it | Yes: `Board` widgets |
| Pinch | Two fingers to zoom | No |
| Double tap | Two quick taps, often to zoom or like | No |
| Pull to refresh | Pulling a list down to reload it | No |
| Edge swipe | Swiping from the screen edge to go back | No |

## Motion

Motion terms name an easing curve, a choreography or a transition between screens.

| Term | Definition | ui |
| --- | --- | --- |
| Ease-in | Starts slow and speeds up; for leaving elements | Yes: `motion.easing.exit` |
| Ease-out | Starts fast and slows down; for entering elements | Yes: `motion.easing.enter` |
| Spring | Physics-based motion with mass and stiffness | Partial: the `expressive` style approximates it with an overshooting curve |
| Bounce | A spring that overshoots and settles | Partial: same as spring |
| Stagger | Items enter one after another with a short delay | No |
| Fade | Opacity changes | Yes |
| Slide | Position changes along one axis | Yes: `Sheet`, toasts |
| Push | The new screen slides in and pushes the old one aside | No |
| Fade through | The old screen fades out before the new one fades in | No |
| Shared element transition | One element moves and resizes from the old screen into the new one; also called container transform | No |
| Card expand | A card grows into a full screen | No |
| Zoom transition | The new screen scales up from where it was opened | No |
| Reduced motion | Motion is cut when the system asks for it | Yes |

## Text effects

Text effects animate how words appear.

| Term | Definition | ui |
| --- | --- | --- |
| Typewriter | Characters appear one by one | No |
| Fade up | Text rises a little as it fades in | No |
| Letter stagger | Each letter enters with a short delay | No |
| Count up | A number counts from zero to its value | No |
| Scramble | Random characters settle into the final text | No |
| Mask reveal | Text is uncovered by a moving mask | No |
| Highlight | A marker-like fill sweeps behind text | No |
| Word rotate | One word in a sentence cycles through options | No |
| Blur in | Text sharpens from a blur | No |

## Completion feedback

The size of a celebration matches the size of the finished task.

| Term | Definition | ui |
| --- | --- | --- |
| Check animation | A check mark draws itself | No |
| Strikethrough | A finished to-do is crossed out | Partial: Markdown task lists |
| Button morph | The button turns into a check | No |
| Progress complete | A bar fills and shows done | No |
| Send animation | An item flies out to show it was sent | No |
| Stamp | A stamp-like mark lands on the item | No |
| Badge unlock | An achievement badge appears | No |
| Confetti | Particles burst across the screen | No |
| Success screen | A full screen confirms a large task | No |

## Data display

Data display patterns differ by how many items share the same fields.

| Term | Definition | ui |
| --- | --- | --- |
| Description list | Labeled values for one item, label beside value | Yes: `DescriptionList` |
| Data table | Rows of items that share columns | Yes: `DataTable` |
| Tree view | Nested items that expand and collapse | Yes: `Tree` |
| Work lists | Rows of handed-off work: notifications with a kind icon, a queue in handling order, and documents with reviewers | Yes: `ActivityList`, `QueueList`, `DocList` |
| Panel | One area of a screen with a one-line header of title, meta and icon actions, filling a sidebar group or a pane without a border | Yes: `Panel`, `PanelAction` |
| Split pane | Panes side by side or stacked, resized by dragging the handle between them | Yes: `SplitPane`, `ResizeHandle` |
| Profile header | One person at the top of a profile: avatar, name and short details; the member layout adds presence, role, status, actions and facts | Yes: `ProfileHeader` |
| Image preview | One attached image shown whole within a size limit, opening the original on press | Yes: `ImagePreview` |

## Navigation

Navigation patterns decide how people move between and within screens.

| Term | Definition | ui |
| --- | --- | --- |
| Tab bar | Main sections along the bottom of a mobile screen | Yes: `TabBar` |
| Top tabs | Sibling views inside one screen | Yes: `Tabs` |
| Navigation drawer | A side panel that slides in with the main menu | Yes: `AppShell` below 1024px |
| Breadcrumb | The path from the root to the current page | No |
| Sticky header | A header that stays while the page scrolls | Yes: `AppShell` |
| Floating action button | A floating button for the main action of a screen | No |
| Pagination | Numbered pages of a long list | No; `Pager` only links previous and next |
| Infinite scroll | More items load as the list nears its end | No |
| Back navigation | A control that returns to the previous screen | No |
| App bar | The title row at the top of a mobile screen | Partial: `AppShell` header |

## First-run screens

An app shows a sequence of screens the first time it opens.

| Term | Definition | ui |
| --- | --- | --- |
| Splash screen | A brief brand screen while the app starts | No |
| Onboarding | Swipeable pages that introduce the app | Partial: `Carousel` |
| Permission request | A prompt that asks for location, notifications or camera | No |
| Social login | Sign-in through an existing account provider | No |
| Terms agreement | A list of consents with an "agree to all" option | No |
| Profile setup | The first form that fills in the profile | No |
| Welcome screen | The last screen that hands over to the app | No |

## Sharing

Sharing actions differ by where the item goes.

| Term | Definition | ui |
| --- | --- | --- |
| Share sheet | The system panel that picks a destination | App code |
| Copy link | Puts the item's address on the clipboard | Partial: `CopyCode` copies text |
| Forward | Passes a received message to someone else | No |
| Repost | Republishes an item to one's own feed | No |
| QR code | A code that opens the item on another device | No |
| Nearby share | Sends the item to devices close by | App code |

## Icon names

Several menu icons have common names.

| Term | Shape | Usual meaning |
| --- | --- | --- |
| Hamburger | Three horizontal lines | Main menu |
| Kebab | Three vertical dots | More actions for one item |
| Meatballs | Three horizontal dots | More actions, often in a row or card |
| Bento or waffle | A 3×3 grid of squares or dots | App switcher |
| Filter (sliders) | Lines with knobs | Filter or adjust settings |

## Decision biases

Decision biases explain why people choose differently from what a feature list predicts.

| Term | Definition |
| --- | --- |
| Anchoring | The first number seen sets the frame for later ones |
| Loss aversion | A loss weighs more than an equal gain |
| Default effect | Most people keep the preselected option |
| Social proof | People follow what others appear to do |
| Scarcity | Limited supply makes an item seem more valuable |
| Framing | The same fact reads differently when phrased as gain or loss |
| Choice overload | Too many options delay or prevent a choice |
| Peak-end rule | An experience is judged by its peak and its end |
| Zeigarnik effect | Unfinished tasks stay in mind, which progress bars use |

## Deceptive patterns

Deceptive patterns turn these biases against the person, and ui templates use none of them.

| Term | Definition |
| --- | --- |
| Roach motel | Easy to sign up, hard to cancel |
| Preselection | Consent boxes come already checked |
| Fake urgency | A countdown that resets or means nothing |
| Confirmshaming | The decline option is worded to cause guilt |
| Sneak into basket | Items are added to the order without asking |
| Fake scarcity | Stock or demand is overstated |
| Hidden costs | Fees appear only at the last step |
| Forced continuity | A free trial turns into a paid plan without warning |
| Nagging | The same request returns again and again |
