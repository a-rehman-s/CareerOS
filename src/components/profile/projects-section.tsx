"use client";

import { useActionState, useEffect, useState } from "react";
import { FormField, Input, Textarea, CheckboxField } from "@/components/ui/form-field";
import { SubmitButton, AddButton, DeleteButton, SectionHeader } from "@/components/ui/buttons";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { createProjectAction, updateProjectAction, deleteProjectAction } from "@/app/dashboard/profile/actions";
import { slugify } from "@/lib/utils";
import type { ActionState } from "@/types";
import type { Project } from "@prisma/client";
import { FolderOpen, ExternalLink, Github } from "lucide-react";

const initial: ActionState = { success: false, error: "" };

function ProjectForm({ item, onSuccess }: { item?: Project; onSuccess: () => void }) {
  const action = item ? updateProjectAction : createProjectAction;
  const [state, formAction] = useActionState(action, initial);
  const [name, setName] = useState(item?.name ?? "");
  const [slug, setSlug] = useState(item?.slug ?? "");
  useEffect(() => { if (state.success) onSuccess(); }, [state.success, onSuccess]);
  const e = !state.success ? state.details : undefined;

  return (
    <form action={formAction} className="space-y-4">
      {item && <input type="hidden" name="id" value={item.id} />}
      {!state.success && state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <FormField label="Project Name" htmlFor="name" error={e?.name?.[0]} required>
        <Input id="name" name="name" value={name} error={!!e?.name}
          onChange={(ev) => { setName(ev.target.value); if (!item) setSlug(slugify(ev.target.value)); }}
          placeholder="My Awesome Project" />
      </FormField>

      <FormField label="URL Slug" htmlFor="slug" error={e?.slug?.[0]} hint="Used in your public portfolio URL">
        <Input id="slug" name="slug" value={slug} onChange={(ev) => setSlug(ev.target.value)}
          placeholder="my-awesome-project" error={!!e?.slug} />
      </FormField>

      <FormField label="Short Description" htmlFor="shortDescription" error={e?.shortDescription?.[0]}>
        <Input id="shortDescription" name="shortDescription" defaultValue={item?.shortDescription ?? ""}
          placeholder="One-line summary of the project" />
      </FormField>

      <FormField label="Full Description" htmlFor="fullDescription">
        <Textarea id="fullDescription" name="fullDescription" rows={4}
          defaultValue={item?.fullDescription ?? ""}
          placeholder="Detailed description..." />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="GitHub URL" htmlFor="githubUrl" error={e?.githubUrl?.[0]}>
          <Input id="githubUrl" name="githubUrl" type="url" defaultValue={item?.githubUrl ?? ""}
            placeholder="https://github.com/..." error={!!e?.githubUrl} />
        </FormField>
        <FormField label="Live URL" htmlFor="liveUrl" error={e?.liveUrl?.[0]}>
          <Input id="liveUrl" name="liveUrl" type="url" defaultValue={item?.liveUrl ?? ""}
            placeholder="https://..." error={!!e?.liveUrl} />
        </FormField>
      </div>

      <div className="flex gap-4">
        <CheckboxField name="featured" label="Featured project" defaultChecked={item?.featured ?? false}
          description="Highlighted at the top of your portfolio" />
        <CheckboxField name="isPublic" label="Show on portfolio" defaultChecked={item?.isPublic ?? true} />
      </div>

      <div className="flex justify-end pt-2">
        <SubmitButton label={item ? "Save Changes" : "Add Project"} />
      </div>
    </form>
  );
}

interface ProjectsSectionProps { projects: Project[] }

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const openAdd = () => { setEditing(null); setOpen(true); };
  const openEdit = (item: Project) => { setEditing(item); setOpen(true); };
  const close = () => { setOpen(false); setEditing(null); };

  return (
    <div className="space-y-3">
      <SectionHeader title="Projects" action={<AddButton onClick={openAdd} label="Add Project" />} />
      {projects.length === 0 ? (
        <EmptyState icon={<FolderOpen className="w-5 h-5" />} title="No projects added"
          description="Showcase your work — personal projects, open source, freelance."
          action={<AddButton onClick={openAdd} label="Add your first project" />} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {projects.map((item) => (
            <div key={item.id} className="p-4 rounded-xl border border-border bg-card hover:bg-accent/30 transition-colors">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate">{item.name}</p>
                  {item.featured && <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-medium shrink-0">⭐</span>}
                </div>
                <button onClick={() => openEdit(item)} className="text-xs text-muted-foreground hover:text-foreground shrink-0 transition-colors">Edit</button>
              </div>
              {item.shortDescription && <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{item.shortDescription}</p>}
              <div className="flex items-center gap-3">
                {item.githubUrl && <a href={item.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors" onClick={(e) => e.stopPropagation()}><Github className="w-3 h-3" />GitHub</a>}
                {item.liveUrl && <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors" onClick={(e) => e.stopPropagation()}><ExternalLink className="w-3 h-3" />Live</a>}
                <span className="ml-auto">
                  <DeleteButton id={item.id} label="Project" onDelete={async (id) => { const fd = new FormData(); fd.append("id", id); await deleteProjectAction({ success: false, error: "" }, fd); }} />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal open={open} onClose={close} title={editing ? "Edit Project" : "Add Project"} className="max-w-2xl">
        <ProjectForm item={editing ?? undefined} onSuccess={close} />
      </Modal>
    </div>
  );
}
