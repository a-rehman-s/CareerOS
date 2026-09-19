"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { ResumeForm } from "@/components/resume/resume-form";
import { AddButton } from "@/components/ui/buttons";

interface ResumeListClientProps {
  buttonLabel?: string;
}

export function ResumeListClient({ buttonLabel = "New Resume" }: ResumeListClientProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <AddButton onClick={() => setOpen(true)} label={buttonLabel} />
      <Modal open={open} onClose={() => setOpen(false)} title="Create Resume">
        <ResumeForm
          onSuccess={(id) => {
            setOpen(false);
            if (id) router.push(`/dashboard/resumes/${id}`);
          }}
        />
      </Modal>
    </>
  );
}
