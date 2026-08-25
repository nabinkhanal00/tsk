import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { BladeMark } from "../components/Header"
import { useSEO } from "../hooks/useSEO"
import { tools, categories } from "../lib/registry"

const SHORT: Record<string,string> = {
  "Date & Time":"TIME", "Developer":"DEV", "Generators":"GEN",
  "Network":"NET", "Reference":"REF",
}

// one blade per tool group — generated from the registry
const BLADES = categories.map((cat,i)=>({
  label: SHORT[cat] ?? cat.toUpperCase(),
  path: (tools.find(t=>t.category===cat) ?? tools[0]).path,
  // varied lengths like a real knife's tool set
  len: 330 + [88,28,62,10,78,42,55,0,70,18,60,32,82,22,48][i],
}))

const SPREAD = 56 // total half-angle of the fan
// the pivot lives at the bottom of the body — blade tangs reach all the way down to it
const PIVOT_B = 36 // px from the knife container's bottom

export function Home(){
  const [open,setOpen]=useState(false)
  const [settled,setSettled]=useState(false)
  const [ripple,setRipple]=useState(0)

  useSEO({
    title: "The Swiss Knife — One toolbox. Every utility you need.",
    description: "47 fast, private, browser-based developer tools for JSON, regex, jq, JWT, dates, encoding, hashing, images, PDFs and more. No uploads, no signup — everything runs locally.",
    path: "/",
  })

  useEffect(()=>{
    const raf=requestAnimationFrame(()=>setOpen(true))
    const t=setTimeout(()=>setSettled(true), 1400)
    return ()=>{ cancelAnimationFrame(raf); clearTimeout(t) }
  },[])

  // red pivot toggles the knife: fully closed ↔ fully open
  const toggle=()=>{
    setRipple(r=>r+1)
    setOpen(v=>!v)
  }

  const n=BLADES.length
  const step=(SPREAD*2)/(n-1)

  return <div className="h-[calc(100vh-52px)] overflow-hidden relative">
    <div className="absolute inset-0 grid-bg" />

    <div className="relative h-full max-w-6xl mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-6 items-center">
      {/* headline */}
      <div>
        <div className="flex items-center gap-3">
          <span className="eyebrow text-muted-foreground">The Swiss Knife</span>
          <span className="h-px flex-1 max-w-16 bg-border" />
          <span className="eyebrow text-muted-foreground">47 utilities</span>
        </div>

        <h1 className="mt-6 font-display font-extrabold uppercase text-5xl sm:text-6xl lg:text-[76px] tracking-[-0.02em] leading-[0.92]">
          One<br/>toolbox<span className="text-primary">.</span>
        </h1>
        <p className="mt-4 font-display font-bold uppercase text-xl sm:text-2xl tracking-tight text-muted-foreground">
          Every utility<br/>you need.
        </p>

        <div className="mt-6 flex items-center gap-3 text-[12px] mono text-muted-foreground">
          <span className="kbd">⌘K</span> opens any tool
        </div>
      </div>

      {/* the knife — blades are navigation */}
      <div className="relative hidden md:flex flex-col items-center select-none lg:scale-90 xl:scale-100">
        <div className="relative w-[560px] h-[500px]">
          {/* dashed fan arc — drafting guide */}
          <svg viewBox="0 0 560 500" className="absolute inset-0 w-full h-full" fill="none" aria-hidden>
            <path d="M 15 285 A 320 320 0 0 1 545 285" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="3 5"/>
          </svg>

          {BLADES.map((b,i)=>{
            const angle = open ? -90 - SPREAD + i*step : -90
            return <Link
              key={b.label}
              to={b.path}
              tabIndex={open? 0 : -1}
              aria-label={`Open ${b.label} tools`}
              className="group absolute left-1/2 bottom-[18px] h-9 hover:z-50"
              style={{
                // the blade's flat BASE edge is anchored at the pivot (left-center);
                // the pointed tip extends outward. closed: stack vertical, slide
                // into the body, fade.
                transform: open ? `rotate(${angle}deg)` : "rotate(-90deg) translateX(-30px)",
                opacity: open ? 1 : 0,
                width: open? b.len : 300,
                transformOrigin:"0 50%",
                transition: settled
                  ? "transform 450ms cubic-bezier(0.5,0,0.3,1), opacity 320ms ease, width 250ms"
                  : `transform 750ms cubic-bezier(0.34,1.4,0.64,1) ${i*80}ms, width 750ms ${i*80}ms, opacity 450ms ${i*80}ms`,
                zIndex: i+1,
              }}
            >
              <span className={`blade-tip w-full h-full rounded-md border flex items-center justify-end gap-2 pr-9 shadow-sm transition-all duration-200 origin-left ${i%2? "bg-card":"bg-secondary" } group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:scale-x-105`}>
                <span className="mono text-[10px] text-primary group-hover:text-primary-foreground">{String(i+1).padStart(2,"0")}</span>
                <span className="mono text-xs font-medium tracking-[0.14em]">{b.label}</span>
              </span>
            </Link>
          })}

          {/* ripple on pivot click */}
          {ripple>0 && [0,1].map(k=>(
            <span key={`${ripple}-${k}`} className="absolute left-1/2 bottom-[36px] -translate-x-1/2 translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-primary ripple-ring" style={{animationDelay:`${k*150}ms`}}/>
          ))}

          {/* the body — an alox shell the blades fold into */}
          <div className="absolute left-1/2 bottom-6 -translate-x-1/2 w-14 h-[110px] rounded-2xl bg-foreground text-background shadow-xl z-40">
            <div className="absolute inset-x-3 top-9 space-y-2.5">
              <div className="h-px bg-background/20"/>
              <div className="h-px bg-background/20"/>
              <div className="h-px bg-background/20"/>
            </div>
            <div className="absolute top-3 inset-x-0 grid place-items-center">
              <BladeMark className="w-5 h-5"/>
            </div>
          </div>

          {/* red pivot — at the base of the blades, bottom of the body; click to toggle */}
          <button
            onClick={toggle}
            aria-label={open ? "Close the blades" : "Open the blades"}
            aria-expanded={open}
            title={open ? "Close" : "Open"}
            className="absolute left-1/2 bottom-[36px] -translate-x-1/2 translate-y-1/2 z-50 cursor-pointer active:scale-90 transition-transform"
          >
            <span className="block w-3.5 h-3.5 rounded-full bg-primary ring-4 ring-background shadow"/>
          </button>
        </div>

        <p className="mono text-[11px] text-muted-foreground mt-3">
          {open ? "pick a blade" : "click the pivot to open"}
        </p>
      </div>
    </div>

    {/* the one privacy line */}
    <div className="absolute bottom-0 inset-x-0 border-t bg-background">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex flex-wrap gap-2 items-center justify-between text-[11px] mono text-muted-foreground">
        <span>Everything runs in your browser. Nothing is uploaded.</span>
        <span>theswissknife.com</span>
      </div>
    </div>
  </div>
}
