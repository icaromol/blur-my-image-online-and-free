# Decisions

Newest first. Each decision says what was decided, why, who decided and what it affects. Product scope decisions are Ícaro's.

## Open questions

Each question carries a recommendation and the default in force, so work doesn't wait on an answer. Ícaro overrides by saying so; no reply needed to keep the default.

### Q-001 — Localized URLs for SEO?

Default in force: **detection only** (built in BMI-041). `resolveLocale()` can take a URL source in front of it later.

Options: detection only, or a URL per locale (`/pt-br/`, `hreflang`, prerendered landing pages) so Portuguese pages can rank in Brazil.

Recommendation: decide together with the SEO work before launch (BMI-050), with `seo-specialist` sizing the prerender cost. Nothing in v1 gets harder either way.

### Q-002 — Marketing in Portuguese?

Default in force: **English only**, as the marketing skill says. The app itself is bilingual.

Recommendation: launch in English; once the app has real visits, add Portuguese posts and a Portuguese listing aimed at Brazilian communities, scoped by `marketing-strategist`. Keeps launch effort on one language.

### Q-027 — Buy a domain for the MCP (`mcp.<domain>`)?

D-037 says Ícaro wants `mcp.blurmyimage.com` and the same for each tool of the family. A subdomain needs the parent domain, and buying a domain is his decision (D-016, Q-005: the app lives today on a `*.vercel.app` address). PM raises it and decides nothing. Recommendation: wait for the architecture spec (BMI-139): a local package run over stdio needs no domain, and the choice between remote and local changes what is worth buying. Default in force: **no purchase and no domain work.**

### Q-028 — Is the first delivery of the MCP only the spec, or a prototype too?

Asked for by `-aa` as a question for later. Recommendation: the spec first, and a prototype only after the privacy model (BMI-140) is decided, since the prototype's shape (remote or local) follows from it. Default in force: **only the spec.**

### Q-022 — When may the app's URL be public: canonical, sitemap, README, marketing?

