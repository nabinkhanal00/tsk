import { useState, useMemo } from "react"
import { ToolLayout, TextArea, ErrorPanel, CopyButton } from "../../components/ToolLayout"
import { runJq } from "../../lib/jq"

export default function Playground(){
  const [input,setInput]=useState('{\n  "users": [\n    {"name":"Ada","age":36,"country":"NP"},\n    {"name":"Bob","age":24,"country":"US"},\n    {"name":"Cara","age":29,"country":"NP"}\n  ]\n}')
  const [filter,setFilter]=useState(".users[] | .name")
  const { result, error } = useMemo(()=>{
    try{
      const parsed=JSON.parse(input)
      return runJq(parsed, filter)
    }catch(e:any){ return { result:null, error:e.message } }
  },[input,filter])
  const output = error ? "" : JSON.stringify(result,null,2)
  return <ToolLayout title="jq Playground" description="Run jq filters on JSON locally — no server, subset of jq supported with helpful examples" clientSide>
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-xs font-medium">JSON Input</label>
        <TextArea value={input} onChange={setInput}  placeholder="Paste JSON…" />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-medium">jq Filter</label>
        <input value={filter} onChange={e=>setFilter(e.target.value)} placeholder='.users[] | .name' className="w-full px-3 py-2 rounded-md border font-mono text-sm focus:outline-none focus:border-primary" style={{background:"var(--term-bg)", borderColor:"var(--term-border)", color:"var(--term-fg)"}} />
        <div className="flex flex-wrap gap-1.5">
          {[".",".users[]",".users[] | .name",".users | map(select(.age > 25))",".users | group_by(.country)"].map(ex=>(
            <button key={ex} onClick={()=>setFilter(ex)} className="px-2 py-1 rounded-full bg-secondary hover:bg-accent text-xs font-mono transition-colors">{ex}</button>
          ))}
        </div>
        <div className="rounded-lg border bg-card">
          <div className="px-3 py-2 border-b flex items-center justify-between">
            <span className="text-xs font-medium">Output</span>
            <CopyButton text={output} />
          </div>
          <pre className="p-3 font-mono text-[13px] whitespace-pre-wrap break-all max-h-[320px] overflow-auto">{output || "—"}</pre>
        </div>
        <ErrorPanel error={error} />
        <div className="text-xs text-muted-foreground">Supported: <code>.</code>, <code>.key</code>, <code>.a.b</code>, <code>.[]</code>, <code>.arr[]</code>, <code>map(select(...))</code>, <code>select</code>, <code>group_by</code>. For full jq, use local <code>jq</code> CLI. This subset covers 80% of daily uses and runs entirely in your browser.</div>
      </div>
    </div>
  </ToolLayout>
}
