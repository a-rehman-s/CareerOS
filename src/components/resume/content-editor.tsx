"use client";

import { useState, useCallback, useTransition } from "react";
import { saveResumeContentAction } from "@/app/dashboard/resumes/actions";
import type { ResumeContent } from "@/validators/resume";
import type { Education, Experience, Skill, Project, Certification, Achievement } from "@prisma/client";
import { cn } from "@/lib/utils";
import { Save, CheckSquare, Square } from "lucide-react";

interface ContentEditorProps {
  versionId: string;
  resumeId: string;
  initialContent: ResumeContent;
  profile: {
    education: Education[];
    experience: Experience[];
    skills: Skill[];
    projects: Project[];
    certifications: Certification[];
    achievements: Achievement[];
    summary?: string | null;
  };
  onSave?: (content: ResumeContent) => void;
}


function useSet(initial: string[]) {
  const [ids, setIds] = useState<Set<string>>(new Set(initial));
  const toggle = (id: string) =>
    setIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const selectAll = (allIds: string[]) => setIds(new Set(allIds));
  const clearAll = () => setIds(new Set());
  return { ids, toggle, selectAll, clearAll };
}

// A toggleable item row
function SelectRow({
  id,
  label,
  sublabel,
  selected,
  onToggle,
}: {
  id: string;
  label: string;
  sublabel?: string;
  selected: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(id)}
      className={cn(
        "w-full flex items-start gap-3 text-left px-3 py-2.5 rounded-lg border transition-all",
        selected
          ? "bg-primary/8 border-primary/30 text-foreground"
          : "bg-card border-border text-muted-foreground hover:bg-accent/30"
      )}
    >
      <span className="mt-0.5 shrink-0 text-primary">
        {selected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-muted-foreground" />}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium">{label}</span>
        {sublabel && <span className="block text-xs mt-0.5 text-muted-foreground">{sublabel}</span>}
      </span>
    </button>
  );
}

function SectionBlock({
  title,
  selected,
  total,
  onSelectAll,
  onClearAll,
  children,
}: {
  title: string;
  _count?: number;
  selected: number;
  total: number;
  onSelectAll: () => void;
  onClearAll: () => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-foreground">{title}</span>
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            {selected}/{total}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onSelectAll(); }}
            className="text-xs text-primary hover:text-primary/80 transition-colors"
          >
            All
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClearAll(); }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            None
          </button>
          <span className="text-muted-foreground text-xs">{open ? "▲" : "▼"}</span>
        </div>
      </button>
      {open && <div className="p-3 space-y-1.5">{children}</div>}
    </div>
  );
}

