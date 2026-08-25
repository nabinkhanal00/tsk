import { useState, useMemo } from "react"
import { ToolLayout, CopyButton } from "../../components/ToolLayout"

function hexToRgb(hex:string){ hex=hex.replace("#",""); if(hex.length===3) hex=hex.split("").map(c=>c+c).join(""); const n=parseInt(hex,16); return {r:(n>>16)&255,g:(n>>8)&255,b:n&255}}
function rgbToHex(r:number,g:number,b:number){ return "#"+[r,g,b].map(v=>v.toString(16).padStart(2,"0")).join("")}
function luminance(r:number,g:number,b:number){
  const a=[r,g,b].map(v=>{ v/=255; return v<=0.03928? v/12.92 : Math.pow((v+0.055)/1.055,2.4)})
  return 0.2126*a[0]+0.7152*a[1]+0.0722*a[2]
}
function contrast(c1:string,c2:string){
  const a=hexToRgb(c1), b=hexToRgb(c2)
  const l1=luminance(a.r,a.g,a.b), l2=luminance(b.r,b.g,b.b)
  return (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05)
}

export default function Tools(){
  const [hex,setHex]=useState("#0ea5e9")
  const rgb=useMemo(()=>{ try{ return hexToRgb(hex)}catch{return {r:0,g:0,b:0}}},[hex])
  const [bg,setBg]=useState("#ffffff")
  const ratio=useMemo(()=>contrast(hex,bg),[hex,bg])
  const aa = ratio>=4.5, aaa=ratio>=7

  return <ToolLayout title="Color Tools" description="HEX/RGB/HSL converters, picker and contrast checker" clientSide>
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <label className="text-xs font-semibold">Pick color</label>
        <div className="flex gap-3 items-center">
          <input type="color" value={hex} onChange={e=>setHex(e.target.value)} className="w-16 h-10 rounded border" />
          <input value={hex} onChange={e=>setHex(e.target.value)} className="flex-1 px-3 py-2 rounded-lg border bg-background font-mono text-sm" />
          <div className="w-10 h-10 rounded-lg border" style={{background:hex}} />
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="rounded border p-2"><div className="text-muted-foreground">HEX</div><div className="font-mono">{hex}</div></div>
          <div className="rounded border p-2"><div className="text-muted-foreground">RGB</div><div className="font-mono">{rgb.r},{rgb.g},{rgb.b}</div></div>
          <div className="rounded border p-2"><div className="text-muted-foreground">HEX copy</div><CopyButton text={hex} /></div>
        </div>
        <button onClick={()=>setHex("#"+Array.from(crypto.getRandomValues(new Uint8Array(3))).map(b=>b.toString(16).padStart(2,"0")).join(""))} className="px-3 py-1.5 rounded-md border text-xs">Random color</button>
        <div className="text-xs">Quick: {["#0ea5e9","#ef4444","#22c55e","#f59e0b","#8b5cf6"].map(c=><button key={c} onClick={()=>setHex(c)} className="w-6 h-6 rounded-full border ml-1" style={{background:c}} />)}</div>
      </div>
      <div className="space-y-4">
        <div className="text-xs font-semibold">Contrast checker (WCAG)</div>
        <div className="flex gap-2 items-center">
          <input type="color" value={bg} onChange={e=>setBg(e.target.value)} className="w-12 h-8 rounded" />
          <span className="text-xs">Background {bg}</span>
        </div>
        <div className="rounded-lg p-6 text-center border" style={{background:bg, color:hex}}>
          <div className="font-semibold">Aa Example Text</div>
          <div className="text-xs">Contrast on this background</div>
        </div>
        <div className="rounded-lg border p-3 text-sm">
          <div>Ratio: <span className="font-mono font-semibold">{ratio.toFixed(2)}:1</span></div>
          <div className="flex gap-2 mt-1 text-xs">
            <span className={`px-2 py-1 rounded-full ${aa?"bg-emerald-100 text-emerald-700":"bg-red-100 text-red-700"}`}>AA {aa?"✓":"✗"}</span>
            <span className={`px-2 py-1 rounded-full ${aaa?"bg-emerald-100 text-emerald-700":"bg-red-100 text-red-700"}`}>AAA {aaa?"✓":"✗"}</span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">HEX ↔ RGB seamlessly. Contrast checker reports WCAG AA/AAA compliance.</div>
      </div>
    </div>
  </ToolLayout>
}
