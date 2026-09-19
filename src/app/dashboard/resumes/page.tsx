import { requireAuth } from "@/lib/auth/helpers";
import { getResumes } from "@/services/resume.service";
import { ResumeCard } from "@/components/resume/resume-card";
import { ResumeListClient } from "./resume-list-client";
import type { Metadata } from "next";
import { FileText } from "lucide-react";

export const metadata: Metadata = { title: "My Resumes" };

export default async function ResumesPage() {
  const user = await requireAuth();
  const resumes = await getResumes(user.id);

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Resumes</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Create multiple targeted resumes. Each pulls from your master profile and can be versioned.
          </p>
        </div>
        <ResumeListClient />
      </div>

      {/* Resume grid */}
      {resumes.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-border bg-card/50 p-16 text-center">
          <FileText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-semibold text-foreground">No resumes yet</p>
          <p className="text-sm text-muted-foreground mt-1 mb-5">
            Create your first resume to get started. It will pull from your career profile.
          </p>
          <ResumeListClient buttonLabel="Create Your First Resume" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      )}
    </div>
  );
}
