import { describe, it, expect } from "vitest"
import Papa from "papaparse"
import yaml from "js-yaml"

describe("csv via papaparse",()=>{
  it("parses csv",()=>{
    const res=Papa.parse("a,b\n1,2\n3,4",{header:true})
    expect(res.data).toEqual([{a:"1",b:"2"},{a:"3",b:"4"}])
  })
  it("handles semicolon delimiter",()=>{
    const res=Papa.parse("a;b\n1;2",{header:true, delimiter:";"})
    expect((res.data as any)[0].a).toBe("1")
  })
  it("unparse json to csv",()=>{
    const csv=Papa.unparse([{a:1,b:2}])
    expect(csv).toContain("a,b")
  })
  it("handles empty csv",()=>{
    const res=Papa.parse("",{header:true})
    expect(res.data.length).toBe(0)
  })
})

describe("yaml",()=>{
  it("yaml to json roundtrip",()=>{
    const obj={name:"Ada",age:36}
    const y=yaml.dump(obj)
    const parsed=yaml.load(y) as any
    expect(parsed.name).toBe("Ada")
  })
  it("throws on invalid yaml",()=>{
    expect(()=> yaml.load(":\n  bad: [")).toThrow()
  })
  it("json to yaml",()=>{
    const y=yaml.dump({a:[1,2]})
    expect(y).toContain("a:")
  })
})

describe("json lines",()=>{
  it("jsonl to json array",()=>{
    const jl='{"a":1}\n{"a":2}'
    const arr=jl.trim().split("\n").map(l=>JSON.parse(l))
    expect(arr).toEqual([{a:1},{a:2}])
  })
  it("json array to jsonl",()=>{
    const arr=[{a:1},{a:2}]
    const jl=arr.map(v=>JSON.stringify(v)).join("\n")
    expect(jl.split("\n").length).toBe(2)
  })
})
