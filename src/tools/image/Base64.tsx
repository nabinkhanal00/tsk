import { useState } from "react"
import { ToolLayout, TextArea, CopyButton } from "../../components/ToolLayout"

export default function Base64Image(){
  const [b64,setB64]=useState("")
  const [imgSrc,setImgSrc]=useState<string>("")
  const onFile=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const f=e.target.files?.[0]; if(!f) return
    const r=new FileReader()
    r.onload=()=>{ const s=r.result as string; setB64(s); setImgSrc(s) }
    r.readAsDataURL(f)
  }
  const fromB64=()=>{
    try{ setImgSrc(b64) }catch{}
  }
  return <ToolLayout title="Image ↔ Base64" description="Convert images to and from Base64" clientSide>
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="space-y-3">
        <input type="file" accept="image/*" onChange={onFile} className="w-full" />
        <TextArea value={b64} onChange={setB64}  placeholder="Base64 data URL…" />
        <div className="flex gap-2"><button onClick={fromB64} className="px-3 py-1.5 rounded border text-xs">Preview</button><CopyButton text={b64} /></div>
      </div>
      <div className="rounded-lg border bg-card p-4 grid place-items-center min-h-[280px]">
        {imgSrc ? <img src={imgSrc} alt="preview" className="max-h-[360px] rounded" /> : <span className="text-sm text-muted-foreground">Preview will appear here</span>}
      </div>
    </div>
  </ToolLayout>
}
