import { useState, useMemo } from "react"
import { ToolLayout } from "../../components/ToolLayout"

const zones=["UTC","America/New_York","Europe/London","Europe/Berlin","Asia/Kathmandu","Asia/Tokyo","Australia/Sydney","Asia/Kolkata","America/Los_Angeles"]

export default function Timezone(){
  const [date,setDate]=useState(new Date().toISOString().slice(0,16))
  const [from,setFrom]=useState("UTC")
  const [to,setTo]=useState("Asia/Kathmandu")
  const converted=useMemo(()=>{
    try{
      const d=new Date(date)
      if(isNaN(d.getTime())) return "Invalid date"
      const fmt=(tz:string)=> new Intl.DateTimeFormat("en-CA",{ timeZone: tz, year:"numeric",month:"2-digit",day:"2-digit", hour:"2-digit", minute:"2-digit", second:"2-digit", hour12:false}).format(d)
      return `${fmt(from)} (${from}) → ${fmt(to)} (${to})`
    }catch(e:any){ return e.message }
  },[date,from,to])
  return <ToolLayout title="Timezone Converter" description="Convert date/time between IANA timezones" clientSide>
    <div className="rounded-lg border bg-card p-4 space-y-4">
      <input type="datetime-local" value={date} onChange={e=>setDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-background" />
      <div className="grid md:grid-cols-2 gap-4">
        <label className="text-xs">From <select value={from} onChange={e=>setFrom(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border bg-background text-sm">{zones.map(z=><option key={z} value={z}>{z}</option>)}</select></label>
        <label className="text-xs">To <select value={to} onChange={e=>setTo(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border bg-background text-sm">{zones.map(z=><option key={z} value={z}>{z}</option>)}</select></label>
      </div>
      <div className="rounded-lg bg-muted p-4 font-mono text-sm">{converted}</div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {zones.map(z=>{
          try{
            const d=new Date(date)
            const s=new Intl.DateTimeFormat("en",{timeZone:z, hour:"2-digit", minute:"2-digit"}).format(d)
            return <div key={z} className="rounded border p-2 text-xs"><div className="font-semibold">{z}</div><div className="font-mono">{s}</div></div>
          }catch{ return null}
        })}
      </div>
    </div>
  </ToolLayout>
}
