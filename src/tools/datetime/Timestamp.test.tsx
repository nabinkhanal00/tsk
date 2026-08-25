import { describe, it, expect } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import Timestamp from "./Timestamp"

describe("Timestamp Converter",()=>{
  it("shows local and UTC for epoch 0", async ()=>{
    render(<MemoryRouter><Timestamp /></MemoryRouter>)
    const input=document.querySelector('input[placeholder="Enter timestamp"]') as HTMLInputElement
    fireEvent.change(input,{target:{value:"0"}})
    expect(screen.getByText(/Local:/)).toBeInTheDocument()
    expect(screen.getByText(/UTC:/)).toBeInTheDocument()
  })
  it("now button fills timestamp", async ()=>{
    const user=userEvent.setup()
    render(<MemoryRouter><Timestamp /></MemoryRouter>)
    await user.click(screen.getByText("Now"))
    const input=document.querySelector('input[placeholder="Enter timestamp"]') as HTMLInputElement
    expect(input.value.length).toBeGreaterThan(0)
  })
})
