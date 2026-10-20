import Link from "next/link";

import { getAdminBattles } from "@/features/battles/services/admin-battle.service";
import type {
  BattleEditorialStatus,
  BattleStage,
  BattleStatus,
} from "@/features/battles/types/battle.types";

type AdminBattlesPageProps = {
  searchParams: Promise<{
    created?: string;
    error?: string;
  }>;
};

const editorialStatusLabels: Record<
  BattleEditorialStatus,
  string
> = {
  draft: "Borrador",
  published: "Publicado",
  archived: "Archivado",
};

const editorialStatusStyles: Record<
  BattleEditorialStatus,
  string
> = {
  draft: "bg-amber-100 text-amber-800",
  published: "bg-emerald-100 text-emerald-800",
  archived: "bg-slate-200 text-slate-700",
};

const battleStatusLabels: Record<BattleStatus, string> = {
  scheduled: "Programada",
  live: "En vivo",
  finished: "Finalizada",
  cancelled: "Cancelada",
  postponed: "Pospuesta",
};

const battleStageLabels: Record<BattleStage, string> = {
  group_stage: "Fase de grupos",
  play_in: "Play-in",
  round_of_32: "Dieciseisavos",
  round_of_16: "Octavos",
  quarterfinal: "Cuartos de final",
  semifinal: "Semifinal",
  third_place: "Tercer lugar",
  final: "Final",
  regular_round: "Jornada regular",
  exhibition: "Exhibición",
  other: "Otra",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function AdminBattlesPage({
  searchParams,
}: AdminBattlesPageProps) {
  const [battles, params] = await Promise.all([
    getAdminBattles(),
    searchParams,
  ]);


  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12">
      <div>
        <Link
          href="/admin"
          className="text-sm font-bold text-[var(--color-primary)]"
        >
          ← Volver al panel
        </Link>

        <p className="mt-6 text-sm font-bold uppercase tracking-[0.15em] text-[var(--color-primary)]">
          Panel editorial
        </p>

        <h1 className="mt-2 text-3xl font-black">
          Batallas
        </h1>

        <p className="mt-2 text-[var(--color-muted)]">
          Consulta y administra las batallas registradas.
        </p>

        <Link
          href="/admin/batallas/nueva"
          className="mt-5 inline-flex w-fit items-center justify-center rounded-full bg-[var(--color-primary)] px-5 py-3 font-bold text-white transition hover:opacity-90"
        >
          Crear batalla
        </Link>
      </div>

      {params.created && (
        <div
          role="status"
          className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800"
        >
          La batalla fue creada correctamente.
        </div>
      )}

      {params.error && (
        <div
          role="alert"
          className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700"
        >
          {params.error}
        </div>
      )}

      {battles.length === 0 ? (
        <section className="mt-8 rounded-3xl border border-[var(--color-border)] bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold">
            No hay batallas registradas
          </h2>

          <p className="mt-2 text-[var(--color-muted)]">
            Las batallas creadas aparecerán en este espacio.
          </p>
        </section>
      ) : (
        <section className="mt-8 overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] border-collapse text-left">
              <thead className="bg-[var(--color-surface-soft)]">
                <tr>
                  <th className="px-5 py-4 text-sm font-bold">
                    Batalla
                  </th>

                  <th className="px-5 py-4 text-sm font-bold">
                    Evento
                  </th>

                  <th className="px-5 py-4 text-sm font-bold">
                    Participantes
                  </th>

                  <th className="px-5 py-4 text-sm font-bold">
                    Fase
                  </th>

                  <th className="px-5 py-4 text-sm font-bold">
                    Estado
                  </th>

                  <th className="px-5 py-4 text-sm font-bold">
                    Publicación
                  </th>

                  <th className="px-5 py-4 text-sm font-bold">
                    Actualización
                  </th>

                  <th className="px-5 py-4 text-right text-sm font-bold">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {battles.map((battle) => (
                  <tr
                    key={battle.id}
                    className="border-t border-[var(--color-border)]"
                  >
                    <td className="px-5 py-4">
                      <p className="font-bold">
                        {battle.title}
                      </p>

                      <p className="mt-1 text-sm text-[var(--color-muted)]">
                        Orden {battle.battleOrder} · /{battle.slug}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {battle.eventTitle}
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {battle.participantNames.length > 0
                        ? battle.participantNames.join(" vs ")
                        : "Sin participantes"}
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {battleStageLabels[battle.stage]}
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {battleStatusLabels[battle.status]}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${editorialStatusStyles[
                          battle.editorialStatus
                        ]
                          }`}
                      >
                        {
                          editorialStatusLabels[
                          battle.editorialStatus
                          ]
                        }
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm">
                      <time dateTime={battle.updatedAt}>
                        {formatDate(battle.updatedAt)}
                      </time>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-3">
                        {battle.editorialStatus ===
                          "published" && (
                            <Link
                              href={`/batallas/${battle.slug}`}
                              className="text-sm font-bold text-[var(--color-muted)] hover:text-[var(--color-text)]"
                            >
                              Ver
                            </Link>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}