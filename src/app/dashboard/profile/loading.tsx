export default function ProfileLoading() {
  return (
    <div className="max-w-4xl space-y-4 animate-pulse">
      {/* Score bar */}
      <div className="h-14 rounded-xl bg-muted" />
      {/* Profile header */}
      <div className="h-28 rounded-xl bg-muted" />
      {/* Sections */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="p-5 rounded-xl border border-border bg-card space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-5 w-32 bg-muted rounded" />
            <div className="h-7 w-24 bg-muted rounded-lg" />
          </div>
          <div className="h-16 bg-muted/50 rounded-xl border border-dashed border-border" />
        </div>
      ))}
    </div>
  );
}
