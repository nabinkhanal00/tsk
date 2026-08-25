import { describe, it, expect } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { Home } from "./Home"

describe("Home (knife landing)",()=>{
  it("renders the headline",()=>{
    render(<MemoryRouter><Home /></MemoryRouter>)
    const h1 = screen.getByRole("heading",{level:1})
    expect(h1.textContent).toContain("One")
    expect(h1.textContent).toContain("toolbox")
  })
  it("fans out one blade per tool group, each linking to a tool",async()=>{
    render(<MemoryRouter><Home /></MemoryRouter>)
    await waitFor(()=>{
      const blades = screen.getAllByRole("link").filter(a=>a.getAttribute("aria-label")?.startsWith("Open "))
      expect(blades.length).toBe(15)
    })
    const hrefs = screen.getAllByRole("link").map(a=>a.getAttribute("href"))
    expect(hrefs).toContain("/json/formatter")
    expect(hrefs).toContain("/regex/tester")
    expect(hrefs).toContain("/crypto/jwt")
  })
  it("shows the single privacy line",()=>{
    render(<MemoryRouter><Home /></MemoryRouter>)
    expect(screen.getByText(/Nothing is uploaded/)).toBeInTheDocument()
  })
  it("does not render removed sections",()=>{
    render(<MemoryRouter><Home /></MemoryRouter>)
    expect(screen.queryByText("Index")).not.toBeInTheDocument()
    expect(screen.queryByText(/theswissknife — zsh/)).not.toBeInTheDocument()
  })
})
