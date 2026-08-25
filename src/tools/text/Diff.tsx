import { useState, useMemo } from "react"
import { ToolLayout, TextArea } from "../../components/ToolLayout"

function diffLines(a:string,b:string){
  const al=a.split("\n"), bl=b.split("\n")
  const max=Math.max(al.length, bl.length)
  const lines:any[]=[]
  for(let i=0;i<max;i++){
    if(al[i]===bl[i]) lines.push({type:"unchanged", left:al[i], right:bl[i], i})
    else if(al[i]===undefined) lines.push({type:"added", right:bl[i], i})
    else if(bl[i]===undefined) lines.push({type:"removed", left:al[i], i})
    else lines.push({type:"changed", left:al[i], right:bl[i], i})
  }
  return lines
}

export default function Diff(){
  const [left,setLeft]=useState("hello world\nfoo bar\nsame line")
  const [right,setRight]=useState("hello world\nfoo baz\nsame line")
  const [mode,setMode]=useState<"split"|"unified">("split")
  const lines=useMemo(()=>diffLines(left,right),[left,right])
  return <ToolLayout title="Text Diff" description="Side-by-side and unified diff for text" clientSide>
    <div className="flex gap-2">
      <button onClick={()=>setMode("split")} className={`px-3 py-1.5 rounded text-xs border ${mode==="split"?"bg-zinc-900 text-white":"bg-background"}`}>Side by side</button>
      <button onClick={()=>setMode("unified")} className={`px-3 py-1.5 rounded text-xs border ${mode==="unified"?"bg-zinc-900 text-white":"bg-background"}`}>Unified</button>
    </div>
    <div className="grid lg:grid-cols-2 gap-4">
      <TextArea value={left} onChange={setLeft}  mono />
      <TextArea value={right} onChange={setRight}  mono />
    </div>
    <div className="rounded-lg border overflow-hidden">
      <div className="divide-y font-mono text-xs max-h-[400px] overflow-auto">
        {lines.map((l:any)=>(
          <div key={l.i} className={`px-3 py-1 flex gap-3 ${l.type==="added"?"bg-emerald-50 dark:bg-emerald-950/20": l.type==="removed"?"bg-red-50 dark:bg-red-950/20": l.type==="changed"?"bg-amber-50 dark:bg-amber-950/20":""}`}>
            <span className="text-muted-foreground w-6">{l.i+1}</span>
            {mode==="split" ? <><span className="flex-1 break-all">{l.left??""}</span><span className="flex-1 break-all">{l.right??""}</span></> : <span className="flex-1 break-all">{l.type==="added"?"+ "+l.right: l.type==="removed"?"- "+l.left: l.type==="changed"?`~ ${l.left} → ${l.right}`:"  "+l.left}</span>}
          </div>
        ))}
      </div>
    </div>
  </ToolLayout>
}
