import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth/helpers";
import { getResume } from "@/services/resume.service";
import { getCareerSummary } from "@/services/profile.service";
import { VersionList } from "@/components/resume/version-list";
import { ResumeBuilderClient } from "./resume-builder-client";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(_props: PageProps): Promise<Metadata> {
  return { title: "Resume Builder" };
}

export default async function ResumeBuilderPage({ params }: PageProps) {
  const { id } = await params;
  const user = await requireAuth();

  const [resume, profileSummary] = await Promise.all([
    getResume(user.id, id),
    getCareerSummary(user.id),
  ]);

  if (!resume) notFound();

  const activeVersion = resume.versions.find((v) => v.isActive) ?? resume.versions[0];

  return (
    <div className="max-w-7xl space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/resumes"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Resumes
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium text-foreground">{resume.name}</span>
        {resume.isDefault && (
          <span className="text-xs bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded font-medium">
            Default
          </span>
        )}
      </div>

      {/* Version list */}
      <div className="p-5 rounded-xl border border-border bg-card">
        <VersionList resumeId={resume.id} versions={resume.versions} />
      </div>

      {/* Builder — only if there's an active version */}
      {activeVersion ? (
        <ResumeBuilderClient
          resume={resume}
          version={activeVersion}
          profileData={{
            profile: profileSummary.profile,
            name: user.name,
            education: profileSummary.education,
            experience: profileSummary.experience,
            skills: profileSummary.skills,
            projects: profileSummary.projects,
            certifications: profileSummary.certifications,
            achievements: profileSummary.achievements,
          }}
        />
      ) : (
        <div className="p-8 text-center text-muted-foreground text-sm rounded-xl border border-dashed border-border">
          Create a version above to start building your resume.
        </div>
      )}
    </div>
  );
}
