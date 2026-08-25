import { useState } from "react"
import { ToolLayout, CopyButton } from "../../components/ToolLayout"
const WORDS="lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat".split(" ")
export default function Lorem(){
  const [paras,setParas]=useState(3)
  const [words,setWords]=useState(30)
  const [text,setText]=useState("")
  const gen=()=>{
    const out=[]
    for(let p=0;p<paras;p++){
      const w=[]
      for(let i=0;i<words;i++) w.push(WORDS[Math.floor(Math.random()*WORDS.length)])
      w[0]=w[0][0].toUpperCase()+w[0].slice(1)
      out.push(w.join(" ")+".")
    }
    setText(out.join("\n\n"))
  }
  return <ToolLayout title="Lorem Ipsum" description="Generate placeholder text" clientSide>
    <div className="flex flex-wrap gap-2 items-end">
      <label className="text-xs">Paragraphs <input type="number" value={paras} onChange={e=>setParas(Number(e.target.value))} className="ml-1 w-20 px-2 py-1.5 rounded border" /></label>
      <label className="text-xs">Words/para <input type="number" value={words} onChange={e=>setWords(Number(e.target.value))} className="ml-1 w-20 px-2 py-1.5 rounded border" /></label>
      <button onClick={gen} className="px-4 py-2 rounded-md bg-zinc-900 text-white text-sm">Generate</button>
      <CopyButton text={text} />
    </div>
    <div className="rounded-lg border bg-card p-4 min-h-[200px] whitespace-pre-wrap text-sm">{text || "Click Generate"}</div>
  </ToolLayout>
}
