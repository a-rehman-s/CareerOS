"use client";

import { useActionState, useEffect, useState } from "react";
import { FormField, Input, Textarea, Select, CheckboxField } from "@/components/ui/form-field";
import { SubmitButton, AddButton, DeleteButton, SectionHeader } from "@/components/ui/buttons";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { createExperienceAction, updateExperienceAction, deleteExperienceAction } from "@/app/dashboard/profile/actions";
import { formatDateRange, enumToLabel } from "@/lib/utils";
import type { ActionState } from "@/types";
import type { Experience } from "@prisma/client";
import { Briefcase } from "lucide-react";

const initial: ActionState = { success: false, error: "" };

const employmentTypes = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "FREELANCE", label: "Freelance" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "VOLUNTEER", label: "Volunteer" },
  { value: "OTHER", label: "Other" },
];

function ExperienceForm({ item, onSuccess }: { item?: Experience; onSuccess: () => void }) {
  const action = item ? updateExperienceAction : createExperienceAction;
  const [state, formAction] = useActionState(action, initial);
  const isCurrent = item?.isCurrent ?? false;

  useEffect(() => { if (state.success) onSuccess(); }, [state.success, onSuccess]);

  const e = !state.success ? state.details : undefined;

  return (
    <form action={formAction} className="space-y-4">
      {item && <input type="hidden" name="id" value={item.id} />}
      {!state.success && state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Company" htmlFor="company" error={e?.company?.[0]} required>
          <Input id="company" name="company" defaultValue={item?.company ?? ""} placeholder="Google, Meta, Startup Inc." error={!!e?.company} />
        </FormField>
        <FormField label="Position" htmlFor="position" error={e?.position?.[0]} required>
          <Input id="position" name="position" defaultValue={item?.position ?? ""} placeholder="Senior Engineer" error={!!e?.position} />
        </FormField>
        <FormField label="Employment Type" htmlFor="employmentType">
          <Select id="employmentType" name="employmentType" options={employmentTypes} defaultValue={item?.employmentType ?? "FULL_TIME"} />
        </FormField>
        <FormField label="Location" htmlFor="location">
          <Input id="location" name="location" defaultValue={item?.location ?? ""} placeholder="New York, NY" />
        </FormField>
        <FormField label="Start Date" htmlFor="startDate">
          <Input id="startDate" name="startDate" type="month"
            defaultValue={item?.startDate ? new Date(item.startDate).toISOString().slice(0, 7) : ""} />
        </FormField>
        <FormField label="End Date" htmlFor="endDate" hint={isCurrent ? "Current position" : "Leave blank if ongoing"}>
          <Input id="endDate" name="endDate" type="month" disabled={isCurrent}
            defaultValue={item?.endDate ? new Date(item.endDate).toISOString().slice(0, 7) : ""} />
        </FormField>
      </div>

      <div className="flex gap-4">
        <CheckboxField name="isCurrent" label="I currently work here"
          defaultChecked={item?.isCurrent ?? false} />
        <CheckboxField name="isRemote" label="Remote"
          defaultChecked={item?.isRemote ?? false} />
      </div>

      <FormField label="Description" htmlFor="description">
        <Textarea id="description" name="description" rows={3} defaultValue={item?.description ?? ""}
          placeholder="Describe your role and responsibilities..." />
      </FormField>

      <CheckboxField name="isPublic" label="Show on public portfolio" defaultChecked={item?.isPublic ?? true} />

      <div className="flex justify-end gap-2 pt-2">
        <SubmitButton label={item ? "Save Changes" : "Add Experience"} />
      </div>
    </form>
  );
}

interface ExperienceSectionProps { experience: Experience[] }

export function ExperienceSection({ experience }: ExperienceSectionProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const openAdd = () => { setEditing(null); setOpen(true); };
  const openEdit = (item: Experience) => { setEditing(item); setOpen(true); };
  const close = () => { setOpen(false); setEditing(null); };

  return (
    <div className="space-y-3">
      <SectionHeader title="Experience" action={<AddButton onClick={openAdd} label="Add Experience" />} />
      {experience.length === 0 ? (
        <EmptyState icon={<Briefcase className="w-5 h-5" />} title="No experience added"
          description="Add your work history, internships, and freelance projects."
          action={<AddButton onClick={openAdd} label="Add your first role" />} />
      ) : (
        <div className="space-y-2">
          {experience.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-4 p-4 rounded-xl border border-border bg-card hover:bg-accent/30 transition-colors">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-foreground text-sm">{item.position}</p>
                  {item.isCurrent && <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">Current</span>}
                </div>
                <p className="text-sm text-muted-foreground">{item.company} · {enumToLabel(item.employmentType)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatDateRange(item.startDate?.toISOString() ?? null, item.endDate?.toISOString() ?? null, item.isCurrent)}
                  {item.location && ` · ${item.location}`}
                  {item.isRemote && " · Remote"}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={() => openEdit(item)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Edit</button>
                <DeleteButton id={item.id} label="Experience" onDelete={async (id) => { const fd = new FormData(); fd.append("id", id); await deleteExperienceAction({ success: false, error: "" }, fd); }} />
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal open={open} onClose={close} title={editing ? "Edit Experience" : "Add Experience"}>
        <ExperienceForm item={editing ?? undefined} onSuccess={close} />
      </Modal>
    </div>
  );
}
