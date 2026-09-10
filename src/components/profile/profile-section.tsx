"use client";

import { useActionState, useState, useEffect } from "react";
import { FormField, Input, Textarea } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/buttons";
import { updateProfileAction } from "@/app/dashboard/profile/actions";
import type { ActionState } from "@/types";
import type { Profile } from "@prisma/client";

interface ProfileFormProps {
  profile: Profile | null;
  onSuccess?: () => void;
}

const initial: ActionState = { success: false, error: "" };

export function ProfileForm({ profile, onSuccess }: ProfileFormProps) {
  const [state, action] = useActionState(updateProfileAction, initial);

  useEffect(() => {
    if (state.success && onSuccess) onSuccess();
  }, [state.success, onSuccess]);

  const e = !state.success ? state.details : undefined;

  return (
    <form action={action} className="space-y-4">
      {!state.success && state.error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm">
          {state.message}
        </div>
      )}

      <FormField label="Professional Title" htmlFor="professionalTitle" error={e?.professionalTitle?.[0]}
        hint="e.g. 'Senior Full-Stack Engineer' or 'AI/ML Engineer'">
        <Input id="professionalTitle" name="professionalTitle"
          defaultValue={profile?.professionalTitle ?? ""}
          placeholder="Software Engineer" error={!!e?.professionalTitle} />
      </FormField>

      <FormField label="Professional Summary" htmlFor="professionalSummary" error={e?.professionalSummary?.[0]}
        hint="2–3 sentences describing your background and what you're looking for">
        <Textarea id="professionalSummary" name="professionalSummary" rows={4}
          defaultValue={profile?.professionalSummary ?? ""}
          placeholder="I'm a software engineer with 5 years of experience..."
          error={!!e?.professionalSummary} />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Location" htmlFor="location" error={e?.location?.[0]}>
          <Input id="location" name="location" defaultValue={profile?.location ?? ""}
            placeholder="San Francisco, CA" error={!!e?.location} />
        </FormField>
        <FormField label="Phone" htmlFor="phone" error={e?.phone?.[0]}>
          <Input id="phone" name="phone" type="tel" defaultValue={profile?.phone ?? ""}
            placeholder="+1 (555) 000-0000" error={!!e?.phone} />
        </FormField>
        <FormField label="Website" htmlFor="website" error={e?.website?.[0]}>
          <Input id="website" name="website" type="url" defaultValue={profile?.website ?? ""}
            placeholder="https://yoursite.com" error={!!e?.website} />
        </FormField>
        <FormField label="Public Email" htmlFor="publicEmail" error={e?.publicEmail?.[0]}
          hint="Shown on your public portfolio">
          <Input id="publicEmail" name="publicEmail" type="email"
            defaultValue={profile?.publicEmail ?? ""}
            placeholder="hello@example.com" error={!!e?.publicEmail} />
        </FormField>
      </div>

      <div className="flex justify-end pt-2">
        <SubmitButton label="Save Profile" pendingLabel="Saving..." />
      </div>
    </form>
  );
}

// ── Profile header display card ───────────────────────────────────────────────

interface ProfileHeaderProps {
  profile: Profile | null;
  userName: string | null;
  onEdit: () => void;
}

export function ProfileHeader({ profile, userName, onEdit }: ProfileHeaderProps) {
  const initials = (userName ?? "?").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-xl border border-border bg-card">
      {/* Avatar */}
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
        {initials}
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-bold text-foreground truncate">{userName ?? "Your Name"}</h2>
        {profile?.professionalTitle ? (
          <p className="text-sm text-primary font-medium">{profile.professionalTitle}</p>
        ) : (
          <p className="text-sm text-muted-foreground italic">No title set</p>
        )}
        {profile?.location && (
          <p className="text-xs text-muted-foreground mt-0.5">📍 {profile.location}</p>
        )}
        {profile?.professionalSummary && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{profile.professionalSummary}</p>
        )}
      </div>
      <button
        onClick={onEdit}
        className="shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg border border-border hover:bg-accent transition-colors"
      >
        Edit Profile
      </button>
    </div>
  );
}

// ── Profile completeness bar ──────────────────────────────────────────────────

interface ProfileScoreBarProps {
  score: number;
}

export function ProfileScoreBar({ score }: ProfileScoreBarProps) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDisplayed(score), 300);
    return () => clearTimeout(timer);
  }, [score]);

  const color = score >= 75 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-primary";

  return (
    <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-muted-foreground">Profile Completeness</span>
          <span className="text-xs font-bold text-foreground">{score}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${color}`}
            style={{ width: `${displayed}%` }}
          />
        </div>
      </div>
    </div>
  );
}
