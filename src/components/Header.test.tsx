import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { Header } from "./Header"

describe("Header",()=>{
  it("renders logo and search button",()=>{
    render(<MemoryRouter><Header onMenu={()=>{}} /></MemoryRouter>)
    expect(screen.getByText("The Swiss Knife")).toBeInTheDocument()
    expect(screen.getByText(/Search tools/)).toBeInTheDocument()
  })
  it("opens command palette on click", async ()=>{
    render(<MemoryRouter><Header onMenu={()=>{}} /></MemoryRouter>)
    fireEvent.click(screen.getByText(/Search tools/))
    expect(screen.getByPlaceholderText(/Search tools/)).toBeInTheDocument()
  })
  it("calls onMenu on mobile button",()=>{
    const fn=vi.fn()
    render(<MemoryRouter><Header onMenu={fn} /></MemoryRouter>)
    const btns=document.querySelectorAll("button")
    // first button is menu
    fireEvent.click(btns[0])
    expect(fn).toHaveBeenCalled()
  })
})
