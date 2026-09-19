"use client";

import { useActionState, useEffect } from "react";
import { FormField, Input, Textarea, CheckboxField } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/buttons";
import { createResumeAction, updateResumeAction } from "@/app/dashboard/resumes/actions";
import type { ActionState } from "@/types";
import type { Resume } from "@prisma/client";

const initial: ActionState = { success: false, error: "" };

interface ResumeFormProps {
  resume?: Resume;
  onSuccess?: (id?: string) => void;
}

export function ResumeForm({ resume, onSuccess }: ResumeFormProps) {
  const action = resume ? updateResumeAction : createResumeAction;
  const [state, formAction] = useActionState(action, initial);

  useEffect(() => {
    if (state.success && onSuccess) {
      const id = state.success ? (state as unknown as { data?: string }).data : undefined;
      onSuccess(id);
    }
  }, [state, onSuccess]);

  const e = !state.success ? state.details : undefined;

  return (
    <form action={formAction} className="space-y-4">
      {resume && <input type="hidden" name="id" value={resume.id} />}

      {!state.success && state.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      {state.success && (
        <p className="text-sm text-emerald-500">{state.message}</p>
      )}

      <FormField label="Resume Name" htmlFor="name" error={e?.name?.[0]} required
        hint='e.g. "Master Resume", "ML Engineer Resume", "SWE Internship"'>
        <Input
          id="name" name="name"
          defaultValue={resume?.name ?? ""}
          placeholder="My Resume"
          error={!!e?.name}
        />
      </FormField>

      <FormField label="Description" htmlFor="description" error={e?.description?.[0]}
        hint="Optional — who this resume is for">
        <Textarea
          id="description" name="description" rows={2}
          defaultValue={resume?.description ?? ""}
          placeholder="Tailored for AI/ML engineering roles at mid-sized companies"
        />
      </FormField>

      <CheckboxField
        name="isDefault"
        label="Set as default resume"
        defaultChecked={resume?.isDefault ?? false}
        description="Used when no specific resume is selected for an application"
      />

      <div className="flex justify-end pt-2">
        <SubmitButton
          label={resume ? "Save Changes" : "Create Resume"}
          pendingLabel={resume ? "Saving..." : "Creating..."}
        />
      </div>
    </form>
  );
}
