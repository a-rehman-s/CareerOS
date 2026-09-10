"use client";

import { useActionState, useEffect } from "react";
import { FormField, Input, Textarea, CheckboxField } from "@/components/ui/form-field";
import { SubmitButton, AddButton, DeleteButton, SectionHeader } from "@/components/ui/buttons";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import {
  createEducationAction,
  updateEducationAction,
  deleteEducationAction,
} from "@/app/dashboard/profile/actions";
import { formatDateRange } from "@/lib/utils";
import type { ActionState } from "@/types";
import type { Education } from "@prisma/client";
import { GraduationCap } from "lucide-react";
import { useState } from "react";

const initial: ActionState = { success: false, error: "" };

// ── Education Form ─────────────────────────────────────────────────────────────

function EducationForm({ item, onSuccess }: { item?: Education; onSuccess: () => void }) {
  const action = item ? updateEducationAction : createEducationAction;
  const [state, formAction] = useActionState(action, initial);

  useEffect(() => {
    if (state.success) onSuccess();
  }, [state.success, onSuccess]);

  const e = !state.success ? state.details : undefined;

  return (
    <form action={formAction} className="space-y-4">
      {item && <input type="hidden" name="id" value={item.id} />}
      {!state.success && state.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <FormField label="Institution" htmlFor="institution" error={e?.institution?.[0]} required>
        <Input id="institution" name="institution" defaultValue={item?.institution ?? ""}
          placeholder="MIT, Stanford, University of..." error={!!e?.institution} />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Degree" htmlFor="degree" error={e?.degree?.[0]}>
          <Input id="degree" name="degree" defaultValue={item?.degree ?? ""}
            placeholder="Bachelor of Science" />
        </FormField>
        <FormField label="Field of Study" htmlFor="field" error={e?.field?.[0]}>
          <Input id="field" name="field" defaultValue={item?.field ?? ""}
            placeholder="Computer Science" />
        </FormField>
        <FormField label="Start Date" htmlFor="startDate">
          <Input id="startDate" name="startDate" type="month"
            defaultValue={item?.startDate ? new Date(item.startDate).toISOString().slice(0, 7) : ""} />
        </FormField>
        <FormField label="End Date" htmlFor="endDate" hint="Leave blank if ongoing">
          <Input id="endDate" name="endDate" type="month"
            defaultValue={item?.endDate ? new Date(item.endDate).toISOString().slice(0, 7) : ""} />
        </FormField>
      </div>

      <FormField label="GPA / CGPA" htmlFor="cgpa" hint="Optional">
        <Input id="cgpa" name="cgpa" type="number" step="0.01" min="0" max="10"
          defaultValue={item?.cgpa?.toString() ?? ""} placeholder="3.8" className="max-w-32" />
      </FormField>

      <FormField label="Description" htmlFor="description" hint="Achievements, activities, notes">
        <Textarea id="description" name="description" rows={3}
          defaultValue={item?.description ?? ""}
          placeholder="Dean's List, relevant courses, thesis..." />
      </FormField>

      <CheckboxField name="isPublic" label="Show on public portfolio"
        defaultChecked={item?.isPublic ?? true} />

      <div className="flex justify-end gap-2 pt-2">
        <SubmitButton label={item ? "Save Changes" : "Add Education"} />
      </div>
    </form>
  );
}

// ── Education Section ──────────────────────────────────────────────────────────

interface EducationSectionProps {
  education: Education[];
}

export function EducationSection({ education }: EducationSectionProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Education | null>(null);

  const openAdd = () => { setEditing(null); setOpen(true); };
  const openEdit = (item: Education) => { setEditing(item); setOpen(true); };
  const close = () => { setOpen(false); setEditing(null); };

  return (
    <div className="space-y-3">
      <SectionHeader title="Education" action={<AddButton onClick={openAdd} label="Add Education" />} />

      {education.length === 0 ? (
        <EmptyState
          icon={<GraduationCap className="w-5 h-5" />}
          title="No education added"
          description="Add your degrees, diplomas, and certifications."
          action={<AddButton onClick={openAdd} label="Add your first degree" />}
        />
      ) : (
        <div className="space-y-2">
          {education.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-4 p-4 rounded-xl border border-border bg-card hover:bg-accent/30 transition-colors">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-foreground text-sm">{item.institution}</p>
                  {!item.isPublic && (
                    <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">Private</span>
                  )}
                </div>
                {(item.degree || item.field) && (
                  <p className="text-sm text-muted-foreground">
                    {[item.degree, item.field].filter(Boolean).join(" · ")}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatDateRange(item.startDate?.toISOString() ?? null, item.endDate?.toISOString() ?? null)}
                  {item.cgpa && ` · GPA: ${item.cgpa}`}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={() => openEdit(item)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Edit
                </button>
                <DeleteButton
                  id={item.id}
                  label="Education"
                  onDelete={async (id) => {
                    const fd = new FormData();
                    fd.append("id", id);
                    await deleteEducationAction({ success: false, error: "" }, fd);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={close} title={editing ? "Edit Education" : "Add Education"}>
        <EducationForm item={editing ?? undefined} onSuccess={close} />
      </Modal>
    </div>
  );
}
