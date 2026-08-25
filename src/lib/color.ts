export function hexToRgb(hex:string){ hex=hex.replace("#",""); if(hex.length===3) hex=hex.split("").map(c=>c+c).join(""); const n=parseInt(hex,16); return {r:(n>>16)&255,g:(n>>8)&255,b:n&255}}
export function rgbToHex(r:number,g:number,b:number){ return "#"+[r,g,b].map(v=>v.toString(16).padStart(2,"0")).join("")}
export function luminance(r:number,g:number,b:number){
  const a=[r,g,b].map(v=>{ v/=255; return v<=0.03928? v/12.92 : Math.pow((v+0.055)/1.055,2.4)})
  return 0.2126*a[0]+0.7152*a[1]+0.0722*a[2]
}
export function contrast(c1:string,c2:string){
  const a=hexToRgb(c1), b=hexToRgb(c2)
  const l1=luminance(a.r,a.g,a.b), l2=luminance(b.r,b.g,b.b)
  return (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05)
}
export function meetsAA(ratio:number){ return ratio>=4.5}
export function meetsAAA(ratio:number){ return ratio>=7}
