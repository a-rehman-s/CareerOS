import type { Metadata } from "next";
export const metadata: Metadata = { title: "Interviews" };
export default function InterviewsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold text-foreground">Interviews</h1><p className="text-muted-foreground text-sm mt-1">Coming in Phase 6</p></div>
      <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center"><p className="font-medium text-muted-foreground">Interview management coming in Phase 6</p><p className="text-sm text-muted-foreground/60 mt-1">Schedule, prep, and outcomes.</p></div>
    </div>
  );
}
