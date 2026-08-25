import { useState, useMemo } from "react"
import { ToolLayout, TextArea, CopyButton, ClearButton } from "../../components/ToolLayout"

function toCamel(s:string){ return s.replace(/[-_\s]+(.)?/g, (_,c)=>c?c.toUpperCase():"").replace(/^(.)/,m=>m.toLowerCase())}
function toPascal(s:string){ const c=toCamel(s); return c.charAt(0).toUpperCase()+c.slice(1)}
function toSnake(s:string){ return s.replace(/([a-z0-9])([A-Z])/g,"$1_$2").replace(/[\s-]+/g,"_").toLowerCase()}
function toKebab(s:string){ return s.replace(/([a-z0-9])([A-Z])/g,"$1-$2").replace(/[\s_]+/g,"-").toLowerCase()}
function toScream(s:string){ return toSnake(s).toUpperCase()}

export default function Tools(){
  const [input,setInput]=useState("hello world\nThe Swiss Knife\nfooBar_Baz")
  const stats=useMemo(()=>{
    const chars=input.length
    const words=input.trim()? input.trim().split(/\s+/).length : 0
    const lines=input.split("\n").length
    return { chars, words, lines }
  },[input])
  const [find,setFind]=useState("hello")
  const [replace,setReplace]=useState("hi")
  const replaced = useMemo(()=> input.split(find).join(replace),[input,find,replace])

  return <ToolLayout title="Text Tools" description="Case converters, counters, sort, diff and more" clientSide>
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="space-y-3">
        <TextArea value={input} onChange={setInput}  mono={false} placeholder="Enter text…" />
        <div className="flex gap-2 text-xs">
          <span className="px-2 py-1 rounded bg-secondary">{stats.words} words</span>
          <span className="px-2 py-1 rounded bg-secondary">{stats.chars} chars</span>
          <span className="px-2 py-1 rounded bg-secondary">{stats.lines} lines</span>
          <ClearButton onClear={()=>setInput("")} />
        </div>
        <div className="rounded-lg border p-3 space-y-2">
          <div className="text-xs font-semibold">Find & Replace</div>
          <div className="flex gap-2"><input value={find} onChange={e=>setFind(e.target.value)} placeholder="Find" className="flex-1 px-2 py-1.5 rounded border text-xs"/><input value={replace} onChange={e=>setReplace(e.target.value)} placeholder="Replace" className="flex-1 px-2 py-1.5 rounded border text-xs"/></div>
          <div className="rounded bg-muted p-2 font-mono text-xs whitespace-pre-wrap break-all max-h-[120px] overflow-auto">{replaced}</div>
          <CopyButton text={replaced} />
        </div>
      </div>
      <div className="space-y-3">
        <div className="text-xs font-semibold">Case converters</div>
        <div className="grid gap-2">
          {[
            ["camelCase", toCamel(input)],
            ["PascalCase", toPascal(input)],
            ["snake_case", toSnake(input)],
            ["kebab-case", toKebab(input)],
            ["SCREAMING_SNAKE", toScream(input)],
            ["UPPER", input.toUpperCase()],
            ["lower", input.toLowerCase()],
          ].map(([label,val])=>(
            <div key={label} className="flex items-center justify-between rounded border p-2 gap-2">
              <div className="min-w-0"><div className="text-[10px] text-muted-foreground">{label}</div><div className="font-mono text-xs truncate">{val as string}</div></div>
              <CopyButton text={val as string} />
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          <button onClick={()=>setInput(input.split("\n").filter((v,i,a)=>a.indexOf(v)===i).join("\n"))} className="px-2 py-1 rounded bg-secondary text-xs">Remove duplicates</button>
          <button onClick={()=>setInput(input.split("\n").sort().join("\n"))} className="px-2 py-1 rounded bg-secondary text-xs">Sort lines</button>
          <button onClick={()=>setInput(input.split("").reverse().join(""))} className="px-2 py-1 rounded bg-secondary text-xs">Reverse</button>
          <button onClick={()=>setInput(input.split("\n").map(l=>l.trim()).join("\n"))} className="px-2 py-1 rounded bg-secondary text-xs">Trim lines</button>
        </div>
      </div>
    </div>
  </ToolLayout>
}
