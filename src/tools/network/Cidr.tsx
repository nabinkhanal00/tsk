import { useState, useMemo } from "react"
import { ToolLayout } from "../../components/ToolLayout"

function cidrInfo(cidr:string){
  const [ip, prefixStr]=cidr.split("/")
  const prefix=Number(prefixStr)
  if(!ip||isNaN(prefix)||prefix<0||prefix>32) throw new Error("Invalid CIDR (e.g., 192.168.1.0/24)")
  const parts=ip.split(".").map(Number)
  if(parts.length!==4||parts.some(n=>isNaN(n)||n<0||n>255)) throw new Error("Invalid IPv4")
  const ipInt = (parts[0]<<24|parts[1]<<16|parts[2]<<8|parts[3])>>>0
  const mask = prefix===0?0: (0xffffffff << (32-prefix))>>>0
  const network = (ipInt & mask)>>>0
  const broadcast = (network | (~mask>>>0))>>>0
  const toIp=(n:number)=> [(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255].join(".")
  const hosts = prefix>=31? 0 : Math.pow(2,32-prefix)-2
  return { network: toIp(network), broadcast: toIp(broadcast), mask: toIp(mask), hosts, prefix, ip }
}

export default function Cidr(){
  const [input,setInput]=useState("192.168.1.0/24")
  const info=useMemo(()=>{
    try{ return { data: cidrInfo(input), err:""} }catch(e:any){ return { data:null, err:e.message}}
  },[input])
  return <ToolLayout title="CIDR Calculator" description="IPv4 CIDR and subnet calculator" clientSide>
    <input value={input} onChange={e=>setInput(e.target.value)} placeholder="192.168.1.0/24" className="w-full px-3 py-2 rounded-lg border bg-background font-mono text-sm" />
    {info.err ? <div className="text-sm text-red-600">{info.err}</div> :
      info.data && <div className="grid md:grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border bg-card p-3 space-y-1 font-mono">
          <div>Network: {info.data.network}</div>
          <div>Broadcast: {info.data.broadcast}</div>
          <div>Mask: {info.data.mask} (/{info.data.prefix})</div>
          <div>Usable hosts: {info.data.hosts}</div>
        </div>
        <div className="rounded-lg border p-3 text-xs">
          <div className="font-semibold">Examples</div>
          <div className="flex flex-wrap gap-1 mt-2">{["10.0.0.0/8","172.16.0.0/12","192.168.0.0/16","192.168.1.0/24","0.0.0.0/0"].map(c=><button key={c} onClick={()=>setInput(c)} className="px-2 py-1 rounded-full bg-secondary font-mono text-[11px]">{c}</button>)}</div>
        </div>
      </div>
    }
  </ToolLayout>
}
