import { useEffect, useState } from "react"
export type Theme = "light"|"dark"|"system"
export function useTheme(){
  const [theme,setTheme]=useState<Theme>(()=>{
    try{ return (globalThis.localStorage?.getItem("theme") as Theme) || "system"}catch{return "system"}
  })
  useEffect(()=>{
    const root = document.documentElement
    const media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : { matches:false, addEventListener:()=>{}, removeEventListener:()=>{}} as any
    const apply = (t: Theme)=>{
      const dark = t==="dark" || (t==="system" && media.matches)
      root.classList.toggle("dark", dark)
    }
    apply(theme)
    try{ globalThis.localStorage?.setItem("theme", theme)}catch{}
    const handler = ()=>{ if(theme==="system") apply("system") }
    media.addEventListener("change", handler)
    return ()=> media.removeEventListener("change", handler)
  },[theme])
  return { theme, setTheme }
}
