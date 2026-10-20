"use client";

import { useTransition } from "react";

import { archiveCreator } from "../actions/admin-creator.actions";

type ArchiveCreatorButtonProps = {
  creatorId: string;
  creatorName: string;
};

export function ArchiveCreatorButton({
  creatorId,
  creatorName,
}: ArchiveCreatorButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleArchive() {
    if (
      !window.confirm(
        `¿Seguro que quieres archivar "${creatorName}"? El perfil dejará de mostrarse públicamente.`,
      )
    ) {
      return;
    }

    startTransition(async () => {
      await archiveCreator(creatorId);
    });
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleArchive}
      className="inline-flex cursor-pointer items-center justify-center rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? "Archivando..." : "Archivar"}
    </button>
  );
}
