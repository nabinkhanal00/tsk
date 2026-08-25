import { useState, useMemo } from "react"
import { ToolLayout } from "../../components/ToolLayout"

export default function UrlParser(){
  const [input,setInput]=useState("https://example.com:8080/path?q=hello&lang=en#hash")
  const parsed=useMemo(()=>{
    try{ const u=new URL(input); const params=Array.from(u.searchParams.entries()); return { u, params, err:"" } }catch(e:any){ return { u:null, params:[], err:e.message } }
  },[input])
  return <ToolLayout title="URL Parser" description="Parse URLs, query strings and headers" clientSide>
    <input value={input} onChange={e=>setInput(e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background font-mono text-sm" />
    {parsed.err ? <div className="text-sm text-red-600">{parsed.err}</div> :
      parsed.u && <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-lg border bg-card p-4 space-y-1 text-sm font-mono">
          <div>protocol: {parsed.u.protocol}</div>
          <div>host: {parsed.u.host}</div>
          <div>hostname: {parsed.u.hostname}</div>
          <div>port: {parsed.u.port||"(default)"}</div>
          <div>pathname: {parsed.u.pathname}</div>
          <div>hash: {parsed.u.hash||"(none)"}</div>
          <div>origin: {parsed.u.origin}</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-xs font-semibold">Query params ({parsed.params.length})</div>
          <div className="mt-2 divide-y">
            {parsed.params.map(([k,v],i)=><div key={i} className="flex justify-between py-1 text-xs font-mono"><span>{k}</span><span className="text-muted-foreground">{v}</span></div>)}
            {parsed.params.length===0 && <div className="text-xs text-muted-foreground">No query params</div>}
          </div>
        </div>
      </div>
    }
  </ToolLayout>
}
