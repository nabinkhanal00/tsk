import { useEffect } from "react"

const SITE = "https://theswissknife.com"

function setMeta(attr:"name"|"property", key:string, content:string){
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if(!el){ el=document.createElement("meta"); el.setAttribute(attr,key); document.head.appendChild(el) }
  el.setAttribute("content", content)
}
function setLink(rel:string, href:string){
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if(!el){ el=document.createElement("link"); el.setAttribute("rel",rel); document.head.appendChild(el) }
  el.setAttribute("href", href)
}

export function useSEO({ title, description, path }:{ title:string, description:string, path:string }){
  useEffect(()=>{
    document.title = title
    setMeta("name","description", description)
    setLink("canonical", SITE+path)
    // Open Graph
    setMeta("property","og:title", title)
    setMeta("property","og:description", description)
    setMeta("property","og:url", SITE+path)
    setMeta("property","og:type","website")
    setMeta("property","og:site_name","The Swiss Knife")
    setMeta("property","og:image", `${SITE}/og-image.png`)
    // Twitter
    setMeta("name","twitter:card","summary_large_image")
    setMeta("name","twitter:title", title)
    setMeta("name","twitter:description", description)
    setMeta("name","twitter:image", `${SITE}/og-image.png`)
  },[title, description, path])
}

export { SITE }
