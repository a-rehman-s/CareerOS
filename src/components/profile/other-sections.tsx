"use client";

import { useActionState, useEffect, useState } from "react";
import { FormField, Input, CheckboxField } from "@/components/ui/form-field";
import { SubmitButton, AddButton, DeleteButton, SectionHeader } from "@/components/ui/buttons";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { createCertificationAction, updateCertificationAction, deleteCertificationAction } from "@/app/dashboard/profile/actions";
import { createAchievementAction, updateAchievementAction, deleteAchievementAction } from "@/app/dashboard/profile/actions";
import { createLinkAction, updateLinkAction, deleteLinkAction } from "@/app/dashboard/profile/actions";
import { formatDate } from "@/lib/utils";
import type { ActionState } from "@/types";
import type { Certification, Achievement, ProfessionalLink } from "@prisma/client";
import { Award, Trophy, Link2 } from "lucide-react";

const initial: ActionState = { success: false, error: "" };

// ─── Certifications ────────────────────────────────────────────────────────────

function CertForm({ item, onSuccess }: { item?: Certification; onSuccess: () => void }) {
  const action = item ? updateCertificationAction : createCertificationAction;
  const [state, formAction] = useActionState(action, initial);
  useEffect(() => { if (state.success) onSuccess(); }, [state.success, onSuccess]);
  const e = !state.success ? state.details : undefined;

  return (
    <form action={formAction} className="space-y-4">
      {item && <input type="hidden" name="id" value={item.id} />}
      {!state.success && state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <FormField label="Certification Name" htmlFor="certName" error={e?.name?.[0]} required>
        <Input id="certName" name="name" defaultValue={item?.name ?? ""} placeholder="AWS Solutions Architect" error={!!e?.name} />
      </FormField>
      <FormField label="Issuer" htmlFor="issuer" error={e?.issuer?.[0]} required>
        <Input id="issuer" name="issuer" defaultValue={item?.issuer ?? ""} placeholder="Amazon Web Services" error={!!e?.issuer} />
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Issue Date" htmlFor="issueDate">
          <Input id="issueDate" name="issueDate" type="month"
            defaultValue={item?.issueDate ? new Date(item.issueDate).toISOString().slice(0, 7) : ""} />
        </FormField>
        <FormField label="Expiration Date" htmlFor="expirationDate" hint="Optional">
          <Input id="expirationDate" name="expirationDate" type="month"
            defaultValue={item?.expirationDate ? new Date(item.expirationDate).toISOString().slice(0, 7) : ""} />
        </FormField>
      </div>
      <FormField label="Credential URL" htmlFor="credentialUrl">
        <Input id="credentialUrl" name="credentialUrl" type="url" defaultValue={item?.credentialUrl ?? ""} placeholder="https://..." />
      </FormField>
      <CheckboxField name="isPublic" label="Show on portfolio" defaultChecked={item?.isPublic ?? true} />
      <div className="flex justify-end pt-2"><SubmitButton label={item ? "Save Changes" : "Add Certification"} /></div>
    </form>
  );
}

export function CertificationsSection({ certifications }: { certifications: Certification[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Certification | null>(null);
  const openAdd = () => { setEditing(null); setOpen(true); };
  const close = () => { setOpen(false); setEditing(null); };

  return (
    <div className="space-y-3">
      <SectionHeader title="Certifications" action={<AddButton onClick={openAdd} label="Add Certification" />} />
      {certifications.length === 0 ? (
        <EmptyState icon={<Award className="w-5 h-5" />} title="No certifications added"
          action={<AddButton onClick={openAdd} label="Add certification" />} />
      ) : (
        <div className="space-y-2">
          {certifications.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card hover:bg-accent/30 transition-colors">
              <div className="min-w-0">
                <p className="font-semibold text-foreground text-sm">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.issuer} · {formatDate(item.issueDate)}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={() => { setEditing(item); setOpen(true); }} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Edit</button>
                <DeleteButton id={item.id} label="Certification" onDelete={async (id) => { const fd = new FormData(); fd.append("id", id); await deleteCertificationAction({ success: false, error: "" }, fd); }} />
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal open={open} onClose={close} title={editing ? "Edit Certification" : "Add Certification"}>
        <CertForm item={editing ?? undefined} onSuccess={close} />
      </Modal>
    </div>
  );
}

// ─── Achievements ──────────────────────────────────────────────────────────────

function AchievementForm({ item, onSuccess }: { item?: Achievement; onSuccess: () => void }) {
  const action = item ? updateAchievementAction : createAchievementAction;
  const [state, formAction] = useActionState(action, initial);
  useEffect(() => { if (state.success) onSuccess(); }, [state.success, onSuccess]);
  const e = !state.success ? state.details : undefined;

  return (
    <form action={formAction} className="space-y-4">
      {item && <input type="hidden" name="id" value={item.id} />}
      {!state.success && state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <FormField label="Title" htmlFor="achTitle" error={e?.title?.[0]} required>
        <Input id="achTitle" name="title" defaultValue={item?.title ?? ""} placeholder="Best Paper Award" error={!!e?.title} />
      </FormField>
      <FormField label="Organization" htmlFor="organization">
        <Input id="organization" name="organization" defaultValue={item?.organization ?? ""} placeholder="IEEE Conference" />
      </FormField>
      <FormField label="Date" htmlFor="achDate">
        <Input id="achDate" name="date" type="month"
          defaultValue={item?.date ? new Date(item.date).toISOString().slice(0, 7) : ""} />
      </FormField>
      <FormField label="URL" htmlFor="achUrl">
        <Input id="achUrl" name="url" type="url" defaultValue={item?.url ?? ""} placeholder="https://..." />
      </FormField>
      <CheckboxField name="isPublic" label="Show on portfolio" defaultChecked={item?.isPublic ?? true} />
      <div className="flex justify-end pt-2"><SubmitButton label={item ? "Save Changes" : "Add Achievement"} /></div>
    </form>
  );
}

export function AchievementsSection({ achievements }: { achievements: Achievement[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Achievement | null>(null);
  const close = () => { setOpen(false); setEditing(null); };

  return (
    <div className="space-y-3">
      <SectionHeader title="Achievements" action={<AddButton onClick={() => { setEditing(null); setOpen(true); }} label="Add Achievement" />} />
      {achievements.length === 0 ? (
        <EmptyState icon={<Trophy className="w-5 h-5" />} title="No achievements added"
          action={<AddButton onClick={() => { setEditing(null); setOpen(true); }} label="Add achievement" />} />
      ) : (
        <div className="space-y-2">
          {achievements.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card hover:bg-accent/30 transition-colors">
              <div>
                <p className="font-semibold text-foreground text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground">{[item.organization, formatDate(item.date)].filter(Boolean).join(" · ")}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={() => { setEditing(item); setOpen(true); }} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Edit</button>
                <DeleteButton id={item.id} label="Achievement" onDelete={async (id) => { const fd = new FormData(); fd.append("id", id); await deleteAchievementAction({ success: false, error: "" }, fd); }} />
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal open={open} onClose={close} title={editing ? "Edit Achievement" : "Add Achievement"}>
        <AchievementForm item={editing ?? undefined} onSuccess={close} />
      </Modal>
    </div>
  );
}

// ─── Professional Links ────────────────────────────────────────────────────────

const platformIcons: Record<string, string> = {
  github: "🐙", linkedin: "💼", twitter: "🐦", portfolio: "🌐",
  youtube: "📺", dribbble: "🏀", behance: "🎨", devto: "💻",
};

function LinkForm({ item, onSuccess }: { item?: ProfessionalLink; onSuccess: () => void }) {
  const action = item ? updateLinkAction : createLinkAction;
  const [state, formAction] = useActionState(action, initial);
  useEffect(() => { if (state.success) onSuccess(); }, [state.success, onSuccess]);
  const e = !state.success ? state.details : undefined;

  return (
    <form action={formAction} className="space-y-4">
      {item && <input type="hidden" name="id" value={item.id} />}
      {!state.success && state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <FormField label="Platform" htmlFor="platform" error={e?.platform?.[0]} required>
        <Input id="platform" name="platform" defaultValue={item?.platform ?? ""} placeholder="github, linkedin, portfolio..." error={!!e?.platform} />
      </FormField>
      <FormField label="URL" htmlFor="linkUrl" error={e?.url?.[0]} required>
        <Input id="linkUrl" name="url" type="url" defaultValue={item?.url ?? ""} placeholder="https://github.com/you" error={!!e?.url} />
      </FormField>
      <FormField label="Label" htmlFor="label" hint="Optional display name">
        <Input id="label" name="label" defaultValue={item?.label ?? ""} placeholder="My GitHub" />
      </FormField>
      <CheckboxField name="isPublic" label="Show on portfolio" defaultChecked={item?.isPublic ?? true} />
      <div className="flex justify-end pt-2"><SubmitButton label={item ? "Save Changes" : "Add Link"} /></div>
    </form>
  );
}

export function LinksSection({ links }: { links: ProfessionalLink[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProfessionalLink | null>(null);
  const close = () => { setOpen(false); setEditing(null); };

  return (
    <div className="space-y-3">
      <SectionHeader title="Professional Links" action={<AddButton onClick={() => { setEditing(null); setOpen(true); }} label="Add Link" />} />
      {links.length === 0 ? (
        <EmptyState icon={<Link2 className="w-5 h-5" />} title="No links added"
          action={<AddButton onClick={() => { setEditing(null); setOpen(true); }} label="Add link" />} />
      ) : (
        <div className="flex flex-wrap gap-2">
          {links.map((item) => {
            const icon = platformIcons[item.platform.toLowerCase()] ?? "🔗";
            return (
              <div key={item.id} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card hover:bg-accent/30 transition-colors">
                <span>{icon}</span>
                <a href={item.url} target="_blank" rel="noopener noreferrer"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors" onClick={(e) => e.stopPropagation()}>
                  {item.label || item.platform}
                </a>
                <button onClick={() => { setEditing(item); setOpen(true); }} className="text-xs text-muted-foreground hover:text-foreground ml-1 transition-colors">✎</button>
                <DeleteButton id={item.id} label="Link" onDelete={async (id) => { const fd = new FormData(); fd.append("id", id); await deleteLinkAction({ success: false, error: "" }, fd); }} />
              </div>
            );
          })}
        </div>
      )}
      <Modal open={open} onClose={close} title={editing ? "Edit Link" : "Add Link"}>
        <LinkForm item={editing ?? undefined} onSuccess={close} />
      </Modal>
    </div>
  );
}
