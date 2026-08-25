import { useState } from "react"
import { ToolLayout, TextArea, ErrorPanel, CopyButton, DownloadButton, ClearButton } from "../../components/ToolLayout"

function formatJSON(input:string, indent:number, sortKeys:boolean){
  const parsed = JSON.parse(input)
  const sorted = sortKeys ? sortObject(parsed) : parsed
  return JSON.stringify(sorted, null, indent)
}
function sortObject(v:any):any{
  if(Array.isArray(v)) return v.map(sortObject)
  if(v!==null && typeof v==="object"){
    const out:any={}
    Object.keys(v).sort().forEach(k=> out[k]=sortObject(v[k]))
    return out
  }
  return v
}

export default function Formatter(){
  const [input,setInput]=useState('{\n  "users": [{"name":"Ada","age":36},{"name":"Bob","age":24}],\n  "active": true\n}')
  const [indent,setIndent]=useState(2)
  const [sortKeys,setSortKeys]=useState(false)
  const [output,setOutput]=useState("")
  const [error,setError]=useState("")

  const run=(mode:"pretty"|"minify")=>{
    try{
      if(!input.trim()){ setError("Please provide JSON input"); return}
      const parsed=JSON.parse(input)
      if(mode==="minify") setOutput(JSON.stringify(sortKeys?sortObject(parsed):parsed))
      else setOutput(JSON.stringify(sortKeys?sortObject(parsed):parsed,null,indent))
      setError("")
    }catch(e:any){
      const msg=e.message || "Invalid JSON"
      // try to extract position
      setError(msg)
      setOutput("")
    }
  }
  const validate=()=>{
    try{ JSON.parse(input); setError("✓ Valid JSON"); setOutput("") }catch(e:any){ setError(e.message) }
  }

  return <ToolLayout title="JSON Formatter" description="Format, validate, minify and sort JSON" clientSide>
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <label className="text-xs">Indent</label>
          <select value={indent} onChange={e=>setIndent(Number(e.target.value))} className="px-2 py-1.5 rounded-md border bg-background text-sm">
            <option value={2}>2 spaces</option><option value={4}>4 spaces</option><option value={0}>Tabs</option>
          </select>
          <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={sortKeys} onChange={e=>setSortKeys(e.target.checked)}/> Sort keys</label>
        </div>
        <TextArea value={input} onChange={setInput} placeholder="Paste JSON here…"  />
        <div className="flex flex-wrap gap-2">
          <button onClick={()=>run("pretty")} className="px-4 py-2 rounded-md bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-sm font-medium">Format</button>
          <button onClick={()=>run("minify")} className="px-4 py-2 rounded-md border bg-background text-sm">Minify</button>
          <button onClick={validate} className="px-4 py-2 rounded-md border bg-background text-sm">Validate</button>
          <ClearButton onClear={()=>{setInput("");setOutput("");setError("")}} />
        </div>
        <ErrorPanel error={error} />
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <CopyButton text={output} />
          <DownloadButton content={output} filename="formatted.json" />
          <span className="text-xs text-muted-foreground">{output? `${output.length} chars`:""}</span>
        </div>
        <div className="rounded-lg border bg-card p-3 font-mono text-[13px] whitespace-pre-wrap break-all min-h-[340px] max-h-[520px] overflow-auto">{output || <span className="text-muted-foreground">Formatted output will appear here. Drop a JSON file or paste above.</span>}</div>
        <div className="flex gap-2 text-xs">
          <button onClick={()=>setInput('{"name":"Ada","users":[{"id":1}]}')} className="px-2 py-1 rounded bg-secondary">Example: Simple</button>
          <button onClick={()=>setInput('[{"id":1,"name":"Ada"},{"id":2,"name":"Bob"}]')} className="px-2 py-1 rounded bg-secondary">Array</button>
        </div>
      </div>
    </div>
  </ToolLayout>
}
