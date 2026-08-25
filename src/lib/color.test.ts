import { describe, it, expect } from "vitest"
import { hexToRgb, rgbToHex, contrast, meetsAA, meetsAAA } from "./color"

describe("color",()=>{
  it("hex to rgb",()=>{
    expect(hexToRgb("#ff0000")).toEqual({r:255,g:0,b:0})
    expect(hexToRgb("#0ea5e9")).toEqual({r:14,g:165,b:233})
    expect(hexToRgb("#fff")).toEqual({r:255,g:255,b:255})
  })
  it("rgb to hex",()=>{
    expect(rgbToHex(255,0,0)).toBe("#ff0000")
    expect(rgbToHex(0,0,0)).toBe("#000000")
  })
  it("roundtrip",()=>{
    const hex="#1a2b3c"
    const {r,g,b}=hexToRgb(hex)
    expect(rgbToHex(r,g,b)).toBe(hex)
  })
  it("contrast black/white max",()=>{
    const c=contrast("#000000","#ffffff")
    expect(c).toBeCloseTo(21,0)
  })
  it("contrast same color =1",()=> expect(contrast("#ff0000","#ff0000")).toBeCloseTo(1,2))
  it("AA/AAA thresholds",()=>{
    expect(meetsAA(4.5)).toBe(true)
    expect(meetsAA(4.4)).toBe(false)
    expect(meetsAAA(7)).toBe(true)
    expect(meetsAAA(6.9)).toBe(false)
  })
})
