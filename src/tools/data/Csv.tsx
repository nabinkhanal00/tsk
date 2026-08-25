import { useState, useMemo } from "react"
import { ToolLayout, TextArea, CopyButton } from "../../components/ToolLayout"
import Papa from "papaparse"

export default function Csv(){
  const [input,setInput]=useState("name,age,city\nAda,36,Kathmandu\nBob,24,New York")
  const [delimiter,setDelimiter]=useState(",")
  const parsed=useMemo(()=>{
    const res=Papa.parse(input, { delimiter, header:true, skipEmptyLines:true })
    return res
  },[input,delimiter])
  const asTable = parsed.data as any[]

  return <ToolLayout title="CSV Tools" description="View, format and convert CSV/TSV/JSON" clientSide>
    <div className="flex gap-2 items-center">
      <label className="text-xs">Delimiter <select value={delimiter} onChange={e=>setDelimiter(e.target.value)} className="ml-1 px-2 py-1 rounded border"><option value=",">Comma ,</option><option value=";">Semicolon ;</option><option value="\t">Tab</option><option value="|">Pipe |</option></select></label>
      <CopyButton text={JSON.stringify(asTable,null,2)} label="Copy as JSON" />
    </div>
    <div className="grid lg:grid-cols-2 gap-4">
      <TextArea value={input} onChange={setInput}  mono />
      <div className="rounded-lg border overflow-auto max-h-[340px]">
        <table className="w-full text-xs">
          <thead className="bg-muted sticky top-0"><tr>{parsed.meta.fields?.map(f=><th key={f} className="px-2 py-1 text-left font-semibold">{f}</th>)}</tr></thead>
          <tbody className="divide-y">{asTable.slice(0,100).map((row,i)=><tr key={i}>{parsed.meta.fields?.map(f=><td key={f} className="px-2 py-1 font-mono">{String(row[f]??"")}</td>)}</tr>)}</tbody>
        </table>
        {parsed.errors.length>0 && <div className="p-2 text-xs text-red-600">{parsed.errors.map(e=>e.message).join(", ")}</div>}
      </div>
    </div>
  </ToolLayout>
}
