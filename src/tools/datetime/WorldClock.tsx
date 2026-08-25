import { useState, useEffect } from "react"
import { ToolLayout } from "../../components/ToolLayout"
const zones=["UTC","America/New_York","Europe/London","Europe/Berlin","Asia/Kathmandu","Asia/Tokyo","Australia/Sydney","Asia/Kolkata","America/Los_Angeles","Pacific/Auckland"]
export default function WorldClock(){
  const [now,setNow]=useState(new Date())
  useEffect(()=>{ const id=setInterval(()=>setNow(new Date()),1000); return()=>clearInterval(id)},[])
  return <ToolLayout title="World Clock" description="Configurable world clocks for any IANA timezone" clientSide>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {zones.map(z=>{
        const time=new Intl.DateTimeFormat("en",{timeZone:z, hour:"2-digit", minute:"2-digit", second:"2-digit", hour12:false}).format(now)
        const date=new Intl.DateTimeFormat("en",{timeZone:z, year:"numeric", month:"short", day:"numeric"}).format(now)
        return <div key={z} className="rounded-xl border bg-card p-4">
          <div className="text-xs font-semibold tracking-widest text-muted-foreground">{z}</div>
          <div className="font-mono text-2xl mt-1">{time}</div>
          <div className="text-xs text-muted-foreground">{date}</div>
        </div>
      })}
    </div>
  </ToolLayout>
}
