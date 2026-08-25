import React from "react"

export type ToolDefinition = {
  id: string
  name: string
  description: string
  category: string
  keywords: string[]
  path: string
  component: React.LazyExoticComponent<React.ComponentType>
  clientSide: boolean
  icon?: string
  related?: string[]
}

export const categories = [
  "JSON","jq","Regex","Date & Time","Encoding","Crypto","Developer","Text","Data","Image","PDF","Network","Generators","Color","Reference"
] as const

// Lazy loader with retry — transient chunk failures (e.g. during deploys) resolve
// on retry instead of leaving the Suspense fallback pending forever.
const lazy = (factory: () => Promise<{ default: React.ComponentType }>) =>
  React.lazy(async () => {
    let lastErr: unknown
    for (let attempt = 0; attempt < 3; attempt++) {
      try { return await factory() } catch (e) { lastErr = e; await new Promise(r => setTimeout(r, 250 * (attempt + 1))) }
    }
    throw lastErr
  })

export const tools: ToolDefinition[] = [
  { id:"json-formatter", name:"JSON Formatter", description:"Format, validate, minify and sort JSON with error highlighting", category:"JSON", keywords:["json","format","pretty","validate","minify","sort"], path:"/json/formatter", component: lazy(()=>import("../tools/json/Formatter")), clientSide:true, related:["json-viewer","json-diff","jq-playground"] },
  { id:"json-viewer", name:"JSON Viewer", description:"Interactive tree viewer with search and copy path", category:"JSON", keywords:["json","viewer","tree","explorer"], path:"/json/viewer", component: lazy(()=>import("../tools/json/Viewer")), clientSide:true },
  { id:"json-diff", name:"JSON Diff", description:"Compare two JSON documents side-by-side", category:"JSON", keywords:["json","diff","compare"], path:"/json/diff", component: lazy(()=>import("../tools/json/Diff")), clientSide:true },
  { id:"json-csv", name:"JSON ↔ CSV", description:"Convert JSON arrays to CSV and vice versa", category:"Data", keywords:["json","csv","convert"], path:"/data/json-csv", component: lazy(()=>import("../tools/data/JsonCsv")), clientSide:true },
  { id:"jq-playground", name:"jq Playground", description:"Run jq filters on JSON in your browser", category:"jq", keywords:["jq","json","filter","query"], path:"/jq/playground", component: lazy(()=>import("../tools/jq/Playground")), clientSide:true },
  { id:"regex-tester", name:"Regex Tester", description:"Test regex with live highlighting, groups and replace", category:"Regex", keywords:["regex","regexp","tester","match"], path:"/regex/tester", component: lazy(()=>import("../tools/regex/Tester")), clientSide:true },
  { id:"regex-builder", name:"Regex Builder", description:"Generate common regex patterns", category:"Regex", keywords:["regex","builder","generator"], path:"/regex/builder", component: lazy(()=>import("../tools/regex/Builder")), clientSide:true },
  { id:"timestamp-converter", name:"Timestamp Converter", description:"Convert Unix timestamps to dates and vice versa", category:"Date & Time", keywords:["timestamp","unix","epoch","date","time"], path:"/date/timestamp", component: lazy(()=>import("../tools/datetime/Timestamp")), clientSide:true },
  { id:"date-difference", name:"Date Difference", description:"Calculate difference between two dates", category:"Date & Time", keywords:["date","difference","duration"], path:"/date/difference", component: lazy(()=>import("../tools/datetime/Difference")), clientSide:true },
  { id:"timezone-converter", name:"Timezone Converter", description:"Convert date/time between IANA timezones", category:"Date & Time", keywords:["timezone","tz","convert"], path:"/date/timezone", component: lazy(()=>import("../tools/datetime/Timezone")), clientSide:true },
  { id:"cron-parser", name:"Cron Parser", description:"Parse and explain cron expressions with next runs", category:"Date & Time", keywords:["cron","schedule","parser"], path:"/date/cron", component: lazy(()=>import("../tools/datetime/Cron")), clientSide:true },
  { id:"base64", name:"Base64 Encode/Decode", description:"Encode and decode Base64 and Base64URL", category:"Encoding", keywords:["base64","encode","decode"], path:"/encoding/base64", component: lazy(()=>import("../tools/encoding/Base64")), clientSide:true },
  { id:"url-encoder", name:"URL Encoder", description:"Encode and decode URLs and query strings", category:"Encoding", keywords:["url","encode","decode","query"], path:"/encoding/url", component: lazy(()=>import("../tools/encoding/Url")), clientSide:true },
  { id:"html-entities", name:"HTML Entities", description:"Encode/decode HTML entities and URL, Hex, Unicode", category:"Encoding", keywords:["html","entities","escape"], path:"/encoding/html", component: lazy(()=>import("../tools/encoding/Html")), clientSide:true },
  { id:"jwt-decoder", name:"JWT Decoder", description:"Decode JWT header and payload locally", category:"Crypto", keywords:["jwt","token","decode"], path:"/crypto/jwt", component: lazy(()=>import("../tools/encoding/Jwt")), clientSide:true },
  { id:"hash-generator", name:"Hash Generator", description:"Generate SHA-1/256/384/512 hashes for text and files", category:"Crypto", keywords:["hash","sha","md5"], path:"/crypto/hash", component: lazy(()=>import("../tools/crypto/Hash")), clientSide:true },
  { id:"uuid-generator", name:"UUID Generator", description:"Generate UUID v4 and v7, ULID, Nano ID", category:"Generators", keywords:["uuid","ulid","guid","nano"], path:"/generators/uuid", component: lazy(()=>import("../tools/generators/Uuid")), clientSide:true },
  { id:"password-generator", name:"Password Generator", description:"Generate secure random passwords", category:"Generators", keywords:["password","random","secure"], path:"/generators/password", component: lazy(()=>import("../tools/generators/Password")), clientSide:true },
  { id:"lorem-generator", name:"Lorem Ipsum", description:"Generate lorem ipsum placeholder text", category:"Generators", keywords:["lorem","ipsum","placeholder"], path:"/generators/lorem", component: lazy(()=>import("../tools/generators/Lorem")), clientSide:true },
  { id:"qr-generator", name:"QR Code Generator", description:"Generate QR codes locally", category:"Generators", keywords:["qr","qrcode","barcode"], path:"/generators/qr", component: lazy(()=>import("../tools/qr/Generator")), clientSide:true },
  { id:"color-tools", name:"Color Tools", description:"HEX/RGB/HSL converters, picker and contrast checker", category:"Color", keywords:["color","hex","rgb","hsl","contrast"], path:"/color/tools", component: lazy(()=>import("../tools/color/Tools")), clientSide:true },
  { id:"text-tools", name:"Text Tools", description:"Case converters, counters, sort, diff and more", category:"Text", keywords:["text","case","counter","diff","sort"], path:"/text/tools", component: lazy(()=>import("../tools/text/Tools")), clientSide:true },
  { id:"diff-tool", name:"Text Diff", description:"Side-by-side and unified diff for text", category:"Text", keywords:["diff","compare","text"], path:"/text/diff", component: lazy(()=>import("../tools/text/Diff")), clientSide:true },
  { id:"csv-tools", name:"CSV Tools", description:"View, format and convert CSV/TSV/JSON", category:"Data", keywords:["csv","tsv","table","viewer"], path:"/data/csv", component: lazy(()=>import("../tools/data/Csv")), clientSide:true },
  { id:"yaml-json", name:"YAML ↔ JSON", description:"Convert between YAML and JSON", category:"Data", keywords:["yaml","json","convert"], path:"/data/yaml-json", component: lazy(()=>import("../tools/data/YamlJson")), clientSide:true },
  { id:"sql-formatter", name:"SQL Formatter", description:"Format and minify SQL", category:"Developer", keywords:["sql","format","formatter"], path:"/developer/sql", component: lazy(()=>import("../tools/developer/Sql")), clientSide:true },
  { id:"markdown-preview", name:"Markdown Preview", description:"Live markdown preview", category:"Developer", keywords:["markdown","preview","md"], path:"/developer/markdown", component: lazy(()=>import("../tools/developer/Markdown")), clientSide:true },
  { id:"image-converter", name:"Image Converter", description:"Convert images between PNG, JPEG, WebP", category:"Image", keywords:["image","convert","png","jpg","webp"], path:"/image/convert", component: lazy(()=>import("../tools/image/Converter")), clientSide:true },
  { id:"image-compressor", name:"Image Compressor", description:"Compress and resize images locally", category:"Image", keywords:["image","compress","resize"], path:"/image/compress", component: lazy(()=>import("../tools/image/Compressor")), clientSide:true },
  { id:"image-base64", name:"Image ↔ Base64", description:"Convert images to and from Base64", category:"Image", keywords:["image","base64"], path:"/image/base64", component: lazy(()=>import("../tools/image/Base64")), clientSide:true },
  { id:"pdf-merge", name:"PDF Merge", description:"Merge multiple PDFs locally", category:"PDF", keywords:["pdf","merge","combine"], path:"/pdf/merge", component: lazy(()=>import("../tools/pdf/Merge")), clientSide:true },
  { id:"pdf-split", name:"PDF Split & Extract", description:"Split, extract and rotate PDF pages", category:"PDF", keywords:["pdf","split","extract","rotate"], path:"/pdf/split", component: lazy(()=>import("../tools/pdf/Split")), clientSide:true },
  { id:"url-parser", name:"URL Parser", description:"Parse URLs, query strings and headers", category:"Network", keywords:["url","parser","query","header"], path:"/network/url-parser", component: lazy(()=>import("../tools/network/UrlParser")), clientSide:true },
  { id:"cidr-calculator", name:"CIDR Calculator", description:"IPv4/IPv6 CIDR and subnet calculator", category:"Network", keywords:["cidr","ip","subnet","ipv4","ipv6"], path:"/network/cidr", component: lazy(()=>import("../tools/network/Cidr")), clientSide:true },
  { id:"http-reference", name:"HTTP Reference", description:"Status codes, headers, MIME types and ports", category:"Reference", keywords:["http","status","mime","header","port"], path:"/reference/http", component: lazy(()=>import("../tools/developer/HttpRef")), clientSide:true },
  { id:"world-clock", name:"World Clock", description:"Configurable world clocks for any timezone", category:"Date & Time", keywords:["world","clock","timezone","time"], path:"/date/world-clock", component: lazy(()=>import("../tools/datetime/WorldClock")), clientSide:true },
  { id:"date-formatter", name:"Date Formatter", description:"Convert between common date formats", category:"Date & Time", keywords:["date","format","iso","utc"], path:"/date/formatter", component: lazy(()=>import("../tools/datetime/Formatter")), clientSide:true },
  { id:"hmac-generator", name:"HMAC Generator", description:"Generate HMAC with Web Crypto", category:"Crypto", keywords:["hmac","hash","crypto","sign"], path:"/crypto/hmac", component: lazy(()=>import("../tools/crypto/Hmac")), clientSide:true },
  { id:"jwt-generator", name:"JWT Generator", description:"Construct JWT locally", category:"Crypto", keywords:["jwt","generate","token"], path:"/crypto/jwt-gen", component: lazy(()=>import("../tools/encoding/JwtGen")), clientSide:true },
  { id:"binary-tools", name:"Binary / Hex Tools", description:"Binary ↔ Text and Hex ↔ Text", category:"Encoding", keywords:["binary","hex","encode","decode"], path:"/encoding/binary", component: lazy(()=>import("../tools/encoding/Binary")), clientSide:true },
  { id:"xml-tools", name:"XML Tools", description:"Format XML and XML ↔ JSON", category:"Developer", keywords:["xml","format","json"], path:"/developer/xml", component: lazy(()=>import("../tools/developer/Xml")), clientSide:true },
  { id:"web-formatters", name:"HTML/CSS/JS Formatter", description:"Lightweight web formatters and minifiers", category:"Developer", keywords:["html","css","js","format","minify"], path:"/developer/web-format", component: lazy(()=>import("../tools/developer/WebFormat")), clientSide:true },
  { id:"image-metadata", name:"Image Metadata", description:"Read image metadata locally", category:"Image", keywords:["image","metadata","exif"], path:"/image/metadata", component: lazy(()=>import("../tools/image/Metadata")), clientSide:true },
  { id:"images-to-pdf", name:"Images to PDF", description:"Convert multiple images into a PDF", category:"PDF", keywords:["image","pdf","convert"], path:"/pdf/images-to-pdf", component: lazy(()=>import("../tools/image/ToPdf")), clientSide:true },
  { id:"json-lines", name:"JSON Lines", description:"JSONL ↔ JSON array conversion", category:"Data", keywords:["jsonl","json","lines"], path:"/data/jsonlines", component: lazy(()=>import("../tools/data/JsonLines")), clientSide:true },
  { id:"random-generator", name:"Random Generator", description:"Generate random numbers, colors, gradients", category:"Generators", keywords:["random","number","color","gradient"], path:"/generators/random", component: lazy(()=>import("../tools/generators/Random")), clientSide:true },
  { id:"header-parser", name:"HTTP Header Parser", description:"Parse and build HTTP headers", category:"Network", keywords:["header","http","parser"], path:"/network/headers", component: lazy(()=>import("../tools/network/Headers")), clientSide:true },
]

export function searchTools(q: string) {
  const lower = q.toLowerCase()
  if (!lower) return tools
  return tools.filter(t => 
    t.name.toLowerCase().includes(lower) ||
    t.description.toLowerCase().includes(lower) ||
    t.keywords.some(k=>k.includes(lower)) ||
    t.category.toLowerCase().includes(lower)
  ).sort((a,b)=>{
    const aExact = a.name.toLowerCase().includes(lower) ? 0 : 1
    const bExact = b.name.toLowerCase().includes(lower) ? 0 : 1
    return aExact - bExact
  })
}
export function getToolByPath(path: string){ return tools.find(t=>t.path===path) }
export function getToolById(id: string){ return tools.find(t=>t.id===id) }
