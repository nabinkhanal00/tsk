function splitPipe(s:string){
  const parts:string[]=[]; let depth=0, cur=""
  for(let i=0;i<s.length;i++){ const c=s[i]; if(c==="("||c==="[") depth++; if(c===")"||c==="]") depth--; if(c==="|" && depth===0){ parts.push(cur); cur=""; continue } cur+=c }
  parts.push(cur); return parts
}
function evalSelect(item:any, cond:string):boolean{
  cond=cond.trim()
  let m=cond.match(/^\.(\w+)\s*(>|<|>=|<=|==|!=)\s*(.+)$/)
  if(!m) throw new Error(`Unsupported select condition: ${cond}`)
  const [,key,op,raw]=m
  let val:any = raw.trim()
  if(val.startsWith('"') && val.endsWith('"')) val=val.slice(1,-1)
  else if(!isNaN(Number(val))) val=Number(val)
  else if(val==="true") val=true
  else if(val==="false") val=false
  const iv=item[key]
  switch(op){
    case ">": return iv > val
    case "<": return iv < val
    case ">=": return iv >= val
    case "<=": return iv <= val
    case "==": return iv == val
    case "!=": return iv != val
    default: return false
  }
}
function applyFilter(data:any, filter:string):any{
  if(filter===".") return data
  if(filter===".[]") return Array.isArray(data)? data : Object.values(data)
  if(/^\.\w+(\.\w+)*$/.test(filter)){
    // jq semantics: a property path applied to an array maps over its elements
    if(Array.isArray(data)) return data.map((item:any)=>{
      let cur=item
      for(const k of filter.slice(1).split(".")){ if(cur==null) return null; cur=cur?.[k] }
      return cur
    })
    const path=filter.slice(1).split(".")
    let cur=data
    for(const k of path){ if(cur==null) return null; cur=cur[k] }
    return cur
  }
  if(/^\.\w+\[\]$/.test(filter)){ const k=filter.slice(1,-2); const arr=data[k]; return Array.isArray(arr)?arr:[] }
  if(/^\.\w+\[\d+\]$/.test(filter)){ const m=filter.match(/^\.(\w+)\[(\d+)\]$/); if(m){ const arr=data[m[1]]; return arr?.[Number(m[2])] } }
  if(/^\.\[\]$/.test(filter)){ return data }
  if(filter.startsWith("map(")){
    const inner=filter.slice(4,-1)
    if(!Array.isArray(data)) throw new Error("map() requires array")
    if(inner.startsWith("select(")){
      const cond=inner.slice(7,-1)
      return data.filter((item:any)=> evalSelect(item, cond))
    }
    return data.map((item:any)=> applyFilter(item, inner))
  }
  if(filter.startsWith("select(")){
    if(Array.isArray(data)) return data.filter((item:any)=> evalSelect(item, filter.slice(7,-1)))
    return evalSelect(data, filter.slice(7,-1)) ? data : null
  }
  if(filter.startsWith("group_by(")){
    const key=filter.slice(9,-1).replace(/^\./,"")
    if(!Array.isArray(data)) throw new Error("group_by requires array")
    const correct:Record<string,any[]>={}
    for(const item of data){ const k=String(item[key]); if(!correct[k]) correct[k]=[]; correct[k].push(item) }
    return Object.values(correct)
  }
  if(filter.includes("|")) throw new Error("Nested pipe not supported in this segment")
  if(filter.startsWith(".")) {
    const path=filter.slice(1).split(".")
    let cur=data
    for(const k of path){ if(cur==null) return null; cur=cur?.[k] }
    return cur
  }
  throw new Error(`Unsupported filter: ${filter}`)
}
export function runJq(json:any, filter:string): { result:any, error:string }{
  const f=filter.trim()
  if(!f || f===".") return { result: json, error:"" }
  try{
    const pipes = splitPipe(f)
    let cur=json
    for(const p of pipes){ cur = applyFilter(cur, p.trim()) }
    return { result: cur, error:"" }
  }catch(e:any){ return { result:null, error:e.message } }
}
