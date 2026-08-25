/**
 * Build-time prerenderer.
 * Renders every route to static HTML so crawlers (and social unfurlers that
 * don't run JS) get full content + per-route meta. Users still get the SPA.
 *
 * Also emits sitemap.xml and robots.txt from the tool registry — the single
 * source of truth for routes and descriptions.
 */
import { mkdir, writeFile, readFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { render, tools } from "../.prerender/entry.js"

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const SITE = "https://theswissknife.com"

// registry paths/descriptions come from the compiled prerender bundle
// (entry.tsx re-exports them alongside render)

const template = await readFile(join(ROOT, "dist/index.html"), "utf8")

/** Inject per-route meta into the index.html template head */
function withMeta(html, body, { title, description, path }){
  let out = html.replace("<div id=\"root\"></div>", `<div id="root">${body}</div>`)
  out = out.replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
  out = out.replace(/(<meta name="description" content=").*?(" \/>)/, `$1${description}$2`)
  out = out.replace(/(<meta property="og:title" content=").*?(" \/>)/, `$1${title}$2`)
  out = out.replace(/(<meta property="og:description" content=").*?(" \/>)/, `$1${description}$2`)
  out = out.replace(/(<meta property="og:url" content=").*?(" \/>)/, `$1${SITE}${path}$2`)
  out = out.replace(/(<link rel="canonical" href=").*?(" \/>)/, `$1${SITE}${path}$2`)
  return out
}

async function writeRoute(path, body, meta){
  const html = withMeta(template, body, meta)
  // "/" -> dist/index.html, "/json/formatter" -> dist/json/formatter/index.html
  const file = path === "/" ? "index.html" : join(path.replace(/^\//,""), "index.html")
  const target = join(ROOT, "dist", file)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, html)
  console.log("  ✓", path)
}

console.log("prerendering routes…")
const routes = [
  { path:"/", title:"The Swiss Knife — One toolbox. Every utility you need.",
    description:"47 fast, private, browser-based developer tools for JSON, regex, jq, JWT, dates, encoding, hashing, images, PDFs and more. No uploads, no signup — everything runs locally." },
  ...tools.map(t=>({
    path: t.path,
    title: `The Swiss Knife — ${t.name}`,
    description: `${t.description}. Free, runs entirely in your browser — no uploads, no signup.`,
  })),
]

for (const r of routes){
  const body = await render(r.path)
  await writeRoute(r.path, body, r)
}

// sitemap.xml
const today = new Date().toISOString().slice(0,10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(r=>`  <url><loc>${SITE}${r.path}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${r.path==="/"?"1.0":"0.8"}</priority></url>`).join("\n")}
</urlset>
`
await writeFile(join(ROOT,"dist","sitemap.xml"), sitemap)

// robots.txt
await writeFile(join(ROOT,"dist","robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`)

console.log(`prerendered ${routes.length} routes + sitemap.xml + robots.txt`)
