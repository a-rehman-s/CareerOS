"use client";



import type { ResumeContent } from "@/validators/resume";
import type {
  Resume, ResumeVersion,
  Education, Experience, Skill, Project, Certification, Achievement, Profile
} from "@prisma/client";
import { formatDateRange, formatDate } from "@/lib/utils";
import { MapPin, Link2, Mail } from "lucide-react";

interface ResumePreviewProps {
  resume: Resume;
  version: ResumeVersion;
  content: ResumeContent;
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

export function ResumePreview({ resume, version, content, profileData }: ResumePreviewProps) {
  const { profile, name, education, experience, skills, projects, certifications, achievements } = profileData;

  // Filter to selected items
  const selectedExp = experience.filter((e) => content.selectedExperienceIds.includes(e.id));
  const selectedEdu = education.filter((e) => content.selectedEducationIds.includes(e.id));
  const selectedSkills = skills.filter((s) => content.selectedSkillIds.includes(s.id));
  const selectedProjects = projects.filter((p) => content.selectedProjectIds.includes(p.id));
  const selectedCerts = certifications.filter((c) => content.selectedCertificationIds.includes(c.id));
  const selectedAch = achievements.filter((a) => content.selectedAchievementIds.includes(a.id));

  const displayName = name ?? "Your Name";
  const title = content.targetRole || profile?.professionalTitle || "Software Engineer";
  const summary = content.summary || profile?.professionalSummary;

  // Group skills by category
  const skillsByCategory: Record<string, Skill[]> = {};
  for (const skill of selectedSkills) {
    const cat = skill.category ?? "Other";
    if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
    skillsByCategory[cat].push(skill);
  }

  const hasContent =
    selectedExp.length > 0 || selectedEdu.length > 0 || selectedSkills.length > 0 ||
    selectedProjects.length > 0 || selectedCerts.length > 0 || selectedAch.length > 0 || summary;

  if (!hasContent) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] rounded-xl border-2 border-dashed border-border text-muted-foreground text-sm">
        Select items in the editor to preview your resume
      </div>
    );
  }

  return (
    <div className="bg-white text-black rounded-xl shadow-lg overflow-hidden min-h-[900px] print:shadow-none">
      {/* A4 proportional container */}
      <div className="p-10 font-serif" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>

        {/* Header */}
        <div className="border-b-2 border-black pb-4 mb-5">
          <h1 className="text-3xl font-bold tracking-tight text-black">{displayName}</h1>
          <p className="text-base text-gray-700 mt-0.5">{title}</p>
          <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-600">
            {profile?.location && (
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{profile.location}</span>
            )}
            {profile?.publicEmail && (
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{profile.publicEmail}</span>
            )}
            {profile?.website && (
              <span className="flex items-center gap-1"><Link2 className="w-3 h-3" />{profile.website}</span>
            )}
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <Section title="Summary">
            <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
          </Section>
        )}

        {/* Experience */}
        {selectedExp.length > 0 && (
          <Section title="Experience">
            {selectedExp.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-sm text-black">{exp.position}</p>
                    <p className="text-sm text-gray-700">{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
                  </div>
                  <p className="text-xs text-gray-500 shrink-0 ml-4 mt-0.5">
                    {formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                  </p>
                </div>
                {exp.description && (
                  <p className="text-xs text-gray-700 mt-1 leading-relaxed">{exp.description}</p>
                )}
              </div>
            ))}
          </Section>
        )}

        {/* Education */}
        {selectedEdu.length > 0 && (
          <Section title="Education">
            {selectedEdu.map((edu) => (
              <div key={edu.id} className="mb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-sm text-black">{edu.institution}</p>
                    <p className="text-xs text-gray-700">
                      {[edu.degree, edu.field].filter(Boolean).join(" · ")}
                      {edu.cgpa && ` · GPA ${edu.cgpa}`}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 shrink-0 ml-4 mt-0.5">
                    {formatDateRange(edu.startDate, edu.endDate)}
                  </p>
                </div>
              </div>
            ))}
          </Section>
        )}

        {/* Skills */}
        {selectedSkills.length > 0 && (
          <Section title="Skills">
            <div className="space-y-1.5">
              {Object.entries(skillsByCategory).map(([cat, catSkills]) => (
                <div key={cat} className="flex gap-2 text-xs">
                  <span className="font-semibold text-black w-24 shrink-0">{cat}:</span>
                  <span className="text-gray-700">{catSkills.map((s) => s.name).join(", ")}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Projects */}
        {selectedProjects.length > 0 && (
          <Section title="Projects">
            {selectedProjects.map((proj) => (
              <div key={proj.id} className="mb-3">
                <div className="flex items-start justify-between">
                  <p className="font-bold text-sm text-black">{proj.name}</p>
                  <div className="flex gap-2 text-xs text-gray-500 shrink-0 ml-4">
                    {proj.githubUrl && <a href={proj.githubUrl} className="underline">GitHub</a>}
                    {proj.liveUrl && <a href={proj.liveUrl} className="underline">Live</a>}
                  </div>
                </div>
                {proj.shortDescription && (
                  <p className="text-xs text-gray-700 mt-0.5">{proj.shortDescription}</p>
                )}
              </div>
            ))}
          </Section>
        )}

        {/* Certifications */}
        {selectedCerts.length > 0 && (
          <Section title="Certifications">
            {selectedCerts.map((cert) => (
              <div key={cert.id} className="mb-2">
                <div className="flex items-start justify-between">
                  <p className="text-sm font-bold text-black">{cert.name}</p>
                  <p className="text-xs text-gray-500 shrink-0 ml-4">{formatDate(cert.issueDate, { month: "short", year: "numeric" })}</p>
                </div>
                <p className="text-xs text-gray-700">{cert.issuer}</p>
              </div>
            ))}
          </Section>
        )}

        {/* Achievements */}
        {selectedAch.length > 0 && (
          <Section title="Achievements">
            {selectedAch.map((ach) => (
              <div key={ach.id} className="mb-2">
                <p className="text-sm font-bold text-black">{ach.title}</p>
                {ach.organization && <p className="text-xs text-gray-700">{ach.organization}</p>}
              </div>
            ))}
          </Section>
        )}

        {/* Footer */}
        <div className="mt-8 pt-3 border-t border-gray-200 text-center text-xs text-gray-400">
          {resume.name} · {version.label} · CareerOS
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h2 className="text-sm font-bold uppercase tracking-widest text-black border-b border-black pb-0.5 mb-2">{title}</h2>
      {children}
    </div>
  );
}
