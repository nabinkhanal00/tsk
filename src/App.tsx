import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { Component, Suspense, useEffect, useState, type ReactNode } from "react"
import { Header } from "./components/Header"
import { Sidebar } from "./components/Sidebar"
import { tools } from "./lib/registry"
import { Home } from "./pages/Home"
import { pushRecent } from "./hooks/useLocal"

class ChunkErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }>{
  state = { failed: false }
  static getDerivedStateFromError(){ return { failed: true } }
  render(){
    if(this.state.failed) return <div className="p-12 text-center max-w-md mx-auto">
      <div className="w-12 h-12 rounded-xl bg-primary text-white grid place-items-center mx-auto font-bold">!</div>
      <h1 className="text-xl font-bold tracking-tight mt-4">Couldn't load this tool</h1>
      <p className="text-sm text-muted-foreground mt-2">A new version may have been deployed. Reloading usually fixes it.</p>
      <button onClick={()=>location.reload()} className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Reload</button>
    </div>
    return this.props.children
  }
}

function Shell(){
  const [sidebarOpen,setSidebarOpen]=useState(false)
  const location=useLocation()
  useEffect(()=>{
    const t=tools.find(x=>x.path===location.pathname)
    if(t) pushRecent(t.id)
  },[location.pathname])

  return <div className="min-h-screen bg-background">
    <Header onMenu={()=>setSidebarOpen(v=>!v)} />
    <div className="flex max-w-[1600px] mx-auto">
      <Sidebar open={sidebarOpen} onClose={()=>setSidebarOpen(false)} />
      <main className={`flex-1 min-w-0 bg-background border-x border-border ${location.pathname==="/" ? "" : "min-h-[calc(100vh-52px)]"}`}>
        <ChunkErrorBoundary>
        <Suspense fallback={<div className="p-8">
          <div className="max-w-5xl mx-auto">
            <div className="h-8 w-48 bg-card border rounded-lg animate-pulse" />
            <div className="h-4 w-96 bg-card border rounded mt-3 animate-pulse" />
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="h-64 bg-card border rounded-xl animate-pulse" />
              <div className="h-64 bg-card border rounded-xl animate-pulse" />
            </div>
          </div>
        </div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            {tools.map(t=>{
              const Comp=t.component
              return <Route key={t.id} path={t.path} element={<Comp />} />
            })}
            <Route path="*" element={<div className="p-12 text-center max-w-md mx-auto">
              <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground grid place-items-center mx-auto">404</div>
              <h1 className="text-xl font-bold tracking-tight mt-4">Tool not found</h1>
              <p className="text-sm text-muted-foreground mt-2">The tool you're looking for doesn't exist. Try searching with <span className="kbd">⌘K</span>.</p>
            </div>} />
          </Routes>
        </Suspense>
        </ChunkErrorBoundary>
      </main>
    </div>
    {/* subtle bottom bar — hidden on the landing (it owns the full viewport) */}
    {location.pathname!=="/" && <div className="border-t bg-card">
      <div className="max-w-[1600px] mx-auto px-4 py-2 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
        <span>© 2026 The Swiss Knife · theswissknife.com</span>
        <span className="hidden sm:inline-flex items-center gap-3"><span>47 tools</span><span>·</span><span>PWA · offline-ready</span></span>
      </div>
    </div>}
  </div>
}

export default function App(){
  return <BrowserRouter>
    <Shell />
  </BrowserRouter>
}
