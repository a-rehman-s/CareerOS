"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { ProfileHeader, ProfileForm, ProfileScoreBar } from "@/components/profile/profile-section";
import { EducationSection } from "@/components/profile/education-section";
import { ExperienceSection } from "@/components/profile/experience-section";
import { SkillsSection } from "@/components/profile/skills-section";
import { ProjectsSection } from "@/components/profile/projects-section";
import { CertificationsSection, AchievementsSection, LinksSection } from "@/components/profile/other-sections";
import type { Profile, Education, Experience, Skill, Project, Certification, Achievement, ProfessionalLink } from "@prisma/client";

interface ProfileClientProps {
  userName: string | null;
  score: number;
  profile: Profile | null;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  achievements: Achievement[];
  links: ProfessionalLink[];
}

export function ProfileClient({
  userName, score, profile, education, experience, skills,
  projects, certifications, achievements, links,
}: ProfileClientProps) {
  const [editingProfile, setEditingProfile] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile completeness */}
      <ProfileScoreBar score={score} />

      {/* Profile header */}
      <ProfileHeader profile={profile} userName={userName} onEdit={() => setEditingProfile(true)} />

      {/* Profile edit modal */}
      <Modal open={editingProfile} onClose={() => setEditingProfile(false)} title="Edit Profile">
        <ProfileForm profile={profile} onSuccess={() => setEditingProfile(false)} />
      </Modal>

      {/* Sections */}
      <div className="grid grid-cols-1 gap-6">
        <SectionCard>
          <ExperienceSection experience={experience} />
        </SectionCard>

        <SectionCard>
          <EducationSection education={education} />
        </SectionCard>

        <SectionCard>
          <SkillsSection skills={skills} />
        </SectionCard>

        <SectionCard>
          <ProjectsSection projects={projects} />
        </SectionCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionCard>
            <CertificationsSection certifications={certifications} />
          </SectionCard>
          <SectionCard>
            <AchievementsSection achievements={achievements} />
          </SectionCard>
        </div>

        <SectionCard>
          <LinksSection links={links} />
        </SectionCard>
      </div>
    </div>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-5 rounded-xl border border-border bg-card">
      {children}
    </div>
  );
}
