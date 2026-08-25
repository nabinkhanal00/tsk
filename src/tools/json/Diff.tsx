import { useState, useMemo } from "react"
import { ToolLayout, TextArea } from "../../components/ToolLayout"

type DiffLine = { type:"added"|"removed"|"unchanged"|"changed", left?:string, right?:string, key:string }

function diffObjects(a:any,b:any,path=""): DiffLine[]{
  const keys=new Set([...Object.keys(a||{}),...Object.keys(b||{})])
  const lines:DiffLine[]=[]
  for(const k of Array.from(keys).sort()){
    const va=a?.[k], vb=b?.[k]
    const curPath=path?`${path}.${k}`:k
    if(!(k in (a||{}))) lines.push({type:"added", right:`${curPath}: ${JSON.stringify(vb)}`, key:curPath})
    else if(!(k in (b||{}))) lines.push({type:"removed", left:`${curPath}: ${JSON.stringify(va)}`, key:curPath})
    else if(typeof va==="object" && va!==null && typeof vb==="object" && vb!==null && !Array.isArray(va) && !Array.isArray(vb)){
      lines.push(...diffObjects(va,vb,curPath))
    } else if(JSON.stringify(va)!==JSON.stringify(vb)){
      lines.push({type:"changed", left:`${curPath}: ${JSON.stringify(va)}`, right:`${curPath}: ${JSON.stringify(vb)}`, key:curPath})
    } else {
      lines.push({type:"unchanged", left:`${curPath}: ${JSON.stringify(va)}`, key:curPath})
    }
  }
  return lines
}

export default function Diff(){
  const [left,setLeft]=useState('{"name":"Ada","age":36,"city":"Kathmandu"}')
  const [right,setRight]=useState('{"name":"Ada","age":37,"country":"Nepal"}')
  const [mode,setMode]=useState<"split"|"unified">("split")
  const result=useMemo(()=>{
    try{
      const a=left.trim()?JSON.parse(left):{}
      const b=right.trim()?JSON.parse(right):{}
      if(Array.isArray(a) || Array.isArray(b)){
        // simple array diff via JSON string compare
        const al=JSON.stringify(a,null,2).split("\n")
        const bl=JSON.stringify(b,null,2).split("\n")
        const max=Math.max(al.length,bl.length)
        const lines:DiffLine[]=[]
        for(let i=0;i<max;i++){
          if(al[i]===bl[i]) lines.push({type:"unchanged", left:al[i], key:"l"+i})
          else if(al[i] && !bl[i]) lines.push({type:"removed", left:al[i], key:"l"+i})
          else if(!al[i] && bl[i]) lines.push({type:"added", right:bl[i], key:"r"+i})
          else lines.push({type:"changed", left:al[i], right:bl[i], key:String(i)})
        }
        return { lines, error:""}
      }
      return { lines: diffObjects(a,b), error:""}
    }catch(e:any){ return { lines:[], error:e.message } }
  },[left,right])
  return <ToolLayout title="JSON Diff" description="Compare two JSON documents" clientSide>
    <div className="flex gap-2 mb-2">
      <button onClick={()=>setMode("split")} className={`px-3 py-1.5 rounded-md text-xs border ${mode==="split"?"bg-zinc-900 text-white":"bg-background"}`}>Side by side</button>
      <button onClick={()=>setMode("unified")} className={`px-3 py-1.5 rounded-md text-xs border ${mode==="unified"?"bg-zinc-900 text-white":"bg-background"}`}>Unified</button>
    </div>
    <div className="grid lg:grid-cols-2 gap-4">
      <TextArea value={left} onChange={setLeft} placeholder="Left JSON"  />
      <TextArea value={right} onChange={setRight} placeholder="Right JSON"  />
    </div>
    {result.error ? <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{result.error}</div> :
      <div className="rounded-lg border overflow-hidden">
        <div className="px-3 py-2 bg-muted text-xs font-medium flex gap-4"><span className="text-emerald-600">● Added</span><span className="text-red-600">● Removed</span><span className="text-amber-600">● Changed</span><span className="text-muted-foreground">● Unchanged</span></div>
        <div className="divide-y max-h-[420px] overflow-auto font-mono text-[12px]">
          {result.lines.map(l=>(
            <div key={l.key} className={`px-3 py-1 flex gap-4 ${l.type==="added"?"bg-emerald-50 dark:bg-emerald-950/30": l.type==="removed"?"bg-red-50 dark:bg-red-950/30": l.type==="changed"?"bg-amber-50 dark:bg-amber-950/20":""}`}>
              {mode==="split" ? <>
                <span className="flex-1 whitespace-pre-wrap break-all">{l.left||""}</span>
                <span className="flex-1 whitespace-pre-wrap break-all">{l.right||""}</span>
              </> : <span className="flex-1 whitespace-pre-wrap break-all">{l.type==="added"?"+ "+l.right: l.type==="removed"?"- "+l.left: l.type==="changed"?`~ ${l.left} → ${l.right}`:"  "+l.left}</span>}
              <span className="text-[10px] px-1 rounded bg-secondary h-fit">{l.type}</span>
            </div>
          ))}
          {result.lines.length===0 && <div className="p-6 text-center text-sm text-muted-foreground">No differences — JSON documents are identical</div>}
        </div>
      </div>
    }
  </ToolLayout>
}
