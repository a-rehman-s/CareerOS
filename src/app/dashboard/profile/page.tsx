import { User } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Career Profile" };

export default function ProfilePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Career Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your professional identity
        </p>
      </div>
      <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
        <User className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
        <p className="font-medium text-muted-foreground">Profile management coming in Phase 2</p>
        <p className="text-sm text-muted-foreground/60 mt-1">
          Full profile editing, education, experience, skills, and projects.
        </p>
      </div>
    </div>
  );
}
