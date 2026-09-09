import type { Metadata } from "next";
export const metadata: Metadata = { title: "Settings" };
export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold text-foreground">Settings</h1><p className="text-muted-foreground text-sm mt-1">Account preferences</p></div>
      <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center"><p className="font-medium text-muted-foreground">Settings coming soon</p><p className="text-sm text-muted-foreground/60 mt-1">Account preferences, notifications, and integrations.</p></div>
    </div>
  );
}
