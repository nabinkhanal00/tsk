import { useState } from "react"
import { ToolLayout, TextArea, CopyButton } from "../../components/ToolLayout"
import { binaryEncode, binaryDecode, hexEncode, hexDecode } from "../../lib/encoding"
export default function Binary(){
  const [input,setInput]=useState("Hello")
  const [mode,setMode]=useState<"bin-enc"|"bin-dec"|"hex-enc"|"hex-dec">("bin-enc")
  const out=(()=>{ try{
    switch(mode){
      case "bin-enc": return binaryEncode(input)
      case "bin-dec": return binaryDecode(input)
      case "hex-enc": return hexEncode(input)
      case "hex-dec": return hexDecode(input)
      default: return ""
    }
  }catch(e:any){return e.message}})()
  return <ToolLayout title="Binary / Hex Tools" description="Binary ↔ Text, Hex ↔ Text conversions" clientSide>
    <div className="flex flex-wrap gap-2">
      {(["bin-enc","bin-dec","hex-enc","hex-dec"] as const).map(m=> <button key={m} onClick={()=>setMode(m)} className={`px-3 py-1.5 rounded-md text-xs border ${mode===m?"bg-zinc-900 text-white":"bg-background"}`}>{m}</button>)}
    </div>
    <div className="grid lg:grid-cols-2 gap-4">
      <TextArea value={input} onChange={setInput}  />
      <div className="space-y-2"><CopyButton text={out} /><div className="rounded-lg border bg-card p-3 font-mono text-sm break-all min-h-[160px]">{out}</div></div>
    </div>
  </ToolLayout>
}
