import { useState, useEffect, useRef } from "react"
import { ToolLayout } from "../../components/ToolLayout"
import QRCode from "qrcode"
import { TextArea } from "../../components/ToolLayout"

export default function Generator(){
  const [text,setText]=useState("https://theswissknife.com")
  const [size,setSize]=useState(256)
  const canvasRef=useRef<HTMLCanvasElement>(null)
  const [error,setError]=useState("")
  useEffect(()=>{
    if(!canvasRef.current) return
    QRCode.toCanvas(canvasRef.current, text || " ", { width: size, margin: 2 }, (err)=> setError(err? err.message:""))
  },[text,size])
  const download=()=>{
    if(!canvasRef.current) return
    const url=canvasRef.current.toDataURL("image/png")
    const a=document.createElement("a"); a.href=url; a.download="qr.png"; a.click()
  }
  return <ToolLayout title="QR Code Generator" description="Generate QR codes locally" clientSide>
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <TextArea value={text} onChange={setText} rows={4} placeholder="Text or URL…" />
        <label className="text-xs">Size <input type="range" min={128} max={512} step={32} value={size} onChange={e=>setSize(Number(e.target.value))} /> {size}px</label>
        <div className="flex gap-2">
          <button onClick={download} className="px-4 py-2 rounded-md bg-zinc-900 text-white text-sm">Download PNG</button>
          <button onClick={()=>setText("WIFI:T:WPA;S:MyNetwork;P:password;;")} className="px-3 py-1.5 rounded-md border text-xs">Wi-Fi example</button>
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
      </div>
      <div className="rounded-lg border bg-white p-6 grid place-items-center">
        <canvas ref={canvasRef} />
      </div>
    </div>
  </ToolLayout>
}
