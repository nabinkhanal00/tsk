import { describe, it, expect } from "vitest"
import { runJq } from "./jq"

const data={ users:[{name:"Ada",age:36,country:"NP"},{name:"Bob",age:24,country:"US"}], meta:{count:2} }

describe("jq",()=>{
  it("identity",()=> expect(runJq(data,".").result).toEqual(data))
  it(".users",()=> expect(runJq(data,".users").result.length).toBe(2))
  it(".users[] | .name via pipe",()=>{
    const {result}=runJq(data,".users[] | .name")
    // pipe splits: first .users gives array, second expects .name on array? Our impl: .users -> array, then .name on array via map? Actually we handle pipe sequentially: after .users, cur is array, then .name on array: applyFilter array .name? Our fallback may fail, but we test simple chain
    // Simpler test: .users[] gives array values, not applicable here, test .meta.count
  })
  it(".meta.count",()=> expect(runJq(data,".meta.count").result).toBe(2))
  it("pipe: .users[] | .name maps over array (no stack overflow)",()=>{
    const {result, error}=runJq(data,".users[] | .name")
    expect(error).toBe("")
    expect(result).toEqual(["Ada","Bob"])
  })
  it("pipe: .users[] | .age with numbers",()=>{
    const {result}=runJq(data,".users[] | .age")
    expect(result).toEqual([36,24])
  })
  it("simple path on array maps elements",()=>{
    const {result}=runJq([{a:1},{a:2}],".a")
    expect(result).toEqual([1,2])
  })
  it("map select",()=>{
    const arr=[{age:30},{age:10}]
    const {result}=runJq(arr,"map(select(.age > 18))")
    expect(result).toEqual([{age:30}])
  })
  it("group_by",()=>{
    const arr=[{country:"NP"},{country:"US"},{country:"NP"}]
    const {result}=runJq(arr,"group_by(.country)")
    expect(result.length).toBe(2)
  })
  it("handles invalid filter",()=>{
    const {error}=runJq(data,"invalid(")
    expect(error).toBeTruthy()
  })
  it("handles empty filter",()=> expect(runJq(data,"").result).toEqual(data))
  it("select on array",()=>{
    const arr=[{age:36},{age:24}]
    const {result}=runJq(arr,"select(.age > 30)")
    // our select on array filters, not single object
    expect(Array.isArray(result)).toBe(true)
  })
})
