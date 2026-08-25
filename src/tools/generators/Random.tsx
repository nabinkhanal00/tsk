import { useState } from "react"
import { ToolLayout, CopyButton } from "../../components/ToolLayout"
export default function Random(){
  const [min,setMin]=useState(1)
  const [max,setMax]=useState(100)
  const [count,setCount]=useState(5)
  const [out,setOut]=useState<number[]>([])
  const gen=()=> setOut(Array.from({length:count},()=> Math.floor(Math.random()*(max-min+1))+min))
  return <ToolLayout title="Random Generator" description="Generate random numbers, strings, colors and gradients locally" clientSide>
    <div className="flex flex-wrap gap-3 items-end">
      <label className="text-xs">Min <input type="number" value={min} onChange={e=>setMin(Number(e.target.value))} className="ml-1 w-20 px-2 py-1.5 rounded border" /></label>
      <label className="text-xs">Max <input type="number" value={max} onChange={e=>setMax(Number(e.target.value))} className="ml-1 w-20 px-2 py-1.5 rounded border" /></label>
      <label className="text-xs">Count <input type="number" value={count} onChange={e=>setCount(Number(e.target.value))} className="ml-1 w-20 px-2 py-1.5 rounded border" /></label>
      <button onClick={gen} className="px-4 py-2 rounded-md bg-zinc-900 text-white text-sm">Generate</button>
      <CopyButton text={out.join(", ")} />
    </div>
    <div className="rounded-lg border bg-card p-4 font-mono text-sm min-h-[80px]">{out.length? out.join(", ") : "—"}</div>
    <div className="rounded-lg border p-4">
      <div className="text-xs font-semibold">Gradient</div>
      <div className="h-20 rounded-lg mt-2" style={{background:`linear-gradient(90deg, #${Math.floor(Math.random()*0xffffff).toString(16).padStart(6,"0")}, #${Math.floor(Math.random()*0xffffff).toString(16).padStart(6,"0")})`}} />
    </div>
  </ToolLayout>
}
