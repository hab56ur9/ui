# Changelog

## [0.3.0-alpha.11](https://github.com/hab56ur9/ui/compare/v0.3.0-alpha.10...v0.3.0-alpha.11) (2026-11-14)


### Features

* **TextField:** add inputMode for mobile keypads ([bdfc04b](https://github.com/hab56ur9/ui/commit/bdfc04be87c8a29b26d8a23da6ae70677fe42a78))


### Bug Fixes

* **toast:** pause the dismiss timer only while it runs ([f977b20](https://github.com/hab56ur9/ui/commit/f977b20b8d5dfbfbd18c881d45e5675c49717bd6))

## [0.3.0-alpha.10](https://github.com/hab56ur9/ui/compare/v0.3.0-alpha.9...v0.3.0-alpha.10) (2026-11-14)


### Features

* **charts:** add Timeline for lanes of time segments ([203894b](https://github.com/hab56ur9/ui/commit/203894bb13ffd6d045736be2aed48dda4b07e234))
* **chat:** add EmojiPicker with category tabs and keyword search ([cd19d63](https://github.com/hab56ur9/ui/commit/cd19d6327f73255ccc99d4a26c89263e8a7f9e0f))
* **code:** add sh and css grammars and hash and users icons ([c16f63b](https://github.com/hab56ur9/ui/commit/c16f63b10b1fd614534ff8b96c56f0e733783c12))
* **image:** add ImageCompare with a draggable divider ([b9bc44a](https://github.com/hab56ur9/ui/commit/b9bc44a00d134795f34a9d61b1466b66710120fe))
* **kanban:** add switcher to show one column at a time on narrow boards ([dd85912](https://github.com/hab56ur9/ui/commit/dd85912a7338460722d8300237c5242b857ce748))
* **motion:** add state transitions and a sliding tabs indicator ([c80576f](https://github.com/hab56ur9/ui/commit/c80576fc4dbf29a76e52e58afcd29488331ee690))
* **motion:** animate tooltips, trees, details, menus and slides in and out ([ab85b7e](https://github.com/hab56ur9/ui/commit/ab85b7e21677751e59dac2de440fb87b704f080e))
* **motion:** let tables, lists, cards and callouts enter inside motion scopes ([8693ec2](https://github.com/hab56ur9/ui/commit/8693ec21e2e2415e9500522cdfe3069bd43440dd))
* **motion:** scale transitions and overlay motion by motion intensity ([fd24d5f](https://github.com/hab56ur9/ui/commit/fd24d5fa4c78250c0f3f5256a8a8f56a28e1fcbe))
* **overlay:** add Popover with hover and click triggers ([c603add](https://github.com/hab56ur9/ui/commit/c603addc358cc6d0305247767f92ce9d5588d8e9))
* **shape:** add control size and indicator tokens and draw the checkbox ([41b2215](https://github.com/hab56ur9/ui/commit/41b2215d154ac648f231bf567e3359c8dd6663af))
* **shape:** add the ring.inset token ([9ad6fe1](https://github.com/hab56ur9/ui/commit/9ad6fe132fb0b8e87feb7661d3807dba64d711a5))
* **shell:** add onBack for a back button in the AppShell bar ([2143d75](https://github.com/hab56ur9/ui/commit/2143d75ed36fdec138a99558e41e8b3e24efd474))
* **theme:** add the blue preset with a deep blue main color ([b2f3052](https://github.com/hab56ur9/ui/commit/b2f305234f6f6cace744c25b1a95c3dbf4d1079d))
* **viewer:** fill narrow screens and let long code lines scroll ([10ad1e1](https://github.com/hab56ur9/ui/commit/10ad1e17c63854a0143283afe9f967c635418e24))
* **workspace:** add ApprovalCard for commands awaiting approval ([0973055](https://github.com/hab56ur9/ui/commit/0973055ddd06c95a9dc5de611e0fe899df2607e5))


### Bug Fixes

* **app-shell:** trap Tab inside the mobile navigation drawer ([606c0a2](https://github.com/hab56ur9/ui/commit/606c0a2565a2be02d7320efe48b2725ab54aae8d))
* **approval:** name tag, variation selector and filler characters too ([471534e](https://github.com/hab56ur9/ui/commit/471534e020b0027f2a212a553f18cd729b8ddbce))
* **approval:** show the whole command and name hidden characters ([957e61f](https://github.com/hab56ur9/ui/commit/957e61f7256c46e1a2b281830a394f11c0c96076))
* **charts:** give Timeline a one-hour range when no lane has segments ([ac08a9c](https://github.com/hab56ur9/ui/commit/ac08a9cf240fce6196409dbe92e52aca640f1526))
* **charts:** keep panel tone on infographic diagram steps ([b93298d](https://github.com/hab56ur9/ui/commit/b93298db2ac43052484a89de416107218b6a62e2))
* **charts:** tint infographic step circles so numerals reach 4.5:1 ([eb922c5](https://github.com/hab56ur9/ui/commit/eb922c5020060dafe7dd72ac5692d2590be8a26a))
* **chat:** draw the EmojiPicker focus ring inside the cell so the grid edge does not clip it ([a8ab960](https://github.com/hab56ur9/ui/commit/a8ab9608e6dedaf68b2de53483fc1a4d565d1a2c))
* **chat:** let EmojiPicker shrink to narrow containers and dedupe recent ([212be4a](https://github.com/hab56ur9/ui/commit/212be4acc9a12d223245072504ed66e5f02fcd2f))
* **code:** render an unknown lang as plain text instead of crashing ([ec8460a](https://github.com/hab56ur9/ui/commit/ec8460a2fbb284b1e38c9d142ca7e0a7038e42c1))
* **motion:** read duration tokens in seconds as well as milliseconds ([5524bfe](https://github.com/hab56ur9/ui/commit/5524bfe1d14adf318b67218aba1b6b5b1ccc6600))
* **motion:** scale board reorder with intensity and keep zero durations ([4c62fba](https://github.com/hab56ur9/ui/commit/4c62fba859794306ecbfd72d1bcfe51689a33bfe))
* **motion:** scale one-shot animations and the docs preview with intensity ([61fc383](https://github.com/hab56ur9/ui/commit/61fc383d91bb7b84f8b35081b27bd0f3468df746))
* **motion:** show items added after the first entry right away ([1d2f4ee](https://github.com/hab56ur9/ui/commit/1d2f4eede54e9770aa2ddf09ff415805b9dcba9c))
* **overlay:** restore focus only when it is still in the dialog ([50f26a5](https://github.com/hab56ur9/ui/commit/50f26a56b75924a15b63c3686e9bf8cebff97c73))
* **overlay:** trap Tab and restore focus in modal overlays ([7ae6bf1](https://github.com/hab56ur9/ui/commit/7ae6bf13c5536d41ff7c9ede4ac7252d057409fb))
* **site:** scroll the theme mode table inside its card on narrow screens ([0af1ac8](https://github.com/hab56ur9/ui/commit/0af1ac82b2de8894f34d71974ffb9a489215b0d2))
* **tokens:** darken light main.default to reach 4.5:1 text contrast ([8a5669e](https://github.com/hab56ur9/ui/commit/8a5669e22829252da789fa51ebd10b405195d8a1))
* **tokens:** raise fg.muted to 4.5:1 on every surface in both themes ([eedfc78](https://github.com/hab56ur9/ui/commit/eedfc78d0278e4dfc7734a834384533f3842ae77))

## [0.3.0-alpha.9](https://github.com/hab56ur9/ui/compare/v0.3.0-alpha.8...v0.3.0-alpha.9) (2026-11-13)


### Features

* add a footer slot to comment cards ([9ca7e99](https://github.com/hab56ur9/ui/commit/9ca7e99a6f15b090cc673893a2446108f1e06aaf))
* add a shared motion vocabulary for diagrams and infographics ([5a561a4](https://github.com/hab56ur9/ui/commit/5a561a468e5ae5ad4ce6f3ed33df8203634ff59b))
* add ArchiveCard, ArchivePicker and ArchivedLine ([f15faef](https://github.com/hab56ur9/ui/commit/f15faef647684ffdaec1bc203932dab353158d76))
* add chat, kanban and annotator components ([9168b72](https://github.com/hab56ur9/ui/commit/9168b72de1a2ca307c5192e84147e8ddd30bdf14))
* add Checkbox for one on/off choice with a one-line label ([2a0bc06](https://github.com/hab56ur9/ui/commit/2a0bc06d68132422aa27550b14e0bb5e7fc03aed))
* add Chip for a small token that opens or removes the item it names ([66143ff](https://github.com/hab56ur9/ui/commit/66143ff2c151c8074829050a18dc75a3a6017bcc))
* add DescriptionList for labeled values of one item ([5b6071d](https://github.com/hab56ur9/ui/commit/5b6071d1772a7ddc13f6fd4f1e1155d318371441))
* add DropZone that hands files dropped onto an area to the app ([76cb4c8](https://github.com/hab56ur9/ui/commit/76cb4c89ac60089452687bdf35736c9ebd454cd7))
* add ImagePreview that shows an attached image whole within a size limit ([bdabd50](https://github.com/hab56ur9/ui/commit/bdabd5041cbb485ee1720a77680c9276e92cec47))
* add Infographic posters and build them into one SVG ([6c5bc3f](https://github.com/hab56ur9/ui/commit/6c5bc3fe5f7d5cf12b5d0539428ffa7455532733))
* add Panel and PanelAction for a headed area of a sidebar or pane ([ce3aa72](https://github.com/hab56ur9/ui/commit/ce3aa72741463142237e79bbc628bdbcdd94b93b))
* add ProgressBar for the done share of a task ([3821095](https://github.com/hab56ur9/ui/commit/382109567b7b6ffbfc663d6fdf5739c1498de987))
* add Select for one value from a closed list, built on the field frame ([8276b56](https://github.com/hab56ur9/ui/commit/8276b569184cc86623cf0a153179a1b1a9ff796b))
* add suggested edits to comment cards and extra selection actions to the annotator ([ae9c04c](https://github.com/hab56ur9/ui/commit/ae9c04c8d3adabeb8ae1f53ff286d54da566691f))
* add the design-decompose skill ([5bbee8d](https://github.com/hab56ur9/ui/commit/5bbee8dacf697bcc6b71501ad56ef670bb71aa48))
* add Tooltip and draw reaction titles with it ([df380c5](https://github.com/hab56ur9/ui/commit/df380c530ce0e8b38c52fd3d767d31d945a0789f))
* **archive:** collapse expanded rows and mark partial picks as indeterminate ([32b2327](https://github.com/hab56ur9/ui/commit/32b2327bbd303ee75a40ceb8e6d3f9784efc14d3))
* catch page errors and stacked arrows in diagram check ([ebb6cb5](https://github.com/hab56ur9/ui/commit/ebb6cb53e0d292da35b6412d7a502dd2d92997c1))
* **chat:** show thumbnail, size and error on ComposerChip and send with files only ([5c0ccac](https://github.com/hab56ur9/ui/commit/5c0ccac743a30706fe4de0d1ebe6f5e7391411d4))
* **code-editor:** add CodeEditor for editing code with line numbers and syntax colors ([3a99c83](https://github.com/hab56ur9/ui/commit/3a99c83b7b4eed17ff4047569f5e81a7db8242ee))
* **command-palette:** add CommandPalette for finding and opening items by name ([beb40e1](https://github.com/hab56ur9/ui/commit/beb40e115ef4553054c830435d56fa858c3fac92))
* Darcula syntax palette for code, go/py/yaml/md grammars, langOf and CodeLine ([29f6f31](https://github.com/hab56ur9/ui/commit/29f6f316835d07b20e01ec8e1bc0e7cbfd3d45d6))
* **desktop-shell:** add DesktopShell for desktop app frames with rail, resizable columns and overlays ([e462600](https://github.com/hab56ur9/ui/commit/e4626003f250a6da71780bf34d1d6188bc8ad378))
* enlarge the infographic title and add the Infographic docs page ([7c9b46c](https://github.com/hab56ur9/ui/commit/7c9b46cc28c0d2dd16b08d3e4588989c162eebf0))
* even out diagram spacing and aim compact diagrams at 3:2 ([c2e5812](https://github.com/hab56ur9/ui/commit/c2e5812b0370ebd281afd6ee643e175a1665a033))
* keep natural node sizes and leave placement to the author ([b0ffe25](https://github.com/hab56ur9/ui/commit/b0ffe252e11b18a5408e16e3af3f79c0acdedf3e))
* lay Diagram out on a grid with a straight main flow and lanes ([dc9c9db](https://github.com/hab56ur9/ui/commit/dc9c9db54d53ce97ca230ab26ae05f56da267179))
* lay out complex flows and fail builds on overlapping or cut text ([6883c42](https://github.com/hab56ur9/ui/commit/6883c4296577ce43923bcb6c98bf6fd00bbd85f2))
* let a mention mark the viewer with a warning tint ([5020740](https://github.com/hab56ur9/ui/commit/5020740a61cf65b304471080aa52304a8298ddce))
* let Board opt into motion and let styles swap motion shapes ([4a8fe25](https://github.com/hab56ur9/ui/commit/4a8fe250d76924e7fd17983aba8b6da11d28945f))
* let chat messages carry an anchor id ([e57de80](https://github.com/hab56ur9/ui/commit/e57de801aeb8cb5f9e00a80501fdaa00ace14e84))
* let comment cards show a separate original for suggested edits ([e89cc49](https://github.com/hab56ur9/ui/commit/e89cc49c29b28e1f26009cd40b2480ad037d93a7))
* let each style pick the keyframes for every motion ([2455494](https://github.com/hab56ur9/ui/commit/245549407b4957accc43875935e8948b44d74eb9))
* lint hand-written motion attributes in apps ([de34dcf](https://github.com/hab56ur9/ui/commit/de34dcf1d8aa91e7f1c6de428cc2951c6d9bc2bc))
* **lists:** add ActivityList, QueueList and DocList ([40f09dc](https://github.com/hab56ur9/ui/commit/40f09dc63e47c3263e08b16bb469b7da5eb89d1e))
* **lists:** add EntryList for titled records with an optional per-row delete ([7d9cae6](https://github.com/hab56ur9/ui/commit/7d9cae6cd6ba0306de53bc675a491b7e513a5ab4))
* mark comments whose quote left the text ([f220139](https://github.com/hab56ur9/ui/commit/f220139fe9b86d44ec00dd5b8202419879c343e7))
* **markdown:** load external images only from imageHosts when set ([76435ba](https://github.com/hab56ur9/ui/commit/76435ba67ec59defe101a86e382cd4878006246e))
* **multi-select:** add MultiSelect for picking several items ([5c3d15a](https://github.com/hab56ur9/ui/commit/5c3d15afe166d8967b593865f88d745659d40af1))
* pin Diagram nodes to grid cells and guide compact layouts ([0891fea](https://github.com/hab56ur9/ui/commit/0891feaf870dbe45cb57755000b58c1132d9a6df))
* **profile:** add a member layout to ProfileHeader ([103f7c9](https://github.com/hab56ur9/ui/commit/103f7c92c376be7757d99310294a2e9011fa364e))
* **projects:** add ProjectCards, ProjectHeader and Lane for project progress ([6af73a0](https://github.com/hab56ur9/ui/commit/6af73a0442cbdb79bab0ecde6206fc5e8ce8c175))
* **split:** add SplitPane and ResizeHandle ([744785e](https://github.com/hab56ur9/ui/commit/744785ecf650ce684d934c6518cf01e1c107930a))
* **tree:** add Tree for grouped sidebar and file lists ([fe988bd](https://github.com/hab56ur9/ui/commit/fe988bd8e734f1b6ba4b43ceeb81ce31b5dab678))
* turn Board entrance motion on by default ([e24cd35](https://github.com/hab56ur9/ui/commit/e24cd3563f9d4b5b4dd43c0e3f0160a2f3729d18))
* **viewer:** add Viewer for opening one file in a large window ([251fcbc](https://github.com/hab56ur9/ui/commit/251fcbc07eb4b8986643278917ef7b854c832611))


### Bug Fixes

* center Row only inside docs example stages ([b43ea2e](https://github.com/hab56ur9/ui/commit/b43ea2e828703739b0bb4be8119c8f6f6ad07643))
* **chat:** follow the log to the bottom after the viewer sends a message ([d0238d2](https://github.com/hab56ur9/ui/commit/d0238d2cc3f102b28799ea0e9a1f3a465be0b23c))
* **chat:** round file sizes before picking a unit and send blank drafts as empty text ([d7a4250](https://github.com/hab56ur9/ui/commit/d7a42500124eff90f76aaf202a7bd01c663ead14))
* **code-editor:** let Tab after Esc leave the editor and show focus ([c28aa6b](https://github.com/hab56ur9/ui/commit/c28aa6b95cb76bd82db8bbcfca9190451e929958))
* draw an empty Meter when max is zero, with tests for the share ([5293e64](https://github.com/hab56ur9/ui/commit/5293e6403fc587fb653190886caaafb69201e47b))
* draw mixed bar and line mermaid charts and fold unsupported chart source ([72b1fba](https://github.com/hab56ur9/ui/commit/72b1fba435e5775e4cbfab0271165069ad953ce4))
* draw the attention ring in the status colour ([6f9c99b](https://github.com/hab56ur9/ui/commit/6f9c99be9ff3ff7872486f5143712a8469014323))
* ignore hidden markers and buttons when anchoring quotes ([5b1244e](https://github.com/hab56ur9/ui/commit/5b1244ef1c9a0eb907bcabc0aabdf02a58d8c773))
* let a click on a link inside the editor follow the link instead of starting an edit ([3c68374](https://github.com/hab56ur9/ui/commit/3c68374a28da3a5d36d9eec59bdb133d009acf27))
* list compound components in the schema and document ActionList ([b0e8963](https://github.com/hab56ur9/ui/commit/b0e8963dc2d23dfe85ebb21a3891d8b9543077d9))
* **lists:** draw the activity row focus ring inside the row ([4b10fbb](https://github.com/hab56ur9/ui/commit/4b10fbb36f4221053ce184130fcbfc011c67e96f))
* **lists:** truncate long EntryList heads and name delete buttons from text when the title is empty ([6cfa168](https://github.com/hab56ur9/ui/commit/6cfa16819bc3286d207f7c3b59cd338fed116793))
* **markdown:** resolve image hosts with the URL parser so lenient srcs cannot bypass imageHosts ([d8ee5ed](https://github.com/hab56ur9/ui/commit/d8ee5ede2978f187c60ad5ca4a14bfb6628154f3))
* **palette:** highlight the first item each time the palette opens ([586829b](https://github.com/hab56ur9/ui/commit/586829b53dea39c76bfe1ef214a89ee7862dc535))
* **presence:** show busy presence as a blinking green dot ([5dc8aa2](https://github.com/hab56ur9/ui/commit/5dc8aa2c6e62063413b8138210f74f5c1be32969))
* regenerate components.json with the compound components ([6b061d9](https://github.com/hab56ur9/ui/commit/6b061d94807b6c0d8c94aecde1fef3d5325447c7))
* regenerate dist for the Darcula code tokens, CodeLine and self mentions ([53616b4](https://github.com/hab56ur9/ui/commit/53616b4f70df11b67bddf24c0119568704f5f679))
* **security:** accept only known Host headers in ui serve and scope CORS to /ui/ ([885b5c6](https://github.com/hab56ur9/ui/commit/885b5c6501a13371fad2f6886d9e453a8a8f2819))
* **security:** harden ui serve, scope release permissions and reject protocol-relative URLs ([d05c961](https://github.com/hab56ur9/ui/commit/d05c961c1b0f4884f3f3582e6e8ad8223e8f4614))
* size Diagram nodes to their reserved box so arrows meet them ([cd157dc](https://github.com/hab56ur9/ui/commit/cd157dce4d47f7e545e4dd8e9cd26321deebe9f8))
* skip dialog motion until the stylesheet has loaded ([f06c553](https://github.com/hab56ur9/ui/commit/f06c5533ce3ab17ee42e9cadd6c0c72fb4d96adc))
* smooth the entrance motion found in recorded examples ([7c09627](https://github.com/hab56ur9/ui/commit/7c0962759d54b5c509590bfeb2109f96bebbb020))
* **split:** scale drag distance by the sum of sizes ([7368573](https://github.com/hab56ur9/ui/commit/73685739b4fa118250902baa68d2c9347f2c84f2))
* stack pinned group members in their row order ([791b96f](https://github.com/hab56ur9/ui/commit/791b96f3153997ba7d828126784d65fde77c7af1))
* **tree:** follow the APG tree keyboard pattern ([526dadf](https://github.com/hab56ur9/ui/commit/526dadf73aa8eea3eb08f45a273501924c8a0a6f))

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
