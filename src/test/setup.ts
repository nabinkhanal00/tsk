import "@testing-library/jest-dom"

// mock localStorage if missing
if (typeof globalThis.localStorage === "undefined") {
  const store = new Map<string,string>()
  globalThis.localStorage = {
    getItem: (k:string)=> store.get(k) ?? null,
    setItem: (k:string,v:string)=> store.set(k,v),
    removeItem: (k:string)=> store.delete(k),
    clear: ()=> store.clear(),
    key: (i:number)=> Array.from(store.keys())[i] ?? null,
    length: 0,
  } as any
}

// mock matchMedia
if (typeof window !== "undefined" && !window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query:string)=> ({
      matches: false,
      media: query,
      onchange: null,
      addListener: ()=>{},
      removeListener: ()=>{},
      addEventListener: ()=>{},
      removeEventListener: ()=>{},
      dispatchEvent: ()=>false,
    })
  })
}

// mock clipboard - make configurable so user-event can stub it
if (typeof navigator !== "undefined") {
  try{
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: async ()=>{} },
      writable: true,
      configurable: true,
    })
  }catch{}
}

// mock URL.createObjectURL for file tests
if (typeof URL !== "undefined" && !URL.createObjectURL) {
  (URL as any).createObjectURL = ()=> "blob:mock"
}
if (typeof URL !== "undefined" && !URL.revokeObjectURL) {
  (URL as any).revokeObjectURL = ()=>{}
}
