import type { Metadata } from "next";
export const metadata: Metadata = { title: "Resumes" };
export default function ResumesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Resumes</h1>
        <p className="text-muted-foreground text-sm mt-1">Coming in Phase 3</p>
      </div>
      <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
        <p className="font-medium text-muted-foreground">Resume management coming in Phase 3</p>
        <p className="text-sm text-muted-foreground/60 mt-1">Resume versions, PDF export, and AI analysis.</p>
      </div>
    </div>
  );
}
