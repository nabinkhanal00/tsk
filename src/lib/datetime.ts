export function toDateFromTimestamp(input:string, unit:"s"|"ms"|"us"): Date|null{
  let ms=Number(input)
  if(isNaN(ms)) return null
  if(unit==="s") ms*=1000
  if(unit==="us") ms/=1000
  const d=new Date(ms)
  return isNaN(d.getTime())? null : d
}
export function diffDates(a:Date,b:Date){
  let ms=Math.abs(b.getTime()-a.getTime())
  const s=Math.floor(ms/1000)%60, m=Math.floor(ms/60000)%60, h=Math.floor(ms/3600000)%24, d=Math.floor(ms/86400000)
  const years=Math.floor(d/365), months=Math.floor(d/30)
  return { ms, s,m,h,d,years,months, totalHours: Math.floor(ms/3600000), totalMinutes: Math.floor(ms/60000) }
}
export function describeCron(expr:string){
  const parts=expr.trim().split(/\s+/)
  if(parts.length!==5) return "Cron must have 5 fields: minute hour day month weekday"
  const [m,h,dom,mon,dow]=parts
  const desc=[]
  desc.push(m==="*"? "every minute" : `at minute ${m}`)
  desc.push(h==="*"? "every hour" : `at hour ${h}`)
  if(dom!=="*") desc.push(`on day ${dom}`)
  if(mon!=="*") desc.push(`in month ${mon}`)
  if(dow!=="*") desc.push(`on weekday ${dow}`)
  return "Runs " + desc.join(" ")
}
export function formatDate(date:Date, fmt:string):string{
  const pad=(n:number,l=2)=>String(n).padStart(l,"0")
  const map:Record<string,string>={
    "YYYY":String(date.getFullYear()),
    "MM":pad(date.getMonth()+1),
    "DD":pad(date.getDate()),
    "HH":pad(date.getHours()),
    "mm":pad(date.getMinutes()),
    "ss":pad(date.getSeconds()),
    "ISO":date.toISOString(),
    "UTC":date.toUTCString(),
  }
  let out=fmt
  for(const [k,v] of Object.entries(map)) out=out.split(k).join(v)
  return out
}
