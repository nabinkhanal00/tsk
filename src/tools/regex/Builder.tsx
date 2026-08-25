import { ToolLayout } from "../../components/ToolLayout"
import { useState } from "react"
import { copyToClipboard } from "../../lib/utils"

const presets: Record<string,string> = {
  "Email": "^[\\w.-]+@[\\w.-]+\\.\\w{2,}$",
  "URL": "https?:\\/\\/[^\\s]+",
  "IPv4": "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b",
  "IPv6": "([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}",
  "UUID": "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}",
  "Date (YYYY-MM-DD)": "\\d{4}-\\d{2}-\\d{2}",
  "Phone (US)": "\\+?1?\\s*\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}",
  "Hex color": "#[0-9a-fA-F]{3,8}",
  "Slug": "^[a-z0-9]+(?:-[a-z0-9]+)*$",
}

export default function Builder(){
  const [selected,setSelected]=useState("Email")
  const pattern = presets[selected]
  return <ToolLayout title="Regex Builder" description="Generate common regex patterns" clientSide>
    <div className="grid md:grid-cols-3 gap-4">
      <div className="space-y-2">
        {Object.keys(presets).map(k=>(
          <button key={k} onClick={()=>setSelected(k)} className={`w-full text-left px-3 py-2 rounded-lg border text-sm ${selected===k?"bg-zinc-900 text-white":"bg-card hover:bg-accent"}`}>{k}</button>
        ))}
      </div>
      <div className="md:col-span-2 space-y-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="text-xs font-semibold">{selected}</div>
          <div className="mt-2 font-mono text-sm bg-muted p-3 rounded-lg break-all">{pattern}</div>
          <button onClick={()=>copyToClipboard(pattern)} className="mt-3 px-3 py-1.5 rounded-md border bg-background text-xs">Copy pattern</button>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-xs font-semibold">Explanation</div>
          <p className="text-sm text-muted-foreground mt-2">This pattern matches {selected.toLowerCase()} strings. Test it in the Regex Tester with your own samples. Adjust quantifiers and groups as needed.</p>
        </div>
      </div>
    </div>
  </ToolLayout>
}
