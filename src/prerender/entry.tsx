import { StrictMode } from "react"
import { MemoryRouter } from "react-router-dom"
import { renderToPipeableStream } from "react-dom/server"
import { Writable } from "node:stream"
import { Shell } from "../App"

/** Renders a route to a complete HTML string. Used by scripts/prerender.mjs at build time. */
export function render(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let html = ""
    const { pipe } = renderToPipeableStream(
      <StrictMode>
        <MemoryRouter initialEntries={[path]}>
          <Shell />
        </MemoryRouter>
      </StrictMode>,
      {
        onAllReady() {
          pipe(new Writable({
            write(chunk, _enc, cb) { html += chunk.toString(); cb() },
            final(cb) { resolve(html); cb() },
            destroy(err) { reject(err) },
          }))
        },
        onError(err) { reject(err) },
      }
    )
  })
}

export { tools } from "../lib/registry"
