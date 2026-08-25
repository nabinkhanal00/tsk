import { useState } from "react"
import { ToolLayout } from "../../components/ToolLayout"
import { PDFDocument } from "pdf-lib"

export default function Merge(){
  const [files,setFiles]=useState<File[]>([])
  const [outputUrl,setOutputUrl]=useState<string>("")
  const [status,setStatus]=useState("")

  const onFiles=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const list=Array.from(e.target.files||[])
    setFiles(prev=>[...prev, ...list])
  }
  const merge=async()=>{
    if(files.length<2){ setStatus("Add at least 2 PDFs"); return }
    setStatus("Merging...")
    try{
      const merged=await PDFDocument.create()
      for(const f of files){
        const buf=await f.arrayBuffer()
        const pdf=await PDFDocument.load(buf)
        const pages=await merged.copyPages(pdf, pdf.getPageIndices())
        pages.forEach(p=> merged.addPage(p))
      }
      const bytes=await merged.save()
      const blob=new Blob([bytes as any],{type:"application/pdf"})
      setOutputUrl(URL.createObjectURL(blob))
      setStatus(`Merged ${files.length} PDFs (${(bytes.length/1024).toFixed(1)} KB)`)
    }catch(e:any){ setStatus("Error: "+e.message)}
  }

  return <ToolLayout title="PDF Merge" description="Merge multiple PDFs locally — files never leave your browser" clientSide>
    <div className="rounded-lg border-2 border-dashed p-6 bg-card text-center">
      <input type="file" accept="application/pdf" multiple onChange={onFiles} />
      <div className="text-xs text-muted-foreground mt-2">Select multiple PDFs to merge</div>
      {files.length>0 && <div className="mt-3 text-left max-w-md mx-auto space-y-1">
        {files.map((f,i)=><div key={i} className="flex justify-between text-xs border rounded px-2 py-1"><span>{f.name}</span><span>{(f.size/1024).toFixed(0)} KB</span></div>)}
        <button onClick={()=>setFiles([])} className="text-xs text-red-600">Clear all</button>
      </div>}
    </div>
    <button onClick={merge} className="px-5 py-2.5 rounded-lg bg-zinc-900 text-white text-sm font-medium">Merge PDFs</button>
    {status && <div className="text-sm">{status}</div>}
    {outputUrl && <a href={outputUrl} download="merged.pdf" className="inline-flex px-4 py-2 rounded-lg border bg-background text-sm">Download merged.pdf</a>}
  </ToolLayout>
}
