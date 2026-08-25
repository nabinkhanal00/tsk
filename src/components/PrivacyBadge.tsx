export function PrivacyBadge({ clientSide=true }: { clientSide?: boolean }){
  return <span className={`inline-flex items-center gap-1.5 text-[11px] mono font-medium px-2.5 py-1 rounded-full border ${clientSide?"text-muted-foreground border-border bg-card":"bg-primary/5 text-primary border-primary/40"}`}>
    <span className={`w-1.5 h-1.5 rounded-full ${clientSide?"bg-emerald-600 dark:bg-emerald-500":"bg-primary"}`}/>
    {clientSide?"Processed locally":"Server processing"}
  </span>
}