D-016 says the URL stays out of the README and marketing until Ícaro says. Meanwhile `index.html` already carries it (`og:url` and `og:image`, on the repository that is public now), and the landing pages need the real host for `canonical` and `sitemap.xml` (decision 3 of `docs/marketing/landing/seo.md`, read through `-75`; PM hasn't read the file). So the URL is already discoverable, and the question is when it stops being a secret to the places that matter.

Recommendation: release it with the go-live, in one step after the merge of PR #2: the first production deploy of the final build, the landing pages (BMI-085) and the README/marketing line, with the canonical and the sitemap built from the same host. Before that nothing changes. Default in force: the URL stays out of the README and marketing, `canonical` and `sitemap.xml` aren't built, and no post cites it.

### Q-020 — What does "overlapping images" mean? (a future spec, blocks nothing)

Ícaro's request mentioned overlapping images and effects (relayed by `-aa`). The effect stack (BMI-128) is about effects; a second image placed over the first is a different, larger feature: a second source texture, a position and scale, a blend. Question for him, for later: what did he mean, a second picture over the first (a sticker, a logo, a pasted patch), or only effects on top of each other? Recommendation: ask when the effect stack comes up, then write its own spec. Default: not in `specs/effect-stack.md`, no item.

### Q-006 — Do the Docker image and server bundle need license notices?

Audit finding C: `dist-server/node.js` bundles hono, `@hono/node-server`, ipaddr.js and undici, and the Dockerfile ships it, but only the client build emits `licenses.md`.

Default in force: **nothing added to v1.** The image is built in CI as an exit path and not published, and a hosted function isn't a distributed copy. The client bundle, which is distributed to browsers, already carries its notices.

Recommendation: before any Docker image is published or pulled by anyone else, add server-bundle notices (the same mechanism, written to `dist-server/`). It's cheap and removes the question. Adding it to v1 is Ícaro's call; say so and it becomes a `Should` item for the server lane.

### Q-005 — Hosted URL

The URL is now `https://blurmyimage.vercel.app` (200), set by Ícaro as the project's main domain on 2026-11-22, per `-aa`; the earlier `https://blur-my-image.vercel.app` answers 307 to it (PM read both with a plain `GET`). The README, the repo website field and the bug form get it only when Ícaro says (D-016). Not blocking.

## Decisions

### D-043 — Ícaro's mockup is BMI-085's visual reference; preview and zoom come after v1; section 4 "Use it your way" has three cards (2026-11-23)

**Decision**, Ícaro's own words in BLU-21: his comment at 22:23:22Z on 2026-11-23 with the three images of the mockup he generated from the `prompt-ui-landing` prompt, and his answers to a question card there, resolved by him (human only) at 22:30:52Z. PM read the comment, the card and its result, not a relay. The options he picked: `preview: after`, `zoom: after`, `mcp: spec`, `cards: shortcuts, issues`. The images and a summary are in `.local/landing-mockup/` (git-ignored) and in the `mockup-feedback` document of BLU-21.
(1) **The mockup is BMI-085's visual reference**, which ends the wait of D-041 point (3). In his words: "Seção 1 e 2 tá bem bom nessa imagem". Section 1 is the hero: the big logo, a supporting line, the drop zone and the link field. Section 2 is four cards: Private by design, Fast and simple, Works with any image, Free and open source. **Section 3, "How it works", becomes a stepper**, Paste > Blur > Download: "Separados e demonstrando com facilidade". In the editor he liked "o menu lateral. Do blur intensity com download logo abaixo. Com arrows": the side menu of tools, the right panel with the intensity and the Download right below it, and the undo and redo arrows.
(2) **BMI-127, the preview toggle, stays after v1** (D-031 confirmed). He asked for it ("Só faltou o toogle de preview ou sem preview by default"): off or on, and in preview the image is cut in half, before and after, with the intensity and the Download above the two halves. To the card's question whether it moves into v1 with the landing, he answered "Não, continua depois da v1 (o mockup fica com o espaço reservado)". So BMI-085's editor layout reserves the place of the toggle, and his description goes into `specs/preview-modes.md`.
(3) **Zoom in the editor is a new item after v1, BMI-129**, next to BMI-127. He liked the mockup's zoom ("Com arrows e zoom"); the app has none today (PM grepped `src/` on `main`, `05645f8`: the only "zoom" is a comment in `src/engine/intensity.ts`). To the card's question he answered "Depois da v1". So BMI-085 builds no zoom control, and the mockup's magnifiers and "100%" don't go into v1's editor.
(4) **Section 4, "Use it your way", has three cards:**
- **The MCP**, "by design, from devs to devs": visible now and marked as in development, linking to the public spec on GitHub, `docs/product/specs/mcp-for-agents.md` (on `main` since `b585016`). The link becomes the MCP's page when that page exists (E10, Q-027). His answer: "Card visível com 'em desenvolvimento', linkando a spec pública no GitHub; vira link da página do MCP quando ela existir". The card makes no privacy promise for the MCP and nothing of the MCP's promise mixes with the app's (D-037, BMI-140). `specs/mcp-for-agents.md` said in its non-goals that nothing about the MCP goes on the landing before the MCP's privacy statement exists; the Copywriter raised the conflict in BLU-66 and PM aligned the spec with this choice (BLU-73): until that statement exists, the card may carry his line and say only that the MCP is in development and not available yet and that the page's privacy notes cover the web app only, with the link; it states no tool, input type, date or privacy rule for the MCP. Nothing else about the MCP goes on the landing or in the README before the statement.
- **Keyboard shortcuts**, from the README's table (`B`, `E`, `[` and `]`, `Ctrl/Cmd+Z`, `Ctrl/Cmd+Shift+Z`, `Ctrl/Cmd+V`) and its note that the single keys work while the image has focus.
- **Ask for a feature or report a bug on GitHub**, through the repository's issue forms (`.github/ISSUE_TEMPLATE/`, a bug form and a feature form).
The other two options of the card (run your own copy with Docker, bring your language) were not chosen; they were only suggestions for the cards, so nothing is cut.
(5) **The port keeps every control of the app.** The mockup doesn't show Motion (with its angle), Blur entire image or the choice of format; they stay, as do the brush size, the eraser, the redaction warning shown with every effect (D-034), the notice under the link field (BMI-079), the large-image notice (BMI-015), the language picker and the theme toggle (BMI-144). The side menu may group the tools (Brush, Eraser, Blur entire image) and the effects go in the panel. **The mockup's sentences that promise too much are replaced by the approved copy:** "forever", "No limits", "No files are uploaded" without the exception for links, "sensitive information" and "Remove personal data", "select the area" (the app has only the brush), the dash in "it's that simple", and "12 px" (the intensity is 1 to 100). The table is in `.local/landing-mockup/feedback.md`, read by PM against `claims-check.md`'s rules. Nothing leaves the scope.
**Why:** the mockup has the look he imagined in D-041; the preview and the zoom change the renderer and the editor's input, and v1 is already built and under review; section 4 shows what the page has nowhere else.
**Decided by:** Ícaro, directly in BLU-21. PM's readings, open to his veto: the stepper is a layout, so the heading approved in D-042 change 6 ("Blur part of an image in three steps") stays unless he says otherwise; BMI-129's place among the post-v1 items (only "after v1", next to BMI-127; the order among them is not decided); the list of controls in point (5), taken from the README and the backlog.
**Affects:** D-041 point (3) (the mockup has arrived), D-031 (confirmed), BMI-085 (criteria for sections 1 to 4, the editor's layout, the reserved place of the toggle, every control kept; the mockup is no longer a dependency), BMI-084 (the cards, the stepper and section 4, written by the Copywriter in BLU-66), BMI-127 (the reserved place and his description), BMI-129 (new), `specs/preview-modes.md`, `specs/mcp-for-agents.md` (the landing non-goal now allows the MCP card, BLU-73), `status.md` "Now", "Next" and "Blocked".

### D-042 — The three use-case pages stay, each with the editor, and the ten changes of the landing critique are approved (2026-11-23)

**Decision**, Ícaro's own answers to a question card in BLU-21, resolved by him (human only) at 22:10:49Z on 2026-11-23. PM read the card and its result, not a relay: the options he picked are `keep` and `all`.
(1) **Q-024 is closed: the three use-case pages stay.** His answer: "Ficam: 3 páginas pequenas, cada uma com o editor, linkadas a partir da principal". So BMI-085 builds four pages: the home (the app's screen with the copy underneath, D-032) and three small pages, `/blur-license-plate/`, `/blur-text-in-screenshot/` and `/blur-face-in-photo/`, **each with the editor on it**, all three linked from the home. On those pages the editor's drop zone is the call to action, so they carry no "Open the editor" button. The SEO notes' route (a Vite multi-page build with static copy outside the element the app mounts into, no new dependency) still applies, now with the app mounted on every page.
(2) **The landing critique: "Sim, as 10".** The ten changes of section D of `.local/landing-improvements.md` are approved for BMI-084's copy: (1) "What people hide with it" on the home (C1-1); (2) the leaked SEO sentence deleted from the screenshot page (C3-1); (3) the Pixelate row caveat (C1-4); (4) three FAQ items, safety first (C1-3); (5) the title tag and `og:title` with "Free" (C1-5); (6) "How it works" renamed "Blur part of an image in three steps" (C1-7); (7) the closing line "drop an image anywhere on this page or press Ctrl+V" in place of the duplicate GitHub line (C1-6), after the scroll check; (8) the meta and JSON-LD description with "or just the parts you paint" (C1-8), after a script recount; (9) a static H1 and subhead above the app (C1-2); (10) "original resolution" in the plate hero, "number plate" once, and the Windows/Mac answer (C2-1, C2-2, C3-2). Change 9 is copy in BMI-084; placing it above the app and the layout check are BMI-085's (ui lane), as are the scroll check of change 7.
(3) **What he did not decide stays as it is, neither applied nor discarded:** C1-9, C1-10, C1-11, C2-3, C4-1, C4-2 and the "Constraints worth revisiting" of the same file. They are not applied to the copy and not cut; if they come up again, they go to him.
**Why:** each search intent (plate, screenshot, face) gets its own answer and its own tool; the ten changes were the critique's best impact for the least effort.
**Decided by:** Ícaro, directly. The split of change 9 between BMI-084 (the words) and BMI-085 (the placement) is PM's reading, open to his veto. Nothing cut.
**Affects:** Q-024 (closed), D-041 point (5) (BMI-084's last blockers are gone), BMI-084 (`Blocked` → `In progress`), BMI-085 (four pages, the editor on each, the static H1, the scroll check), `status.md` "Now", "Next" and "Blocked".

### D-041 — The landing: marketing runs in parallel, the visual direction, and a light/dark toggle in the app (2026-11-23)

**Decision**, Ícaro's own words in the BLU-21 chat on 2026-11-23 (PM read both messages there, not relayed): at 22:05, "ao mesmo tempo quero ir avançando com a tarefa de copy a UI UX da página!!! Já imagino a logo grande, visual limpo e claro, crie também um prompt pra mim gerar uma UI em outro agente especializado em landing pages preto e branco, detalhes azul, minimal, fácil, clean, rápido, funcional, SUPER MEGA HIPER RAPIDO"; at 22:07, "adicione tambem essa feature https://ui.shadcn.com/docs/dark-mode".
(1) **The marketing lane runs in parallel with the code queue.** The landing copy (BMI-084) no longer stands by: this replaces D-039 point (1) "Marketing ... stand by" for the marketing lane only. The code queue keeps one writing agent at a time, in D-039's order, and Dev Server still stands by. The marketing lane writes only its own files (`docs/marketing/`), so it doesn't collide with a code branch; its commits still go through the Git agent, and nothing is published.
(2) **Visual direction of the landing:** a big logo at the top, a clean and clear look, black and white with blue only in details (the two-tone blue of D-038, `#0d62b8` on light and `#7cc4ff` on dark, never in the logo), minimal, easy, functional and very fast. It feeds BMI-085 (the build) and BMI-078 (the brand on the site).
(3) **A mockup from an external agent is the visual reference of BMI-085.** The Orquestrador wrote the prompt (the `prompt-ui-landing` document in BLU-21); Ícaro generates the UI in a landing-page agent of his choice and brings it back. Until it arrives, BMI-085 has no visual reference and stays `Idea`; nothing is built from the prompt itself.
(4) **The app gets a light/dark theme toggle** following the shadcn/ui dark-mode pattern: Light / Dark / System, default System, the choice remembered in the browser, applied before the first paint, no transition on the switch. The app is Vue and Vite, so the pattern is used and not the React packages (`next-themes`, `lucide-react`). New item BMI-144, `Should`, v1 (Ícaro asked to add it next to the landing, which is v1). This closes what D-027 point (4) and D-020 left open ("The app's color theme is still to be decided with him later"): both themes, with a toggle. Which colors each theme uses comes with the landing build (BMI-085, from the mockup and the kit palette); BMI-144 is the mechanism and the toggle.
(5) **BMI-084's blocker is corrected.** D-039 point (5) listed "the three `audience.md` edits"; PM checked `main` (`05645f8`): the CSP caveat is in P1 (`docs/marketing/audience.md` line 54) and the automatic-detection objection in P2 and P3 (lines 63 and 72), as authorized by D-033. The third is a check before the copy leaves draft (the "no analytics cookies" pillar against BMI-082), not an edit, so it stays a criterion and isn't a blocker. What is left from Ícaro is only **Q-024** and **the landing critique** (`.local/landing-improvements.md`, section D, the ten changes); the Orquestrador asked him both in BLU-21 on 2026-11-23. When he answers, BMI-084 returns to `Ready` for the marketing lane.
**Why:** he wants the page's copy and look to move now, while the code queue does the privacy and CI work; the toggle is his request for the page he imagines.
**Decided by:** Ícaro, directly in BLU-21. Points (4)'s placement (`Should`, E8, position 8 of the code queue) and (5)'s reading of `main` are PM's, open to his veto. Nothing cut: every item keeps its milestone and priority.
**Affects:** D-039 points (1) and (5), D-027 point (4), D-020, BMI-084 (blocker reduced to Q-024 and the critique), BMI-085 (visual reference, both themes), BMI-078, BMI-144 (new), `status.md` "Now", "Next" and "Blocked".
**Followed by D-042 (2026-11-23, Ícaro):** Q-024 and the landing critique are answered. BMI-084 went straight to `In progress` instead of `Ready`, since the Copywriter had already started on his answers (BLU-57).
**Followed by D-043 (2026-11-23, Ícaro):** the mockup arrived and is BMI-085's visual reference (point 3).

### D-040 — The Firefox and WebKit job runs on every pull request that touches more than docs (2026-11-23)

**Decision:** widens PM's own path filter from BMI-089, confirmed in D-039 point (7) (no veto had arrived). On a pull request, the `e2e-firefox-webkit` job runs **unless every changed file is documentation**: under `docs/`, `marketing/`, `brand/` or `.claude/`, any `*.md` file, or `LICENSE`. Every other change runs it, including `src/` (all of it: `engine/`, `input/`, `export/`, `ui/`, `i18n/`), `e2e/`, `index.html`, `public/`, `vite.config.ts`, `security-headers.ts`, `package.json`, `pnpm-lock.yaml`, `playwright.config.ts` and `.github/workflows/`. A push to `main` keeps running it always. The YAML comment says exactly this rule and nothing broader.
**Why:** the opus reviewer of PR B (finding 2) showed that the first list (`ci.yml`, `playwright.config.ts`, `e2e/`, `src/engine/`) left out the very places where Firefox already behaved differently: the paste (`src/input/`), the WebP download (`src/export/`), and a Playwright bump in `package.json`/`pnpm-lock.yaml`, which swaps the Firefox and WebKit binaries. The reviewer proposed adding those four paths; PM goes one step further and lists what may skip the job instead of what must run it, because an allow-list goes stale as code moves (BMI-092's second bug was in `src/ui/editor.ts`, also outside both lists) and a stale list fails the same way PR #2 did: green on the PR, red on `main`. The cost is only CI time (the job has a 25-minute ceiling; the repository is public, so the minutes aren't billed). It adds a check and removes none, the same idea as D-036's Docker path filter.
**Decided by:** PM, as the owner of the filter it widens. Reversible; Ícaro can overrule.
**Affects:** D-039 point (7) (the list there is replaced by this rule), BMI-089 (PR B: the `changes` job in `.github/workflows/ci.yml` and the coverage note in `docs/quality.md`, both applied by the Dev Quality worker in the same rework round as the reviewer's other findings), `status.md` "Now".

### D-039 — Order and eligibility of the delegation plan, by PM (2026-11-23)

**Partly replaced by D-041 (2026-11-23, Ícaro):** the marketing lane no longer stands by (point 1), and BMI-084 waits only on Q-024 and the landing critique (point 5). The code queue keeps one writer at a time.

**Decision**, by PM, on the plan the Orquestrador drew up in BLU-3. Ícaro passed this decision to PM in BLU-3 on 2026-11-23 and wrote "destrave e prossiga!" in BLU-4 the same day. Each point is open to his veto.
(1) **Order**, one writing agent at a time, each on its own branch and PR: BMI-092 PR A → BMI-089 PR B → BMI-135 → BMI-094 → BMI-090 (config part) → BMI-076 (dependency-review) → BMI-093. BMI-066 takes the next free slot from 2026-11-28, ahead of any `Should` still queued, and its gate includes a clean `pnpm install --frozen-lockfile`. BMI-082 is out of the queue. Marketing and Dev Server stand by. Being later in the queue is ordering, not a cut.
(2) **BMI-135 after PR B**, which keeps the PR A → PR B order of D-036 and stops two PRs from editing `playwright.config.ts` and `docs/quality.md` at the same time. It comes before BMI-094, although it is a `Should`, because it removes false failures from every later gate.
(3) **BMI-090's dependency on BMI-071 counts as met to start**: its files are on `main`. BMI-071 becomes `Done` together with BMI-090.
(4) **BMI-090 and BMI-076 start on the part that doesn't need Ícaro** (the 0.1.0 config and the release sentence; the dependency-review). Both items stay open until every criterion is met. If the scorecard allowlist doesn't exist when the PR leaves draft, the scorecard goes in a second PR with the same criteria.
(5) **BMI-084 → `Blocked`** on Ícaro (Q-024, the three `audience.md` edits, the landing critique), not `Ready`.
(6) **BMI-082 → `Blocked`** on Ícaro's yes to the Vercel preview experiment, which is outward-facing.
(7) **The Firefox/WebKit job also runs on PRs** that touch `ci.yml`, `playwright.config.ts`, `e2e/**` or `src/engine/**` (BMI-089): confirmed. It adds a check and removes none.
(8) **Dependabot's PR #3 stays open and unmerged** until BMI-093 closes it (D-036).
(9) BMI-094 becomes `Ready` once PR A is committed; it was merged as `715e381`, so it is `Ready`. BMI-093 becomes `Ready` once BMI-089 PR B is committed.
**Why:** privacy first (D-036), then the CI that proves Firefox, then what removes false failures, then the rest by dependency. Items whose next step is Ícaro's can't be picked up by a lane, so they aren't `Ready`.
**Decided by:** PM, at Ícaro's direction in BLU-3 and BLU-4. Scope unchanged: every item stays in v1 with the same priority.
**Affects:** BMI-066, 076, 082, 084, 089, 090, 093, 094, 135; `status.md` "Now" and "Next".

### D-038 — The logo is black or white only; the blue is an accent outside the logo (2026-11-23)

**Decision**, Ícaro's own words in the BLU-9 task (2026-11-23, not relayed): "O tom de azul ficou legal, mas não gostei da aplicação na logo. Remova, deixe apenas 100% branca ou preta na logo, e o tom de azul você pode deixar para a landing page, detalhes e no brand kit." (1) The logo (horizontal and stacked lockups, and the mark on its own) exists only in **black** and in **white**. The two blue colorways are removed. (2) The two-tone blue (`#0d62b8` on light backgrounds, `#7cc4ff` on dark ones) stays the only accent color. It is used on the landing page, in interface details and in the brand kit's materials, and **never in the logo**. (3) The icons and favicon (16, 32, 48, 180, 192 and 512 px) are applications of the logo, so they lose the blue too: dark background, all-white mark. Ícaro answered the BLU-9 question card directly on 2026-11-23: "Sim, ícones sem azul".
**Why:** he liked the blue but not on the logo.
**Decided by:** Ícaro, directly in BLU-9.
**Affects:** D-027 (points 1 and 3 replaced as above: four colorways become two, and the icons lose the blue bar; the two-tone blue as the only accent still stands), BMI-075 (criteria changed, back to `In progress` while the designer redoes PR #6), BMI-078 (the favicon it puts in `public/` is the new one), `brand/README.md` in PR #6.

### D-037 — Strategic direction: an MCP for each tool of the family (2026-11-22)

**Decision** (a direction, scope not closed), as relayed by `-aa` from Ícaro's own words: "we have to have mcp.blurmyimage.com" and, for each micro-SaaS, the same ("mcp.cut...", "mcp.pixelate", "mcp.backgroundremove" and so on): "this is where the value lives": each tool is established on the web with SEO and GEO/AEO as the free, global MCP that works best for agents. He also plans to launch several separate tools (a map is in `.local/tool-sites/`, git-ignored). PM opens a new epic, E10 (MCP and discovery by agents), with `Idea` items only and a spec outline first (`specs/mcp-for-agents.md`); nothing is implemented, no domain is bought, and no pull request is touched. The spec covers the family, not only blur. The label D-036 that `-aa` used is taken by the answers after the merge, so this is D-037.
**Why:** his strategy for where the product's value lies.
**Decided by:** Ícaro, per the orchestrator session. Scope closed later.
**Affects:** epic E10, BMI-139 to BMI-143, Q-027, Q-028, the landing and README (nothing may mix the promise of the web app with the MCP's).

### D-036 — Answers after the merge: the BMI-087 text, the Playwright port, Node 26, and the priority of the privacy bug (2026-11-22)

**Decision**, as relayed by `-aa` from Ícaro's direct answers: (1) the `pt-BR` text of the cut-download error (BMI-087, PR #4) is **approved as it is**: "O download foi interrupido. Se a imagem for grande, baixe o arquivo e abra-o aqui." (2) **BMI-135** (the shared port 4173 of the e2e, `reuseExistingServer`) **moves from `Later` to `Ready`**, `Should`, quality lane: it has already caused a false failure twice and now contaminates the Firefox diagnosis; outside the CI Playwright must not reuse another process's server (or must use a free port). (3) **Node 26**, closing Q-026: he chose **(a), move everything to 26**: Docker with a pinned pnpm 12.18.0 in place of corepack, the CI (`setup-node`, four places), `engines` and the README; PR #3 is closed afterwards; in a PR of its own, **after BMI-089 and BMI-092**; extra criterion: the Docker job also runs on PRs that change the `Dockerfile` (a path filter), so that the change is proven before the merge, since PR #3's green proved nothing because that job runs only on `main`. (4) **BMI-092 has the highest priority**: plan approved, PR A first (`src/engine/renderer.ts` with `preference: ["webgl"]` and a regression test that fails without the fix), PR B (e2e and CI) after; `-aa` checked line 48 of `renderer.ts` on `main`; the worker (Firefox 159) reproduced it. `-aa` takes the manual Firefox check (a WebP download gives a file) and a test without WebGL (`webgl.disabled`) to him. None of this cuts support.
**Why:** the privacy bug is the one thing that makes the product do the opposite of what it says; the port problem wastes diagnosis time; Node 26 is the longer-lived LTS and the one the host already runs.
**Decided by:** Ícaro, per the orchestrator session.
**Affects:** BMI-087, BMI-135, BMI-093 (new), BMI-092, BMI-089.

### D-035 — After the merge: Actions may create PRs, the first release is 0.1.0, Dependabot's Node 26 bump waits (2026-11-22)

**Decision**, as relayed by `-aa` from Ícaro's direct answers: (1) GitHub Actions is allowed to create pull requests (the repository setting "Allow GitHub Actions to create and approve pull requests"; he turns it on in the GitHub settings or says "pode" in `-5b`'s session; `-5b` doesn't accept a relayed go). The `release-please` run on the merge commit failed with "GitHub Actions is not permitted to create or approve pull requests": it created the branch `release-please--branches--main--components--blur-my-image` but no PR, and it computed "updating from 0.0.0 to 1.0.0". (2) The first release is **0.1.0**, not 1.0.0: BMI-090 configures release-please for it; the existing branch is updated or redone without publishing anything; **no GitHub Release and no public tag exist before Ícaro merges the release PR.** (3) Dependabot PR #3 (the Docker base image from `node:24-slim` to `node:26-slim`) is evaluated read-only (BMI-091) and **not merged without his yes**, since it swaps the runtime. Information only: the squash author on `main` shows as "Neous", the public profile name, with the no-reply address.
**Why:** the release flow needs the permission to open its PR; a first public version of 1.0.0 would promise more than a pre-release is.
**Decided by:** Ícaro, per the orchestrator session.
**Affects:** BMI-071 (release workflow), BMI-090, BMI-091, README ("Requires Node.js 24").

### D-034 — The in-app warning: final texts, and it shows for every effect (2026-11-22)

**Decision**, as relayed by `-aa` from Ícaro's direct answers, closing Q-025: (1) Ícaro **read the `pt-BR`** of the warning and chose both optional changes. Final `pt-BR`, to be used exactly: "Desfoque e pixelização não escondem texto de forma confiável. Para algo secreto, cubra com uma tarja preta em outro editor ou deixe de fora." The `en` stays as the reviewer approved it: "Blur and pixelate don't reliably hide text. For anything secret, cover it with a solid box in another editor, or leave it out." (he didn't choose the optional "of the image"). (2) The warning is shown **for every effect** (blur and pixelate), keeping "Blur and pixelate" in the text: the ui lane adjusts the component, the e2e and the accessibility (aria, without repeated noise) and changes nothing else in the interface. Because it changes behavior, it goes back to the opus reviewer.
**Also accepted by Ícaro (relayed by `-aa`, 2026-11-22):** the new README line 47, "Obscuring faces and plates; not for text that must stay secret", the README line 58, "The app shows this warning with every effect.", and the `aria-describedby` on the group of effect radios.
**Why:** the reason for the warning applies to all three effects, and narrowing the text to Pixelate would suggest that blur is safe.
**Decided by:** Ícaro, per the orchestrator session.
**Affects:** BMI-088 (reopened for the behavior change), BMI-086 (the README sentence on where the warning shows), `src/engine/effect-catalog.ts` (`hasWarning`), `en.json` and `pt-BR.json`.

### D-033 — Merge after the fixes, the false statements corrected, the in-app warning rewritten, BMI-104 stays in Later (2026-11-22)

**Decision**, as relayed by `-aa` from Ícaro's direct answers (closing Q-023): (1) **Merge**: correct, push everything, and only then merge (option A). (2) **BMI-086 is authorized in full**: replace the "roughly 20 px" figure with sentences faithful to the 2016 PoPETs study in `README.md` line 58, `docs/research.md`, `docs/marketing/channels.md`, the pre-launch plan and the post (dropping its blocking note); take "brute force" and "use heavy Pixelate as a minimum" out of the README; fix line 78 (an `http://` link always goes through the proxy; the CSP is `connect-src 'self' https:`); and the three `audience.md` edits (the objection "does it find the faces or the plate for me?" in P2 and P3, **without making it the opening of the landing**; the CSP caveat in P1; a re-check of the "no analytics cookies" pillar against BMI-082 before the copy leaves draft); all of it read by the opus reviewer (faithful to the study, no-ai-slop). (3) **The in-app warning** (line 47 of `en.json` and `pt-BR.json`) is rewritten, with no new feature: blur and pixelate don't really hide what must stay secret, and for a secret one covers or crops. It is an item (BMI-088); Ícaro **reads the `pt-BR` before the merge**. (4) **BMI-104 (a solid box) stays in `Later`**, and the honest warning is its mitigation. (5) Q-022 (when the URL is public, the About field) and Q-024 (the use-case pages) are still with him, defaults in force.
**Precision recorded (2026-11-22, `-aa` and PM):** the number in the first reviewer's account was imprecise. In the paper the 45p blur radius belongs to sentences rendered as 24p Verdana, mosaiced with 8p tiles and then blurred, where the HMM-based recognizers keep a 70% accuracy score up to that radius (the brute-force ones up to 15p); there is no absolute threshold, and the conclusion in the abstract is that mosaicing and blurring "are not viable approaches for text redaction". PM extracted the paper's text to check this (notes in `.local/study-popets-2016-extract.md`, outside git). **No loose number goes into public text.** `-aa` repeated the older number to Ícaro in the question he answered; what he authorized was "correct it with sentences faithful to the study", so the version without numbers is within his authorization and needs no new question.
**Why:** a public statement that overstates what the study found is a defect, and the product's own warning should not promise what the study doesn't.
**Decided by:** Ícaro, per the orchestrator session.
**Affects:** BMI-086, BMI-088, BMI-104, BMI-084 (the `audience.md` edits), the merge of PR #2.

### D-032 — Landing choices (2026-11-22)

**Decision**, as relayed by `-aa` from Ícaro's direct answers, closing Q-021, exactly as he gave them: (1) the landing is **the app's screen with the copy underneath**, against PM's recommendation of a page of its own; the hero has the editor's drop zone, there is no separate home page with a button. (2) In the FAQ he ticked **only** "the FAQ states both link limits": 100 MiB for the browser's direct fetch, and about 4.2 MiB (`MAX_BYTES`, 4,400,000 bytes) through the proxy. He did **not** tick "the FAQ states Vercel's 1-hour request log" nor "the face section opens with 'no automatic detection'": both are treated as **not wanted** in the FAQ and at the start of the face section. That doesn't take the 1-hour log out of the README, which carries it by D-004 item 1 and keeps it; it only concerns the landing. If the landing needs the detection notice, PM asks him again. (3) Silence about phones and about analytics: yes.
**Why:** his choices. The README stays the full statement; the landing stays short.
**Decided by:** Ícaro, per the orchestrator session.
**Affects:** BMI-084 (criteria changed), BMI-085 (reshaped), Q-024.

### D-031 — Preview modes and the editable effect stack come after v1, in that order (2026-11-22)

**Decision**, as relayed by `-aa` from Ícaro's direct answer, closing Q-019: BMI-127 (preview: before and after, and no preview) and BMI-128 (the editable effect stack) come **after v1**, in this order: before and after first, the stack last. It is only an order; nothing he asked for was cut. The JavaScript cost of the preview is measured before any implementation (today's room is 1.31 kB). The meaning of "overlapping images" is a future question (Q-020) and blocks nothing.
**Why:** v1 is the README plus i18n, already built and under review; the two ideas change the renderer and the undo model.
**Decided by:** Ícaro, per the orchestrator session.
**Affects:** BMI-127, BMI-128, `specs/preview-modes.md`, `specs/effect-stack.md`.
**Confirmed by D-043 (2026-11-23, Ícaro, directly):** asked again with the mockup, he kept BMI-127 after v1; BMI-085's editor layout reserves the place of its toggle.

### D-030 — The rate-limit message in `pt-BR` is approved; `ossf/scorecard-action` is allowed (2026-11-22)

**Decision**, as relayed by `-aa` from Ícaro's direct answers: (1) the `pt-BR` text of the rate-limit message is approved as proposed, "Muitas solicitações vindas da sua rede agora. Tente de novo em cerca de um minuto." (`en`: "Too many requests from your network right now. Try again in about a minute."), so the pre-merge read of it is done. (2) Closes Q-012: `ossf/scorecard-action` is added to the Actions allowlist, pinned by SHA like the others; `-5b` applies the setting, and the scorecard workflow is written after the merge, in a PR of its own with the dependency-review workflow (BMI-076). **Correction (2026-11-22, per `-5b`): decided, not executed.** `-5b`'s environment blocked the write to the Actions allowlist (a security classifier, "Undermining Oversight") and `-5b` did not work around it. What is ready: `ossf/scorecard-action` v2.6.0 is an annotated tag pointing to commit `23f22cd43608bae7a1f1fa2603d7314dee9538a5` (verified by `-5b` as an ancestor of the official repository's main); the list today has 4 patterns ending in `@*` and `github_owned_allowed` true, and the update replaces the whole list, so it must carry those 4 plus the new one. Ícaro allows it directly in `-5b`'s session, or sets it himself in the repository's Actions settings. **State read on 2026-11-23 (PM, `gh api`, read-only):** point (2) is still not in effect, and there is no allowlist at all: `allowed_actions: "all"` (the selected-actions endpoint answers 409, "All actions and workflows are allowed on this repository"), `sha_pinning_required: true`, `default_workflow_permissions: "read"`, `can_approve_pull_request_reviews: false`, fork pull request approval `all_external_contributors`, log retention 90 days. Any action may run, pinned by SHA. Ícaro is reviewing these settings in BLU-21; nothing was changed by PM. BMI-076 records what it means for the scorecard workflow.
**Why:** the message and the allowlist were the last two answers waiting on him; the scorecard action is the OpenSSF project's own.
**Decided by:** Ícaro, per the orchestrator session.
**Affects:** BMI-081 (the `pt-BR` read is done), BMI-076 (the scorecard half no longer waits), the repo's Actions settings.

### D-029 — Hosted-only metrics, and sponsorship and donations first (2026-11-22)

**Decision**, as relayed by `-aa` from Ícaro's direct answers, closing Q-018: (1) Vercel Web Analytics and Speed Insights go on the **hosted deployment only**: nothing in the open-source code path, nothing in the Docker image, off by default in the code. His conditions: the README and the privacy text say what is true (the hosted site counts visits and speed, never images); the README's line 80, "No analytics cookies, no tracking pixels", stays only if Vercel's documentation confirms that Speed Insights uses no cookies, otherwise the sentence changes; the CSP and `e2e/privacy.spec.ts` change on purpose and keep proving that the open-source and Docker builds make no third-party request; one line in the app says it; PM checks whether a package or only a script is needed (the JavaScript budget has 1.31 kB of room). It is specified in `specs/hosted-analytics.md` and built after the merge of PR #2, in a PR of its own; nothing of it enters PR #2. (2) Monetization: **sponsorship and donations first**, GitHub Sponsors or Open Collective with no third-party script on the site; **no ads**.
**Why:** he wants numbers from the hosted site without touching the code people clone, and a way to fund the project that doesn't track anyone.
**Decided by:** Ícaro, per the orchestrator session.
**Affects:** BMI-082 (the metrics), BMI-083 (funding), README line 80, `docs/tooling.md`, BMI-003's "keep them off" line, `e2e/privacy.spec.ts`, `security-headers.ts`.

### D-028 — A privacy notice next to the link field; the rate limit and the WAF finding (2026-11-22)

**Decision**, as relayed by `-aa` from Ícaro's direct answers: the app gets a notice under the link field, with his wording. `en`: "Links are fetched through our server. Files you open, drop or paste never leave your browser." `pt-BR`: "Links são buscados pelo nosso servidor. Arquivos que você abre, solta ou cola nunca saem do seu navegador." The taglines don't change. It goes into PR #2 and changes no scope: the README already says links go through the proxy. Context: CodeRabbit checked and the app had no such notice, while the public answer on the `pt-BR.json` comment said it had; that answer was wrong, `-5b` corrects it, and PM's reply draft carried the same mistake (corrected). He also says he did everything of BMI-073 and turned off the Vercel comments (D-024 done).
**Why:** the claim "files never leave your browser" needs the exception for links said where the user pastes a link, not only in the README.
**Decided by:** Ícaro, per the orchestrator session.
**Affects:** BMI-079 (the notice), BMI-080 (docs on the rate limit), BMI-081 (the deny's message), BMI-073, the README privacy text.

### D-027 — Brand kit: his original lettering, the two-tone blue and the icons are accepted (2026-11-22)

**Partly replaced by D-038 (2026-11-23):** the logo is black or white only, with no blue colorways, and the icons have no blue bar. The blue stays the only accent, outside the logo.
**Point (4)'s open end closed by D-041 (2026-11-23):** the app's color theme is light and dark, with a Light / Dark / System toggle (BMI-144).

**Decision**, as relayed by `-aa` from Ícaro's direct answers, closing Q-016: (1) the wordmark is **his original lettering**, vectorized from `brand/source/logo-horizontal.png` (1983x793); Liberation Sans stays for running text only. The designer redoes the SVGs (horizontal and stacked, four colorways each) and touches the mark only if it has to change; vectorizing uses a mature tool (potrace or an equivalent) and the result is compared side by side with the original at small sizes. (2) The blue is two tones, `#0d62b8` on light backgrounds and `#7cc4ff` on dark ones, as the only accent: accepted. (3) The icons (favicon, apple-touch, 192, 512), as drawn now with a dark background and a light blue bar: accepted. (4) Applying the identity to the site (`index.html`, `public/`, the OG image) is a PR of its own after the merge of PR #2; the kit is a PR of its own too (`feat/brand-kit`), not part of #2. The app's color theme is still to be decided with him later.
**Why:** it is his logo and his brand, and D-022 lets the kit start from it.
**Decided by:** Ícaro, per the orchestrator session.
**Affects:** BMI-075 (criteria changed), BMI-078 (new), `brand/README.md` (the note about the Liberation wordmark becomes history; `OFL.txt` stays while Liberation is used for text).

### D-026 — CC-BY-3.0 accepted for development tools only, so the license check can use a maintained SPDX parser (2026-11-22)

**Decision**, as relayed by `-aa` from Ícaro's direct answer, closing Q-017: CC-BY-3.0 is accepted **for development tools only**, which lets `spdx-expression-parse` bring `spdx-exceptions` (a CC-BY-3.0 data package). Neither is shipped to the client or to the Docker image. The swap that was prepared goes in, and the dev-only rule is explicit in the check: a production dependency under CC-BY-3.0 still fails.
**Why:** the project prefers the maintained library over a hand-written evaluator, and the allowance changes nothing in what ships.
**Decided by:** Ícaro, per the orchestrator session.
**Affects:** BMI-077 (the license check), `scripts/check-licenses.mjs`, `package.json` and `pnpm-lock.yaml` (lock files).

### D-025 — Answers on the three CodeRabbit findings that needed Ícaro (2026-11-22)

**Decision**, as relayed by `-aa` from Ícaro's direct answers, closing Q-015: (1) **release-please**: the first release PR is closed and reopened by hand to start its checks; the workflow stays as it is and no new secret is created. (2) **Direct fetch**: it gets a timeout **and a size cap** (his choice, against PM's recommendation of a timeout only; his choice stands). PM sets the value, with a reason, in BMI-077, and the error uses the existing `too_large` i18n code in `en` and `pt-BR`. (3) **Tagline**: kept as he approved it (D-010); the PR answer says the README and the meta description carry the exception for links. (PM first wrote "and the app's own notice" here and in the reply draft without checking: the app had no such notice, CodeRabbit found it, and D-028 adds it.)
**Why:** each is his call: a credential, a limit that can refuse an image, and his own wording.
**Decided by:** Ícaro, per the orchestrator session.
**Affects:** BMI-077, PR #2 (answers only where we refuse or explain).

### D-024 — Turn off the Vercel pull-request comments (2026-11-22)

**Decision**, as relayed by `-aa` from Ícaro's direct answer, closing Q-014: the Vercel comments on pull requests are turned off. Ícaro flips the toggle in the Vercel dashboard (Project Settings, Git); `-5b` deletes the existing comment on PR #2, already ordered by `-aa`. Previews and the GitHub status check stay.
**Why:** the bot's public comment on PR #2 carried the project ID and the team slug, and it comments on every PR.
**Decided by:** Ícaro, per the orchestrator session.
**Affects:** PR #2, team.md's Vercel notes.

### D-023 — Path filters let CodeRabbit review PR #2 (2026-11-22)

**Decision**, taken by `-aa`, `-f5` and `-5b` as option A of the former Q-013 (PM's recommendation, tried first on `-aa`'s word; PM hasn't seen the file): the committed `.coderabbit.yaml` (`57e170d`) uses path filters that take `docs/`, `marketing/`, `.claude/`, markdown and `public/` out of the review, while code, security and CI files stay in, and `drafts: true`. CodeRabbit's status on PR #2 went from "skipped" (134 files over the free plan's limit of 100) to "Review in progress". Ícaro's condition, a merge only after CodeRabbit's corrections, is met by this route and stays in force; he can overrule the filters.
**Why:** the file count was the only thing that stopped the review, and the filtered files are text and assets, not code.
**Decided by:** `-aa` with `-f5` and `-5b`, under Ícaro's order (D-018), not by Ícaro himself. Reversible. Result: the review came out line by line, so the open-source plan covers PR #2 (per `-aa`; reading the CodeRabbit dashboard is still Ícaro's).
**Affects:** BMI-050 (the review step), PR #2. Closes Q-013.

### D-022 — The logos are Ícaro's and may be published under MIT (2026-11-22)

**Decision**, as relayed by `-aa` from Ícaro's direct answer ("licença minha", PM did not hear it directly), closing Q-011: the two logos are his and may be published under the repo's MIT license. He didn't name the tool they came from, so the record says only "created by Ícaro". The brand kit may start from the shape of his symbol and from his wordmark; redrawing the wordmark in a free font (SIL OFL) for a clean vector is the designer's call, not required by license.
**Why:** it settles whether the raster logos can be redrawn and published.
**Decided by:** Ícaro, per the orchestrator session.
**Affects:** BMI-075 (criteria loosened accordingly), `brand/README.md`. PM did not check the wordmark's typeface; if it comes from a commercial font, that font's own license is a separate matter from the logo's.

### D-021 — Old commit hashes stay reachable: risk accepted; the e-mail toggles are on (2026-11-22)

**Decision**, as relayed by `-aa` from Ícaro's direct answers (PM did not hear them directly): (1) the pre-rewrite commits may stay reachable by their full hash on GitHub until it garbage-collects them, and he **accepts the risk**: no request to GitHub Support and no new repository; (2) the two e-mail settings of his GitHub account, "Keep my email addresses private" and "Block command line pushes that expose my email", are **on** (he sent `-aa` a screenshot; PM hasn't seen it); (3) BMI-075 and the E8 epic are fine as described.
**Why:** the old hashes aren't linked from any ref (PM checked `refs/pull/1/head` and the branches), so reaching them takes the full hash; a repository replacement or a Support request wasn't worth that. The two toggles stop a future commit from exposing the old address.
**Decided by:** Ícaro, per the orchestrator session. Irreversible once the repo is public.
**Affects:** D-015 (its residual risk is now an accepted one), BMI-050, BMI-075.

### D-020 — Visual identity for the product (2026-11-22)

**Decision**, as relayed by `-aa` from Ícaro's direct request (PM did not hear it directly): the product gets a visual identity, minimalist, black and white with blue as the accent, built from the two logos he added. It enters v1 by his order, as BMI-075 (`Should`, so the `Must` count doesn't change). It covers vector logos, a minimal palette, favicon, the OG image base, the marketing templates' CSS and a short guide. Applying the identity inside the app (theme, components) is a separate item for the ui lane, groomed later with him; `src/**` isn't touched here.
**Why:** he wants a consistent identity for the repo, the OG image and the posts before launch.
**Decided by:** Ícaro, per the orchestrator session.
**Affects:** BMI-075 (new), Q-011, `marketing/social/templates/brand.css`, the OG image, `.gitignore` (the raw sources).

### D-019 — Ignored Build Step on the Vercel project before the rewritten `main` is pushed (2026-11-22)

**Decision**, as relayed by the orchestrator session (`-aa`) from Ícaro's direct answer (PM did not hear it directly): before `-5b` pushes the rewritten `main`, `-f2` sets the project's Ignored Build Step to `test ! -f package.json`. A tree with no `package.json` (today's `main`) is skipped and the live site stays; a tree with the app builds as usual, also after the merge. `-5b` pushes `main` only after `-f2` reads the value back. `-f2`'s environment denied the change (a PATCH of `commandForIgnoringBuildStep`, "Destructive or Unwanted Actions"), and a relayed authorization doesn't change that, so **the execution is Ícaro's** (he saved it in the dashboard, 2026-11-22, per `-aa`; the read-back by `-f2` is still to come): Project Settings, Git, Ignored Build Step, Custom, command `test ! -f package.json`, Save. Read back by `-f2` right after the denial: the value is `None`, so production is **not protected yet**, and `-5b` must not push `main` until `-f2` reads the new value back. This replaces any earlier acceptance of the site going down, which was given without the exposure below.
**Why:** pushing `main` would otherwise trigger a static deployment of the repository root (no app, no build), taking the site down and serving files such as `/CLAUDE.md` and `/docs/*.md` by URL.
**Decided by:** Ícaro, per the orchestrator session. Reversible.
**Affects:** BMI-050 (a step before pushing the rewritten `main`), BMI-003 and BMI-073 (a Vercel project setting), D-015.

### D-018 — Final order: rewrite, flip, protections, CodeRabbit config, review, merge (2026-11-22)

**Decision**, as relayed by the orchestrator session (`-aa`), the fallback Ícaro had accepted in advance: `-f5` confirmed that on the CodeRabbit Free plan with a private repo CodeRabbit only writes a summary and does no line-by-line review; the open-source plan, for a public repo, does review. So the order of D-017 changes to: (1) rewrite the commits (D-015); (2) flip the repo to public, only with `-aa`'s explicit go, after `-5b`'s report on the rewrite; (3) the BMI-050 protections; (4) `.coderabbit.yaml` committed; (5) PR #1 out of draft and `@coderabbitai review`; (6) the corrections; (7) merge. Supersedes D-017's order; D-015, D-016 and the rest of D-013 stand.
**Why:** a code review before the merge needs a public repo; Ícaro chose the order with this fallback foreseen.
**Decided by:** Ícaro, per the orchestrator session (PM did not hear it directly).
**Affects:** BMI-050 (reordered again), BMI-073, README on `main`: the public `main` shows the old README ("planning, nothing implemented") from the flip until PR #1 merges, which PM flagged before and Ícaro's order accepts. No review comments exist yet, so the history rewrite loses nothing.

### D-017 — New order for going public: rewrite, review privately, merge, then flip (2026-11-22)

**Decision**, as relayed by the orchestrator session (`-aa`) from Ícaro's direct answer (PM did not hear it directly), revising the order in D-013 (its premise, that CodeRabbit reviews private PRs, didn't hold; D-018 changes the order again): (1) rewrite the history to the GitHub no-reply address (D-015); (2) PR #1 comes out of draft; (3) CodeRabbit reviews it while the repo is still private (a `CodeRabbit` status already shows on the PR); (4) its corrections are made; (5) PR #1 is merged; (6) only then the repo flips to public, with `-aa`'s go, so the public `main` is born with the new README. The merge stays the first "official" production deploy. The repo description and topics drafted in `docs/marketing/repo-metadata.md` are approved and `-5b` applies them.
**Why:** CodeRabbit turned out to review private PRs, so the flip no longer has to come before the review, and a flip after the merge doesn't show the old README on `main`.
**Decided by:** Ícaro, per the orchestrator session. Reversible until the flip.
**Affects:** BMI-050 (checklist reordered again), BMI-073 (the pre-merge items), D-013 (its order is superseded; the rest of it stands).

### D-016 — Vercel: publish the rate-limit rule, keep the site up, remove the uploaded-files deployment (2026-11-22)

**Decision**, as relayed by `-aa` from Ícaro's direct answers, closing Q-010: (a) the WAF rule on `/api/image` (30 requests per 60 s per IP, deny for 1 minute) is to be published and the site **stays up** (**decided, not executed**: see the correction below); its URL does not go into the README or any marketing text until he says; (b) the deployment that carries the files uploaded by `-f2`'s local deploy is removed, by `-f2`, and only that one (done and read back: it answers 404); (c) revoking the "Protection Bypass for Automation" secret is his own action in the Vercel dashboard; (d) confirmed that Hobby builds from a private repo. The other finding, the author address of the commits, was decided in D-015.
**Correction (2026-11-22, from `-aa`):** the rule was **not** published. `-f2`'s environment denied `vercel firewall publish` (the CLI's approval gate doesn't accept an authorization relayed by another session) and `-f2` did not work around it. The rule stays staged and `/api/image` has no rate limit. Ícaro decided to publish it; he publishes it himself in the Vercel dashboard (Firewall, Review changes, Publish) or allows the permission in `-f2`'s environment. Nothing here says "published" until `-f2` reads the active rule back. **Update (2026-11-22, from `-aa`):** done and read back. The rule "Rate limit image proxy" is published and active on `/api/image` (30 requests per 60 s per IP, deny for 1 minute, 0 pending changes), the bypass secret no longer appears in the project's API (Ícaro revoked it; `-f2` only checked that it is gone), and `ALLOWED_ORIGINS` lists the new domain from the next deploy. Caveat: `-f2`'s 13 test requests never reached the limit, so that the deny fires above 30 requests per 60 s is not proven.
**Why:** the proxy had no rate limit while reachable; the uploaded copy held internal handoff notes. Background: the project's first Git deployment was promoted to production by the Vercel Git integration (`-f2`, read-only evidence), not by a CLI deploy, so the alias has served a feature-branch build since 16:06.
**Decided by:** Ícaro, per the orchestrator session.
**Affects:** BMI-003, BMI-073, Q-005 (the URL stays out of the README until he says), D-013, `team.md` (nobody runs `vercel deploy` from the working tree).

### D-015 — Rewrite the history to the GitHub no-reply address before the flip (2026-11-22)

**Decision**, as relayed by `-aa` from Ícaro's direct answer, closing Q-009: the commits are rewritten to his GitHub no-reply address before the flip. `-5b` does it with a backup, a verification and `--force-with-lease`, and gives PM the old-to-new hash map so the docs can be corrected. The address isn't written in these docs.
**Why:** the author address would be public in every commit once the repo is public.
**Decided by:** Ícaro, per the orchestrator session. Irreversible for the old hashes.
**Executed and verified (2026-11-22, `-5b` and `-aa`):** every commit on the remote now carries only the no-reply address (87 commits; every tree identical to the backup; `main` has the same tree), pushed with the Ignored Build Step in place (the `main` push built nothing, the alias stayed, no `.md` file was served). The old-to-new hash map is in `.local/rewrite-map-old-new.txt` (outside git) and the hashes cited in `docs/product/` were corrected from it. PR #1 was **closed by GitHub during the push** (the branch and `main` had no common history for a few seconds) and the API can't reopen it, so a new PR replaces it. Residual risk, low: the pre-rewrite commits may stay reachable by their full hash on GitHub until it garbage-collects them. PM checked that `refs/pull/1/head` now points at the new head (`32c4e77`) and that no remote ref holds an old hash. Ícaro accepted this residual risk (D-021).
**Affects:** every commit hash cited in `docs/product/` and `docs/marketing/`, PR #1 (force-push, checks rerun), BMI-050. Two things to settle before pushing: `main` holds 5 of the commits and has no app in it, so pushing a rewritten `main` makes the Vercel Git integration build a production deployment from an app-less tree while the site is meant to stay up; and the repo's `user.email` must be the no-reply address first, or the next commit exposes the old one. `-5b` and `-f2` settle the first with Ícaro's go (one option is turning off deployment creation on the project while `main` is pushed, then back on).

### D-014 — The three `.claude/` skills may be published (2026-11-22)

**Decision**, as relayed by the orchestrator session (`-aa`) from Ícaro's direct answer ("posso publicar"): `brandkit`, `design-taste-frontend` and `no-ai-slop` stay in the repo and go public with it. Nothing is removed from the history. Closes Q-008.
**Why:** it was the one open item that blocked the flip. The exact origin of the three skills is still not documented: their `SKILL.md` files state no author, source or license, and the claim that they can be published is Ícaro's own. The PM recorded that, and did not verify it.
**Decided by:** Ícaro, per the orchestrator session. Irreversible in practice once the repo is public: the history stays public unless it is rewritten.
**Affects:** BMI-050 (the skills item, Q-008, is closed and the flip no longer waits on it; the flip still waits on Q-009, the author address), D-008. Note: this entry originally shared the label Q-008 with the author-address question; that one is now Q-009, and IDs are not reused.

### D-013 — Go public: yes, with CodeRabbit before the merge (2026-11-22)

**Decision**, as relayed by the orchestrator session (`-aa`) from Ícaro's direct answers to it (PM did not hear them directly): the go-public of BMI-050 is a **yes**. He wants CodeRabbit to review PR #1 before it's merged, and the free CodeRabbit only works on public repos, so the order of BMI-050 changes to: pre-flip checklist, flip, protections, CodeRabbit app installed (Ícaro's action), PR #1 out of draft (CodeRabbit ignores drafts), CodeRabbit's corrections, merge. The merge is authorized by him only after those corrections and with green checks. The flip itself happens only when `-aa` gives `-5b` the go, and Q-008 (origin and license of three skills) was open when this was recorded; D-014 closed it.
**Why:** a second reviewer on the largest PR before it lands on `main`. It reorders the checklist and cuts nothing.
**Decided by:** Ícaro, per the orchestrator session.
**Affects:** BMI-050 (checklist rewritten; the order is superseded by D-017), PR #1, D-005 (merging to `main` triggers the first production deploy once BMI-003 is done), BMI-003. Executed by `-5b` (git and GitHub), Ícaro (installing the CodeRabbit app), `-f5` (CodeRabbit session).

### D-012 — Create the Vercel project and deploy (2026-11-22)

**Decision**, as relayed by `-aa` from Ícaro ("Faça"): BMI-003 goes ahead, `Ready`. The project is created, linked to the GitHub repo through Vercel's Git integration and deployed, by `-f2` with the Vercel actions Ícaro authorized. If linking to GitHub needs the Vercel app authorized in the browser, `-f2` tells `-aa`.
**Why:** it unblocks the hosted URL (Q-005), the preview deployments on PRs and BMI-073.
**Decided by:** Ícaro, per the orchestrator session.
**Affects:** BMI-003, BMI-073, Q-005, D-005. A denied Vercel or GitHub action is recorded and reported; nobody works around it with another credential.

### D-011 — Apply the GitHub repository settings (2026-11-22)

**Decision**, as relayed by `-aa` from Ícaro ("Faça"): the GitHub settings of BMI-070 are applied: labels, squash-only merges, delete branch on merge, suggest updating PR branches. `-5b` executes them. Saved replies are a per-user GitHub setting, not a repository one, so they stay Ícaro's to add by hand.
**Why:** they keep the history linear and the PR flow tidy before the repo is public.
**Decided by:** Ícaro, per the orchestrator session.
**Affects:** BMI-070.

### D-010 — Privacy wording and tagline say "image files" and match the URL proxy exception (2026-11-22)

**Decision**, as relayed by the orchestrator session (`-aa`) from Ícaro's direct answer to it ("ajustar tudo", PM did not hear it directly): the README and the `index.html` meta description say "Image files you open, drop or paste never leave your device." The `en` tagline changes to the same idea (for example "…Image files never leave your device."), and the `pt-BR` tagline is made consistent with the URL proxy exception. Translation files may be edited for this, through the ui lane. The final `pt-BR` wording is proposed by the PM and the worker and shown to Ícaro before the merge, since he corrected `pt-BR` strings before (`fbf8779`).
**Why:** "Images you open, drop or paste never leave your device" is ambiguous because opening a link goes through the proxy; the `en` tagline ("It never leaves your device") and the `pt-BR` one ("Ela nunca sai do seu navegador") state no exception at all.
**Decided by:** Ícaro, per the orchestrator session. Reversible. He then read and approved the committed `pt-BR` tagline (`ccef665`) as it is, "Desfoque a imagem inteira ou como quiser. Os arquivos de imagem nunca saem do seu navegador.", and said not to switch to "Seus arquivos…" (relayed by `-aa`, 2026-11-22).
**Affects:** BMI-051 (criteria reopened), BMI-003 (meta tags and OG image use the final wording), `src/i18n/messages/en.json` and `pt-BR.json` line 4, `README.md` line 3, `index.html` line 6. Settles the "en vs pt-BR tagline" question that had been open since `fbf8779`.

### D-009 — Bundle budgets set to 45 kB initial and 195 kB total (2026-11-22)

**Decision**, as relayed by the orchestrator session (`-aa`) from Ícaro's direct answer to it (PM did not hear it directly): Ícaro accepts the `size-limit` budgets of 45 kB initial JavaScript and 195 kB for all JavaScript except the WebP encoder (brotli), replacing 35 kB and 180 kB. Closes Q-007.
**Why:** Vue (~26 kB) and vue-i18n's runtime (~16 kB) alone exceed 35 kB, so the old figure, measured before i18n existed, can't be met. The limits sit just above the measured 43.21 and 192.22 kB, so any growth is a visible decision. No feature is dropped. The README states no size figure; the budget came from the D-004 package.
**Decided by:** Ícaro, per the orchestrator session. Reversible.
**Affects:** BMI-061 (criterion rewritten to the new numbers), `docs/quality.md`, D-006 (which aimed at 35 kB).

### D-008 — `CLAUDE.md` and `.claude/` stay in the repo (2026-11-22)

**Decision**, as relayed by the orchestrator session (`-aa`) from Ícaro's direct answer to it (PM did not hear it directly): `CLAUDE.md` and `.claude/` stay in the repository. The `.gitignore` edit that ignored both is reverted by the git owner. This settles D-004 item 3.
**Why:** it was the mandatory "decide before going public" item; Ícaro chose to keep them. A minute earlier he had told the CodeRabbit session `-f5` it could remove them, then made keeping them his final answer.
**Decided by:** Ícaro, per the orchestrator session. Reversible while the repo is private. Once it is public, anything already in the history stays there unless the history is rewritten.
**Affects:** BMI-050 (checklist item closed), `.gitignore`. Licensing and provenance of the skills under `.claude/` (brandkit, design-taste-frontend, no-ai-slop) was the reason the item existed; this decision doesn't answer that, so BMI-052's audit record still lists it.

### D-007 — Code of conduct contact is set (2026-11-22)

**Decision**, as relayed by the orchestrator session (`-aa`) from Ícaro's direct answer to it: the `CODE_OF_CONDUCT.md` contact is the email address Ícaro named, replacing `<CONDUCT_CONTACT>`. The edit was made at 15:01 on his request through the `-f5` session; the git owner commits it. Closes Q-003. The address is deliberately not written in these docs.
**Why:** the placeholder blocked BMI-050. `SECURITY.md` needs no address (GitHub private vulnerability reporting).
**Decided by:** Ícaro, per the orchestrator session.
**Affects:** BMI-050 (placeholder line removed from the checklist), BMI-072 (note updated), BMI-052 (the "no email in the repo" check now has this one intended exception, the conduct contact).

### D-006 — Precompile the i18n messages to meet the size budget (2026-11-22)

**Decision**, as reported by the frontend session (`implementar-v1-editor-pixi`) and passed on by the git-owner session (neither PM nor git owner heard it directly): vue-i18n messages are precompiled at build time instead of compiled in the browser, to bring the initial JavaScript under the 35 kB budget. The frontend session implements it.
**Why:** `pnpm size` fails at 43.21 kB brotli against 35 kB, and the message compiler that ships with the runtime build is the largest piece Ícaro can remove without dropping a feature.
**Decided by:** Ícaro, per the frontend session, which asked him.
**Affects:** BMI-061, BMI-040 (follow-up), BMI-002 (CI waits for `pnpm size` to pass).

### D-005 — Production deploys on every merge to `main` (2026-11-22)

**Decision:** production deploys automatically when a PR is squash-merged to `main`, through Vercel's Git integration. Release tags (release-please, BMI-071) only version and changelog; they don't gate deploys.
**Why:** one maintainer, squash-only merges and CI that must pass before merge make `main` always releasable. Gating on tags adds a manual step with no review benefit. The security report also wants deploys through the Git integration, so no deploy token sits in GitHub.
**Decided by:** PM, from the community report's recommendation, resolving the former Q-004. Reversible; Ícaro can overrule.
**Affects:** BMI-003, BMI-071.

### D-004 — Quality, security and community standards package (2026-11-22)

**Decision**, as relayed by the git-owner session from `.local/standards/decisions.md` (Ícaro's answers; PM has not heard them directly, confirmation requested):
1. The proxy stays `GET /api/image?url=…`. No switch to POST. The README privacy text becomes honest: our code logs nothing, but Vercel's runtime log keeps the request path including the image URL, client IP and user agent for 1 hour on Hobby.
2. Single-key shortcuts (`B`, `E`, `[`, `]`) work only while the image canvas has focus (WCAG 2.1.4). `Ctrl/Cmd` shortcuts stay global. The README says so.
3. `CLAUDE.md` and `.claude/`: no change now. Deciding is a mandatory item on the go-public checklist. *Settled by D-008: they stay.*
4. The rest of the three reports is approved: community files, quality bar, CI, security headers and CSP, supply-chain settings, proxy fixes, privacy tests. Response targets: 7 days for issues and conduct reports, 7 days to acknowledge security reports.
5. License stays MIT. v1 scope is the full README; nothing is cut without Ícaro's direct yes.

**Why:** hardening and standards before the repo goes public, without changing the product's three-step scope.
**Decided by:** Ícaro, per the git-owner session.
**Affects:** backlog epic E7 (BMI-060 to BMI-073), BMI-002 (expanded), BMI-050 (go-public checklist), README shortcuts and privacy text. Item 2 changes a behavior the README currently describes as global: the README is updated in BMI-069.

### D-003 — i18n sequencing after the editor was built first (2026-11-22)

**Decision:** the editor UI was committed (`43525ae`) before i18n existed, with English strings hard-coded. Ícaro agreed to build i18n now over the existing UI: BMI-040 to BMI-044 in one pass, then every later story ships its `pt-BR` strings from the start.
**Why:** the committed UI is small enough to translate in one change, and the parity test (BMI-040) stops it from regressing.
**Decided by:** Ícaro ("ok prossiga, estou de acordo").
**Affects:** BMI-040 to BMI-044. Not answered by this decision: whether other sessions must pause adding UI strings meanwhile.

### D-002 — vue-i18n for internationalization (2026-11-22)

**Decision:** use vue-i18n v11 in Composition API mode, `en` bundled as fallback, other locales lazy-loaded, typed keys from `en.json`.
**Why:** it's the official Intlify library for Vue 3 and actively maintained (11.4.23 published 2026-11-19). It covers plurals, number formatting and lazy loading, so nothing is written from scratch. No i18n library was in the project yet.
**Decided by:** PM, under the engineering principles in CLAUDE.md (mature library first). Reversible until BMI-040 is merged.
**Affects:** BMI-040 to BMI-044, [specs/i18n.md](specs/i18n.md).

### D-001 — i18n in v1 with English and Brazilian Portuguese (2026-11-22)

**Decision:** v1 ships in `en` and `pt-BR`. The i18n structure is built before any further UI work, and from then on every UI story includes the `pt-BR` strings.
**Why:** adding languages after the UI grows means a refactor across every component. Today there are a dozen strings.
**Decided by:** Ícaro.
**Affects:** README (Languages section), backlog epic E5, Definition of Done.

### D-000 — Earlier decisions, recorded for reference (2026-11-22)

Made before this log existed. Details live in the linked docs.

- **MIT license kept.** Decided by Ícaro.
- **Repo stays private until a pre-release audit** (BMI-050). Marketing doesn't say "open source" until it's public.
- **Hosting on Vercel Hobby, Docker image as the tested exit path.** [docs/hosting.md](../hosting.md).
- **PixiJS 8 + pixi-filters over Canvas 2D `ctx.filter`.** Canvas filters only do gaussian and don't work on iOS Safari. [README, Tech stack](../../README.md#tech-stack).
- **Operations, not pixels:** original image + ordered operation list, undo as a pointer. [README, How it works](../../README.md#how-it-works).
- **One session owns git.** Other sessions hand it file lists and commit messages.
