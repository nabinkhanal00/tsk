import { useState } from "react"
import { ToolLayout, TextArea, CopyButton } from "../../components/ToolLayout"
import { format } from "sql-formatter"

export default function Sql(){
  const [input,setInput]=useState("select * from users where age > 18 order by name")
  const [output,setOutput]=useState("")
  const [error,setError]=useState("")
  const fmt=()=>{
    try{ setOutput(format(input, { language:"sql", keywordCase:"upper"})); setError("") }catch(e:any){ setError(e.message)}
  }
  const minify=()=> setOutput(input.replace(/\s+/g," ").trim())
  return <ToolLayout title="SQL Formatter" description="Format and minify SQL" clientSide>
    <TextArea value={input} onChange={setInput}  placeholder="Paste SQL…" />
    <div className="flex gap-2">
      <button onClick={fmt} className="px-4 py-2 rounded-md bg-zinc-900 text-white text-sm">Format</button>
      <button onClick={minify} className="px-4 py-2 rounded-md border bg-background text-sm">Minify</button>
      <CopyButton text={output} />
    </div>
    {error && <div className="text-sm text-red-600">{error}</div>}
    <div className="rounded-lg border bg-card p-3 font-mono text-sm whitespace-pre-wrap min-h-[160px]">{output || "Formatted SQL will appear here"}</div>
  </ToolLayout>
}
