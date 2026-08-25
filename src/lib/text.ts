export function toCamel(s:string){ return s.replace(/[-_\s]+(.)?/g, (_,c)=>c?c.toUpperCase():"").replace(/^(.)/,m=>m.toLowerCase())}
export function toPascal(s:string){ const c=toCamel(s); return c.charAt(0).toUpperCase()+c.slice(1)}
export function toSnake(s:string){ return s.replace(/([a-z0-9])([A-Z])/g,"$1_$2").replace(/[\s-]+/g,"_").toLowerCase()}
export function toKebab(s:string){ return s.replace(/([a-z0-9])([A-Z])/g,"$1-$2").replace(/[\s_]+/g,"-").toLowerCase()}
export function toScream(s:string){ return toSnake(s).toUpperCase()}
export function wordCount(s:string){ return s.trim()? s.trim().split(/\s+/).length:0}
export function lineCount(s:string){ return s.split("\n").length}
export function sortLines(s:string){ return s.split("\n").sort().join("\n")}
export function dedupeLines(s:string){ return s.split("\n").filter((v,i,a)=>a.indexOf(v)===i).join("\n")}
export function reverseText(s:string){ return s.split("").reverse().join("")}
export function trimLines(s:string){ return s.split("\n").map(l=>l.trim()).join("\n")}
export function diffLines(a:string,b:string){
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
