import { tools, categories } from "../lib/registry"
import { NavLink, useNavigate, useLocation } from "react-router-dom"
import { getFavorites } from "../hooks/useLocal"
import { useState, useEffect, useRef } from "react"
import { Star, Dices, Search, X } from "lucide-react"

export function Sidebar({ open, onClose }: { open:boolean, onClose:()=>void }){
  const [favs,setFavs]=useState<string[]>([])
  const [now,setNow]=useState(()=> new Date())
  const [rolling,setRolling]=useState(false)
  const [q,setQ]=useState("")
  const filterRef=useRef<HTMLInputElement>(null)
  const navigate=useNavigate()
  const location=useLocation()

  useEffect(()=>{ setFavs(getFavorites()); const h=()=>setFavs(getFavorites()); window.addEventListener("storage",h); window.addEventListener("focus",h); const id=setInterval(()=>setFavs(getFavorites()),1000); return()=>{window.removeEventListener("storage",h); window.removeEventListener("focus",h); clearInterval(id)}},[])
  useEffect(()=>{ const id=setInterval(()=>setNow(new Date()),1000); return()=>clearInterval(id)},[])
  // keep the active tool in view
  useEffect(()=>{
    const el=document.querySelector(`aside a[href="${location.pathname}"]`)
    el?.scrollIntoView({ block:"nearest" })
  },[location.pathname])
  // "/" focuses the filter (when not typing somewhere else)
  useEffect(()=>{
    const h=(e:KeyboardEvent)=>{
      if(e.key==="/" && !["INPUT","TEXTAREA","SELECT"].includes((e.target as HTMLElement)?.tagName)){
        e.preventDefault(); filterRef.current?.focus()
      }
    }
    window.addEventListener("keydown",h); return()=>window.removeEventListener("keydown",h)
  },[])

  const favTools = tools.filter(t=>favs.includes(t.id))
  const utc = now.toISOString().slice(11,19)
  const randomTool=()=>{
    setRolling(true)
    setTimeout(()=>{
      const t=tools[Math.floor(Math.random()*tools.length)]
      navigate(t.path)
      onClose()
      setRolling(false)
    }, 500)
  }

  const query=q.trim().toLowerCase()
  const matches=(t:typeof tools[number])=>
    !query ||
    t.name.toLowerCase().includes(query) ||
    t.category.toLowerCase().includes(query) ||
    t.keywords.some(k=>k.includes(query))
  const visibleCategories = categories
    .map(cat=>({ cat, list: tools.filter(t=>t.category===cat && matches(t)) }))
    .filter(g=>g.list.length>0)
  const totalMatches = query ? tools.filter(matches).length : tools.length

  return <>
    {open && <div className="fixed inset-0 bg-zinc-950/30 dark:bg-black/60 z-30 md:hidden" onClick={onClose} />}
    <aside className={`fixed md:sticky top-[52px] h-[calc(100vh-52px)] w-[264px] bg-background border-r overflow-hidden flex flex-col z-30 md:z-10 transition-transform ${open?"translate-x-0":"-translate-x-full md:translate-x-0"}`}>
      {/* filter — scan or narrow the whole toolbox */}
      <div className="p-3 pb-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground"/>
          <input
            ref={filterRef}
            value={q}
            onChange={e=>setQ(e.target.value)}
            placeholder="Filter tools…"
            aria-label="Filter tools in sidebar"
            className="w-full pl-8 pr-7 py-1.5 rounded-md border bg-card text-[13px] focus:outline-none focus:border-primary placeholder:text-muted-foreground"
          />
          {q && <button onClick={()=>setQ("")} aria-label="Clear filter" className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded"><X className="w-3 h-3"/></button>}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-3 pt-1 space-y-4">
          {query && <div className="eyebrow text-muted-foreground px-2">{totalMatches} result{totalMatches===1?"":"s"}</div>}

          {/* flat results while filtering */}
          {query ? (
            visibleCategories.length===0 ? (
              <div className="px-2 py-6 text-center">
                <div className="text-sm text-muted-foreground">Nothing matches "{q}"</div>
                <button onClick={()=>setQ("")} className="mt-2 text-xs text-primary hover:underline">Clear filter</button>
              </div>
            ) : visibleCategories.map(({cat,list})=>(
              <div key={cat}>
                <div className="eyebrow text-muted-foreground px-2 py-1">{cat}</div>
                {list.map(t=>(
                  <NavLink key={t.id} to={t.path} onClick={onClose} className={({isActive})=>`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] transition-colors ${isActive?"bg-accent text-foreground font-medium":"text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
                    {({isActive})=>(
                      <>
                        <span className={`w-1 h-1 rounded-full shrink-0 ${isActive?"bg-primary":"bg-border"}`}/>
                        <span className="truncate flex-1">{t.name}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            ))
          ) : (<>
            {/* favorites */}
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

            {/* the full index — every tool visible, nothing hidden */}
            {categories.map((cat,i)=>{
              const list=tools.filter(t=>t.category===cat)
              if(!list.length) return null
              return <div key={cat}>
                <div className="flex items-baseline gap-2 px-2 py-1.5">
                  <span className="mono text-[10px] text-muted-foreground/70">{String(i+1).padStart(2,"0")}</span>
                  <span className="eyebrow text-foreground">{cat}</span>
                  <span className="ml-auto mono text-[10px] text-muted-foreground">{list.length}</span>
                </div>
                <div className="space-y-px">
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
            })}
          </>)}
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
