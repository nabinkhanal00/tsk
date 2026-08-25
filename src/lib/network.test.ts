import { describe, it, expect } from "vitest"
import { cidrInfo, parseUrl } from "./network"

describe("network",()=>{
  it("cidr /24",()=>{
    const info=cidrInfo("192.168.1.0/24")
    expect(info.network).toBe("192.168.1.0")
    expect(info.broadcast).toBe("192.168.1.255")
    expect(info.mask).toBe("255.255.255.0")
    expect(info.hosts).toBe(254)
  })
  it("cidr /32 single host",()=>{
    const info=cidrInfo("10.0.0.1/32")
    expect(info.hosts).toBe(0)
    expect(info.network).toBe("10.0.0.1")
  })
  it("cidr /0",()=>{
    const info=cidrInfo("0.0.0.0/0")
    expect(info.network).toBe("0.0.0.0")
    expect(info.broadcast).toBe("255.255.255.255")
  })
  it("throws on invalid cidr",()=>{
    expect(()=> cidrInfo("bad")).toThrow()
    expect(()=> cidrInfo("999.0.0.0/24")).toThrow()
    expect(()=> cidrInfo("192.168.1.0/33")).toThrow()
  })
  it("parse url",()=>{
    const p=parseUrl("https://example.com:8080/path?q=1#hash")
    expect(p.hostname).toBe("example.com")
    expect(p.port).toBe("8080")
    expect(p.pathname).toBe("/path")
    expect(p.params).toEqual([["q","1"]])
  })
  it("handles url without port",()=>{
    const p=parseUrl("https://example.com/a")
    expect(p.port).toBe("")
  })
  it("throws on invalid url",()=> expect(()=> parseUrl("not a url")).toThrow())
})
