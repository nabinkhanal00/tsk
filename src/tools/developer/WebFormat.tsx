import { useState } from "react"
import { ToolLayout, TextArea, CopyButton } from "../../components/ToolLayout"
function simpleFormat(code:string, type:"html"|"css"|"js"){
  if(type==="html") return code.replace(/>\s*</g,">\n<").split("\n").map(l=>l.trim()).join("\n")
  if(type==="css") return code.replace(/;/g,";\n").replace(/{/g,"{\n").replace(/}/g,"\n}\n")
  if(type==="js") return code.replace(/;/g,";\n").replace(/{/g,"{\n").replace(/}/g,"\n}\n")
  return code
}
export default function WebFormat(){
  const [input,setInput]=useState("<div><p>Hello</p></div>")
  const [type,setType]=useState<"html"|"css"|"js">("html")
  const [out,setOut]=useState("")
  return <ToolLayout title="HTML / CSS / JS Formatter" description="Lightweight formatters and minifiers" clientSide>
    <div className="flex gap-2">
      {(["html","css","js"] as const).map(t=> <button key={t} onClick={()=>setType(t)} className={`px-3 py-1.5 rounded-md text-xs border ${type===t?"bg-zinc-900 text-white":"bg-background"}`}>{t.toUpperCase()}</button>)}
      <button onClick={()=>setOut(simpleFormat(input,type))} className="px-4 py-1.5 rounded-md bg-zinc-900 text-white text-xs">Format</button>
      <button onClick={()=>setOut(input.replace(/\s+/g," ").trim())} className="px-4 py-1.5 rounded-md border text-xs">Minify</button>
    </div>
    <div className="grid lg:grid-cols-2 gap-4">
      <TextArea value={input} onChange={setInput}  />
      <div className="space-y-2"><CopyButton text={out} /><div className="rounded-lg border bg-card p-3 font-mono text-xs whitespace-pre-wrap break-all min-h-[280px]">{out || "Formatted output"}</div></div>
    </div>
  </ToolLayout>
}
