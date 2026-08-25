import { useState, useMemo } from "react"
import { ToolLayout } from "../../components/ToolLayout"

export default function Timestamp(){
  const [input,setInput]=useState(String(Math.floor(Date.now()/1000)))
  const [unit,setUnit]=useState<"s"|"ms"|"us">("s")
  const date = useMemo(()=>{
    try{
      let ms=Number(input)
      if(isNaN(ms)) return null
      if(unit==="s") ms*=1000
      if(unit==="us") ms/=1000
      return new Date(ms)
    }catch{ return null}
  },[input,unit])
  const now=()=>{
    const n=Date.now()
    if(unit==="s") setInput(String(Math.floor(n/1000)))
    else if(unit==="ms") setInput(String(n))
    else setInput(String(n*1000))
  }
  return <ToolLayout title="Timestamp Converter" description="Convert Unix timestamps between seconds, milliseconds and human dates" clientSide>
    <div className="rounded-lg border bg-card p-4 space-y-4">
      <div className="flex flex-wrap gap-2">
        <select value={unit} onChange={e=>setUnit(e.target.value as any)} className="px-3 py-2 rounded-md border bg-background text-sm">
          <option value="s">Unix seconds</option><option value="ms">Milliseconds</option><option value="us">Microseconds</option>
        </select>
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Enter timestamp" className="flex-1 min-w-[200px] px-3 py-2 rounded-lg border bg-background font-mono text-sm" />
        <button onClick={now} className="px-4 py-2 rounded-md bg-zinc-900 text-white text-sm">Now</button>
      </div>
      {date && !isNaN(date.getTime()) ? <div className="grid md:grid-cols-2 gap-3 text-sm">
        <div className="space-y-1">
          <div>Local: <span className="font-mono">{date.toLocaleString()}</span></div>
          <div>UTC: <span className="font-mono">{date.toUTCString()}</span></div>
          <div>ISO 8601: <span className="font-mono">{date.toISOString()}</span></div>
          <div>RFC 3339: <span className="font-mono">{date.toISOString()}</span></div>
        </div>
        <div className="space-y-1">
          <div>Unix s: <span className="font-mono">{Math.floor(date.getTime()/1000)}</span></div>
          <div>Unix ms: <span className="font-mono">{date.getTime()}</span></div>
          <div>Day: <span className="font-mono">{date.toLocaleDateString(undefined,{weekday:"long"})}</span></div>
        </div>
      </div> : <div className="text-sm text-red-600">Invalid timestamp</div>}
      <div className="pt-4 border-t">
        <div className="text-xs font-semibold">Date → Timestamp</div>
        <input type="datetime-local" onChange={e=>{
          const d=new Date(e.target.value)
          if(!isNaN(d.getTime())){
            if(unit==="s") setInput(String(Math.floor(d.getTime()/1000)))
            else if(unit==="ms") setInput(String(d.getTime()))
            else setInput(String(d.getTime()*1000))
          }
        }} className="mt-2 px-3 py-2 rounded-lg border bg-background text-sm" />
      </div>
    </div>
  </ToolLayout>
}
