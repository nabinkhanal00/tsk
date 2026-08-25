import { describe, it, expect } from "vitest"
import { base64Encode, base64Decode, urlEncode, urlDecode, htmlEncode, hexEncode, hexDecode, binaryEncode, binaryDecode, unicodeEscape, decodeJwt } from "./encoding"

describe("encoding",()=>{
  it("base64 roundtrip",()=>{
    const s="Hello, Swiss Knife! 😀"
    expect(base64Decode(base64Encode(s))).toBe(s)
  })
  it("base64url no padding",()=>{
    const enc=base64Encode("hello", true)
    expect(enc).not.toContain("+"); expect(enc).not.toContain("/")
    expect(base64Decode(enc,true)).toBe("hello")
  })
  it("handles empty base64",()=> expect(base64Encode("")).toBe(""))
  it("url encode",()=>{
    expect(urlEncode("hello world")).toBe("hello%20world")
    expect(urlDecode("hello%20world")).toBe("hello world")
    expect(urlEncode("a+b=c&d")).toContain("%")
  })
  it("html encode",()=>{
    expect(htmlEncode('<div>"hi" &')).toBe('&lt;div&gt;&quot;hi&quot; &amp;')
  })
  it("hex encode/decode",()=>{
    const s="Hi"
    const hex=hexEncode(s)
    expect(hex).toBe("48 69")
    expect(hexDecode(hex)).toBe(s)
  })
  it("binary encode/decode",()=>{
    const s="A"
    expect(binaryEncode(s)).toBe("01000001")
    expect(binaryDecode(binaryEncode(s))).toBe(s)
  })
  it("unicode escape",()=>{
    expect(unicodeEscape("A")).toBe("\\u0041")
    expect(unicodeEscape("😀").length).toBeGreaterThan(0)
  })
  it("jwt decode",()=>{
    const token="eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMiLCJleHAiOjIwMDAwMDAwMDB9.sig"
    const {payload, header}=decodeJwt(token)
    expect(payload.sub).toBe("123")
    expect(header.alg).toBe("HS256")
  })
  it("jwt throws on invalid",()=>{
    expect(()=> decodeJwt("bad")).toThrow()
  })
  it("handles malformed base64",()=>{
    expect(()=> base64Decode("!!!")).toThrow()
  })
})
