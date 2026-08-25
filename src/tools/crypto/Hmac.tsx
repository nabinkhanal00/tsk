import { useState } from "react"
import { ToolLayout, TextArea, CopyButton } from "../../components/ToolLayout"
const algos=["SHA-256","SHA-384","SHA-512"] as const
export default function Hmac(){
  const [message,setMessage]=useState("hello world")
  const [secret,setSecret]=useState("secret")
  const [algo,setAlgo]=useState<typeof algos[number]>("SHA-256")
  const [out,setOut]=useState("")
  const generate=async()=>{
    const enc=new TextEncoder()
    const key=await crypto.subtle.importKey("raw", enc.encode(secret), {name:"HMAC", hash:algo}, false, ["sign"])
    const sig=await crypto.subtle.sign("HMAC", key, enc.encode(message))
    const hex=Array.from(new Uint8Array(sig)).map(b=>b.toString(16).padStart(2,"0")).join("")
    setOut(hex)
  }
  return <ToolLayout title="HMAC Generator" description="Generate HMAC with secret and Web Crypto" clientSide>
    <div className="flex gap-2">
      <select value={algo} onChange={e=>setAlgo(e.target.value as any)} className="px-3 py-2 rounded-md border bg-background text-sm">{algos.map(a=> <option key={a} value={a}>{a}</option>)}</select>
      <button onClick={generate} className="px-4 py-2 rounded-md bg-zinc-900 text-white text-sm">Generate</button>
    </div>
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="space-y-3">
        <label className="text-xs font-medium">Message</label><TextArea value={message} onChange={setMessage}  />
        <label className="text-xs font-medium">Secret</label><TextArea value={secret} onChange={setSecret} rows={4} />
      </div>
      <div className="space-y-3">
        <div className="flex gap-2 items-center"><span className="text-xs font-medium">HMAC</span><CopyButton text={out} /></div>
        <div className="rounded-lg border bg-card p-3 font-mono text-xs break-all min-h-[120px]">{out || "Click Generate"}</div>
      </div>
    </div>
  </ToolLayout>
}
