export function cidrInfo(cidr:string){
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
export function parseUrl(input:string){
  const u=new URL(input)
  return { protocol:u.protocol, host:u.host, hostname:u.hostname, port:u.port, pathname:u.pathname, hash:u.hash, origin:u.origin, params: Array.from(u.searchParams.entries())}
}
