export default function ResumeBuilderLoading() {
  return (
    <div className="max-w-7xl space-y-5 animate-pulse">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="h-5 w-20 bg-muted rounded" />
        <div className="h-5 w-4 bg-muted/50 rounded" />
        <div className="h-5 w-36 bg-muted rounded" />
      </div>
      {/* Version list skeleton */}
      <div className="p-5 rounded-xl border border-border bg-card space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-5 w-24 bg-muted rounded" />
          <div className="h-8 w-28 bg-muted rounded-lg" />
        </div>
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-14 rounded-xl bg-muted/50 border border-border" />
        ))}
      </div>
      {/* Builder panes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="h-[600px] rounded-xl border border-border bg-card" />
        <div className="h-[600px] rounded-xl border border-border bg-muted/20" />
      </div>
    </div>
  );
}
