import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import Formatter from "./Formatter"

describe("JSON Formatter",()=>{
  it("formats json on click", async ()=>{
    const user=userEvent.setup()
    render(<MemoryRouter><Formatter /></MemoryRouter>)
    await user.click(screen.getByText("Format"))
    expect(document.body.textContent).toContain('"users"')
  })
  it("shows error on invalid json", async ()=>{
    const user=userEvent.setup()
    render(<MemoryRouter><Formatter /></MemoryRouter>)
    const textarea=document.querySelector("textarea") as HTMLTextAreaElement
    fireEvent.change(textarea,{target:{value:'{invalid}'}})
    await user.click(screen.getByText("Format"))
    expect(document.body.textContent).toMatch(/Unexpected|Expected/)
  })
  it("minifies", async ()=>{
    const user=userEvent.setup()
    render(<MemoryRouter><Formatter /></MemoryRouter>)
    await user.click(screen.getByText("Minify"))
    expect(document.body.textContent).toContain('"users"')
  })
  it("clear button", async ()=>{
    const user=userEvent.setup()
    render(<MemoryRouter><Formatter /></MemoryRouter>)
    await user.click(screen.getByText("Clear"))
    const ta=document.querySelector("textarea") as HTMLTextAreaElement
    expect(ta.value).toBe("")
  })
})
