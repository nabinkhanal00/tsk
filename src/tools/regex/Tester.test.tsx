import { describe, it, expect } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import Tester from "./Tester"

describe("Regex Tester",()=>{
  it("shows matches", async ()=>{
    render(<MemoryRouter><Tester /></MemoryRouter>)
    // should show at least 1 match (default has 2 emails)
    expect(screen.getByText(/match/)).toBeInTheDocument()
    expect(screen.getByText(/Match 1/)).toBeInTheDocument()
  })
  it("handles invalid regex", async ()=>{
    render(<MemoryRouter><Tester /></MemoryRouter>)
    const input=screen.getByPlaceholderText("Enter regex") as HTMLInputElement
    fireEvent.change(input,{target:{value:"["}})
    expect(document.body.textContent).toMatch(/Invalid regular expression|invalid/i)
  })
  it("replace mode", async ()=>{
    const user=userEvent.setup()
    render(<MemoryRouter><Tester /></MemoryRouter>)
    const cb=screen.getByLabelText(/Replace mode/) as HTMLInputElement
    await user.click(cb)
    expect(screen.getByPlaceholderText("Replacement…")).toBeInTheDocument()
  })
})
