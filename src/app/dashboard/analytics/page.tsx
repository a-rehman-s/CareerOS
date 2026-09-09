import type { Metadata } from "next";
export const metadata: Metadata = { title: "Analytics" };
export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold text-foreground">Analytics</h1><p className="text-muted-foreground text-sm mt-1">Coming in Phase 9</p></div>
      <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center"><p className="font-medium text-muted-foreground">Career analytics coming in Phase 9</p><p className="text-sm text-muted-foreground/60 mt-1">Application rates, interview conversion, and career trends.</p></div>
    </div>
  );
}
