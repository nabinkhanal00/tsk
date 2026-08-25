import { useState, useMemo } from "react"
import { ToolLayout, TextArea, CopyButton, ErrorPanel } from "../../components/ToolLayout"
export default function JsonLines(){
  const [input,setInput]=useState('{"a":1}\n{"a":2}\n{"a":3}')
  const { asJson, error }=useMemo(()=>{
    try{
      const lines=input.trim().split("\n").filter(Boolean)
      const arr=lines.map(l=> JSON.parse(l))
      return { asJson: JSON.stringify(arr,null,2), error:""}
    }catch(e:any){ return { asJson:"", error:e.message}}
  },[input])
  const [json,setJson]=useState('[{"a":1},{"a":2}]')
  const asLines=useMemo(()=>{
    try{ const arr=JSON.parse(json); if(!Array.isArray(arr)) throw new Error("JSON must be array"); return arr.map((v:any)=> JSON.stringify(v)).join("\n")
    }catch(e:any){ return "Error: "+e.message}
  },[json])
  return <ToolLayout title="JSON Lines" description="JSONL ↔ JSON array conversion" clientSide>
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-2"><div className="text-xs font-semibold">JSONL → JSON</div><TextArea value={input} onChange={setInput}  /><ErrorPanel error={error} /><div className="rounded border bg-card p-3 font-mono text-xs whitespace-pre-wrap min-h-[140px]">{asJson}</div><CopyButton text={asJson} /></div>
      <div className="space-y-2"><div className="text-xs font-semibold">JSON → JSONL</div><TextArea value={json} onChange={setJson}  /><div className="rounded border bg-card p-3 font-mono text-xs whitespace-pre-wrap min-h-[140px]">{asLines}</div><CopyButton text={asLines} /></div>
    </div>
  </ToolLayout>
}
