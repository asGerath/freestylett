"use client";

import { useTransition } from "react";

import { removeBattleParticipant } from "../actions/admin-battle-participant.actions";

type RemoveBattleParticipantButtonProps = {
  battleId: string;
  participantId: string;
  participantName: string;
};

export function RemoveBattleParticipantButton({
  battleId,
  participantId,
  participantName,
}: RemoveBattleParticipantButtonProps) {
  const [isPending, startTransition] =
    useTransition();

  function handleRemove() {
    const confirmed = window.confirm(
      `¿Seguro que quieres retirar a "${participantName}" de esta batalla?`,
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      await removeBattleParticipant(
        battleId,
        participantId,
      );
    });
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleRemove}
      className="cursor-pointer rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-bold text-red-600 transition hover:border-red-300 hover:bg-red-100 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? "Retirando..." : "Retirar"}
    </button>
  );
}