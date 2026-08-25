import { useState } from "react"
import { ToolLayout, CopyButton } from "../../components/ToolLayout"

function uuidv4(){ return crypto.randomUUID() }
function uuidv7(){
  const now=Date.now()
  const timeHex=now.toString(16).padStart(12,"0")
  const rand=crypto.getRandomValues(new Uint8Array(10))
  const randHex=Array.from(rand).map(b=>b.toString(16).padStart(2,"0")).join("")
  // format as uuid v7-ish: time + version + variant
  return `${timeHex.slice(0,8)}-${timeHex.slice(8,12)}-7${randHex.slice(0,3)}-${((parseInt(randHex.slice(3,5),16) & 0x3f) | 0x80).toString(16).padStart(2,"0")}${randHex.slice(5,7)}-${randHex.slice(7,19).padEnd(12,"0")}`.slice(0,36)
}
function ulid(){
  const chars="0123456789ABCDEFGHJKMNPQRSTVWXYZ"
  let time=Date.now()
  let out=""
  for(let i=9;i>=0;i--){ out=chars[time%32]+out; time=Math.floor(time/32)}
  for(let i=0;i<16;i++) out+=chars[Math.floor(Math.random()*32)]
  return out
}
function nanoid(size=21){
  const alphabet="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-"
  const bytes=crypto.getRandomValues(new Uint8Array(size))
  let id=""
  for(let i=0;i<size;i++) id+=alphabet[bytes[i] & 63]
  return id
}

export default function Uuid(){
  const [count,setCount]=useState(5)
  const [type,setType]=useState<"uuidv4"|"uuidv7"|"ulid"|"nanoid">("uuidv4")
  const [list,setList]=useState<string[]>(()=> Array.from({length:5},()=>uuidv4()))
  const generate=()=>{
    const fn = type==="uuidv4"?uuidv4 : type==="uuidv7"?uuidv7 : type==="ulid"?ulid : ()=>nanoid()
    setList(Array.from({length:count},()=>fn()))
  }
  return <ToolLayout title="UUID Generator" description="Generate UUID v4, v7, ULID and Nano ID" clientSide>
    <div className="flex flex-wrap gap-2 items-end">
      <label className="text-xs">Type <select value={type} onChange={e=>setType(e.target.value as any)} className="ml-1 px-2 py-1.5 rounded-md border bg-background"><option value="uuidv4">UUID v4</option><option value="uuidv7">UUID v7</option><option value="ulid">ULID</option><option value="nanoid">Nano ID</option></select></label>
      <label className="text-xs">Count <input type="number" min={1} max={100} value={count} onChange={e=>setCount(Number(e.target.value))} className="ml-1 w-20 px-2 py-1.5 rounded-md border bg-background" /></label>
      <button onClick={generate} className="px-4 py-2 rounded-md bg-zinc-900 text-white text-sm">Generate</button>
      <CopyButton text={list.join("\n")} label="Copy all" />
    </div>
    <div className="rounded-lg border bg-card divide-y font-mono text-sm">
      {list.map((v,i)=><div key={i} className="flex items-center justify-between px-3 py-2"><span className="break-all">{v}</span><CopyButton text={v} /></div>)}
    </div>
  </ToolLayout>
}
