import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import userEvent from "@testing-library/user-event"
import { ToolLayout, CopyButton, TextArea, ErrorPanel } from "./ToolLayout"
import { PrivacyBadge } from "./PrivacyBadge"

describe("PrivacyBadge",()=>{
  it("renders local processing",()=>{
    render(<PrivacyBadge clientSide />)
    expect(screen.getByText(/Processed locally/)).toBeInTheDocument()
  })
  it("renders server badge",()=>{
    render(<PrivacyBadge clientSide={false} />)
    expect(screen.getByText(/Server processing/)).toBeInTheDocument()
  })
})

describe("ToolLayout",()=>{
  it("renders title and description",()=>{
    render(<MemoryRouter><ToolLayout title="Test Tool" description="Does stuff"><div>child</div></ToolLayout></MemoryRouter>)
    expect(screen.getByText("Test Tool")).toBeInTheDocument()
    expect(screen.getByText("Does stuff")).toBeInTheDocument()
    expect(screen.getByText("child")).toBeInTheDocument()
  })
  it("shows about collapsible",()=>{
    render(<MemoryRouter><ToolLayout title="T" description="d"><div>x</div></ToolLayout></MemoryRouter>)
    expect(screen.getByText("About this tool")).toBeInTheDocument()
  })
})

describe("CopyButton",()=>{
  it("copies and shows Copied!", async ()=>{
    const user=userEvent.setup()
    // ensure clipboard mock
    vi.stubGlobal("navigator",{ clipBoard: undefined } as any)
    Object.assign(navigator,{clipboard:{writeText: vi.fn().mockResolvedValue(undefined)}})
    render(<CopyButton text="hello" />)
    const btn=screen.getByRole("button")
    await user.click(btn)
    expect(await screen.findByText("Copied")).toBeInTheDocument()
  })
})

describe("TextArea",()=>{
  it("renders and changes", async ()=>{
    const onChange=vi.fn()
    render(<TextArea value="hi" onChange={onChange} placeholder="Enter" />)
    const ta=screen.getByPlaceholderText("Enter") as HTMLTextAreaElement
    expect(ta.value).toBe("hi")
    // use fireEvent for change
    const { fireEvent } = await import("@testing-library/react")
    fireEvent.change(ta,{target:{value:"world"}})
    expect(onChange).toHaveBeenCalled()
  })
  it("has mono class by default",()=>{
    render(<TextArea value="" onChange={()=>{}} />)
    expect(document.querySelector("textarea")?.className).toContain("font-mono")
  })
})

describe("ErrorPanel",()=>{
  it("shows error",()=>{
    render(<ErrorPanel error="Invalid JSON" />)
    expect(screen.getByText("Invalid JSON")).toBeInTheDocument()
  })
  it("hides when empty",()=>{
    const {container}=render(<ErrorPanel error="" />)
    expect(container.innerHTML).toBe("")
  })
})
