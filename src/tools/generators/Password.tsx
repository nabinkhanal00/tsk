import { useState } from "react"
import { ToolLayout, CopyButton } from "../../components/ToolLayout"

export default function Password(){
  const [length,setLength]=useState(16)
  const [upper,setUpper]=useState(true)
  const [lower,setLower]=useState(true)
  const [numbers,setNumbers]=useState(true)
  const [symbols,setSymbols]=useState(false)
  const [pwd,setPwd]=useState("")

  const generate=()=>{
    let chars=""
    if(lower) chars+="abcdefghijklmnopqrstuvwxyz"
    if(upper) chars+="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if(numbers) chars+="0123456789"
    if(symbols) chars+="!@#$%^&*_-+="
    if(!chars) chars="abcdefghijklmnopqrstuvwxyz"
    const arr=crypto.getRandomValues(new Uint32Array(length))
    let out=""
    for(let i=0;i<length;i++) out+=chars[arr[i]%chars.length]
    setPwd(out)
  }

  return <ToolLayout title="Password Generator" description="Generate secure random passwords locally" clientSide>
    <div className="rounded-lg border bg-card p-4 space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <label className="text-sm">Length <input type="range" min={8} max={64} value={length} onChange={e=>setLength(Number(e.target.value))} className="mx-2" /> <span className="font-mono">{length}</span></label>
        <label className="text-xs flex items-center gap-1"><input type="checkbox" checked={upper} onChange={e=>setUpper(e.target.checked)}/> A-Z</label>
        <label className="text-xs flex items-center gap-1"><input type="checkbox" checked={lower} onChange={e=>setLower(e.target.checked)}/> a-z</label>
        <label className="text-xs flex items-center gap-1"><input type="checkbox" checked={numbers} onChange={e=>setNumbers(e.target.checked)}/> 0-9</label>
        <label className="text-xs flex items-center gap-1"><input type="checkbox" checked={symbols} onChange={e=>setSymbols(e.target.checked)}/> Symbols</label>
      </div>
      <button onClick={generate} className="px-5 py-2.5 rounded-lg bg-zinc-900 text-white text-sm font-medium">Generate Password</button>
      {pwd && <div className="rounded-lg border bg-muted p-4 flex items-center justify-between gap-3">
        <span className="font-mono text-lg break-all">{pwd}</span><CopyButton text={pwd} />
      </div>}
    </div>
  </ToolLayout>
}
