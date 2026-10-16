"use client";

import { useTransition } from "react";

import { removeRankingEntry } from "../actions/admin-ranking.actions";

type RemoveRankingEntryButtonProps = {
  rankingId: string;
  entryId: string;
  participantName: string;
};

export function RemoveRankingEntryButton({
  rankingId,
  entryId,
  participantName,
}: RemoveRankingEntryButtonProps) {
  const [isPending, startTransition] =
    useTransition();

  function handleRemove() {
    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar la posición de "${participantName}"? Esta acción no eliminará al participante de la temporada.`,
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      await removeRankingEntry(
        rankingId,
        entryId,
      );
    });
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleRemove}
      className="inline-flex cursor-pointer items-center justify-center rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-bold text-red-600 transition hover:border-red-300 hover:bg-red-100 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? "Eliminando..." : "Eliminar"}
    </button>
  );
}