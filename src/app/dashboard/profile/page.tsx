import { requireAuth } from "@/lib/auth/helpers";
import { getCareerSummary, calculateProfileScore } from "@/services/profile.service";
import { ProfileClient } from "./profile-client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Career Profile" };

export default async function ProfilePage() {
  const user = await requireAuth();
  const summary = await getCareerSummary(user.id);
  const score = calculateProfileScore(summary);

  return (
    <div className="max-w-4xl space-y-2">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Career Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your professional identity — this powers your resume and public portfolio.
        </p>
      </div>
      <ProfileClient
        userName={user.name}
        score={score}
        profile={summary.profile}
        education={summary.education}
        experience={summary.experience}
        skills={summary.skills}
        projects={summary.projects}
        certifications={summary.certifications}
        achievements={summary.achievements}
        links={summary.links}
      />
    </div>
  );
}
