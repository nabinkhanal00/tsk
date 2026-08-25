import { PrivacyBadge } from "./PrivacyBadge"
import { Copy, Download, Trash2, ChevronRight, Check } from "lucide-react"
import { copyToClipboard } from "../lib/utils"
import { useState } from "react"
import { Link } from "react-router-dom"
import { getToolById } from "../lib/registry"

export function ToolLayout({ title, description, clientSide=true, children, related, category }: { title:string, description:string, clientSide?:boolean, children:React.ReactNode, related?:string[], category?:string }){
  if(typeof document!=="undefined") document.title=`The Swiss Knife — ${title}`
  return <div className="max-w-5xl mx-auto px-4 py-6 md:py-8">
    <div className="mb-6">
      <div className="flex items-center gap-1.5 text-[11px] mono text-muted-foreground">
        <Link to="/" className="hover:text-foreground">theswissknife</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground">{category || title.toLowerCase().replace(/\s+/g,"-")}</span>
      </div>
      <div className="mt-2 flex flex-col md:flex-row md:items-start justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-[28px] tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">{description}</p>
        </div>
        <div className="shrink-0 flex flex-col items-start md:items-end gap-2">
          <PrivacyBadge clientSide={clientSide} />
          <span className="text-[11px] mono text-muted-foreground hidden md:inline">⌘↩ run · Esc clear</span>
        </div>
      </div>
      <div className="mt-4 h-px bg-border" />
    </div>

    <div className="space-y-5">{children}</div>

    {related && related.length>0 && <div className="mt-10 pt-6 border-t">
      <h3 className="eyebrow text-muted-foreground">Related</h3>
      <div className="flex flex-wrap gap-2 mt-3">{related.map(r=>{
        const t=getToolById(r)
        if(!t) return null
        return <Link key={r} to={t.path} className="text-xs font-medium px-3 py-1.5 rounded-md border bg-card hover:border-primary hover:text-primary transition-colors">{t.name}</Link>
      })}</div>
    </div>}

    <details className="mt-6 rounded-md border bg-card p-4">
      <summary className="cursor-pointer text-sm font-medium">About this tool</summary>
      <p className="text-sm text-muted-foreground mt-3 leading-relaxed">Shortcuts: <span className="kbd">⌘↩</span> run · <span className="kbd">Esc</span> clear. Works offline as a PWA.</p>
    </details>
  </div>
}

export function CopyButton({ text, label="Copy" }: { text:string, label?:string }){
  const [copied,setCopied]=useState(false)
  return <button onClick={async()=>{
    await copyToClipboard(text); setCopied(true); setTimeout(()=>setCopied(false),1500)
  }} className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${copied?"border-primary text-primary":"bg-card hover:border-muted-foreground/50"}`}>
    {copied? <Check className="w-3.5 h-3.5"/> : <Copy className="w-3.5 h-3.5"/>} {copied?"Copied":label}
  </button>
}
export function DownloadButton({ content, filename }: { content:string, filename:string }){
  return <button onClick={()=>{
    const blob=new Blob([content],{type:"text/plain"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=filename; a.click(); URL.revokeObjectURL(url)
  }} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border bg-card hover:border-muted-foreground/50 transition-colors">
    <Download className="w-3.5 h-3.5" /> Download
  </button>
}
export function ClearButton({ onClear }: { onClear:()=>void }){
  return <button onClick={onClear} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border bg-card hover:border-primary hover:text-primary transition-colors"><Trash2 className="w-3.5 h-3.5"/> Clear</button>
}

export function TextArea({ value, onChange, placeholder, rows=12, mono=true }: { value:string, onChange:(v:string)=>void, placeholder?:string, rows?:number, mono?:boolean }){
  return <div className="relative group">
    <div className="absolute top-2 right-2 text-[10px] mono text-muted-foreground bg-card px-1.5 py-0.5 rounded border opacity-0 group-focus-within:opacity-100 transition-opacity">{value.length} chars</div>
    <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} aria-label={placeholder||"Input"} className={`w-full rounded-md border bg-card p-3 pt-4 text-sm leading-6 focus:outline-none focus:border-primary resize-y ${mono?"font-mono !text-[13px]":""}`} />
  </div>
}
export function ErrorPanel({ error }: { error:string }){
  if(!error) return null
  const isSuccess = error.startsWith("✓")
  return <div className={`rounded-md border p-3 text-sm whitespace-pre-wrap flex gap-2.5 ${isSuccess?"border-emerald-600/30 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400":"border-primary/40 bg-primary/5 text-primary"}`}>
    <span className={`w-5 h-5 rounded-full grid place-items-center text-[11px] font-bold shrink-0 text-primary-foreground ${isSuccess?"bg-emerald-600":"bg-primary"}`}>{isSuccess?"✓":"!"}</span>
    <span>{error}</span>
  </div>
}
export function OutputPanel({ value, placeholder }: { value:string, placeholder?:string }){
  return <div className="rounded-md border overflow-hidden" style={{background:"var(--term-bg)", borderColor:"var(--term-border)"}}>
    <div className="flex items-center gap-2 px-3 py-2 border-b text-[11px] mono" style={{background:"var(--term-panel)", borderColor:"var(--term-border)", color:"var(--term-muted)"}}>
      <span className="w-1.5 h-1.5 rounded-full" style={{background:"var(--term-green)"}}/> output
      <span className="ml-auto">{value.length ? `${value.length} chars` : "empty"}</span>
    </div>
    <div className="p-3 font-mono text-sm whitespace-pre-wrap break-all min-h-[120px] max-h-[500px] overflow-auto" style={{color:"var(--term-fg)"}}>{value || <span style={{color:"var(--term-muted)"}}>{placeholder||"Output will appear here"}</span>}</div>
  </div>
}
