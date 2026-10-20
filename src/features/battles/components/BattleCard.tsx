import Link from "next/link";

import type { BattleItem } from "../types/battle.types";

type BattleCardProps = {
  battle: BattleItem;
};

const statusLabels: Record<BattleItem["status"], string> = {
  scheduled: "Programada",
  live: "En vivo",
  finished: "Finalizada",
  cancelled: "Cancelada",
  postponed: "Pospuesta",
};

const stageLabels: Record<BattleItem["stage"], string> = {
  group_stage: "Fase de grupos",
  play_in: "Play-in",
  round_of_32: "Treintaidosavos",
  round_of_16: "Octavos de final",
  quarterfinal: "Cuartos de final",
  semifinal: "Semifinal",
  third_place: "Tercer lugar",
  final: "Final",
  regular_round: "Jornada regular",
  exhibition: "Exhibición",
  other: "Otra fase",
};

function formatEventDate(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Mexico_City",
  }).format(new Date(value));
}

export function BattleCard({ battle }: BattleCardProps) {
  const sides = Array.from(
    new Set(
      battle.participants.map(
        (participant) => participant.sideNumber,
      ),
    ),
  ).sort((first, second) => first - second);

  return (
    <article className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--color-primary)]">
            {stageLabels[battle.stage]}
          </p>

          <p className="mt-1 text-sm text-[var(--color-muted)]">
            {battle.event.title}
          </p>
        </div>

        <span className="rounded-full bg-white px-4 py-2 text-sm font-bold">
          {statusLabels[battle.status]}
        </span>
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-black">
          <Link
            href={`/batallas/${battle.slug}`}
            className="transition-colors hover:text-[var(--color-primary)]"
          >
            {battle.title}
          </Link>
        </h2>

        <p className="mt-2 text-sm text-[var(--color-muted)]">
          {formatEventDate(battle.event.startsAt)}
          {" · "}
          {battle.event.city}, {battle.event.country}
        </p>

        {battle.league && (
          <p className="mt-2 text-sm font-bold">
            {battle.league.name}
            {battle.season ? ` — ${battle.season.name}` : ""}
          </p>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {sides.map((sideNumber) => {
            const participants = battle.participants.filter(
              (participant) =>
                participant.sideNumber === sideNumber,
            );

            const isWinner =
              battle.winnerSide === sideNumber;

            return (
              <div
                key={sideNumber}
                className={`rounded-2xl border p-5 ${
                  isWinner
                    ? "border-[var(--color-primary)] bg-cyan-50"
                    : "border-[var(--color-border)]"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                    Lado {sideNumber}
                  </p>

                  {isWinner && (
                    <span className="rounded-full bg-[var(--color-primary)] px-3 py-1 text-xs font-bold text-white">
                      Ganador
                    </span>
                  )}
                </div>

                <div className="mt-3 space-y-3">
                  {participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between gap-4"
                    >
                      <Link
                        href={`/freestylers/${participant.freestyler.slug}`}
                        className="font-black transition-colors hover:text-[var(--color-primary)]"
                      >
                        {participant.freestyler.stageName}
                      </Link>

                      {participant.score !== null && (
                        <span className="text-lg font-black">
                          {participant.score}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <Link
            href={`/batallas/${battle.slug}`}
            className="font-bold text-[var(--color-primary)] hover:underline"
          >
            Ver batalla →
          </Link>
        </div>
      </div>
    </article>
  );
}