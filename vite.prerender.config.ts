import { defineConfig } from "vite"

/** Bundles the prerender entry for node — see scripts/prerender.mjs */
export default defineConfig({
  build: {
    ssr: "src/prerender/entry.tsx",
    outDir: ".prerender",
    emptyOutDir: true,
    rollupOptions: { output: { format: "es" } },
    minify: false,
  },
})
