"use client";

import { useTransition } from "react";

import { archiveFreestyler } from "../actions/admin-freestyler.actions";

type ArchiveFreestylerButtonProps = {
  freestylerId: string;
  freestylerName: string;
};

export function ArchiveFreestylerButton({
  freestylerId,
  freestylerName,
}: ArchiveFreestylerButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleArchive() {
    const confirmed = window.confirm(
      `¿Seguro que quieres archivar "${freestylerName}"? El perfil dejará de mostrarse públicamente.`,
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      await archiveFreestyler(freestylerId);
    });
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleArchive}
      className="inline-flex cursor-pointer items-center justify-center rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-bold text-red-600 transition hover:border-red-300 hover:bg-red-100 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? "Archivando..." : "Archivar"}
    </button>
  );
}