import { useState, useMemo } from "react"
import { ToolLayout, TextArea } from "../../components/ToolLayout"

function renderMd(md:string){
  let html=md
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/^\- (.*$)/gim, "<li>$1</li>")
    .replace(/\n/g, "<br/>")
  // very naive sanitization: strip script
  html=html.replace(/<script.*?>.*?<\/script>/gi,"")
  return html
}

export default function Markdown(){
  const [input,setInput]=useState("# Hello\n\nThis is **markdown** with `code` and [link](https://example.com)\n\n- item one\n- item two")
  const html=useMemo(()=>renderMd(input),[input])
  return <ToolLayout title="Markdown Preview" description="Live markdown preview (sanitized)" clientSide>
    <div className="grid lg:grid-cols-2 gap-4">
      <TextArea value={input} onChange={setInput}  mono={false} />
      <div className="rounded-lg border bg-card p-4 prose prose-sm max-w-none overflow-auto max-h-[500px]" dangerouslySetInnerHTML={{__html: html}} />
    </div>
  </ToolLayout>
}
