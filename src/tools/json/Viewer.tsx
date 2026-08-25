import { useState, useMemo } from "react"
import { ToolLayout, TextArea, ErrorPanel, CopyButton } from "../../components/ToolLayout"
import { copyToClipboard } from "../../lib/utils"

function JsonNode({ data, path, depth=0, query }: { data:any, path:string, depth?:number, query:string }){
  const [collapsed,setCollapsed]=useState(depth>2)
  const isObj = data!==null && typeof data==="object"
  const isArr = Array.isArray(data)
  if(!isObj){
    const str = typeof data==="string" ? `"${data}"` : String(data)
    const highlight = query && String(data).toLowerCase().includes(query.toLowerCase())
    return <span className={highlight?"bg-yellow-200 dark:bg-yellow-800":""}>{str} <button onClick={()=>copyToClipboard(str)} className="text-[10px] px-1 border rounded ml-1">copy</button></span>
  }
  const entries = isArr ? data.map((v:any,i:number)=>[String(i),v] as const) : Object.entries(data)
  if(collapsed) return <span onClick={()=>setCollapsed(false)} className="cursor-pointer text-muted-foreground">{isArr?`Array(${data.length})`:`Object{${entries.length}}`} ▶</span>
  return <div className="pl-3 border-l border-dashed ml-1">
    <div onClick={()=>setCollapsed(true)} className="cursor-pointer text-xs text-muted-foreground">▼ {isArr?"[":"{"} </div>
    {entries.map(([k,v])=>(
      <div key={k} className="py-0.5 font-mono text-[12px]">
        <span className="text-sky-600 dark:text-sky-400">{isArr?k:`"${k}"`}</span>: <JsonNode data={v} path={path+"."+k} depth={depth+1} query={query} />
        <button onClick={()=>copyToClipboard(path+"."+k)} className="ml-2 text-[10px] px-1 border rounded">path</button>
      </div>
    ))}
    <div className="text-xs text-muted-foreground">{isArr?"]":"}"}</div>
  </div>
}

export default function Viewer(){
  const [input,setInput]=useState('{"users":[{"name":"Ada","age":36,"city":"Kathmandu"},{"name":"Bob","age":24}],"meta":{"count":2}}')
  const [query,setQuery]=useState("")
  const [error,setError]=useState("")
  const parsed = useMemo(()=>{
    try{ if(!input.trim()) return null; const p=JSON.parse(input); setError(""); return p }catch(e:any){ setError(e.message); return null}
  },[input])
  return <ToolLayout title="JSON Viewer" description="Interactive tree viewer with search and copy path" clientSide>
    <div className="grid lg:grid-cols-2 gap-4">
      <div>
        <TextArea value={input} onChange={setInput}  placeholder="Paste JSON…" />
        <ErrorPanel error={error} />
      </div>
      <div className="space-y-3">
        <div className="flex gap-2">
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search values…" className="flex-1 px-3 py-2 rounded-lg border bg-background text-sm" />
          <CopyButton text={JSON.stringify(parsed,null,2) || ""} />
        </div>
        <div className="rounded-lg border bg-card p-3 min-h-[340px] max-h-[520px] overflow-auto">
          {parsed ? <JsonNode data={parsed} path="$" query={query} /> : <span className="text-sm text-muted-foreground">Enter valid JSON to view</span>}
        </div>
      </div>
    </div>
  </ToolLayout>
}
