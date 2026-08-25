import { useState, useMemo } from "react"
import { ToolLayout } from "../../components/ToolLayout"

const statuses=[
  [200,"OK"],[201,"Created"],[204,"No Content"],[301,"Moved Permanently"],[302,"Found"],[304,"Not Modified"],[400,"Bad Request"],[401,"Unauthorized"],[403,"Forbidden"],[404,"Not Found"],[409,"Conflict"],[422,"Unprocessable Entity"],[429,"Too Many Requests"],[500,"Internal Server Error"],[502,"Bad Gateway"],[503,"Service Unavailable"]
]
const mimes=[
  ["application/json","JSON"], ["text/html","HTML"], ["text/plain","Plain"], ["image/png","PNG"], ["application/pdf","PDF"], ["application/xml","XML"]
]

export default function HttpRef(){
  const [q,setQ]=useState("")
  const filtered=useMemo(()=>{
    const l=q.toLowerCase()
    return statuses.filter(([code,text])=> String(code).includes(l) || (text as string).toLowerCase().includes(l))
  },[q])
  return <ToolLayout title="HTTP Reference" description="Status codes, headers, MIME types and ports" clientSide>
    <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search status codes…" className="w-full px-3 py-2 rounded-lg border bg-background text-sm" />
    <div className="grid md:grid-cols-2 gap-4">
      <div className="rounded-lg border bg-card">
        <div className="px-3 py-2 text-xs font-semibold border-b">Status Codes</div>
        <div className="divide-y max-h-[360px] overflow-auto">
          {filtered.map(([code,text])=><div key={code} className="flex justify-between px-3 py-2 text-sm"><span className="font-mono font-semibold">{String(code)}</span><span>{text as string}</span></div>)}
        </div>
      </div>
      <div className="space-y-4">
        <div className="rounded-lg border bg-card p-3">
          <div className="text-xs font-semibold">Common MIME Types</div>
          <div className="mt-2 space-y-1 text-xs font-mono">{mimes.map(([m,d])=><div key={m} className="flex justify-between"><span>{m}</span><span className="text-muted-foreground">{d}</span></div>)}</div>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <div className="text-xs font-semibold">Common Ports</div>
          <div className="mt-2 space-y-1 text-xs font-mono">{[["80","HTTP"],["443","HTTPS"],["5432","Postgres"],["6379","Redis"],["3000","Dev"]].map(([p,s])=><div key={p} className="flex justify-between"><span>{p}</span><span>{s}</span></div>)}</div>
        </div>
      </div>
    </div>
  </ToolLayout>
}
