import { describe, it, expect } from "vitest"
import { toDateFromTimestamp, diffDates, describeCron, formatDate } from "./datetime"

describe("datetime",()=>{
  it("timestamp s -> date",()=>{
    const d=toDateFromTimestamp("0","s")
    expect(d?.toISOString()).toBe("1970-01-01T00:00:00.000Z")
  })
  it("timestamp ms",()=>{
    const d=toDateFromTimestamp("1000","ms")
    expect(d?.getTime()).toBe(1000)
  })
  it("timestamp us",()=>{
    const d=toDateFromTimestamp("1000000","us")
    expect(d?.getTime()).toBe(1000)
  })
  it("invalid timestamp",()=> expect(toDateFromTimestamp("abc","s")).toBeNull())
  it("diff dates",()=>{
    const a=new Date("2024-01-01"), b=new Date("2024-01-03")
    const diff=diffDates(a,b)
    expect(diff.d).toBe(2)
    expect(diff.totalHours).toBe(48)
  })
  it("diff same date zero",()=>{
    const d=new Date()
    expect(diffDates(d,d).ms).toBe(0)
  })
  it("describe cron",()=>{
    expect(describeCron("* * * * *")).toContain("every minute")
    expect(describeCron("0 9 * * 1")).toContain("9")
    expect(describeCron("bad")).toContain("5 fields")
  })
  it("formatDate tokens",()=>{
    const d=new Date("2024-03-05T09:07:06Z")
    expect(formatDate(d,"YYYY-MM-DD")).toBe("2024-03-05")
    expect(formatDate(d,"ISO")).toContain("2024")
  })
  it("handles boundary timestamp",()=>{
    const d=toDateFromTimestamp("2147483647","s")
    expect(d?.getFullYear()).toBe(2038)
  })
})
