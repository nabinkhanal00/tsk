import { useState } from "react"
import { ToolLayout, TextArea, CopyButton, ClearButton } from "../../components/ToolLayout"

export default function Base64(){
  const [input,setInput]=useState("Hello, Swiss Knife!")
  const [mode,setMode]=useState<"encode"|"decode">("encode")
  const [urlSafe,setUrlSafe]=useState(false)
  const output = (()=>{ try{
    if(mode==="encode"){
      let b=btoa(unescape(encodeURIComponent(input)))
      if(urlSafe) b=b.replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")
      return b
    } else {
      let s=input.trim()
      if(urlSafe) s=s.replace(/-/g,"+").replace(/_/g,"/")
      while(s.length%4) s+="="
      return decodeURIComponent(escape(atob(s)))
    }
  }catch(e:any){ return "Error: "+e.message }})()

  return <ToolLayout title="Base64 Encode/Decode" description="Encode and decode Base64 and Base64URL" clientSide>
    <div className="flex flex-wrap gap-2">
      <button onClick={()=>setMode("encode")} className={`px-4 py-2 rounded-md text-sm border ${mode==="encode"?"bg-zinc-900 text-white":"bg-background"}`}>Encode</button>
      <button onClick={()=>setMode("decode")} className={`px-4 py-2 rounded-md text-sm border ${mode==="decode"?"bg-zinc-900 text-white":"bg-background"}`}>Decode</button>
      <label className="flex items-center gap-1 text-xs ml-2"><input type="checkbox" checked={urlSafe} onChange={e=>setUrlSafe(e.target.checked)}/> Base64URL</label>
    </div>
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-xs font-medium">{mode==="encode"?"Text to encode":"Base64 to decode"}</label>
        <TextArea value={input} onChange={setInput}  />
        <ClearButton onClear={()=>setInput("")} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2"><span className="text-xs font-medium">Output</span><CopyButton text={output} /></div>
        <div className="rounded-lg border bg-card p-3 font-mono text-sm whitespace-pre-wrap break-all min-h-[220px]">{output}</div>
      </div>
    </div>
  </ToolLayout>
}
