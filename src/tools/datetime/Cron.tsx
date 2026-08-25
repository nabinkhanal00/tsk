import { useState, useMemo } from "react"
import { ToolLayout, ErrorPanel } from "../../components/ToolLayout"

/** Parse one cron field into a matcher. Supports star, star-slash-step, exact values, ranges, ranges with steps, and comma lists. */
function parseField(field:string, min:number, max:number): ((v:number)=>boolean) | null {
  if(field==="*") return ()=>true
  if(field.startsWith("*/")){
    const step=Number(field.slice(2))
    if(isNaN(step)||step<1) return null
    return v=> v%step===0
  }
  if(field.includes(",")){
    const parts=field.split(",").map(f=>parseField(f,min,max))
    if(parts.some(p=>p===null)) return null
    return v=> (parts as ((v:number)=>boolean)[]).some(fn=>fn(v))
  }
  if(field.includes("-")){
    const [a,s]=field.split("-")
    const step = s?.includes("/") ? Number(s.split("/")[1]) : 1
    const lo=Number(a), hi=Number(s?.split("/")[0])
    if(isNaN(lo)||isNaN(hi)||isNaN(step)||step<1) return null
    return v=> v>=lo && v<=hi && (v-lo)%step===0
  }
  const n=Number(field)
  if(isNaN(n)||n<min||n>max) return null
  return v=> v===n
}

function describeField(field:string, unit:string, min:number, max:number): string | null {
  if(field==="*") return null
  if(field.startsWith("*/")) return `every ${field.slice(2)} ${unit}s`
  return null // handled by caller with plain value
}

function describeCron(expr:string){
  const parts=expr.trim().split(/\s+/)
  if(parts.length!==5) return "Cron must have 5 fields: minute hour day month weekday"
  const [m,h,dom,mon,dow]=parts
  const seg: string[] = []
  if(m==="*") seg.push("every minute")
  else if(m.startsWith("*/")) seg.push(`every ${m.slice(2)} minutes`)
  else if(m.includes(",")) seg.push(`at minutes ${m}`)
  else if(m.includes("-")) seg.push(`at minutes ${m}`)
  else seg.push(`at minute ${m}`)

  if(h==="*") seg.push("every hour")
  else if(h.startsWith("*/")) seg.push(`every ${h.slice(2)} hours`)
  else if(h.includes(",")) seg.push(`at hours ${h}`)
  else if(h.includes("-")) seg.push(`during hours ${h}`)
  else seg.push(`at hour ${h}`)

  if(dom!=="*") seg.push(`on day ${dom} of the month`)
  if(mon!=="*") seg.push(`in month ${mon}`)
  if(dow!=="*") seg.push(`on weekday ${dow}`)
  return "Runs " + seg.join(", ")
}

function nextRuns(expr:string, count=5){
  const parts=expr.trim().split(/\s+/)
  if(parts.length!==5) return []
  const [m,h,dom,mon,dow]=parts
  const mm=parseField(m,0,59), hh=parseField(h,0,23), dd=parseField(dom,1,31), mo=parseField(mon,1,12), dw=parseField(dow,0,7)
  if(!mm||!hh||!dd||!mo||!dw) return []
  const res:Date[]=[]
  const cur=new Date()
  cur.setSeconds(0); cur.setMilliseconds(0)
  for(let i=0;i<366*24*60 && res.length<count;i++){
    cur.setMinutes(cur.getMinutes()+1)
    if(mm(cur.getMinutes()) && hh(cur.getHours()) && dd(cur.getDate()) && mo(cur.getMonth()+1) && dw(cur.getDay())){
      res.push(new Date(cur))
    }
  }
  return res
}

export default function Cron(){
  const [expr,setExpr]=useState("*/15 * * * *")
  const desc=useMemo(()=>describeCron(expr),[expr])
  const runs=useMemo(()=>nextRuns(expr),[expr])
  const error = expr.split(/\s+/).length!==5 ? "Invalid cron expression" : ""
  return <ToolLayout title="Cron Parser" description="Parse and explain cron expressions with next execution times" clientSide>
    <div className="space-y-4">
      <input value={expr} onChange={e=>setExpr(e.target.value)} placeholder="* * * * *" aria-label="Cron expression" className="w-full px-4 py-3 rounded-lg border bg-background font-mono text-sm focus:outline-none focus:border-primary" />
      <ErrorPanel error={error} />
      <div className="rounded-lg border bg-card p-4">
        <div className="text-sm font-medium">{desc}</div>
        <div className="text-xs text-muted-foreground mt-1">Format: minute hour day month weekday — supports * , - / — e.g., 0 9 * * 1 = 9am every Monday</div>
      </div>
      <div className="rounded-lg border bg-card p-4">
        <div className="text-xs font-semibold">Next 5 runs</div>
        <ul className="mt-2 space-y-1 font-mono text-sm">
          {runs.map((d,i)=><li key={i}>{d.toLocaleString()}</li>)}
          {runs.length===0 && <li className="text-muted-foreground">No runs found — check the expression</li>}
        </ul>
      </div>
      <div className="flex flex-wrap gap-2">
        {["* * * * *","0 * * * *","0 0 * * *","0 9 * * 1","*/15 * * * *","30 8 1 * *","0 12 * * 1-5"].map(e=>(
          <button key={e} onClick={()=>setExpr(e)} className="px-2 py-1 rounded-full bg-secondary hover:bg-accent text-xs font-mono transition-colors">{e}</button>
        ))}
      </div>
    </div>
  </ToolLayout>
}
