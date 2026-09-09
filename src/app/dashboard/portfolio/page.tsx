import type { Metadata } from "next";
export const metadata: Metadata = { title: "Portfolio" };
export default function PortfolioPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold text-foreground">Portfolio</h1><p className="text-muted-foreground text-sm mt-1">Coming in Phase 4</p></div>
      <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center"><p className="font-medium text-muted-foreground">Public portfolio coming in Phase 4</p><p className="text-sm text-muted-foreground/60 mt-1">Public portfolio visibility controls and SEO.</p></div>
    </div>
  );
}
