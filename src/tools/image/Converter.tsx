import { useState } from "react"
import { ToolLayout } from "../../components/ToolLayout"

export default function Converter(){
  const [src,setSrc]=useState<string>("")
  const [out,setOut]=useState<string>("")
  const [format,setFormat]=useState<"image/png"|"image/jpeg"|"image/webp">("image/webp")
  const [info,setInfo]=useState("")

  const onFile=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const f=e.target.files?.[0]; if(!f) return
    const url=URL.createObjectURL(f)
    setSrc(url)
    setInfo(`${f.name} · ${(f.size/1024).toFixed(1)} KB · ${f.type}`)
  }
  const convert=()=>{
    if(!src) return
    const img=new Image()
    img.onload=()=>{
      const canvas=document.createElement("canvas")
      canvas.width=img.width; canvas.height=img.height
      const ctx=canvas.getContext("2d")!
      ctx.drawImage(img,0,0)
      const dataUrl=canvas.toDataURL(format, 0.92)
      setOut(dataUrl)
    }
    img.src=src
  }
  const download=()=>{
    if(!out) return
    const a=document.createElement("a"); a.href=out; a.download=`converted.${format.split("/")[1]}`; a.click()
  }

  return <ToolLayout title="Image Converter" description="Convert images between PNG, JPEG, WebP locally" clientSide>
    <div className="rounded-lg border-2 border-dashed p-6 text-center bg-card">
      <input type="file" accept="image/*" onChange={onFile} />
      {info && <div className="text-xs text-muted-foreground mt-2">{info}</div>}
      {src && <img src={src} alt="preview" className="mx-auto mt-4 max-h-[240px] rounded border" />}
    </div>
    <div className="flex flex-wrap gap-2">
      <select value={format} onChange={e=>setFormat(e.target.value as any)} className="px-3 py-2 rounded-md border bg-background text-sm">
        <option value="image/png">PNG</option><option value="image/jpeg">JPEG</option><option value="image/webp">WebP</option>
      </select>
      <button onClick={convert} className="px-4 py-2 rounded-md bg-zinc-900 text-white text-sm">Convert</button>
      {out && <button onClick={download} className="px-4 py-2 rounded-md border bg-background text-sm">Download</button>}
    </div>
    {out && <img src={out} alt="output" className="max-h-[320px] rounded border mx-auto" />}
  </ToolLayout>
}
