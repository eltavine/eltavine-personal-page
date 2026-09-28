# Eltavine Personal Page

An Astro single-page site designed as an engineer's hand-drawn notebook: editorial type, monospace readouts, and fine grid lines, warmed up by crayon marks, stamps, tape, a postcard, and sketches that actually run. Every section is static HTML; JavaScript only layers interaction and motion on top.

## Commands

```sh
pnpm install
pnpm dev               # local dev server
pnpm build             # static build into dist/
pnpm preview           # serve dist/
pnpm check             # astro check (strict TypeScript) + Pages Function types
pnpm test              # Vitest unit tests
pnpm test:e2e          # Playwright across 1440 / 834 / 390 / 320 px (runs against `pnpm preview`)
pnpm format            # Prettier (with prettier-plugin-astro)
pnpm snapshot:github   # refresh src/content/snapshots/github.json (set GITHUB_TOKEN for star history; Node 22.18+)
pnpm verify            # everything CI runs, in order
```

Locally, Playwright drives the installed Microsoft Edge; set `PW_CHANNEL=chrome` or run `pnpm exec playwright install chromium` to use something else. CI always uses Playwright's Chromium.

## How the code is organised

```
src/
  content.config.ts      Collections and their Zod schemas (projects, stack, stackGroups, about, repos)
  content/               The words: one YAML per project, stack registry and groups, about.mdx, GitHub snapshot
  content/loaders/       Custom content loader that pulls GitHub stats (Octokit) with a snapshot fallback
  config/site.ts         Typed singletons: profile, contact, navigation, section copy, footer
  lib/                   Pure, framework-free, unit-tested logic (no DOM, no Astro)
    rough.ts             The only module that imports roughjs
    diagram.ts           One renderer for every drawing: sketches, wireframes, doodles, charts, seals
    marks.ts             Crayon marks (underline, circle, highlight, strike, caret, …)
    randomart.ts         OpenSSH's drunken-bishop walk (tested against an OpenSSH vector)
    github.ts            Stats + star-history sampling, snapshot merge
    star-chart.ts, seal.ts, ascii-card.ts, format.ts, hand-notes.ts, events.ts
  ui/                    Design-system primitives: CrayonMark, Diagram, Marked, SectionHead, Stamp, Tape, Icon, …
  features/<name>/       One folder per feature: Component.astro + feature.css + *.element.ts + motion.ts
  motion/                gsap.ts (the only GSAP import) and the runtime that loads feature motion on demand
  styles/                tokens, base, paper surfaces, motion overrides; cascade order set once in Layout
  pages/                 index, 404, and build-time artifacts: og.png, favicon.svg, apple-touch-icon.png, card.txt
functions/index.ts       Cloudflare Pages Function: `curl eltavine.com` gets the ASCII postcard
tests/unit, tests/e2e    Vitest and Playwright
```

Conventions that keep features decoupled:

- **Custom elements** carry all client behaviour. Any `src/features/*/*.element.ts` is registered automatically by `src/scripts/elements.ts`; nothing needs wiring.
- **Motion modules** are opt-in by markup: an element with `data-motion="name"` makes the runtime lazy-load `src/features/name/motion.ts` after first paint. Modules receive GSAP through their context instead of importing it, run in their own `gsap.context`, and yield to the main thread between each other.
- **Features talk through DOM events** declared in `src/lib/events.ts` (for example, a working rule asks a sketch to play with `eltavine:sketch-play`).
- **CSS layers** (`tokens, base, ui, features, overrides`) are declared in the first inline `<style>` of the layout, so bundle order can never flip them. Feature CSS lives next to its component and wraps itself in `@layer features`.

## Adding things

- **A project:** add `src/content/projects/<id>.yaml` (the schema in `content.config.ts` lists every field; `stack` entries must exist in the stack registry). Optionally add `sketch`, `wireframe` (files in `src/features/sketches/diagrams/`), a `doodle` key, a `paper` (`plain`, `checklist`, `drafting`, `tracing`, `tractor`), and `github: owner/name` for build-time stats.
- **A stack item or group:** `src/content/stack/items.yaml` and `groups.yaml`. Icons are Iconify names; keep them monochrome (`simple-icons:*` or `lucide:*`) so tiles take their color from the crayon palette.
- **A drawing:** a new file in `src/features/sketches/diagrams/` exporting a `Diagram`; items can carry `step`, `role`, and `group` for live-sketch scenarios.
- **A feature:** a folder under `src/features/`, rendered from `src/pages/index.astro`. Add `*.element.ts` for behaviour and `motion.ts` plus `data-motion` for animation.
- **Your own handwriting:** make a font from your handwriting (for example with Calligraphr), then replace the Caveat entry in `astro.config.mjs` with `fontProviders.local()` pointing at the file, keeping `cssVariable: "--font-hand"`.

## GitHub numbers

Star and fork counts and the star-history chart are fetched at build time by the `repos` content loader and written into the HTML, so a visitor never waits on (or is rate-limited by) GitHub. The loader falls back to `src/content/snapshots/github.json` when the API is unreachable, and `GITHUB_OFFLINE=1` skips the network entirely. Listing stargazers needs a token: without `GITHUB_TOKEN` only counts refresh and the committed history is carried forward. In the browser, `repo-stats` may refresh the counts from the public API at most every six hours and stays silent if that fails.

## Performance notes

- Fonts are subset to the glyphs the copy uses. Fraunces ships in two tiers: first paint uses a cut with the SOFT axis pinned (about half the size) and preloaded; the full four-axis cut is fetched after the first interaction (or five idle seconds) and swapped in. That swap is what enables the hover "ink bleed" and the settling headline. Visitors with Save-Data or reduced motion never download it.
- The hero sticker (the LCP element) is preloaded in `<head>`; the headline is painted from the first frame and only its font axis animates.
- Sections deliberately do not use `content-visibility: auto`: it broke full-page screenshots and printing, and made Safari (no scroll anchoring) jump when scrolling back up. The motion runtime refreshes ScrollTrigger whenever the page size changes.
- Non-critical work (GSAP, live stats) starts only after `load` and the first contentful paint.
- Hashed assets are cached immutably via `public/_headers`.

With `prefers-reduced-motion: reduce`, the motion chunk is never requested and every section renders in its final state. If motion has not started within 4 seconds, everything is shown without animation. Without JavaScript all content stays readable; the email stays hidden because only script assembles it.

## Deployment

Cloudflare Pages builds this project from the linked GitHub repository:

- Framework preset: `Astro`, build command `pnpm build`, output directory `dist`
- Node version comes from `.node-version` (24); remove any older `NODE_VERSION` override in the Pages settings
- Environment variables: `GITHUB_TOKEN` (a fine-grained token with public read access) for star history; optional `SITE_URL` (defaults to `https://eltavine.com`)
- The `functions/` directory is picked up automatically; only `/` is routed through the Function

To keep counts fresh without commits, create a deploy hook in Cloudflare Pages and store it as the `CLOUDFLARE_DEPLOY_HOOK` repository secret; `.github/workflows/refresh-stats.yml` triggers it daily. CI (`.github/workflows/ci.yml`) runs `pnpm verify`'s steps on every push and pull request, and Dependabot proposes grouped dependency updates weekly. Dependencies are pinned exactly (`saveExact`), pnpm is pinned via `packageManager`, and pnpm's minimum release age guards against freshly published packages.
