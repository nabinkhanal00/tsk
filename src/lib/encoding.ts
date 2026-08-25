export function base64Encode(input:string, urlSafe=false){
  let b=btoa(unescape(encodeURIComponent(input)))
  if(urlSafe) b=b.replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")
  return b
}
export function base64Decode(input:string, urlSafe=false){
  let s=input.trim()
  if(urlSafe) s=s.replace(/-/g,"+").replace(/_/g,"/")
  while(s.length%4) s+="="
  return decodeURIComponent(escape(atob(s)))
}
export function urlEncode(s:string){ return encodeURIComponent(s)}
export function urlDecode(s:string){ return decodeURIComponent(s)}
export function htmlEncode(s:string){ return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}
export function htmlDecode(s:string){ 
  if(typeof document!=="undefined"){ const el=document.createElement("div"); el.innerHTML=s; return el.textContent||"" }
  return s.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'")
}
export function hexEncode(s:string){ return Array.from(s).map(c=>c.charCodeAt(0).toString(16).padStart(2,"0")).join(" ")}
export function hexDecode(s:string){ return s.trim().split(/\s+/).map(h=>String.fromCharCode(parseInt(h,16))).join("")}
export function binaryEncode(s:string){ return Array.from(s).map(c=>c.charCodeAt(0).toString(2).padStart(8,"0")).join(" ")}
export function binaryDecode(s:string){ return s.trim().split(/\s+/).map(b=>String.fromCharCode(parseInt(b,2))).join("")}
export function unicodeEscape(s:string){ return Array.from(s).map(c=>"\\u"+c.charCodeAt(0).toString(16).padStart(4,"0")).join("")}
export function decodeJwt(token:string){
  const parts=token.trim().split(".")
  if(parts.length<2) throw new Error("JWT must have at least 2 parts")
  const decode=(s:string)=>{
    let str=s.replace(/-/g,"+").replace(/_/g,"/")
    while(str.length%4) str+="="
    return JSON.parse(decodeURIComponent(escape(atob(str))))
  }
  return { header: decode(parts[0]), payload: decode(parts[1]), signature: parts[2]||""}
}
