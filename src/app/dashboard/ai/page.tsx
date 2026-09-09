import type { Metadata } from "next";
export const metadata: Metadata = { title: "AI Assistant" };
export default function AIPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold text-foreground">AI Assistant</h1><p className="text-muted-foreground text-sm mt-1">Coming in Phase 8</p></div>
      <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center"><p className="font-medium text-muted-foreground">AI career assistant coming in Phase 8</p><p className="text-sm text-muted-foreground/60 mt-1">Specialized agents for profile, resume, job matching, and interview prep.</p></div>
    </div>
  );
}
