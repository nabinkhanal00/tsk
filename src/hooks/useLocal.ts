function ls(){ 
  try{ return globalThis.localStorage }catch{ return null as any}
}
export function getFavorites(): string[] { try{return JSON.parse(ls()?.getItem("favorites")||"[]")}catch{return []}}
export function toggleFavorite(id:string){
  const favs=getFavorites()
  const next=favs.includes(id)? favs.filter(f=>f!==id) : [...favs,id]
  try{ ls()?.setItem("favorites", JSON.stringify(next)) }catch{}
  return next
}
export function getRecent(): string[] { try{return JSON.parse(ls()?.getItem("recent")||"[]")}catch{return []}}
export function pushRecent(id:string){
  const r=getRecent().filter(x=>x!==id)
  r.unshift(id)
  try{ ls()?.setItem("recent", JSON.stringify(r.slice(0,10))) }catch{}
}
