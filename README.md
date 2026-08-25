# The Swiss Knife

> **One toolbox. Every utility you need.**
> Fast, private, browser-based utilities for JSON, regex, dates, encoding, images, PDFs, data, and more.
> Production: **https://theswissknife.com**

## Overview
The Swiss Knife is a privacy-first, client-side web toolbox for developers, data engineers and everyday digital work. Inspired by jq playground, regex101, CyberChef, and Unix toolbox — unified into a single cohesive platform with consistent interaction patterns, keyboard shortcuts, navigation, and privacy model.

**Principles:** Client-side first, no data leaves the browser unless explicitly required. All core tools are offline-capable via PWA.

## Architecture
```
src/
  app/
  components/   # Header, Sidebar, ToolLayout, PrivacyBadge
  tools/        # json/, jq/, regex/, datetime/, encoding/, crypto/, image/, pdf/, text/, data/, etc.
  lib/registry.tsx  # central tool registry (single source of truth)
  hooks/        # useTheme, useLocal (favorites/recent)
  pages/Home.tsx
  styles/globals.css
```

**Tool Registry** powers homepage, categories, search (⌘K), navigation, SEO, sitemap. Every tool exposes `ToolDefinition` with id, name, category, keywords, path, component, clientSide.

Shared components: `ToolLayout`, `PrivacyBadge`, `CopyButton`, `DownloadButton`, `FileDropZone`, `ErrorPanel`, `OutputPanel`.

## Tech Stack
- React 19 + TypeScript (strict)
- Vite 6 + vite-plugin-pwa (Workbox)
- Tailwind CSS 3 + shadcn patterns
- React Router 7 (code-split lazy per tool)
- Libraries: pdf-lib, js-yaml, papaparse, sql-formatter, qrcode
- Web APIs: Web Crypto, Clipboard, File, Canvas, Intl

## Tools Implemented (35)
JSON Formatter/Viewer/Diff, jq Playground (subset supporting `., .key, .[]`, `map(select(...))`), Regex Tester/Builder, Timestamp/TimeZone/Cron/Date Difference, Base64/URL/HTML Encode, JWT Decoder, Hash Generator (SHA-*), UUID/ULID/NanoID, Password/Lorem, QR, Color Tools (contrast WCAG), Text Tools & Diff, CSV & JSON↔CSV, YAML↔JSON, SQL Formatter, Markdown Preview, Image Converter/Compressor/Base64, PDF Merge/Split, URL Parser, CIDR Calculator, HTTP Reference.

All tools display 🔒 Local processing badge and run offline after first load.

## Development
```bash
npm install
npm run dev          # vite dev server http://localhost:5173
npm run build        # tsc -b && vite build
npm run preview
npm test             # vitest run
npm run typecheck    # tsc --noEmit
```

Environment:
```
VITE_APP_NAME=The Swiss Knife
VITE_APP_URL=https://theswissknife.com
VITE_GITHUB_URL=https://github.com/...
```

## Adding a New Tool
1. Create `src/tools/<category>/<Name>.tsx` default export using `ToolLayout`
2. Add entry to `src/lib/registry.tsx` (no duplication elsewhere) — include keywords, category, path, `React.lazy(() => import(...))`
3. Add `related` tools for discovery
4. Include empty state, error handling, examples, Copy/Download, PrivacyBadge
5. Add unit tests for pure logic, run `npm run build` + `npm test`

## Privacy Model
- 🔒 Local processing for all current tools (no uploads)
- localStorage only for favorites/recent (no server)
- `Clear local data` available via recent clear
- No tool input sent to analytics

## PWA & Offline
- manifest + service worker (Workbox) precaches static + tool chunks
- Offline indicator, navigation and loaded tools work offline
- Do not cache sensitive user data

## Testing
- Unit: `src/lib/utils.test.ts` covers JSON, Base64, regex, CIDR, JWT (vitest)
- Component & E2E: recommended Playwright flows documented in spec (JSON format, regex, timestamp, image convert, PDF merge)
- Accessibility: keyboard nav (Tab/Arrows/Enter/Esc), ARIA, focus states, contrast 4.5:1

## Deployment

**Vercel (recommended)** — `vercel.json` is preconfigured (cleanUrls, SPA fallback, immutable asset caching, security headers):

```bash
npm i -g vercel
vercel --prod
```

Then attach the domain `theswissknife.com` in the Vercel dashboard (A/CNAME records) and submit `https://theswissknife.com/sitemap.xml` to Google Search Console.

**Any static host** (Cloudflare Pages / Nginx / CDN):
```bash
npm run build
# deploy dist/
```
SPA fallback to `index.html` for unknown routes (client-side 404).

### SEO architecture

- **Build-time prerendering (SSG)**: `npm run build` renders all 48 routes (home + 47 tools) to static HTML with per-route `<title>`, meta description, canonical, Open Graph and Twitter tags — crawlers and social unfurlers get full content with zero runtime server. Users get the SPA as before.
- **Single source of truth**: routes/titles/descriptions derive from `src/lib/registry.tsx`; `scripts/prerender.mjs` emits the pages, `sitemap.xml` and `robots.txt`.
- **JSON-LD**: each tool page embeds `WebApplication` schema (free, browser-based) for rich results.
- **OG image**: `public/og-image.png` (1200×630).
- All processing still happens client-side at runtime — SEO affects only the initial HTML shell.

## CI
```yaml
# .github/workflows/ci.yml
install → lint → typecheck → unit tests → build → e2e
```
Fails on any step.

## Quality Gate
- [x] builds, typecheck passes, tests pass
- [x] responsive 320→1920, dark mode, offline, search ⌘K, favorites/recent, clipboard, file upload
- [x] error handling without stack traces, empty states, lazy-loaded chunks
- [x] no placeholder pages, no fake buttons

Built for developers. Designed for speed. Your data stays yours.
