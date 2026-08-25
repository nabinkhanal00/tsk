import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import Base64 from "./Base64"

beforeEach(()=>{ Object.assign(navigator,{clipboard:{writeText: vi.fn().mockResolvedValue(undefined)}}) })

describe("Base64 tool",()=>{
  it("encodes", async ()=>{
    render(<MemoryRouter><Base64 /></MemoryRouter>)
    expect(document.body.textContent).toContain("SGVsbG8")
  })
  it("switches to decode", async ()=>{
    const user=userEvent.setup()
    render(<MemoryRouter><Base64 /></MemoryRouter>)
    await user.click(screen.getByText("Decode"))
    const ta=document.querySelector("textarea") as HTMLTextAreaElement
    fireEvent.change(ta,{target:{value:btoa("hello")}})
    expect(document.body.textContent).toContain("hello")
  })
})
