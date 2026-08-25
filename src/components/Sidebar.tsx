import { tools, categories } from "../lib/registry"
import { NavLink, useNavigate, useLocation } from "react-router-dom"
import { getFavorites } from "../hooks/useLocal"
import { useState, useEffect } from "react"
import { Star, Dices, ChevronRight } from "lucide-react"

const OPEN_KEY = "sidebar-open"

export function Sidebar({ open, onClose }: { open:boolean, onClose:()=>void }){
  const [favs,setFavs]=useState<string[]>([])
  const [now,setNow]=useState(()=> new Date())
  const [rolling,setRolling]=useState(false)
  const [expanded,setExpanded]=useState<string[]>(()=>{ try{ return JSON.parse(localStorage.getItem(OPEN_KEY)||"[]") }catch{ return [] }})
  const navigate=useNavigate()
  const location=useLocation()
  useEffect(()=>{ setFavs(getFavorites()); const h=()=>setFavs(getFavorites()); window.addEventListener("storage",h); window.addEventListener("focus",h); const id=setInterval(()=>setFavs(getFavorites()),1000); return()=>{window.removeEventListener("storage",h); window.removeEventListener("focus",h); clearInterval(id)}},[])
  useEffect(()=>{ const id=setInterval(()=>setNow(new Date()),1000); return()=>clearInterval(id)},[])
  useEffect(()=>{ try{ localStorage.setItem(OPEN_KEY, JSON.stringify(expanded)) }catch{} },[expanded])
  // the category owning the active tool is always shown open (not persisted)
  const autoCat = tools.find(x=>x.path===location.pathname)?.category
  const favTools = tools.filter(t=>favs.includes(t.id))
  const utc = now.toISOString().slice(11,19)
  const toggle=(cat:string)=> setExpanded(prev=> prev.includes(cat)? prev.filter(c=>c!==cat) : [...prev,cat])
  const randomTool=()=>{
    setRolling(true)
    setTimeout(()=>{
      const t=tools[Math.floor(Math.random()*tools.length)]
      navigate(t.path)
      onClose()
      setRolling(false)
    }, 500)
  }
  return <>
    {open && <div className="fixed inset-0 bg-zinc-950/30 dark:bg-black/60 z-30 md:hidden" onClick={onClose} />}
    <aside className={`fixed md:sticky top-[52px] h-[calc(100vh-52px)] w-[264px] bg-background border-r overflow-hidden flex flex-col z-30 md:z-10 transition-transform ${open?"translate-x-0":"-translate-x-full md:translate-x-0"}`}>
      <div className="flex-1 overflow-auto">
        <div className="p-3 space-y-5">
          {favTools.length>0 && <div>
            <div className="flex items-center gap-2 px-2 py-1.5">
              <Star className="w-3 h-3 text-primary fill-primary" />
              <span className="eyebrow text-muted-foreground">Favorites</span>
              <span className="ml-auto text-[11px] mono text-muted-foreground">{String(favTools.length).padStart(2,"0")}</span>
            </div>
            <div className="space-y-px mt-0.5">
            {favTools.map(t=>(
              <NavLink key={t.id} to={t.path} onClick={onClose} className={({isActive})=>`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] transition-colors ${isActive?"bg-accent text-foreground font-medium":"text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
                <span className="w-1 h-1 rounded-full bg-primary shrink-0"/>
                <span className="truncate flex-1">{t.name}</span>
              </NavLink>
            ))}
            </div>
          </div>}

          {categories.map((cat,i)=>{
            const list=tools.filter(t=>t.category===cat)
            if(!list.length) return null
            const isOpen = expanded.includes(cat) || cat===autoCat
            return <div key={cat}>
              <button
                onClick={()=>toggle(cat)}
                aria-expanded={isOpen}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-secondary transition-colors text-left"
              >
                <ChevronRight className={`w-3 h-3 text-muted-foreground transition-transform duration-200 ${isOpen?"rotate-90":""}`}/>
                <span className="mono text-[10px] text-muted-foreground/70">{String(i+1).padStart(2,"0")}</span>
                <span className="eyebrow text-foreground">{cat}</span>
                <span className="ml-auto mono text-[10px] text-muted-foreground">{list.length}</span>
              </button>
              <div className={`grid transition-[grid-template-rows] duration-200 ${isOpen?"grid-rows-[1fr]":"grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <div className="space-y-px pt-0.5">
                  {list.map(t=>(
                    <NavLink key={t.id} to={t.path} onClick={onClose} className={({isActive})=>`flex items-center gap-2.5 pl-6 pr-2.5 py-1.5 rounded-md text-[13px] truncate transition-colors ${isActive?"bg-accent text-foreground font-medium":"text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
                      {({isActive})=>(
                        <>
                          <span className={`w-1 h-1 rounded-full shrink-0 ${isActive?"bg-primary":"bg-border"}`}/>
                          <span className="truncate flex-1">{t.name}</span>
                        </>
                      )}
                    </NavLink>
                  ))}
                  </div>
                </div>
              </div>
            </div>
          })}
        </div>
      </div>
      <div className="p-3 border-t flex items-center gap-2">
        <button
          onClick={randomTool}
          title="Open a random tool"
          className="group flex items-center gap-2 px-2.5 py-2 rounded-md border bg-card hover:border-primary hover:text-primary transition-colors"
        >
          <Dices className={`w-4 h-4 transition-transform duration-500 ${rolling?"rotate-[360deg]":""}`}/>
          <span className="text-[11px] mono">surprise me</span>
        </button>
        <span className="ml-auto mono text-[11px] text-muted-foreground tabular-nums" title="Current time (UTC)">
          {utc} UTC
        </span>
      </div>
    </aside>
  </>
}
