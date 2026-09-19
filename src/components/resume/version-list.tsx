"use client";

import { useActionState, useEffect, useState } from "react";
import { FormField, Input, Textarea } from "@/components/ui/form-field";
import { SubmitButton, DeleteButton, SectionHeader, AddButton } from "@/components/ui/buttons";
import { Modal } from "@/components/ui/modal";
import {
  createResumeVersionAction,
  updateResumeVersionAction,
  deleteResumeVersionAction,
  setActiveVersionAction,
} from "@/app/dashboard/resumes/actions";
import { formatDate, cn } from "@/lib/utils";
import type { ActionState } from "@/types";
import type { ResumeVersion } from "@prisma/client";
import { CheckCircle2, Circle } from "lucide-react";

const initial: ActionState = { success: false, error: "" };

// ── Version Form ──────────────────────────────────────────────────────────────

function VersionForm({
  resumeId,
  version,
  onSuccess,
}: {
  resumeId: string;
  version?: ResumeVersion;
  onSuccess: () => void;
}) {
  const action = version ? updateResumeVersionAction : createResumeVersionAction;
  const [state, formAction] = useActionState(action, initial);
  useEffect(() => { if (state.success) onSuccess(); }, [state.success, onSuccess]);
  const e = !state.success ? state.details : undefined;

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="resumeId" value={resumeId} />
      {version && <input type="hidden" name="id" value={version.id} />}
      {!state.success && state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <FormField label="Version Label" htmlFor="label" hint='e.g. "v2", "ATS Optimized", "Google Application"'>
        <Input id="label" name="label" defaultValue={version?.label ?? ""} placeholder="v2" />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Target Role" htmlFor="targetRole" error={e?.targetRole?.[0]}>
          <Input id="targetRole" name="targetRole" defaultValue={version?.targetRole ?? ""} placeholder="ML Engineer" />
        </FormField>
        <FormField label="Target Level" htmlFor="targetLevel">
          <Input id="targetLevel" name="targetLevel" defaultValue={version?.targetLevel ?? ""} placeholder="Senior / Mid / Junior" />
        </FormField>
      </div>

      <FormField label="ATS Score" htmlFor="atsScore" hint="Manual entry 0–100 (AI scoring coming soon)">
        <Input id="atsScore" name="atsScore" type="number" min="0" max="100"
          defaultValue={version?.atsScore?.toString() ?? ""}
          placeholder="75" className="max-w-24" />
      </FormField>

      <FormField label="Notes" htmlFor="notes">
        <Textarea id="notes" name="notes" rows={2} defaultValue={version?.notes ?? ""}
          placeholder="What this version is optimized for..." />
      </FormField>

      <div className="flex justify-end pt-2">
        <SubmitButton label={version ? "Save Version" : "Create Version"} />
      </div>
    </form>
  );
}

// ── Version List ──────────────────────────────────────────────────────────────

interface VersionListProps {
  resumeId: string;
  versions: ResumeVersion[];
}

export function VersionList({ resumeId, versions }: VersionListProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ResumeVersion | null>(null);

  const close = () => { setOpen(false); setEditing(null); };

  return (
    <div className="space-y-3">
      <SectionHeader
        title="Versions"
        description="Each version has its own selected content and target role"
        action={
          <AddButton
            onClick={() => { setEditing(null); setOpen(true); }}
            label="New Version"
          />
        }
      />

      <div className="space-y-2">
        {versions.map((v) => {
          const scoreColor =
            v.atsScore == null ? "" :
            v.atsScore >= 80 ? "text-emerald-500" :
            v.atsScore >= 60 ? "text-amber-500" : "text-destructive";

          return (
            <div
              key={v.id}
              className={cn(
                "flex items-center gap-3 p-4 rounded-xl border transition-colors",
                v.isActive
                  ? "border-primary/40 bg-primary/5"
                  : "border-border bg-card hover:bg-accent/20"
              )}
            >
              {/* Active indicator */}
              <button
                onClick={async () => {
                  if (v.isActive) return;
                  const fd = new FormData();
                  fd.append("resumeId", resumeId);
                  fd.append("versionId", v.id);
                  await setActiveVersionAction({ success: false, error: "" }, fd);
                }}
                title={v.isActive ? "Active version" : "Set as active"}
                className="shrink-0"
              >
                {v.isActive
                  ? <CheckCircle2 className="w-5 h-5 text-primary" />
                  : <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                }
              </button>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-foreground">{v.label ?? `v${v.version}`}</span>
                  {v.isActive && (
                    <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded font-medium">Active</span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground flex-wrap">
                  {v.targetRole && <span>🎯 {v.targetRole}</span>}
                  {v.targetLevel && <span>· {v.targetLevel}</span>}
                  {v.atsScore != null && <span className={`font-semibold ${scoreColor}`}>ATS {v.atsScore}%</span>}
                  <span className="ml-auto">{formatDate(v.updatedAt, { month: "short", day: "numeric" })}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => { setEditing(v); setOpen(true); }}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Edit
                </button>
                <DeleteButton
                  id={v.id}
                  label="Version"
                  onDelete={async (id) => {
                    const fd = new FormData();
                    fd.append("id", id);
                    fd.append("resumeId", resumeId);
                    await deleteResumeVersionAction({ success: false, error: "" }, fd);
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        open={open}
        onClose={close}
        title={editing ? "Edit Version" : "New Version"}
        description={editing ? undefined : "A new version copies the current active version's content"}
      >
        <VersionForm resumeId={resumeId} version={editing ?? undefined} onSuccess={close} />
      </Modal>
    </div>
  );
}
