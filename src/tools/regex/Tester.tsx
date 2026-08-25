import { useState, useMemo } from "react"
import { ToolLayout, TextArea, ErrorPanel } from "../../components/ToolLayout"

export default function Tester(){
  const [pattern,setPattern]=useState("(\\w+)@(\\w+\\.\\w+)")
  const [flags,setFlags]=useState("g")
  const [text,setText]=useState("Contact Ada at ada@example.com and Bob at bob@test.org for info.")
  const [replace,setReplace]=useState("[$1 at $2]")
  const [replaceMode,setReplaceMode]=useState(false)
  const flagOptions=["g","i","m","s","u","y"] as const

  const { matches, error, replaced } = useMemo(()=>{
    try{
      if(!pattern) return { matches:[], error:"", replaced:"" }
      const re=new RegExp(pattern, flags)
      const ms=[...text.matchAll(re)]
      const replaced = replaceMode ? text.replace(re, replace) : ""
      return { matches: ms as RegExpMatchArray[], error:"", replaced }
    }catch(e:any){ return { matches:[], error:e.message, replaced:""} }
  },[pattern,flags,text,replace,replaceMode])

  return <ToolLayout title="Regex Tester" description="Test regex with live highlighting, groups and replace" clientSide>
    <div className="space-y-4">
      <div className="rounded-lg border bg-card p-4 space-y-3">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="font-mono text-sm">/</span>
          <input value={pattern} onChange={e=>setPattern(e.target.value)} placeholder="Enter regex" className="flex-1 min-w-[200px] px-3 py-2 rounded-md border bg-background font-mono text-sm" />
          <span className="font-mono text-sm">/</span>
          <div className="flex gap-1">
            {flagOptions.map(f=>(
              <label key={f} className={`px-2 py-1 rounded border text-xs cursor-pointer ${flags.includes(f)?"bg-zinc-900 text-white":"bg-background"}`}>
                <input type="checkbox" className="hidden" checked={flags.includes(f)} onChange={e=>{
                  setFlags(prev=> e.target.checked ? prev+f : prev.replace(f,""))
                }} />{f}
              </label>
            ))}
          </div>
        </div>
        <ErrorPanel error={error} />
        <div className="text-xs text-muted-foreground">{matches.length} match{matches.length!==1?"es":""} · flags: {flags||"(none)"}</div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium">Test string</label>
          <TextArea value={text} onChange={setText}  placeholder="Paste test string…" mono={false} />
          {matches.length>0 && <div className="mt-2 rounded-lg border bg-card p-3 font-mono text-sm whitespace-pre-wrap break-all">
            {(()=>{
              // simple highlight by splitting with regex
              try{
                const re=new RegExp(pattern, flags.includes("g")?flags:flags+"g")
                let last=0; const parts:React.ReactNode[]=[]
                let m:RegExpExecArray | null
                let idx=0
                while((m=re.exec(text))!==null){
                  if(m.index>last) parts.push(<span key={"t"+idx++}>{text.slice(last,m.index)}</span>)
                  parts.push(<mark key={"m"+idx++} className="bg-yellow-300 dark:bg-yellow-600 px-0.5 rounded">{m[0]}</mark>)
                  last=m.index+m[0].length
                  if(m[0].length===0) re.lastIndex++
                  if(!flags.includes("g")) break
                }
                if(last<text.length) parts.push(<span key="tail">{text.slice(last)}</span>)
                return parts
              }catch{ return text }
            })()}
          </div>}
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={replaceMode} onChange={e=>setReplaceMode(e.target.checked)}/> Replace mode</label>
            {replaceMode && <input value={replace} onChange={e=>setReplace(e.target.value)} placeholder="Replacement…" className="flex-1 px-2 py-1.5 rounded-md border bg-background font-mono text-xs" />}
          </div>
          {replaceMode && <div className="rounded-lg border bg-card p-3 font-mono text-sm whitespace-pre-wrap min-h-[120px]">{replaced}</div>}
          <div className="rounded-lg border bg-card divide-y max-h-[320px] overflow-auto">
            <div className="px-3 py-2 text-xs font-semibold bg-muted">Matches</div>
            {matches.length===0 ? <div className="p-4 text-sm text-muted-foreground text-center">No matches</div> :
              matches.map((m,i)=>(
                <div key={i} className="px-3 py-2 font-mono text-xs">
                  <div className="font-semibold">Match {i+1} <span className="font-normal text-muted-foreground">at index {m.index}</span></div>
                  <div>Full: <span className="bg-secondary px-1 rounded">{m[0]}</span></div>
                  {m.slice(1).map((g,gi)=>(
                    <div key={gi}>Group {gi+1}: <span className="bg-secondary px-1 rounded">{g ?? "(empty)"}</span></div>
                  ))}
                </div>
              ))
            }
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-xs font-semibold">Common patterns</div>
            <div className="flex flex-wrap gap-1 mt-2">
              {[
                ["Email","\\w+@\\w+\\.\\w+"],
                ["URL","https?://\\S+"],
                ["IPv4","\\b\\d{1,3}(\\.\\d{1,3}){3}\\b"],
                ["UUID","[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"],
              ].map(([label,pat])=>(
                <button key={label} onClick={()=>setPattern(pat)} className="px-2 py-1 rounded-full bg-secondary text-xs">{label}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
}
