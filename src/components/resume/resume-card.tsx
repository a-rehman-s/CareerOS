"use client";

import Link from "next/link";
import { FileText, Star, Clock, Layers } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Resume, ResumeVersion } from "@prisma/client";
import { DeleteButton } from "@/components/ui/buttons";
import { deleteResumeAction, setDefaultResumeAction } from "@/app/dashboard/resumes/actions";

type ResumeWithMeta = Resume & {
  versions: ResumeVersion[];
  _count: { versions: number };
};

interface ResumeCardProps {
  resume: ResumeWithMeta;
}

export function ResumeCard({ resume }: ResumeCardProps) {
  const activeVersion = resume.versions[0]; // already filtered to active only
  const atsScore = activeVersion?.atsScore;

  const scoreColor =
    atsScore == null ? "text-muted-foreground" :
    atsScore >= 80 ? "text-emerald-500" :
    atsScore >= 60 ? "text-amber-500" : "text-destructive";

  return (
    <div className="group relative flex flex-col gap-4 p-5 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all">
      {/* Default badge */}
      {resume.isDefault && (
        <span className="absolute top-3 right-3 flex items-center gap-1 text-xs font-semibold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
          <Star className="w-3 h-3 fill-current" /> Default
        </span>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 pr-16">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-foreground truncate">{resume.name}</h3>
          {resume.description && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{resume.description}</p>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" />
          {resume._count.versions} {resume._count.versions === 1 ? "version" : "versions"}
        </span>
        {activeVersion?.targetRole && (
          <span className="truncate">🎯 {activeVersion.targetRole}</span>
        )}
        {atsScore != null && (
          <span className={`font-semibold ml-auto ${scoreColor}`}>ATS {atsScore}%</span>
        )}
        <span className="flex items-center gap-1 ml-auto">
          <Clock className="w-3.5 h-3.5" />
          {formatDate(resume.updatedAt, { month: "short", day: "numeric" })}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-1 border-t border-border">
        <Link
          href={`/dashboard/resumes/${resume.id}`}
          className="flex-1 text-center text-sm font-medium text-primary hover:text-primary/80 transition-colors py-1 rounded-lg hover:bg-primary/5"
        >
          Open Builder
        </Link>
        {!resume.isDefault && (
          <button
            onClick={async () => {
              const fd = new FormData();
              fd.append("id", resume.id);
              await setDefaultResumeAction({ success: false, error: "" }, fd);
            }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Set Default
          </button>
        )}
        <DeleteButton
          id={resume.id}
          label="Resume"
          onDelete={async (id) => {
            const fd = new FormData();
            fd.append("id", id);
            await deleteResumeAction({ success: false, error: "" }, fd);
          }}
        />
      </div>
    </div>
  );
}
