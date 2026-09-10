"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

interface SubmitButtonProps {
  label?: string;
  pendingLabel?: string;
  variant?: "primary" | "destructive";
  className?: string;
}

export function SubmitButton({
  label = "Save",
  pendingLabel = "Saving...",
  variant = "primary",
  className,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed",
        variant === "primary" &&
          "bg-primary text-primary-foreground hover:bg-primary/90",
        variant === "destructive" &&
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        className
      )}
    >
      {pending ? (
        <>
          <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {pendingLabel}
        </>
      ) : (
        label
      )}
    </button>
  );
}

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

interface AddButtonProps {
  onClick: () => void;
  label?: string;
}

export function AddButton({ onClick, label = "Add" }: AddButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border hover:bg-accent hover:border-primary/30 text-muted-foreground hover:text-foreground transition-all"
    >
      <span className="text-base leading-none">+</span>
      {label}
    </button>
  );
}

interface DeleteButtonProps {
  id: string;
  label?: string;
  onDelete: (id: string) => Promise<void>;
}

export function DeleteButton({ id, label = "Remove", onDelete }: DeleteButtonProps) {
  return (
    <button
      type="button"
      onClick={async () => {
        if (!confirm(`Remove this ${label.toLowerCase()}?`)) return;
        await onDelete(id);
      }}
      className="text-xs text-muted-foreground hover:text-destructive transition-colors"
    >
      {label}
    </button>
  );
}
