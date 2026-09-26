# Eltavine Personal Page

An Astro single-page personal site for Eltavine, designed as an engineer's hand-drawn notebook: precise editorial typography, monospace readouts, and fine grid lines, warmed up by a few crayon marks, sparkles, stickers, stamps, and tape. Every section is static HTML; JavaScript only layers interaction and motion on top.

## Client JavaScript

- A small UI script (about 4 KB gzip) always loads. It handles the theme toggle, hiding the header on scroll, active-section highlighting, the email reveal, GitHub star and fork counts, the stack cross-reference highlight, copying the PGP fingerprint, and the pencil lens on the footer wordmark.
- GSAP motion (about 54 KB gzip, with ScrollTrigger, SplitText, DrawSVG, and ScrambleText) is a separate chunk. It is imported after the `load` event once the browser is idle, so it never blocks the first render.
- With `prefers-reduced-motion: reduce`, the motion chunk is never requested and every section renders in its final state.
- If the motion chunk fails to load or has not started within 4 seconds, all content is shown without animation.
- Without JavaScript, all content stays readable: the theme follows the system setting, the header keeps a static background, GitHub counts and the copy button are hidden, the stack legend is shown but not clickable, and the email address stays hidden because only the UI script assembles it.

Fonts (Fraunces, Geist, Geist Mono, Caveat) are downloaded at build time through the Astro Fonts API and served from the site itself, and the hand-drawn marks are generated at build time with Rough.js. The only third-party requests at runtime are GitHub repository stats and the lazily loaded Star History charts.

## Commands

```sh
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## Deployment

Cloudflare Pages can build this project from the linked GitHub repository with:

- Framework preset: `Astro`
- Production branch: `main`
- Build command: `pnpm build`
- Build output directory: `dist`
- Root directory: leave blank when the project is at the repository root
- Environment variable: `NODE_VERSION=22.16.0` if the project is not already using the v3 build image
- Optional environment variable: `SITE_URL=https://eltavine.com`

All public asset paths are root-relative, so no GitHub Pages base path is needed. The default canonical site URL is `https://eltavine.com`.
