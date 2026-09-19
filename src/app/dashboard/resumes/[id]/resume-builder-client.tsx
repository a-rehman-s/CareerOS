"use client";

import { useState } from "react";
import { ContentEditor } from "@/components/resume/content-editor";
import { ResumePreview } from "@/components/resume/resume-preview";
import type { ResumeContent } from "@/validators/resume";
import type { Resume, ResumeVersion, Education, Experience, Skill, Project, Certification, Achievement, Profile } from "@prisma/client";
import { Eye, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResumeBuilderClientProps {
  resume: Resume;
  version: ResumeVersion;
  profileData: {
    profile: Profile | null;
    name: string | null;
    education: Education[];
    experience: Experience[];
    skills: Skill[];
    projects: Project[];
    certifications: Certification[];
    achievements: Achievement[];
  };
}

function parseContent(raw: unknown): ResumeContent {
  if (raw && typeof raw === "object") {
    const r = raw as Record<string, unknown>;
    return {
      summary: (r.summary as string) ?? null,
      selectedExperienceIds: (r.selectedExperienceIds as string[]) ?? [],
      selectedEducationIds: (r.selectedEducationIds as string[]) ?? [],
      selectedSkillIds: (r.selectedSkillIds as string[]) ?? [],
      selectedProjectIds: (r.selectedProjectIds as string[]) ?? [],
      selectedCertificationIds: (r.selectedCertificationIds as string[]) ?? [],
      selectedAchievementIds: (r.selectedAchievementIds as string[]) ?? [],
      customSections: (r.customSections as ResumeContent["customSections"]) ?? [],
      keywords: (r.keywords as string[]) ?? [],
      targetRole: (r.targetRole as string) ?? null,
      targetCompany: (r.targetCompany as string) ?? null,
    };
  }
  return {
    summary: null,
    selectedExperienceIds: [],
    selectedEducationIds: [],
    selectedSkillIds: [],
    selectedProjectIds: [],
    selectedCertificationIds: [],
    selectedAchievementIds: [],
    customSections: [],
    keywords: [],
    targetRole: null,
    targetCompany: null,
  };
}

export function ResumeBuilderClient({ resume, version, profileData }: ResumeBuilderClientProps) {
  const [content, setContent] = useState<ResumeContent>(() => parseContent(version.content));
  const [mobileTab, setMobileTab] = useState<"editor" | "preview">("editor");

  return (
    <div className="space-y-3">
      {/* Mobile tab switcher */}
      <div className="flex lg:hidden gap-1 p-1 bg-muted rounded-xl border border-border">
        {(["editor", "preview"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all",
              mobileTab === tab
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab === "editor" ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {tab === "editor" ? "Editor" : "Preview"}
          </button>
        ))}
      </div>

      {/* Split pane — stacked on mobile, side-by-side on lg */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Editor pane */}
        <div className={cn(mobileTab !== "editor" && "hidden lg:block")}>
          <div className="sticky top-4">
            <div className="p-5 rounded-xl border border-border bg-card max-h-[calc(100vh-8rem)] overflow-y-auto">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Content Builder · {version.label ?? `v${version.version}`}
              </p>
              <ContentEditor
                versionId={version.id}
                resumeId={resume.id}
                initialContent={content}
                profile={profileData}
                onSave={setContent}
              />
            </div>
          </div>
        </div>

        {/* Preview pane */}
        <div className={cn(mobileTab !== "preview" && "hidden lg:block")}>
          <div className="sticky top-4">
            <div className="rounded-xl overflow-hidden shadow-xl border border-border max-h-[calc(100vh-8rem)] overflow-y-auto">
              <ResumePreview
                resume={resume}
                version={version}
                content={content}
                profileData={profileData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
