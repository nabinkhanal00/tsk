import { useState, useMemo } from "react"
import { ToolLayout, TextArea, ErrorPanel, CopyButton } from "../../components/ToolLayout"
import yaml from "js-yaml"

export default function YamlJson(){
  const [yamlInput,setYamlInput]=useState("name: Ada\nage: 36\nskills:\n  - JS\n  - Rust\n")
  const [jsonInput,setJsonInput]=useState('{\n  "name": "Ada",\n  "age": 36\n}')
  const y2j=useMemo(()=>{
    try{ const obj=yaml.load(yamlInput); return { out: JSON.stringify(obj,null,2), err:""}}catch(e:any){ return { out:"", err:e.message}}
  },[yamlInput])
  const j2y=useMemo(()=>{
    try{ const obj=JSON.parse(jsonInput); return { out: yaml.dump(obj), err:""}}catch(e:any){ return { out:"", err:e.message}}
  },[jsonInput])

  return <ToolLayout title="YAML ↔ JSON" description="Convert between YAML and JSON" clientSide>
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-2">
        <div className="text-xs font-semibold">YAML → JSON</div>
        <TextArea value={yamlInput} onChange={setYamlInput}  />
        <ErrorPanel error={y2j.err} />
        <div className="rounded border bg-card p-3 font-mono text-xs whitespace-pre-wrap break-all min-h-[140px]">{y2j.out}</div>
        <CopyButton text={y2j.out} />
      </div>
      <div className="space-y-2">
        <div className="text-xs font-semibold">JSON → YAML</div>
        <TextArea value={jsonInput} onChange={setJsonInput}  />
        <ErrorPanel error={j2y.err} />
        <div className="rounded border bg-card p-3 font-mono text-xs whitespace-pre-wrap break-all min-h-[140px]">{j2y.out}</div>
        <CopyButton text={j2y.out} />
      </div>
    </div>
  </ToolLayout>
}
