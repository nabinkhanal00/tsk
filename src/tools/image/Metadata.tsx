import { useState } from "react"
import { ToolLayout } from "../../components/ToolLayout"
export default function Metadata(){
  const [info,setInfo]=useState<any>(null)
  const [preview,setPreview]=useState<string>("")
  const onFile=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const f=e.target.files?.[0]; if(!f) return
    setPreview(URL.createObjectURL(f))
    const img=new Image()
    img.onload=()=> setInfo({ name:f.name, type:f.type, size:f.size, width:img.width, height:img.height, lastModified:new Date(f.lastModified).toLocaleString() })
    img.src=URL.createObjectURL(f)
  }
  return <ToolLayout title="Image Metadata" description="Read image metadata without uploading" clientSide>
    <div className="rounded-lg border-2 border-dashed p-6 text-center bg-card"><input type="file" accept="image/*" onChange={onFile} /></div>
    {preview && <img src={preview} alt="preview" className="max-h-[240px] rounded border mx-auto" />}
    {info && <div className="rounded-lg border bg-card p-4 grid grid-cols-2 gap-2 text-sm font-mono">
      {Object.entries(info).map(([k,v])=> <div key={k}><span className="text-muted-foreground">{k}:</span> {String(v)}</div>)}
    </div>}
  </ToolLayout>
}
