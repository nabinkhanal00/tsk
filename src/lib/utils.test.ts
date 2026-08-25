import { describe, it, expect } from "vitest"
import { formatBytes } from "./utils"

describe("formatBytes",()=>{
  it("formats zero",()=> expect(formatBytes(0)).toBe("0 B"))
  it("formats bytes",()=> expect(formatBytes(512)).toBe("512 B"))
  it("formats kilobytes",()=> expect(formatBytes(2048)).toBe("2 KB"))
  it("formats megabytes",()=> expect(formatBytes(5*1024*1024)).toBe("5 MB"))
})

describe("JSON formatting",()=>{
  it("pretty prints",()=>{
    const obj={b:2,a:1}
    expect(JSON.stringify(obj,null,2)).toContain('"a": 1')
  })
  it("sorts keys",()=>{
    function sort(o:any):any{ if(Array.isArray(o)) return o.map(sort); if(o&&typeof o==="object"){const out:any={}; Object.keys(o).sort().forEach(k=> out[k]=sort(o[k])); return out} return o}
    expect(JSON.stringify(sort({b:2,a:1}))).toBe('{"a":1,"b":2}')
  })
})

describe("Base64",()=>{
  it("encodes and decodes",()=>{
    const text="Hello, Swiss Knife!"
    const enc=btoa(unescape(encodeURIComponent(text)))
    const dec=decodeURIComponent(escape(atob(enc)))
    expect(dec).toBe(text)
  })
  it("url encode",()=>{
    expect(encodeURIComponent("hello world")).toBe("hello%20world")
    expect(decodeURIComponent("hello%20world")).toBe("hello world")
  })
})

describe("regex",()=>{
  it("matches groups",()=>{
    const re=/(\w+)@(\w+\.\w+)/g
    const m=[..."ada@example.com".matchAll(re)]
    expect(m[0][1]).toBe("ada")
  })
})

describe("CIDR",()=>{
  it("calculates network",()=>{
    const ip="192.168.1.0", prefix=24
    const parts=ip.split(".").map(Number)
    const ipInt=(parts[0]<<24|parts[1]<<16|parts[2]<<8|parts[3])>>>0
    const mask=(0xffffffff << (32-prefix))>>>0
    const network=(ipInt & mask)>>>0
    const toIp=(n:number)=> [(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255].join(".")
    expect(toIp(network)).toBe("192.168.1.0")
    expect(toIp(mask)).toBe("255.255.255.0")
  })
})

describe("JWT decode",()=>{
  it("decodes payload",()=>{
    const token="eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.sig"
    const part=token.split(".")[1].replace(/-/g,"+").replace(/_/g,"/")
    const padded=part + "=".repeat((4-part.length%4)%4)
    const obj=JSON.parse(decodeURIComponent(escape(atob(padded))))
    expect(obj.sub).toBe("123")
  })
})
