import { useState } from "react"
import { ToolLayout, TextArea, CopyButton } from "../../components/ToolLayout"

function encodeHtml(s:string){ return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;") }
function decodeHtml(s:string){ const el=document.createElement("div"); el.innerHTML=s; return el.textContent||el.innerText||"" }

function hexEncode(s:string){ return Array.from(s).map(c=>c.charCodeAt(0).toString(16).padStart(2,"0")).join(" ") }
function hexDecode(s:string){ try{ return s.trim().split(/\s+/).map(h=>String.fromCharCode(parseInt(h,16))).join("") }catch{return "Invalid hex"} }

export default function Html(){
  const [input,setInput]=useState('<div class="hi">Hello & goodbye</div>')
  const [mode,setMode]=useState<"html-encode"|"html-decode"|"hex-encode"|"hex-decode"|"unicode-escape">("html-encode")
  const output=(()=>{
    switch(mode){
      case "html-encode": return encodeHtml(input)
      case "html-decode": return decodeHtml(input)
      case "hex-encode": return hexEncode(input)
      case "hex-decode": return hexDecode(input)
      case "unicode-escape": return Array.from(input).map(c=>"\\u"+c.charCodeAt(0).toString(16).padStart(4,"0")).join("")
      default: return ""
    }
  })()
  return <ToolLayout title="HTML Entities" description="Encode/decode HTML, Hex, Unicode" clientSide>
    <div className="flex flex-wrap gap-2">
      {(["html-encode","html-decode","hex-encode","hex-decode","unicode-escape"] as const).map(m=>(
        <button key={m} onClick={()=>setMode(m)} className={`px-3 py-1.5 rounded-md text-xs border ${mode===m?"bg-zinc-900 text-white":"bg-background"}`}>{m}</button>
      ))}
    </div>
    <div className="grid lg:grid-cols-2 gap-4">
      <TextArea value={input} onChange={setInput}  />
      <div className="space-y-2">
        <CopyButton text={output} />
        <div className="rounded-lg border bg-card p-3 font-mono text-sm whitespace-pre-wrap break-all min-h-[220px]">{output}</div>
      </div>
    </div>
  </ToolLayout>
}
