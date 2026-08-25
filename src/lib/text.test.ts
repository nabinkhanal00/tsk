import { describe, it, expect } from "vitest"
import { toCamel, toPascal, toSnake, toKebab, toScream, wordCount, lineCount, sortLines, dedupeLines, reverseText, diffLines } from "./text"

describe("text",()=>{
  it("case converters",()=>{
    expect(toCamel("hello world")).toBe("helloWorld")
    expect(toPascal("hello world")).toBe("HelloWorld")
    expect(toSnake("Hello World")).toBe("hello_world")
    expect(toKebab("Hello World")).toBe("hello-world")
    expect(toScream("hello world")).toBe("HELLO_WORLD")
    expect(toCamel("foo-bar_baz")).toBe("fooBarBaz")
  })
  it("unicode case",()=>{
    expect(toSnake("fooBar")).toBe("foo_bar")
  })
  it("empty case",()=> expect(toCamel("")).toBe(""))
  it("word count",()=>{
    expect(wordCount("hello world")).toBe(2)
    expect(wordCount("  ")).toBe(0)
    expect(wordCount("")).toBe(0)
  })
  it("line count",()=> expect(lineCount("a\nb\nc")).toBe(3))
  it("sort lines",()=> expect(sortLines("b\na\nc")).toBe("a\nb\nc"))
  it("dedupe",()=> expect(dedupeLines("a\na\nb")).toBe("a\nb"))
  it("reverse",()=> expect(reverseText("abc")).toBe("cba"))
  it("diffLines",()=>{
    const lines=diffLines("a\nb","a\nc")
    expect(lines[0].type).toBe("unchanged")
    expect(lines[1].type).toBe("changed")
  })
  it("handles large text",()=>{
    const s=Array.from({length:1000},(_,i)=>`line ${i}`).join("\n")
    expect(lineCount(s)).toBe(1000)
  })
})
