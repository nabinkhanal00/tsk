import { useState, useMemo } from "react"
import { ToolLayout } from "../../components/ToolLayout"

export default function Difference(){
  const [a,setA]=useState("2024-01-01T00:00")
  const [b,setB]=useState(new Date().toISOString().slice(0,16))
  const diff=useMemo(()=>{
    const d1=new Date(a), d2=new Date(b)
    if(isNaN(d1.getTime())||isNaN(d2.getTime())) return null
    let ms=Math.abs(d2.getTime()-d1.getTime())
    const s=Math.floor(ms/1000)%60, m=Math.floor(ms/60000)%60, h=Math.floor(ms/3600000)%24, d=Math.floor(ms/86400000)
    const years=Math.floor(d/365), months=Math.floor(d/30)
    return { ms, s,m,h,d,years,months, totalHours: Math.floor(ms/3600000), totalMinutes: Math.floor(ms/60000) }
  },[a,b])
  return <ToolLayout title="Date Difference" description="Calculate difference between two dates" clientSide>
    <div className="rounded-lg border bg-card p-4 space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <label className="text-sm">Start <input type="datetime-local" value={a} onChange={e=>setA(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border bg-background" /></label>
        <label className="text-sm">End <input type="datetime-local" value={b} onChange={e=>setB(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border bg-background" /></label>
      </div>
      {diff ? <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
        {[
          ["Days",diff.d],
          ["Hours",diff.totalHours],
          ["Minutes",diff.totalMinutes],
          ["Seconds",Math.floor(diff.ms/1000)],
          ["Years ~",diff.years],
          ["Months ~",diff.months],
          ["H:M:S",`${diff.h}h ${diff.m}m ${diff.s}s`],
        ].map(([k,v])=>(
          <div key={String(k)} className="rounded-lg border p-3 bg-muted/50">
            <div className="text-xs text-muted-foreground">{k}</div>
            <div className="font-semibold font-mono">{String(v)}</div>
          </div>
        ))}
      </div> : <div className="text-sm text-red-600">Invalid dates</div>}
    </div>
  </ToolLayout>
}
