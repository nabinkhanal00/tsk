import { useState } from "react"
import { ToolLayout, TextArea, CopyButton } from "../../components/ToolLayout"

async function digest(algo:string, data:ArrayBuffer){
  const buf=await crypto.subtle.digest(algo as any, data)
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("")
}

const algos = ["SHA-1","SHA-256","SHA-384","SHA-512"] as const

export default function Hash(){
  const [input,setInput]=useState("hello world")
  const [results,setResults]=useState<Record<string,string>>({})
  const [fileInfo,setFileInfo]=useState("")

  const run=async()=>{
    const enc=new TextEncoder().encode(input)
    const out:Record<string,string>={}
    for(const a of algos){
      out[a]=await digest(a, enc.buffer as ArrayBuffer)
    }
    setResults(out)
  }

  const onFile=async(e:React.ChangeEvent<HTMLInputElement>)=>{
    const f=e.target.files?.[0]
    if(!f) return
    setFileInfo(`${f.name} (${(f.size/1024).toFixed(1)} KB)`)
    const buf=await f.arrayBuffer()
    const out:Record<string,string>={}
    for(const a of algos) out[a]=await digest(a, buf)
    setResults(out)
  }

  return <ToolLayout title="Hash Generator" description="Generate SHA hashes for text and files using Web Crypto" clientSide>
    <TextArea value={input} onChange={setInput}  placeholder="Enter text…" />
    <div className="flex flex-wrap gap-2">
      <button onClick={run} className="px-4 py-2 rounded-md bg-zinc-900 text-white text-sm">Generate Hashes</button>
      <label className="px-4 py-2 rounded-md border bg-background text-sm cursor-pointer">Hash file <input type="file" className="hidden" onChange={onFile} /></label>
      {fileInfo && <span className="text-xs text-muted-foreground self-center">{fileInfo}</span>}
    </div>
    <div className="space-y-3">
      {algos.map(a=>(
        <div key={a} className="rounded-lg border bg-card p-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs font-semibold">{a}</div>
            <div className="font-mono text-xs break-all mt-1">{results[a] || "—"}</div>
          </div>
          {results[a] && <CopyButton text={results[a]} />}
        </div>
      ))}
    </div>
  </ToolLayout>
}
