import { describe, it, expect, beforeEach } from "vitest"
import { getFavorites, toggleFavorite, getRecent, pushRecent } from "./useLocal"

beforeEach(()=> localStorage.clear())

describe("local storage helpers",()=>{
  it("favorites toggle",()=>{
    expect(getFavorites()).toEqual([])
    toggleFavorite("json-formatter")
    expect(getFavorites()).toContain("json-formatter")
    toggleFavorite("json-formatter")
    expect(getFavorites()).not.toContain("json-formatter")
  })
  it("recent push and limit 10",()=>{
    for(let i=0;i<15;i++) pushRecent(`tool-${i}`)
    const r=getRecent()
    expect(r.length).toBe(10)
    expect(r[0]).toBe("tool-14")
  })
  it("recent deduplicates",()=>{
    pushRecent("a"); pushRecent("b"); pushRecent("a")
    expect(getRecent()[0]).toBe("a")
    expect(getRecent().filter(x=>x==="a").length).toBe(1)
  })
})
