import { useState } from "react"
import { ToolLayout, TextArea, CopyButton } from "../../components/ToolLayout"

export default function Url(){
  const [input,setInput]=useState("https://example.com/search?q=hello world&lang=en")
  const [mode,setMode]=useState<"encode"|"decode">("encode")
  const output=(()=>{
    try{
      if(mode==="encode") return encodeURIComponent(input)
      return decodeURIComponent(input)
    }catch(e:any){ return "Error: "+e.message}
  })()
  const fullEncode = encodeURI(input)
  return <ToolLayout title="URL Encoder" description="Encode and decode URLs and query strings" clientSide>
    <div className="flex gap-2">
      <button onClick={()=>setMode("encode")} className={`px-4 py-2 rounded-md text-sm border ${mode==="encode"?"bg-zinc-900 text-white":"bg-background"}`}>Encode</button>
      <button onClick={()=>setMode("decode")} className={`px-4 py-2 rounded-md text-sm border ${mode==="decode"?"bg-zinc-900 text-white":"bg-background"}`}>Decode</button>
    </div>
    <div className="grid lg:grid-cols-2 gap-4">
      <TextArea value={input} onChange={setInput}  />
      <div className="space-y-3">
        <div className="flex gap-2"><CopyButton text={output} /><span className="text-xs text-muted-foreground">encodeURIComponent</span></div>
        <div className="rounded-lg border bg-card p-3 font-mono text-sm break-all min-h-[100px]">{output}</div>
        <div className="text-xs">encodeURI (preserves :/?#):</div>
        <div className="rounded-lg border bg-muted p-3 font-mono text-xs break-all">{fullEncode}</div>
      </div>
    </div>
  </ToolLayout>
}