export function ContentEditor({
  versionId,
  resumeId,
  initialContent,
  profile,
  onSave,
}: ContentEditorProps) {
  const [summary, setSummary] = useState(initialContent.summary ?? "");
  const [isPending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const experience = useSet(initialContent.selectedExperienceIds);
  const education = useSet(initialContent.selectedEducationIds);
  const skills = useSet(initialContent.selectedSkillIds);
  const projects = useSet(initialContent.selectedProjectIds);
  const certifications = useSet(initialContent.selectedCertificationIds);
  const achievements = useSet(initialContent.selectedAchievementIds);

  const buildContent = useCallback((): ResumeContent => ({
    summary: summary || null,
    selectedExperienceIds: [...experience.ids],
    selectedEducationIds: [...education.ids],
    selectedSkillIds: [...skills.ids],
    selectedProjectIds: [...projects.ids],
    selectedCertificationIds: [...certifications.ids],
    selectedAchievementIds: [...achievements.ids],
    customSections: initialContent.customSections ?? [],
    keywords: initialContent.keywords ?? [],
    targetRole: initialContent.targetRole,
    targetCompany: initialContent.targetCompany,
  }), [summary, experience.ids, education.ids, skills.ids, projects.ids, certifications.ids, achievements.ids, initialContent]);

  const handleSave = () => {
    const content = buildContent();
    startTransition(async () => {
      setSaveError(null);
      const fd = new FormData();
      fd.append("id", versionId);
      fd.append("resumeId", resumeId);
      fd.append("content", JSON.stringify(content));
      const result = await saveResumeContentAction({ success: false, error: "" }, fd);
      if (result.success) {
        setSavedAt(new Date());
        onSave?.(content);
      } else {
        setSaveError(!result.success ? result.error : "Save failed");
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Save bar */}
      <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-muted/40 border border-border">
        <div className="text-xs text-muted-foreground">
          {saveError ? (
            <span className="text-destructive">{saveError}</span>
          ) : savedAt ? (
            <span className="text-emerald-500">Saved at {savedAt.toLocaleTimeString()}</span>
          ) : (
            "Select items from your profile to include in this resume version"
          )}
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          <Save className="w-3.5 h-3.5" />
          {isPending ? "Saving…" : "Save"}
        </button>
      </div>

      {/* Professional Summary */}
      <div className="border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-muted/30 font-semibold text-sm text-foreground">
          Professional Summary
        </div>
        <div className="p-3">
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder={profile.summary ?? "Write a custom summary for this resume version, or leave blank to use your profile summary…"}
            rows={4}
            className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/60 transition-shadow"
          />
          {profile.summary && !summary && (
            <button
              type="button"
              onClick={() => setSummary(profile.summary ?? "")}
              className="mt-1 text-xs text-primary hover:text-primary/80 transition-colors"
            >
              ↑ Copy from profile
            </button>
          )}
        </div>
      </div>

      {/* Experience */}
      {profile.experience.length > 0 && (
        <SectionBlock
          title="Experience"
          count={experience.ids.size}
          selected={experience.ids.size}
          total={profile.experience.length}
          onSelectAll={() => experience.selectAll(profile.experience.map((e) => e.id))}
          onClearAll={experience.clearAll}
        >
          {profile.experience.map((exp) => (
            <SelectRow
              key={exp.id}
              id={exp.id}
              label={`${exp.position} · ${exp.company}`}
              sublabel={exp.isCurrent ? "Current" : exp.endDate ? exp.endDate.getFullYear().toString() : ""}
              selected={experience.ids.has(exp.id)}
              onToggle={experience.toggle}
            />
          ))}
        </SectionBlock>
      )}

      {/* Education */}
      {profile.education.length > 0 && (
        <SectionBlock
          title="Education"
          count={education.ids.size}
          selected={education.ids.size}
          total={profile.education.length}
          onSelectAll={() => education.selectAll(profile.education.map((e) => e.id))}
          onClearAll={education.clearAll}
        >
          {profile.education.map((edu) => (
            <SelectRow
              key={edu.id}
              id={edu.id}
              label={edu.institution}
              sublabel={[edu.degree, edu.field].filter(Boolean).join(" · ") || undefined}
              selected={education.ids.has(edu.id)}
              onToggle={education.toggle}
            />
          ))}
        </SectionBlock>
      )}

      {/* Skills */}
      {profile.skills.length > 0 && (
        <SectionBlock
          title="Skills"
          count={skills.ids.size}
          selected={skills.ids.size}
          total={profile.skills.length}
          onSelectAll={() => skills.selectAll(profile.skills.map((s) => s.id))}
          onClearAll={skills.clearAll}
        >
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <button
                key={skill.id}
                type="button"
                onClick={() => skills.toggle(skill.id)}
                className={cn(
                  "px-2.5 py-1 rounded-lg border text-xs font-medium transition-all",
                  skills.ids.has(skill.id)
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-card border-border text-muted-foreground hover:border-primary/20"
                )}
              >
                {skill.name}
              </button>
            ))}
          </div>
        </SectionBlock>
      )}

      {/* Projects */}
      {profile.projects.length > 0 && (
        <SectionBlock
          title="Projects"
          count={projects.ids.size}
          selected={projects.ids.size}
          total={profile.projects.length}
          onSelectAll={() => projects.selectAll(profile.projects.map((p) => p.id))}
          onClearAll={projects.clearAll}
        >
          {profile.projects.map((proj) => (
            <SelectRow
              key={proj.id}
              id={proj.id}
              label={proj.name}
              sublabel={proj.shortDescription ?? undefined}
              selected={projects.ids.has(proj.id)}
              onToggle={projects.toggle}
            />
          ))}
        </SectionBlock>
      )}

      {/* Certifications */}
      {profile.certifications.length > 0 && (
        <SectionBlock
          title="Certifications"
          count={certifications.ids.size}
          selected={certifications.ids.size}
          total={profile.certifications.length}
          onSelectAll={() => certifications.selectAll(profile.certifications.map((c) => c.id))}
          onClearAll={certifications.clearAll}
        >
          {profile.certifications.map((cert) => (
            <SelectRow
              key={cert.id}
              id={cert.id}
              label={cert.name}
              sublabel={cert.issuer}
              selected={certifications.ids.has(cert.id)}
              onToggle={certifications.toggle}
            />
          ))}
        </SectionBlock>
      )}

      {/* Achievements */}
      {profile.achievements.length > 0 && (
        <SectionBlock
          title="Achievements"
          count={achievements.ids.size}
          selected={achievements.ids.size}
          total={profile.achievements.length}
          onSelectAll={() => achievements.selectAll(profile.achievements.map((a) => a.id))}
          onClearAll={achievements.clearAll}
        >
          {profile.achievements.map((ach) => (
            <SelectRow
              key={ach.id}
              id={ach.id}
              label={ach.title}
              sublabel={ach.organization ?? undefined}
              selected={achievements.ids.has(ach.id)}
              onToggle={achievements.toggle}
            />
          ))}
        </SectionBlock>
      )}
    </div>
  );
}
