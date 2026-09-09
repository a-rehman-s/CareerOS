import type { Metadata } from "next";
export const metadata: Metadata = { title: "Jobs" };
export default function JobsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold text-foreground">Jobs</h1><p className="text-muted-foreground text-sm mt-1">Coming in Phase 5</p></div>
      <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center"><p className="font-medium text-muted-foreground">Job management coming in Phase 5</p><p className="text-sm text-muted-foreground/60 mt-1">Job search, import, filtering, and discovery.</p></div>
    </div>
  );
}
