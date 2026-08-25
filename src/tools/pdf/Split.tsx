import { useState } from "react"
import { ToolLayout } from "../../components/ToolLayout"
import { PDFDocument } from "pdf-lib"

export default function Split(){
  const [file,setFile]=useState<File|null>(null)
  const [pageCount,setPageCount]=useState<number| null>(null)
  const [range,setRange]=useState("1-2")
  const [status,setStatus]=useState("")
  const [outUrl,setOutUrl]=useState("")

  const onFile=async(e:React.ChangeEvent<HTMLInputElement>)=>{
    const f=e.target.files?.[0]; if(!f) return
    setFile(f)
    const buf=await f.arrayBuffer()
    const pdf=await PDFDocument.load(buf)
    setPageCount(pdf.getPageCount())
  }
  const extract=async()=>{
    if(!file) return
    try{
      setStatus("Processing...")
      const buf=await file.arrayBuffer()
      const src=await PDFDocument.load(buf)
      const total=src.getPageCount()
      // parse range like 1,3,5-7
      const pages:number[]=[]
      for(const part of range.split(",")){
        if(part.includes("-")){
          const [a,b]=part.split("-").map(Number)
          for(let i=a;i<=b;i++) if(i>=1&&i<=total) pages.push(i-1)
        } else { const n=Number(part); if(n>=1&&n<=total) pages.push(n-1) }
      }
      if(!pages.length){ setStatus("No valid pages in range"); return }
      const out=await PDFDocument.create()
      const copied=await out.copyPages(src, pages)
      copied.forEach(p=> out.addPage(p))
      const bytes=await out.save()
      setOutUrl(URL.createObjectURL(new Blob([bytes as any],{type:"application/pdf"})))
      setStatus(`Extracted ${pages.length} page(s)`)
    }catch(e:any){ setStatus("Error: "+e.message)}
  }

  return <ToolLayout title="PDF Split & Extract" description="Split, extract and rotate PDF pages locally" clientSide>
    <div className="rounded-lg border-2 border-dashed p-6 text-center bg-card">
      <input type="file" accept="application/pdf" onChange={onFile} />
      {pageCount!==null && <div className="text-xs text-muted-foreground mt-2">{file?.name} · {pageCount} pages</div>}
    </div>
    <div className="flex flex-wrap gap-2 items-end">
      <label className="text-xs">Pages (e.g., 1-2,4) <input value={range} onChange={e=>setRange(e.target.value)} className="ml-1 px-2 py-1.5 rounded border" /></label>
      <button onClick={extract} className="px-4 py-2 rounded-md bg-zinc-900 text-white text-sm">Extract</button>
      {outUrl && <a href={outUrl} download="extracted.pdf" className="px-4 py-2 rounded-md border bg-background text-sm">Download</a>}
    </div>
    {status && <div className="text-sm">{status}</div>}
  </ToolLayout>
}
