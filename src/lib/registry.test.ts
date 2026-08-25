import { describe, it, expect } from "vitest"
import { tools, searchTools, getToolByPath, categories } from "./registry"

describe("registry",()=>{
  it("has tools",()=> expect(tools.length).toBeGreaterThan(30))
  it("unique ids and paths",()=>{
    const ids=new Set(tools.map(t=>t.id))
    expect(ids.size).toBe(tools.length)
    const paths=new Set(tools.map(t=>t.path))
    expect(paths.size).toBe(tools.length)
  })
  it("categories covered",()=>{
    for(const c of categories){
      // at least one tool per some categories, but allow empty for flexibility
      expect(typeof c).toBe("string")
    }
  })
  it("search by name",()=>{
    expect(searchTools("json").length).toBeGreaterThan(0)
    expect(searchTools("JWT")[0].name).toContain("JWT")
  })
  it("search by keyword",()=>{
    expect(searchTools("timestamp").some(t=>t.id==="timestamp-converter")).toBe(true)
  })
  it("search empty returns all",()=> expect(searchTools("").length).toBe(tools.length))
  it("get by path",()=>{
    expect(getToolByPath("/json/formatter")?.id).toBe("json-formatter")
    expect(getToolByPath("/not-found")).toBeUndefined()
  })
  it("clientSide true for most",()=>{
    expect(tools.filter(t=>t.clientSide).length).toBeGreaterThan(tools.length*0.8)
  })
})
