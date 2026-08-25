import { useState, useMemo } from "react"
import { ToolLayout, TextArea, ErrorPanel } from "../../components/ToolLayout"

function decodeJwt(token:string){
  const parts=token.trim().split(".")
  if(parts.length<2) throw new Error("JWT must have at least 2 parts")
  const decode=(s:string)=>{
    let str=s.replace(/-/g,"+").replace(/_/g,"/")
    while(str.length%4) str+="="
    return JSON.parse(decodeURIComponent(escape(atob(str))))
  }
  const header=decode(parts[0])
  const payload=decode(parts[1])
  const signature=parts[2] || "(no signature)"
  return { header, payload, signature }
}

export default function Jwt(){
  const [input,setInput]=useState("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSBMb3ZlbGFjZSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMDAwMDAwMDAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c")
  const { data, error } = useMemo(()=>{
    try{ if(!input.trim()) return { data:null, error:""}; return { data: decodeJwt(input), error:"" } }catch(e:any){ return { data:null, error:e.message } }
  },[input])
  const isExpired = data?.payload?.exp ? Date.now()/1000 > data.payload.exp : false

  return <ToolLayout title="JWT Decoder" description="Decode JWT header and payload locally — signature is NOT verified" clientSide>
    <TextArea value={input} onChange={setInput} rows={4} placeholder="Paste JWT…" />
    <ErrorPanel error={error} />
    {data && <div className="grid md:grid-cols-2 gap-4">
      <div className="rounded-lg border bg-card p-4">
        <div className="text-xs font-semibold">Header <span className="text-muted-foreground">(decoded)</span></div>
        <pre className="mt-2 font-mono text-xs whitespace-pre-wrap">{JSON.stringify(data.header,null,2)}</pre>
      </div>
      <div className="rounded-lg border bg-card p-4">
        <div className="text-xs font-semibold">Payload <span className={isExpired?"text-red-600":"text-emerald-600"}>{isExpired?"— expired":"— valid"}</span></div>
        <pre className="mt-2 font-mono text-xs whitespace-pre-wrap">{JSON.stringify(data.payload,null,2)}</pre>
        {data.payload.iat && <div className="text-xs mt-2">iat: {new Date(data.payload.iat*1000).toLocaleString()}</div>}
        {data.payload.exp && <div className="text-xs">exp: {new Date(data.payload.exp*1000).toLocaleString()}</div>}
      </div>
      <div className="md:col-span-2 rounded-lg border bg-amber-50 dark:bg-amber-950/20 p-3 text-xs">
        ⚠️ Decoded — not verified. Signature: <span className="font-mono break-all">{data.signature.slice(0,40)}…</span> Verification requires the secret/public key and is not performed here.
      </div>
    </div>}
  </ToolLayout>
}
