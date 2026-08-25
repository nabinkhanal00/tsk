export function sortObject(v:any):any{
  if(Array.isArray(v)) return v.map(sortObject)
  if(v!==null && typeof v==="object"){
    const out:any={}
    Object.keys(v).sort().forEach(k=> out[k]=sortObject(v[k]))
    return out
  }
  return v
}
export function formatJson(input:string, indent:number, sortKeys:boolean){
  if(!input.trim()) throw new Error("Please provide JSON input")
  const parsed=JSON.parse(input)
  const sorted= sortKeys ? sortObject(parsed): parsed
  return JSON.stringify(sorted,null,indent)
}
export function minifyJson(input:string, sortKeys:boolean){
  if(!input.trim()) throw new Error("Please provide JSON input")
  const parsed=JSON.parse(input)
  const sorted= sortKeys ? sortObject(parsed): parsed
  return JSON.stringify(sorted)
}
export function validateJson(input:string): { valid:boolean, error?:string }{
  try{ JSON.parse(input); return {valid:true}}catch(e:any){ return {valid:false, error:e.message}}
}
export type DiffLine = { type:"added"|"removed"|"unchanged"|"changed", left?:string, right?:string, key:string }
export function diffObjects(a:any,b:any,path=""): DiffLine[]{
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
