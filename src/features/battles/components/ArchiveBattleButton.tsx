"use client";

import { useTransition } from "react";

import { archiveBattle } from "../actions/admin-battle.actions";

type ArchiveBattleButtonProps = {
  battleId: string;
  battleTitle: string;
};

export function ArchiveBattleButton({
  battleId,
  battleTitle,
}: ArchiveBattleButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleArchive() {
    const confirmed = window.confirm(
      `¿Seguro que quieres archivar "${battleTitle}"? La batalla dejará de mostrarse públicamente.`,
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      await archiveBattle(battleId);
    });
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleArchive}
      className="cursor-pointer rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-bold text-red-600 transition hover:border-red-300 hover:bg-red-100 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? "Archivando..." : "Archivar"}
    </button>
  );
}
