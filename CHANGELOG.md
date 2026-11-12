# Changelog

## [0.3.0-alpha.8](https://github.com/hab56ur9/ui/compare/v0.3.0-alpha.7...v0.3.0-alpha.8) (2026-11-12)


### ⚠ BREAKING CHANGES

* Graph is removed; use Diagram with tags.
* Button no longer forwards HTML attributes, Slide and cell className are gone, and string chart colors other than "emphasis" and "de-emphasis" are rejected.
* the documented no-script path that links tokens.css and ui.css and uses CSS classes is gone.
* UIProvider and render() require a theme, and apps no longer import ui/tokens.css, ui/presets.css or ui/styles.css.

### Features

* add a dots-pulse motion where one bigger dot rides the marching dots ([7bdf068](https://github.com/hab56ur9/ui/commit/7bdf068cda6b31cd376c47675b60e631422ba86f))
* add a pulse motion that glides one dot along an arrow ([9c863cc](https://github.com/hab56ur9/ui/commit/9c863cc02643afd28a6d7d83ed6dca59d422470b))
* add Graph for architecture diagrams ([409cf37](https://github.com/hab56ur9/ui/commit/409cf376850a208da8f12ae037ff36ec5f625e61))
* add Stack and ActionList and drop the class-based page path ([1406d24](https://github.com/hab56ur9/ui/commit/1406d2421e5197dfd8098c8c70a8a0f50c875367))
* add stagger and intensity motion tokens and share the motion engine ([2e4bfa7](https://github.com/hab56ur9/ui/commit/2e4bfa7e7774b808ae2c00d5708f351ec94abef6))
* build Diagram pages into animated and still SVG files ([a1c29a4](https://github.com/hab56ur9/ui/commit/a1c29a41330fed43f54d3c53047435e99d614c3c))
* close component signatures ([05630ec](https://github.com/hab56ur9/ui/commit/05630ec460fd7342cf13fe669488b0d3d2af4b2d))
* embed the needed font files in built diagram SVGs ([0eec5b7](https://github.com/hab56ur9/ui/commit/0eec5b721a742cdf0349fe070a2cbaea7ed7b795))
* fit Graph nodes to their labels and keep group blocks near their sources ([c88582a](https://github.com/hab56ur9/ui/commit/c88582ae250c87d80253bf92aed855dd1b03edf2))
* inject the theme through UIProvider and keep tokens private ([c6ee70a](https://github.com/hab56ur9/ui/commit/c6ee70a030dcc12246cab29bd8264f1cecf5d9a4))
* lint app pages against the ui contract ([acc16f0](https://github.com/hab56ur9/ui/commit/acc16f0af9e9083f1459dd07557459614c6a0534))
* play data flow along Graph edges ([490ccea](https://github.com/hab56ur9/ui/commit/490cceabe7b4f9a21e1b8d7c16bc5be2d38bfea8))
* relay the dots-pulse dot from one arrow to the next ([d8065dd](https://github.com/hab56ur9/ui/commit/d8065ddf71200b87778f42932d6762e9e9c98926))
* replace Graph with Diagram tags and CSS-declared motion ([8804915](https://github.com/hab56ur9/ui/commit/880491565381855fb1bb99ae872594167c3fe916))
* smooth Graph packets and add a dotted flow preset ([246f316](https://github.com/hab56ur9/ui/commit/246f3163d5214666ba1af47af251313935031c51))


### Bug Fixes

* add space below the page head ([d2d4d54](https://github.com/hab56ur9/ui/commit/d2d4d54e89ee12eddc00e568189c53a332eded57))
* drop the inline code look inside article code blocks ([e0ebe83](https://github.com/hab56ur9/ui/commit/e0ebe83985e3a685ef82698a3cd296ee5285c5d3))
* keep the dots-pulse dot on top of a marching dot ([a2cd012](https://github.com/hab56ur9/ui/commit/a2cd01266b16f38e734fd71c6fdb44876adaa9d0))
* let Graph packets dive into the target instead of lingering ([1db0e83](https://github.com/hab56ur9/ui/commit/1db0e8392b487f196aada42c65f90e7c7f81a2aa))
* scale Diagram packets and sparks around their own centers ([8d1a15b](https://github.com/hab56ur9/ui/commit/8d1a15b9ed5d0c1ac5ea7b911f2cf6ffddcd0c0f))
* slow the dots-pulse motion by a quarter ([74df813](https://github.com/hab56ur9/ui/commit/74df813987f6179d152920ec1e7b18afb13b39c7))

## [0.3.0-alpha.7](https://github.com/hab56ur9/ui/compare/v0.3.0-alpha.6...v0.3.0-alpha.7) (2026-11-11)


### Features

* add Meter and space category labels by their width ([99bf3f2](https://github.com/hab56ur9/ui/commit/99bf3f2960f20984593ba90d45440c58c776a37c))
* add Phone and Browser frames, a product PRD template and round two fixes ([efcb2cc](https://github.com/hab56ur9/ui/commit/efcb2cc5d84d5af862ecb8d2ffb6fc2cc8959b72))
* round three fixes for dashboards and product PRDs ([3f5ad4c](https://github.com/hab56ur9/ui/commit/3f5ad4c33acc8f325767911982a971825a3f6524))


### Bug Fixes

* final round fixes for dashboards and product PRDs ([4e2dad9](https://github.com/hab56ur9/ui/commit/4e2dad90774f9257e4f355b8b8de6ac2805f48d4))

## [0.3.0-alpha.6](https://github.com/hab56ur9/ui/compare/v0.3.0-alpha.5...v0.3.0-alpha.6) (2026-11-10)


### Features

* add a canvas editor for reviewing built specs ([39347ac](https://github.com/hab56ur9/ui/commit/39347ac654f794fb54941c9cca54e3ddcbe925b3))
* build the docs site from a spec that matches it pixel for pixel ([bab0ae5](https://github.com/hab56ur9/ui/commit/bab0ae5ffd36de72554dfeab3ecc17e792d53f14))

## [0.3.0-alpha.5](https://github.com/hab56ur9/ui/compare/v0.3.0-alpha.4...v0.3.0-alpha.5) (2026-11-10)


### Features

* add a compact density to Portfolio and Resume ([b5d125e](https://github.com/hab56ur9/ui/commit/b5d125eb82dad64a30aa90f7b2e4a61be154de2d))
* add a Korean FitNote spec and show the one that matches the site ([5a0b5c8](https://github.com/hab56ur9/ui/commit/5a0b5c8526a2587b2f3c0df1ee4428fc194ab43a))
* add a style axis with minimal, expressive and brutal looks ([dd4e524](https://github.com/hab56ur9/ui/commit/dd4e5242c8c732e38c29f14a43b38271794e09be))
* add the app spec format with a checker and a JSON Schema ([4adc231](https://github.com/hab56ur9/ui/commit/4adc23190ba0f4347b628ebf47f6b3a82e9387e2))
* build an app spec into one editable HTML file ([8ed265a](https://github.com/hab56ur9/ui/commit/8ed265ae1ce1c48e264606670fe690505c3e3514))
* build the app spec preview in the site language ([ba34698](https://github.com/hab56ur9/ui/commit/ba34698f65c7d7aa22f081a85e8b0d6626662242))
* draw Mermaid charts in Markdown and add category axes ([a42876c](https://github.com/hab56ur9/ui/commit/a42876c6a21a44b1571ce61ca3d21466be8fc057))
* review built specs in ui serve and save edits into the page ([1823812](https://github.com/hab56ur9/ui/commit/18238120f534da6c38b40827801c0a1edfb690a3))
* review overlays with notes and text edits ([6223e8b](https://github.com/hab56ur9/ui/commit/6223e8b9e7426235201682a27de6bef53bb009f0))
* tokenize border width, focus ring, floating material and heading font ([b9e5c63](https://github.com/hab56ur9/ui/commit/b9e5c6396f878cb509e665613b39c698ac934e85))


### Bug Fixes

* keep project tags in a row and fit the compact resume on one page ([e1dc7cd](https://github.com/hab56ur9/ui/commit/e1dc7cd2236ab62b2a44cb9922995760e98954f6))

## [0.3.0-alpha.4](https://github.com/hab56ur9/ui/compare/v0.3.0-alpha.3...v0.3.0-alpha.4) (2026-11-10)


### Features

* add a project submission slide template ([38ff04a](https://github.com/hab56ur9/ui/commit/38ff04a14728f151af2fa75769c1aa603875ecbc))
* add a slide grid and check every slide against it ([ad1789b](https://github.com/hab56ur9/ui/commit/ad1789bef84c4ee6e2171814b40c01df5cb7e71f))
* add PM resume and PM portfolio templates ([73c9603](https://github.com/hab56ur9/ui/commit/73c960371f15eebebd69525e775dcaa65ad5f41a))
* add Tabs for switching views inside one screen ([2a12351](https://github.com/hab56ur9/ui/commit/2a12351525e2da2958fad4f3c71947853924363d))
* compose Options from tags, and add TextField, Toc and Pager ([9279ae7](https://github.com/hab56ur9/ui/commit/9279ae753f658ed532d75a587bd9bfaca4b93c0a))
* let Callout put its color rule on top ([371c2c4](https://github.com/hab56ur9/ui/commit/371c2c49cba834d13cbba0e19743a7cb62824b7f))
* page the slide deck by swiping on touch screens ([c28919b](https://github.com/hab56ur9/ui/commit/c28919bbd23fbafac7b28e1579d8225e227bd925))
* set Korean like English and fix one slide grid ([024d234](https://github.com/hab56ur9/ui/commit/024d2346d64c189992460a82b523c3da27d551cb))
* toasts clear the mobile tab bar, and docs show where they appear ([6130450](https://github.com/hab56ur9/ui/commit/61304504454284e66b366f6a658463839f386221))
* truncate single-line labels with an ellipsis and a tooltip ([14e143f](https://github.com/hab56ur9/ui/commit/14e143f72fc58b99c3f92cc277b0581563b89ed9))


### Bug Fixes

* let Ref jump to requirement rows again ([14a1839](https://github.com/hab56ur9/ui/commit/14a1839377bcbf66970ea80f93c823186ce6af20))

## [0.3.0-alpha.3](https://github.com/hab56ur9/ui/compare/v0.3.0-alpha.2...v0.3.0-alpha.3) (2026-11-10)


### Features

* Markdown component that draws markdown with the system's parts ([88a7b58](https://github.com/hab56ur9/ui/commit/88a7b58467eff7d12fcc919ad814edcaacaa0340))
* merge the markdown viewer and editor into one Markdown component ([b2a8854](https://github.com/hab56ur9/ui/commit/b2a885428afca4057cd6870123df2ad78461e8a9))
* Notion-style block editor for markdown ([5a4495f](https://github.com/hab56ur9/ui/commit/5a4495f3390195b170f0352364802c713acf7b3d))
* Notion-style markdown editor with live blocks, slash menu and drag ([ce12337](https://github.com/hab56ur9/ui/commit/ce12337e478b9980905d918c9c73be257e7dd6db))
* portfolio template ([4ef6844](https://github.com/hab56ur9/ui/commit/4ef6844c688c9b718baec0db7e98b03b32f34b03))
* standard markdown compatibility for the Markdown component ([0d28216](https://github.com/hab56ur9/ui/commit/0d28216a9b4e9ea847cfc2c980a1d0bfd8ff5028))

## [0.3.0-alpha.2](https://github.com/hab56ur9/ui/compare/v0.3.0-alpha.1...v0.3.0-alpha.2) (2026-11-10)


### Features

* configurable tab bar style and an SDUI menu bar editor ([ceedebd](https://github.com/hab56ur9/ui/commit/ceedebdf6bf51e0d74cb732100f1c686c61f930c))
* JsonUI engine, layout components and one screen in TSX and JSON ([ae66bfc](https://github.com/hab56ur9/ui/commit/ae66bfcadf4b5eb1459b5938152d9b23a14f63aa))
* make English the default language ([b906f4d](https://github.com/hab56ur9/ui/commit/b906f4d4d9d0330054a4b026cff8967f54de4d25))
* Templates tab with slide, tech doc and resume template cards ([ed13122](https://github.com/hab56ur9/ui/commit/ed13122fc36cf620058fbcfdd3362a4af38deaa9))
* theme picker with preset palettes and tinted sub colors ([19e303e](https://github.com/hab56ur9/ui/commit/19e303e320811fd3e0ebe6ced891d97496f9800f))


### Bug Fixes

* floating tab bar fills its width with even, pill-shaped items ([1d2ba3b](https://github.com/hab56ur9/ui/commit/1d2ba3b728006a7d4ed7de4f00598e72d32acc29))
* show template cards in one horizontally scrolling row ([a0cf6f2](https://github.com/hab56ur9/ui/commit/a0cf6f2f31c085d465e8c0a69cb06d575882e92b))
* slide previews with long metric values and sparse bar charts ([1841006](https://github.com/hab56ur9/ui/commit/18410068dce38b3cdabe630dbfd2e65cd0fd0245))
* theme picker preview and pickers that agree with the root ([00d1654](https://github.com/hab56ur9/ui/commit/00d16541bbfff3f22f89387bc8ae55069b15abd9))

## [0.3.0-alpha.1](https://github.com/hab56ur9/ui/compare/v0.3.0-alpha.0...v0.3.0-alpha.1) (2026-11-09)


### Features

* add a ui CLI with a dev server and starter pages ([00120b9](https://github.com/hab56ur9/ui/commit/00120b98e4fc3a497fc13d6185dbf9da3e65bd9d))
* add the ui design system ([420d40a](https://github.com/hab56ur9/ui/commit/420d40af21bd64127e2361c10aa79ee4e71e6001))
* make ui.js a one-line import for pages without a bundler ([3741303](https://github.com/hab56ur9/ui/commit/3741303245f617dc4e4489da4cb03c1d3c298b7e))
