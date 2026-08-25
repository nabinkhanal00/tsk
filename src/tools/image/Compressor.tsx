import { useState } from "react"
import { ToolLayout } from "../../components/ToolLayout"

export default function Compressor(){
  const [src,setSrc]=useState<string>("")
  const [out,setOut]=useState<string>("")
  const [quality,setQuality]=useState(0.7)
  const [width,setWidth]=useState<number|undefined>(undefined)
  const [origSize,setOrigSize]=useState(0)
  const [newSize,setNewSize]=useState(0)

  const onFile=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const f=e.target.files?.[0]; if(!f) return
    setOrigSize(f.size)
    setSrc(URL.createObjectURL(f))
  }
  const compress=()=>{
    if(!src) return
    const img=new Image()
    img.onload=()=>{
      const canvas=document.createElement("canvas")
      const w=width || img.width
      const h=width ? Math.round(img.height * (width/img.width)) : img.height
      canvas.width=w; canvas.height=h
      const ctx=canvas.getContext("2d")!
      ctx.drawImage(img,0,0,w,h)
      const url=canvas.toDataURL("image/jpeg", quality)
      setOut(url)
      // estimate size
      const b64=url.split(",")[1] || ""
      setNewSize(Math.ceil(b64.length*3/4))
    }
    img.src=src
  }

  return <ToolLayout title="Image Compressor" description="Compress and resize images locally" clientSide>
    <div className="rounded-lg border-2 border-dashed p-6 text-center bg-card">
      <input type="file" accept="image/*" onChange={onFile} />
      {src && <img src={src} alt="src" className="mx-auto mt-4 max-h-[200px] rounded border" />}
    </div>
    <div className="flex flex-wrap gap-4 items-center">
      <label className="text-xs">Quality <input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={e=>setQuality(Number(e.target.value))} /> {Math.round(quality*100)}%</label>
      <label className="text-xs">Width <input type="number" placeholder="auto" value={width||""} onChange={e=>setWidth(e.target.value?Number(e.target.value):undefined)} className="w-20 ml-1 px-2 py-1 rounded border" />px</label>
      <button onClick={compress} className="px-4 py-2 rounded-md bg-zinc-900 text-white text-sm">Compress</button>
    </div>
    {origSize>0 && <div className="text-xs text-muted-foreground">Original: {(origSize/1024).toFixed(1)} KB {newSize? `· New: ${(newSize/1024).toFixed(1)} KB · Saved: ${(((origSize-newSize)/origSize)*100).toFixed(1)}%`:""}</div>}
    {out && <img src={out} alt="compressed" className="max-h-[320px] rounded border mx-auto" />}
  </ToolLayout>
}
