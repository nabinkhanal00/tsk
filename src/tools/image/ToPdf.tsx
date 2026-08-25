import { useState } from "react"
import { ToolLayout } from "../../components/ToolLayout"
import { PDFDocument } from "pdf-lib"
export default function ToPdf(){
  const [files,setFiles]=useState<File[]>([])
  const [url,setUrl]=useState("")
  const [status,setStatus]=useState("")
  const create=async()=>{
    if(!files.length){ setStatus("Add images"); return }
    setStatus("Creating PDF...")
    const pdf=await PDFDocument.create()
    for(const f of files){
      const buf=await f.arrayBuffer()
      const isPng=f.type.includes("png")
      const img=isPng? await pdf.embedPng(buf) : await pdf.embedJpg(buf)
      const page=pdf.addPage([img.width, img.height])
      page.drawImage(img,{x:0,y:0,width:img.width,height:img.height})
    }
    const bytes=await pdf.save()
    setUrl(URL.createObjectURL(new Blob([bytes as any],{type:"application/pdf"})))
    setStatus(`Created PDF with ${files.length} images (${(bytes.length/1024).toFixed(1)} KB)`)
  }
  return <ToolLayout title="Images to PDF" description="Convert multiple images into a PDF locally" clientSide>
    <div className="rounded-lg border-2 border-dashed p-6 text-center bg-card">
      <input type="file" accept="image/*" multiple onChange={e=>setFiles(Array.from(e.target.files||[]))} />
      {files.length>0 && <div className="text-xs mt-2">{files.map(f=>f.name).join(", ")}</div>}
    </div>
    <button onClick={create} className="px-5 py-2.5 rounded-lg bg-zinc-900 text-white text-sm">Create PDF</button>
    {status && <div className="text-sm">{status}</div>}
    {url && <a href={url} download="images.pdf" className="inline-flex px-4 py-2 rounded-lg border bg-background text-sm">Download PDF</a>}
  </ToolLayout>
}
