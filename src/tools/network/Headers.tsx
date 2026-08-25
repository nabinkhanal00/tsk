import { useState, useMemo } from "react"
import { ToolLayout, TextArea, CopyButton } from "../../components/ToolLayout"
export default function Headers(){
  const [input,setInput]=useState("Content-Type: application/json\nAuthorization: Bearer token\nX-Request-ID: 123")
  const parsed=useMemo(()=>{
    const lines=input.split("\n").filter(Boolean)
    return lines.map(l=>{ const idx=l.indexOf(":"); if(idx===-1) return {k:l, v:""}; return {k:l.slice(0,idx).trim(), v:l.slice(idx+1).trim()}})
  },[input])
  const asJson=JSON.stringify(Object.fromEntries(parsed.map(p=>[p.k,p.v])),null,2)
  return <ToolLayout title="HTTP Headers" description="Parse and build HTTP headers" clientSide>
    <div className="grid lg:grid-cols-2 gap-4">
      <TextArea value={input} onChange={setInput}  placeholder="Header: value per line" />
      <div className="space-y-3">
        <div className="rounded-lg border bg-card divide-y max-h-[280px] overflow-auto">
          {parsed.map((p,i)=><div key={i} className="flex justify-between px-3 py-1.5 text-xs font-mono"><span className="font-semibold">{p.k}</span><span className="text-muted-foreground truncate ml-2">{p.v}</span></div>)}
        </div>
        <div className="rounded border bg-muted p-3 font-mono text-xs whitespace-pre-wrap">{asJson}</div><CopyButton text={asJson} />
      </div>
    </div>
  </ToolLayout>
}
