import { useState, useMemo } from "react"
import { ToolLayout, TextArea, CopyButton, ErrorPanel, ClearButton } from "../../components/ToolLayout"

const ALGS = {
  "HS256": { name:"HMAC", hash:"SHA-256" },
  "HS384": { name:"HMAC", hash:"SHA-384" },
  "HS512": { name:"HMAC", hash:"SHA-512" },
} as const

type Alg = keyof typeof ALGS

function b64urlEncode(str:string){
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")
}
function b64urlBytes(bytes:ArrayBuffer){
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")
}

export default function JwtGen(){
  const [alg,setAlg]=useState<Alg>("HS256")
  const [header,setHeader]=useState('{"alg":"HS256","typ":"JWT"}')
  const [payload,setPayload]=useState('{"sub":"1234567890","name":"Ada","iat":0}')
  const [secret,setSecret]=useState("your-256-bit-secret")
  const [token,setToken]=useState("")
  const [error,setError]=useState("")

  const setAlgAndHeader=(a:Alg)=>{
    setAlg(a)
    try{
      const h=JSON.parse(header)
      h.alg=a
      setHeader(JSON.stringify(h,null,2))
      setError("")
    }catch{ /* header invalid; user must fix it */ }
  }

  const sign=async()=>{
    try{
      const h=JSON.parse(header)
      const p=JSON.parse(payload)
      if(!secret.trim()){ setError("Enter a secret to sign with."); setToken(""); return }
      const signingInput = `${b64urlEncode(JSON.stringify(h))}.${b64urlEncode(JSON.stringify(p))}`
      const enc=new TextEncoder()
      const key=await crypto.subtle.importKey("raw", enc.encode(secret), {name:"HMAC", hash:ALGS[alg].hash}, false, ["sign"])
      const sig=await crypto.subtle.sign("HMAC", key, enc.encode(signingInput))
      setToken(`${signingInput}.${b64urlBytes(sig)}`)
      setError("")
    }catch(e:any){
      setToken("")
      setError(e.message?.includes("JSON")? "Header and payload must be valid JSON." : e.message)
    }
  }

  const parts=useMemo(()=> token? token.split(".") : [], [token])

  return <ToolLayout title="JWT Generator" description="Build and sign JWTs locally with HMAC — nothing leaves your browser" clientSide>
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-3">
        <label className="block">
          <span className="text-xs font-medium">Algorithm</span>
          <select value={alg} onChange={e=>setAlgAndHeader(e.target.value as Alg)} className="mt-1 w-full px-3 py-2 rounded-md border bg-card text-sm focus:outline-none focus:border-primary">
            {(Object.keys(ALGS) as Alg[]).map(a=> <option key={a} value={a}>HMAC {a} ({ALGS[a].hash})</option>)}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-medium">Header</span>
          <div className="mt-1"><TextArea value={header} onChange={setHeader} rows={4} placeholder={'{ "alg": "HS256", "typ": "JWT" }'} /></div>
        </label>
        <label className="block">
          <span className="text-xs font-medium">Payload</span>
          <div className="mt-1"><TextArea value={payload} onChange={setPayload} rows={8} placeholder={'{ "sub": "123", "name": "Ada" }'} /></div>
        </label>
        <label className="block">
          <span className="text-xs font-medium">Secret</span>
          <input value={secret} onChange={e=>setSecret(e.target.value)} type="text" className="mt-1 w-full px-3 py-2 rounded-md border bg-card font-mono text-sm focus:outline-none focus:border-primary" />
        </label>
        <div className="flex gap-2">
          <button onClick={sign} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">Sign JWT</button>
          <ClearButton onClear={()=>{setToken("");setError("")}} />
        </div>
        <ErrorPanel error={error} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium">Signed token</span>
          {token && <CopyButton text={token} />}
        </div>
        <div className="rounded-md border p-3 font-mono text-xs break-all min-h-[120px] bg-card" style={{borderColor:"var(--term-border)", background:"var(--term-bg)", color:"var(--term-fg)"}}>
          {token ? <>
            <span style={{color:"var(--term-steel)"}}>{parts[0]}</span>.<span style={{color:"var(--term-fg)"}}>{parts[1]}</span>.<span style={{color:"var(--term-amber)"}}>{parts[2]}</span>
          </> : <span style={{color:"var(--term-muted)"}}>Set header, payload and secret, then press "Sign JWT".</span>}
        </div>
        <div className="rounded-md border bg-card p-3 text-xs text-muted-foreground space-y-1">
          <div><span className="font-medium text-foreground">How it works:</span> header and payload are base64url-encoded, then signed with HMAC-{alg} using your secret (Web Crypto). The signature covers <span className="font-mono">base64url(header).base64url(payload)</span>.</div>
          <div>Paste the token into the <a href="/crypto/jwt" className="text-primary hover:underline">JWT Decoder</a> to inspect it. Keep the secret — verifying requires the same one.</div>
        </div>
      </div>
    </div>
  </ToolLayout>
}
