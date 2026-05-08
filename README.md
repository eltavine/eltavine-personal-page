# Eltavine Personal Page

An Astro single-page personal site for Eltavine. The page is intentionally static, editorial, and light on client JavaScript.

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
