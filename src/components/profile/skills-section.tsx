"use client";

import { useActionState, useEffect, useState } from "react";
import { FormField, Input, Select, CheckboxField } from "@/components/ui/form-field";
import { SubmitButton, AddButton, DeleteButton, SectionHeader } from "@/components/ui/buttons";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { createSkillAction, updateSkillAction, deleteSkillAction } from "@/app/dashboard/profile/actions";
import { groupSkillsByCategory } from "@/services/skill.service";
import { cn } from "@/lib/utils";
import type { ActionState } from "@/types";
import type { Skill } from "@prisma/client";
import { Zap } from "lucide-react";

const initial: ActionState = { success: false, error: "" };

const proficiencyLevels = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
  { value: "EXPERT", label: "Expert" },
];

const proficiencyColors: Record<string, string> = {
  BEGINNER: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  INTERMEDIATE: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  ADVANCED: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  EXPERT: "bg-violet-500/10 text-violet-400 border-violet-500/20",
};

const proficiencyDot: Record<string, string> = {
  BEGINNER: "bg-slate-400",
  INTERMEDIATE: "bg-blue-400",
  ADVANCED: "bg-indigo-400",
  EXPERT: "bg-violet-400",
};

function SkillForm({ item, onSuccess }: { item?: Skill; onSuccess: () => void }) {
  const action = item ? updateSkillAction : createSkillAction;
  const [state, formAction] = useActionState(action, initial);
  useEffect(() => { if (state.success) onSuccess(); }, [state.success, onSuccess]);
  const e = !state.success ? state.details : undefined;

  return (
    <form action={formAction} className="space-y-4">
      {item && <input type="hidden" name="id" value={item.id} />}
      {!state.success && state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <FormField label="Skill Name" htmlFor="name" error={e?.name?.[0]} required>
        <Input id="name" name="name" defaultValue={item?.name ?? ""} placeholder="TypeScript, React, PostgreSQL..." error={!!e?.name} />
      </FormField>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Category" htmlFor="category" hint="e.g. Frontend, Backend, DevOps">
          <Input id="category" name="category" defaultValue={item?.category ?? ""} placeholder="Frontend" />
        </FormField>
        <FormField label="Proficiency" htmlFor="proficiency">
          <Select id="proficiency" name="proficiency" options={proficiencyLevels} defaultValue={item?.proficiency ?? "INTERMEDIATE"} />
        </FormField>
        <FormField label="Years of Experience" htmlFor="yearsOfExperience" hint="Optional">
          <Input id="yearsOfExperience" name="yearsOfExperience" type="number" min="0" max="50"
            defaultValue={item?.yearsOfExperience?.toString() ?? ""} placeholder="3" className="max-w-24" />
        </FormField>
      </div>
      <CheckboxField name="isPublic" label="Show on public portfolio" defaultChecked={item?.isPublic ?? true} />
      <div className="flex justify-end pt-2">
        <SubmitButton label={item ? "Save Changes" : "Add Skill"} />
      </div>
    </form>
  );
}

interface SkillsSectionProps { skills: Skill[] }

export function SkillsSection({ skills }: SkillsSectionProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const grouped = groupSkillsByCategory(skills);

  const openAdd = () => { setEditing(null); setOpen(true); };
  const openEdit = (item: Skill) => { setEditing(item); setOpen(true); };
  const close = () => { setOpen(false); setEditing(null); };

  return (
    <div className="space-y-3">
      <SectionHeader title="Skills" action={<AddButton onClick={openAdd} label="Add Skill" />} />
      {skills.length === 0 ? (
        <EmptyState icon={<Zap className="w-5 h-5" />} title="No skills added"
          description="Add your technical and professional skills with proficiency levels."
          action={<AddButton onClick={openAdd} label="Add your first skill" />} />
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([category, categorySkills]) => (
            <div key={category}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{category}</p>
              <div className="flex flex-wrap gap-2">
                {categorySkills.map((skill) => (
                  <button key={skill.id} onClick={() => openEdit(skill)}
                    className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all hover:opacity-80 cursor-pointer", proficiencyColors[skill.proficiency] ?? "bg-muted text-foreground border-border")}>
                    <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", proficiencyDot[skill.proficiency] ?? "bg-muted-foreground")} />
                    {skill.name}
                    {skill.yearsOfExperience && <span className="opacity-60">{skill.yearsOfExperience.toString()}y</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">Click a skill to edit or delete it.</p>
        </div>
      )}
      <Modal open={open} onClose={close} title={editing ? `Edit: ${editing.name}` : "Add Skill"}>
        <SkillForm item={editing ?? undefined} onSuccess={close} />
        {editing && (
          <div className="mt-4 pt-4 border-t border-border">
            <DeleteButton id={editing.id} label="Skill" onDelete={async (id) => { const fd = new FormData(); fd.append("id", id); await deleteSkillAction({ success: false, error: "" }, fd); }} />
          </div>
        )}
      </Modal>
    </div>
  );
}
