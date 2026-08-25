import { describe, it, expect } from "vitest"
import { formatJson, minifyJson, validateJson, diffObjects, sortObject } from "./json"

describe("json utils",()=>{
  it("formats with indent",()=>{
    expect(formatJson('{"b":2,"a":1}',2,false)).toBe('{\n  "b": 2,\n  "a": 1\n}')
  })
  it("sorts keys",()=>{
    expect(sortObject({b:2,a:1})).toEqual({a:1,b:2})
    expect(formatJson('{"z":1,"a":2}',2,true)).toContain('"a": 2')
  })
  it("minifies",()=>{
    expect(minifyJson('{"a":1, "b":2}',false)).toBe('{"a":1,"b":2}')
  })
  it("validates success/failure",()=>{
    expect(validateJson('{"a":1}').valid).toBe(true)
    expect(validateJson('{"a":}').valid).toBe(false)
    expect(validateJson('{"a":}').error).toContain("Unexpected token")
  })
  it("handles empty input",()=>{
    expect(()=> formatJson('',2,false)).toThrow()
  })
  it("handles unicode",()=>{
    const s='{"emoji":"😀","café":1}'
    expect(formatJson(s,2,false)).toContain("😀")
  })
  it("handles nested sort",()=>{
    expect(sortObject({b:{z:1,a:2},a:1})).toEqual({a:1,b:{a:2,z:1}})
  })
  it("handles large input",()=>{
    const arr=Array.from({length:100},(_,i)=>({id:i}))
    expect(formatJson(JSON.stringify(arr),2,false).split("\n").length).toBeGreaterThan(100)
  })
  it("diffObjects added/removed/changed",()=>{
    const a={name:"Ada", age:36}, b={name:"Ada", age:37, country:"NP"}
    const lines=diffObjects(a,b)
    expect(lines.find(l=>l.type==="changed" && l.key==="age")).toBeTruthy()
    expect(lines.find(l=>l.type==="added" && l.key==="country")).toBeTruthy()
    expect(lines.find(l=>l.type==="unchanged" && l.key==="name")).toBeTruthy()
  })
  it("diff nested",()=>{
    const lines=diffObjects({a:{b:1}},{a:{b:2}})
    expect(lines[0].type).toBe("changed")
  })
})
