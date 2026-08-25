import { Moon, Sun, Github, Menu, X, Search, ArrowRight, Monitor } from "lucide-react"
import { useTheme } from "../hooks/useTheme"
import { useState, useEffect } from "react"
import { searchTools, tools } from "../lib/registry"
import { useNavigate } from "react-router-dom"
import { getRecent } from "../hooks/useLocal"

/** Fanned tool blades with pointed tips around a red pivot — the mark. */
export function BladeMark({ className = "w-4 h-4" }){
  return <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden>
    <g fill="currentColor">
      <path d="M13.6 20.5 L16 5.2 L18.4 20.5 Z" transform="rotate(-42 16 20.5)"/>
      <path d="M13.2 20.5 L16 3.2 L18.8 20.5 Z"/>
      <path d="M13.6 20.5 L16 5.2 L18.4 20.5 Z" transform="rotate(42 16 20.5)"/>
    </g>
    <circle cx="16" cy="20.5" r="3.1" className="fill-primary"/>
  </svg>
}

export function Header({ onMenu }: { onMenu:()=>void }){
  const { theme, setTheme } = useTheme()
  const [open,setOpen]=useState(false)
  const [q,setQ]=useState("")
  const navigate=useNavigate()
  const results = q ? searchTools(q).slice(0,8) : []

  useEffect(()=>{
    const h=(e:KeyboardEvent)=>{ if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){ e.preventDefault(); setOpen(v=>!v)} if(e.key==="Escape") setOpen(false)}
    window.addEventListener("keydown",h); return()=>window.removeEventListener("keydown",h)
  },[])

  return <header className="sticky top-0 z-40 border-b bg-background">
    <div className="flex items-center gap-3 px-3 md:px-6 h-[52px] max-w-[1600px] mx-auto w-full">
      <button onClick={onMenu} aria-label="Open menu" className="md:hidden p-2 rounded-md hover:bg-accent"><Menu className="w-4 h-4"/></button>

      <a href="/" className="flex items-center gap-2.5 shrink-0">
        <div className="w-8 h-8 rounded-md bg-foreground text-background grid place-items-center">
          <BladeMark className="w-5 h-5"/>
        </div>
        <div className="hidden sm:block leading-none">
          <div className="font-display font-bold text-[14px] tracking-tight">The Swiss Knife</div>
          <div className="text-[11px] mono text-muted-foreground mt-0.5">theswissknife.com</div>
        </div>
      </a>

      <div className="flex-1 max-w-[560px] mx-2 md:mx-8 relative">
        <button onClick={()=>setOpen(true)} className="w-full group flex items-center gap-2.5 px-3 py-2 rounded-md border bg-card hover:border-muted-foreground/40 transition-colors text-left">
          <Search className="w-3.5 h-3.5 text-muted-foreground"/>
          <span className="flex-1 text-[13px] text-muted-foreground truncate">Search tools…</span>
          <span className="kbd">⌘K</span>
        </button>

        {open && <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] p-4">
          <div className="absolute inset-0 bg-zinc-950/30 dark:bg-black/60" onClick={()=>setOpen(false)} />
          <div className="relative w-full max-w-[640px] bg-card rounded-lg shadow-2xl border overflow-hidden flex flex-col max-h-[68vh]">
            <div className="flex items-center gap-3 px-4 py-3.5 border-b">
              <div className="w-8 h-8 rounded-md bg-foreground text-background grid place-items-center shrink-0"><Search className="w-4 h-4"/></div>
              <input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Search tools, categories, keywords…" className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-muted-foreground" />
              <span className="kbd">ESC</span>
              <button onClick={()=>setOpen(false)} aria-label="Close" className="p-1.5 hover:bg-accent rounded"><X className="w-4 h-4"/></button>
            </div>
            <div className="overflow-auto p-2">
              {q ? results.map(t=>(
                <button key={t.id} onClick={()=>{setOpen(false); navigate(t.path); setQ("")}} className="w-full text-left px-3 py-2.5 rounded-md hover:bg-accent flex items-center gap-3 group">
                  <span className="mono text-[10px] text-muted-foreground w-8 shrink-0">{t.category.slice(0,2).toUpperCase()}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{t.description}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              )) : <div className="p-1 space-y-4">
                <div>
                  <div className="eyebrow text-muted-foreground px-3 py-2">Popular</div>
                  {tools.slice(0,6).map(t=>(
                    <button key={t.id} onClick={()=>{setOpen(false); navigate(t.path)}} className="w-full text-left px-3 py-2.5 rounded-md hover:bg-accent flex items-center gap-3 text-[13px]">
                      <span className="mono text-[10px] text-muted-foreground w-8 shrink-0">{t.category.slice(0,2).toUpperCase()}</span>
                      <span className="font-medium flex-1">{t.name}</span>
                      <span className="text-xs text-muted-foreground hidden sm:inline">{t.category}</span>
                    </button>
                  ))}
                </div>
                <div>
                  <div className="eyebrow text-muted-foreground px-3 py-2">Recent</div>
                  {getRecent().length? getRecent().slice(0,5).map(id=>{
                    const t=tools.find(x=>x.id===id); if(!t) return null
                    return <button key={id} onClick={()=>{setOpen(false); navigate(t.path)}} className="w-full text-left px-3 py-2 rounded-md hover:bg-accent text-[13px] font-medium flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-primary"/>{t.name}
                      <span className="text-xs text-muted-foreground ml-auto font-normal">{t.category}</span>
                    </button>
                  }) : <div className="text-xs text-muted-foreground px-3 py-2">Tools you open will appear here.</div>}
                </div>
              </div>}
              {q && results.length===0 && <div className="p-8 text-center">
                <div className="text-sm font-medium">No tools match "{q}"</div>
                <div className="text-xs text-muted-foreground mt-1">Try "json", "regex", "pdf", "hash"</div>
              </div>}
            </div>
            <div className="px-3 py-2 border-t flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="flex items-center gap-3"><span className="flex items-center gap-1"><span className="kbd">↑↓</span> navigate</span><span className="flex items-center gap-1"><span className="kbd">↵</span> open</span></span>
              <span className="hidden sm:inline">47 tools · no signup</span>
            </div>
          </div>
        </div>}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <a href="https://github.com" target="_blank" rel="noreferrer" className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border bg-card hover:border-muted-foreground/40 text-xs font-medium">
          <Github className="w-3.5 h-3.5"/> <span className="hidden lg:inline">GitHub</span>
        </a>
        <div className="flex items-center gap-0.5 ml-1 p-0.5 rounded-md border bg-card">
          <button onClick={()=> setTheme("light")} aria-label="Light theme" title="Paper (light)" className={`p-1.5 rounded-sm transition-colors ${theme==="light"?"bg-accent text-foreground":"text-muted-foreground hover:text-foreground"}`}>
            <Sun className="w-3.5 h-3.5"/>
          </button>
          <button onClick={()=> setTheme("system")} aria-label="System theme" title="Follow system" className={`p-1.5 rounded-sm transition-colors ${theme==="system"?"bg-accent text-foreground":"text-muted-foreground hover:text-foreground"}`}>
            <Monitor className="w-3.5 h-3.5"/>
          </button>
          <button onClick={()=> setTheme("dark")} aria-label="Dark theme" title="Alox (dark)" className={`p-1.5 rounded-sm transition-colors ${theme==="dark"?"bg-accent text-foreground":"text-muted-foreground hover:text-foreground"}`}>
            <Moon className="w-3.5 h-3.5"/>
          </button>
        </div>
      </div>
    </div>
  </header>
}
