import { useState, useMemo } from "react"
import { ToolLayout } from "../../components/ToolLayout"
import { formatDate } from "../../lib/datetime"
const presets=["YYYY-MM-DD","DD/MM/YYYY","MM-DD-YYYY","YYYY-MM-DD HH:mm:ss","ISO","UTC","YYYY/MM/DD HH:mm"]
export default function Formatter(){
  const [dateStr,setDateStr]=useState(new Date().toISOString().slice(0,16))
  const [fmt,setFmt]=useState("YYYY-MM-DD HH:mm:ss")
  const out=useMemo(()=>{
    try{ const d=new Date(dateStr); if(isNaN(d.getTime())) return "Invalid date"; return formatDate(d, fmt)}catch(e:any){ return e.message}
  },[dateStr,fmt])
  return <ToolLayout title="Date Formatter" description="Convert between common date formats" clientSide>
    <input type="datetime-local" value={dateStr} onChange={e=>setDateStr(e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background" />
    <div className="flex flex-wrap gap-2">
      {presets.map(p=> <button key={p} onClick={()=>setFmt(p)} className={`px-3 py-1.5 rounded-full text-xs border ${fmt===p?"bg-zinc-900 text-white":"bg-secondary"}`}>{p}</button>)}
    </div>
    <input value={fmt} onChange={e=>setFmt(e.target.value)} placeholder="Custom format e.g., YYYY-MM-DD" className="w-full px-3 py-2 rounded-lg border bg-background font-mono text-sm" />
    <div className="rounded-lg border bg-card p-4 font-mono text-lg">{out}</div>
    <div className="text-xs text-muted-foreground">Tokens: YYYY year, MM month, DD day, HH hour, mm minute, ss second, ISO, UTC</div>
  </ToolLayout>
}
