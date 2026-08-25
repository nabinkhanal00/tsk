import { useState, useMemo } from "react"
import { ToolLayout, TextArea, CopyButton, ErrorPanel } from "../../components/ToolLayout"
import Papa from "papaparse"

export default function JsonCsv(){
  const [jsonInput,setJsonInput]=useState('[{"name":"Ada","age":36},{"name":"Bob","age":24}]')
  const [csvInput,setCsvInput]=useState("name,age\nAda,36\nBob,24")
  const jsonToCsv = useMemo(()=>{
    try{
      const data=JSON.parse(jsonInput)
      if(!Array.isArray(data)) return { out:"", err:"JSON must be an array of objects" }
      return { out: Papa.unparse(data), err:"" }
    }catch(e:any){ return { out:"", err:e.message }}
  },[jsonInput])
  const csvToJson = useMemo(()=>{
    try{
      const res=Papa.parse(csvInput, { header:true, skipEmptyLines:true })
      return { out: JSON.stringify(res.data,null,2), err:"" }
    }catch(e:any){ return { out:"", err:e.message }}
  },[csvInput])

  return <ToolLayout title="JSON ↔ CSV" description="Convert JSON arrays to CSV and vice versa" clientSide>
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-3">
        <div className="text-xs font-semibold">JSON → CSV</div>
        <TextArea value={jsonInput} onChange={setJsonInput}  />
        <ErrorPanel error={jsonToCsv.err} />
        <div className="rounded-lg border bg-card p-3 font-mono text-xs whitespace-pre-wrap break-all min-h-[120px]">{jsonToCsv.out || "—"}</div>
        <CopyButton text={jsonToCsv.out} />
      </div>
      <div className="space-y-3">
        <div className="text-xs font-semibold">CSV → JSON</div>
        <TextArea value={csvInput} onChange={setCsvInput}  />
        <ErrorPanel error={csvToJson.err} />
        <div className="rounded-lg border bg-card p-3 font-mono text-xs whitespace-pre-wrap break-all min-h-[120px]">{csvToJson.out || "—"}</div>
        <CopyButton text={csvToJson.out} />
      </div>
    </div>
  </ToolLayout>
}
