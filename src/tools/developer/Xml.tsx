import { useState, useMemo } from "react"
import { ToolLayout, TextArea, CopyButton, ErrorPanel } from "../../components/ToolLayout"
function formatXml(xml:string){
  let formatted="", indent=0
  xml=xml.replace(/>\s*</g,"><").trim()
  const tokens=xml.split(/(<[^>]*>)/g).filter(Boolean)
  for(const t of tokens){
    if(t.startsWith("</")){ indent=Math.max(0,indent-1); formatted+="  ".repeat(indent)+t+"\n"}
    else if(t.startsWith("<") && !t.endsWith("/>")){ formatted+="  ".repeat(indent)+t+"\n"; if(!t.includes("</")) indent++ }
    else if(t.trim()) formatted+="  ".repeat(indent)+t.trim()+"\n"
    else formatted+=t
  }
  return formatted.trim()
}
function xmlToJson(xmlStr:string){
  const parser=new DOMParser()
  const doc=parser.parseFromString(xmlStr,"application/xml")
  if(doc.querySelector("parsererror")) throw new Error("Invalid XML")
  function nodeToObj(node:Element):any{
    const obj:any={}
    if(node.attributes) for(const a of Array.from(node.attributes)) obj["@"+a.name]=a.value
    for(const c of Array.from(node.childNodes)){
      if(c.nodeType===3){ const t=c.textContent?.trim(); if(t) obj["#text"]=t }
      else if(c.nodeType===1){ const el=c as Element; obj[el.tagName]= nodeToObj(el) }
    }
    return obj
  }
  return { [doc.documentElement.tagName]: nodeToObj(doc.documentElement) }
}
export default function Xml(){
  const [input,setInput]=useState('<root><user name="Ada"><age>36</age></user></root>')
  const [mode,setMode]=useState<"format"|"tojson">("format")
  const { out, err }=useMemo(()=>{
    try{
      if(mode==="format") return {out: formatXml(input), err:""}
      return {out: JSON.stringify(xmlToJson(input),null,2), err:""}
    }catch(e:any){ return {out:"", err:e.message}}
  },[input,mode])
  return <ToolLayout title="XML Tools" description="Format XML and convert XML ↔ JSON" clientSide>
    <div className="flex gap-2"><button onClick={()=>setMode("format")} className={`px-3 py-1.5 rounded-md text-xs border ${mode==="format"?"bg-zinc-900 text-white":"bg-background"}`}>Format</button><button onClick={()=>setMode("tojson")} className={`px-3 py-1.5 rounded-md text-xs border ${mode==="tojson"?"bg-zinc-900 text-white":"bg-background"}`}>XML → JSON</button></div>
    <div className="grid lg:grid-cols-2 gap-4">
      <TextArea value={input} onChange={setInput}  />
      <div className="space-y-2"><CopyButton text={out} /><ErrorPanel error={err} /><div className="rounded-lg border bg-card p-3 font-mono text-xs whitespace-pre-wrap break-all min-h-[280px]">{out || "—"}</div></div>
    </div>
  </ToolLayout>
}
