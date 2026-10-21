"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  canAccessEditorialPanel,
  getCurrentUser,
} from "@/features/auth/services/auth.service";
import { createClient } from "@/lib/supabase/server";

import type { RankingEditorialStatus } from "../types/ranking.types";

const editorialStatuses: RankingEditorialStatus[] = [
  "draft",
  "published",
  "archived",
];

function getRequiredString(
  formData: FormData,
  field: string,
) {
  const value = formData.get(field);

  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  return value.trim();
}

function getRequiredNumber(
  formData: FormData,
  field: string,
) {
  const value = formData.get(field);

  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    return null;
  }

  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    return null;
  }

  return parsedValue;
}

function getNonnegativeInteger(
  formData: FormData,
  field: string,
) {
  const value = getRequiredNumber(formData, field);

  if (
    value === null ||
    !Number.isInteger(value) ||
    value < 0
  ) {
    return null;
  }

  return value;
}

function getNonnegativeNumber(
  formData: FormData,
  field: string,
) {
  const value = getRequiredNumber(formData, field);

  if (value === null || value < 0) {
    return null;
  }

  return value;
}

function getRankingEntryFormValues(
  formData: FormData,
  errorPath: string,
) {
  const participantId = getRequiredString(
    formData,
    "participantId",
  );

  const rankingGroup =
    getRequiredString(formData, "rankingGroup") ??
    "general";

  const position = getNonnegativeInteger(
    formData,
    "position",
  );

  const matchesPlayed = getNonnegativeInteger(
    formData,
    "matchesPlayed",
  );

  const battleWins = getNonnegativeInteger(
    formData,
    "battleWins",
  );

  const battleWinsAfterReplica =
    getNonnegativeInteger(
      formData,
      "battleWinsAfterReplica",
    );

  const battleLossesAfterReplica =
    getNonnegativeInteger(
      formData,
      "battleLossesAfterReplica",
    );

  const battleLosses = getNonnegativeInteger(
    formData,
    "battleLosses",
  );

  const points = getNonnegativeNumber(
    formData,
    "points",
  );

  const scoreTotal = getNonnegativeNumber(
    formData,
    "scoreTotal",
  );

  const penaltyPoints = getNonnegativeNumber(
    formData,
    "penaltyPoints",
  );

  const mvpCount = getNonnegativeInteger(
    formData,
    "mvpCount",
  );

  if (
    !participantId ||
    position === null ||
    position < 1 ||
    matchesPlayed === null ||
    battleWins === null ||
    battleWinsAfterReplica === null ||
    battleLossesAfterReplica === null ||
    battleLosses === null ||
    points === null ||
    scoreTotal === null ||
    penaltyPoints === null ||
    mvpCount === null
  ) {
    redirectWithError(
      errorPath,
      "Completa correctamente todos los campos.",
    );
  }

  if (
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(
      rankingGroup,
    )
  ) {
    redirectWithError(
      errorPath,
      "El grupo solo puede contener letras minúsculas, números y guiones.",
    );
  }

  return {
    participantId,
    rankingGroup,
    position,
    matchesPlayed,
    battleWins,
    battleWinsAfterReplica,
    battleLossesAfterReplica,
    battleLosses,
    points,
    scoreTotal,
    penaltyPoints,
    mvpCount,
  };
}

function redirectWithError(
  path: string,
  message: string,
): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

async function requireEditorialUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!canAccessEditorialPanel(user)) {
    redirect("/dashboard");
  }

  return user;
}

function getRankingFormValues(
  formData: FormData,
  errorPath: string,
) {
  const seasonId = getRequiredString(formData, "seasonId");
  const name = getRequiredString(formData, "name");
  const capturedAtValue = getRequiredString(
    formData,
    "capturedAt",
  );
  const sourceUrl = getRequiredString(formData, "sourceUrl");
  const editorialStatus = getRequiredString(
    formData,
    "editorialStatus",
  );
  const isCurrent = formData.get("isCurrent") === "on";

  if (
    !seasonId ||
    !name ||
    !capturedAtValue ||
    !sourceUrl ||
    !editorialStatus
  ) {
    redirectWithError(
      errorPath,
      "Completa todos los campos obligatorios.",
    );
  }

  if (
    !editorialStatuses.includes(
      editorialStatus as RankingEditorialStatus,
    )
  ) {
    redirectWithError(
      errorPath,
      "El estado editorial no es válido.",
    );
  }

  const capturedAt = new Date(capturedAtValue);

  if (Number.isNaN(capturedAt.getTime())) {
    redirectWithError(
      errorPath,
      "La fecha de captura no es válida.",
    );
  }

  let parsedSourceUrl: URL;

  try {
    parsedSourceUrl = new URL(sourceUrl);
  } catch {
    redirectWithError(
      errorPath,
      "La URL de la fuente no es válida.",
    );
  }

  if (
    parsedSourceUrl.protocol !== "http:" &&
    parsedSourceUrl.protocol !== "https:"
  ) {
    redirectWithError(
      errorPath,
      "La fuente debe utilizar http o https.",
    );
  }

  if (isCurrent && editorialStatus !== "published") {
    redirectWithError(
      errorPath,
      "Una clasificación vigente debe estar publicada.",
    );
  }

  return {
    seasonId,
    name,
    capturedAt: capturedAt.toISOString(),
    sourceUrl,
    isCurrent,
    editorialStatus:
      editorialStatus as RankingEditorialStatus,
  };
}

function revalidateRankingPaths(leagueSlug?: string) {
  revalidatePath("/");
  revalidatePath("/rankings");
  revalidatePath("/admin");
  revalidatePath("/admin/rankings");

  if (leagueSlug) {
    revalidatePath(`/ligas/${leagueSlug}`);
  }
}

export async function createRanking(formData: FormData) {
  const user = await requireEditorialUser();
  const errorPath = "/admin/rankings/nuevo";
  const values = getRankingFormValues(
    formData,
    errorPath,
  );
  const supabase = await createClient();

  const { data: season, error: seasonError } =
    await supabase
      .from("league_seasons")
      .select(`
        id,
        league:leagues!league_seasons_league_id_fkey (
          slug
        )
      `)
      .eq("id", values.seasonId)
      .maybeSingle();

  if (seasonError) {
    redirectWithError(
      errorPath,
      `No fue posible consultar la temporada: ${seasonError.message}`,
    );
  }

  if (!season) {
    redirectWithError(
      errorPath,
      "La temporada seleccionada no existe.",
    );
  }

  let previousCurrentId: string | null = null;

  if (values.isCurrent) {
    const { data: previousCurrent, error: currentError } =
      await supabase
        .from("ranking_snapshots")
        .select("id")
        .eq("season_id", values.seasonId)
        .eq("is_current", true)
        .maybeSingle();

    if (currentError) {
      redirectWithError(
        errorPath,
        `No fue posible consultar la clasificación vigente: ${currentError.message}`,
      );
    }

    previousCurrentId = previousCurrent?.id ?? null;

    if (previousCurrentId) {
      const { error: resetError } = await supabase
        .from("ranking_snapshots")
        .update({
          is_current: false,
          updated_by: user.id,
        })
        .eq("id", previousCurrentId);

      if (resetError) {
        redirectWithError(
          errorPath,
          `No fue posible actualizar la clasificación anterior: ${resetError.message}`,
        );
      }
    }
  }

  const { error } = await supabase
    .from("ranking_snapshots")
    .insert({
      season_id: values.seasonId,
      name: values.name,
      captured_at: values.capturedAt,
      source_url: values.sourceUrl,
      is_current: values.isCurrent,
      editorial_status: values.editorialStatus,
      published_at:
        values.editorialStatus === "published"
          ? new Date().toISOString()
          : null,
      created_by: user.id,
      updated_by: user.id,
    });

  if (error) {
    if (previousCurrentId) {
      await supabase
        .from("ranking_snapshots")
        .update({
          is_current: true,
          updated_by: user.id,
        })
        .eq("id", previousCurrentId);
    }

    redirectWithError(
      errorPath,
      `No fue posible crear la clasificación: ${error.message}`,
    );
  }

  const league = season.league as {
    slug: string;
  } | null;

  revalidateRankingPaths(league?.slug);

  

  redirect("/admin/rankings?created=1");


  
}

export async function updateRanking(
  rankingId: string,
  formData: FormData,
) {
  const user = await requireEditorialUser();
  const errorPath = `/admin/rankings/${rankingId}/editar`;
  const values = getRankingFormValues(
    formData,
    errorPath,
  );
  const supabase = await createClient();

  const {
    data: currentRanking,
    error: currentRankingError,
  } = await supabase
    .from("ranking_snapshots")
    .select(`
      id,
      season_id,
      published_at,
      season:league_seasons!ranking_snapshots_season_id_fkey (
        league:leagues!league_seasons_league_id_fkey (
          slug
        )
      )
    `)
    .eq("id", rankingId)
    .maybeSingle();

  if (currentRankingError) {
    redirectWithError(
      errorPath,
      `No fue posible consultar la clasificación: ${currentRankingError.message}`,
    );
  }

  if (!currentRanking) {
    redirectWithError(
      errorPath,
      "La clasificación ya no existe.",
    );
  }

  const { data: targetSeason, error: seasonError } =
    await supabase
      .from("league_seasons")
      .select(`
        id,
        league:leagues!league_seasons_league_id_fkey (
          slug
        )
      `)
      .eq("id", values.seasonId)
      .maybeSingle();

  if (seasonError) {
    redirectWithError(
      errorPath,
      `No fue posible consultar la temporada: ${seasonError.message}`,
    );
  }

  if (!targetSeason) {
    redirectWithError(
      errorPath,
      "La temporada seleccionada no existe.",
    );
  }

  let previousTargetCurrentId: string | null = null;

  if (values.isCurrent) {
    const {
      data: previousTargetCurrent,
      error: targetCurrentError,
    } = await supabase
      .from("ranking_snapshots")
      .select("id")
      .eq("season_id", values.seasonId)
      .eq("is_current", true)
      .neq("id", rankingId)
      .maybeSingle();

    if (targetCurrentError) {
      redirectWithError(
        errorPath,
        `No fue posible consultar la clasificación vigente: ${targetCurrentError.message}`,
      );
    }

    previousTargetCurrentId =
      previousTargetCurrent?.id ?? null;

    if (previousTargetCurrentId) {
      const { error: resetError } = await supabase
        .from("ranking_snapshots")
        .update({
          is_current: false,
          updated_by: user.id,
        })
        .eq("id", previousTargetCurrentId);

      if (resetError) {
        redirectWithError(
          errorPath,
          `No fue posible actualizar la clasificación vigente anterior: ${resetError.message}`,
        );
      }
    }
  }

  const { error } = await supabase
    .from("ranking_snapshots")
    .update({
      season_id: values.seasonId,
      name: values.name,
      captured_at: values.capturedAt,
      source_url: values.sourceUrl,
      is_current: values.isCurrent,
      editorial_status: values.editorialStatus,
      published_at:
        values.editorialStatus === "published"
          ? currentRanking.published_at ??
            new Date().toISOString()
          : currentRanking.published_at,
      updated_by: user.id,
    })
    .eq("id", rankingId);

  if (error) {
    if (previousTargetCurrentId) {
      await supabase
        .from("ranking_snapshots")
        .update({
          is_current: true,
          updated_by: user.id,
        })
        .eq("id", previousTargetCurrentId);
    }

    redirectWithError(
      errorPath,
      `No fue posible actualizar la clasificación: ${error.message}`,
    );
  }

  const previousSeason = currentRanking.season as {
    league: {
      slug: string;
    } | null;
  } | null;

  const nextLeague = targetSeason.league as {
    slug: string;
  } | null;

  revalidateRankingPaths(
    previousSeason?.league?.slug,
  );

  if (
    nextLeague?.slug &&
    nextLeague.slug !== previousSeason?.league?.slug
  ) {
    revalidateRankingPaths(nextLeague.slug);
  }

  redirect("/admin/rankings?updated=1");
}

export async function archiveRanking(rankingId: string) {
  const user = await requireEditorialUser();
  const errorPath = "/admin/rankings";
  const supabase = await createClient();

  const { data: ranking, error: queryError } =
    await supabase
      .from("ranking_snapshots")
      .select(`
        id,
        season:league_seasons!ranking_snapshots_season_id_fkey (
          league:leagues!league_seasons_league_id_fkey (
            slug
          )
        )
      `)
      .eq("id", rankingId)
      .maybeSingle();

  if (queryError) {
    redirectWithError(
      errorPath,
      `No fue posible consultar la clasificación: ${queryError.message}`,
    );
  }

  if (!ranking) {
    redirectWithError(
      errorPath,
      "La clasificación no existe.",
    );
  }

  const { error } = await supabase
    .from("ranking_snapshots")
    .update({
      editorial_status: "archived",
      is_current: false,
      updated_by: user.id,
    })
    .eq("id", rankingId);

  if (error) {
    redirectWithError(
      errorPath,
      `No fue posible archivar la clasificación: ${error.message}`,
    );
  }

  const season = ranking.season as {
    league: {
      slug: string;
    } | null;
  } | null;

  revalidateRankingPaths(season?.league?.slug);

  redirect("/admin/rankings?archived=1");
}

export async function createRankingEntry(
  rankingId: string,
  formData: FormData,
) {
  const user = await requireEditorialUser();
  const errorPath = `/admin/rankings/${rankingId}/posiciones/nueva`;
  const supabase = await createClient();

  const participantId = getRequiredString(
    formData,
    "participantId",
  );
  const rankingGroup =
    getRequiredString(formData, "rankingGroup") ??
    "general";

  const position = getNonnegativeInteger(
    formData,
    "position",
  );
  const matchesPlayed = getNonnegativeInteger(
    formData,
    "matchesPlayed",
  );
  const battleWins = getNonnegativeInteger(
    formData,
    "battleWins",
  );
  const battleWinsAfterReplica =
    getNonnegativeInteger(
      formData,
      "battleWinsAfterReplica",
    );
  const battleLossesAfterReplica =
    getNonnegativeInteger(
      formData,
      "battleLossesAfterReplica",
    );
  const battleLosses = getNonnegativeInteger(
    formData,
    "battleLosses",
  );
  const points = getNonnegativeNumber(
    formData,
    "points",
  );
  const scoreTotal = getNonnegativeNumber(
    formData,
    "scoreTotal",
  );
  const penaltyPoints = getNonnegativeNumber(
    formData,
    "penaltyPoints",
  );

  const mvpCount = getNonnegativeInteger(
    formData,
    "mvpCount",
  );

  if (
    !participantId ||
    position === null ||
    position < 1 ||
    matchesPlayed === null ||
    battleWins === null ||
    battleWinsAfterReplica === null ||
    battleLossesAfterReplica === null ||
    battleLosses === null ||
    points === null ||
    scoreTotal === null ||
    penaltyPoints === null ||
    mvpCount === null
  ) {
    redirectWithError(
      errorPath,
      "Completa correctamente todos los campos numéricos.",
    );
  }

  if (
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(
      rankingGroup,
    )
  ) {
    redirectWithError(
      errorPath,
      "El grupo solo puede contener letras minúsculas, números y guiones.",
    );
  }

  const { data: ranking, error: rankingError } =
    await supabase
      .from("ranking_snapshots")
      .select(`
        season_id,
        season:league_seasons!ranking_snapshots_season_id_fkey (
          league:leagues!league_seasons_league_id_fkey (
            slug
          )
        )
      `)
      .eq("id", rankingId)
      .maybeSingle();

  if (rankingError) {
    redirectWithError(
      errorPath,
      `No fue posible consultar la clasificación: ${rankingError.message}`,
    );
  }

  if (!ranking) {
    redirectWithError(
      errorPath,
      "La clasificación no existe.",
    );
  }

  const { data: participant, error: participantError } =
    await supabase
      .from("league_season_participants")
      .select("id, season_id, is_active")
      .eq("id", participantId)
      .maybeSingle();

  if (participantError) {
    redirectWithError(
      errorPath,
      `No fue posible consultar el participante: ${participantError.message}`,
    );
  }

  if (
    !participant ||
    participant.season_id !== ranking.season_id ||
    !participant.is_active
  ) {
    redirectWithError(
      errorPath,
      "El participante no pertenece a esta temporada o está inactivo.",
    );
  }

  const { error } = await supabase
    .from("ranking_entries")
    .insert({
      snapshot_id: rankingId,
      participant_id: participantId,
      ranking_group: rankingGroup,
      position,
      matches_played: matchesPlayed,
      battle_wins: battleWins,
      battle_wins_after_replica:
        battleWinsAfterReplica,
      battle_losses_after_replica:
        battleLossesAfterReplica,
      battle_losses: battleLosses,
      points,
      score_total: scoreTotal,
      penalty_points: penaltyPoints,
      mvp_count: mvpCount,
      created_by: user.id,
      updated_by: user.id,
    });

  if (error) {
    if (error.code === "23505") {
      redirectWithError(
        errorPath,
        "El participante o la posición ya están registrados en esta clasificación.",
      );
    }

    redirectWithError(
      errorPath,
      `No fue posible agregar la posición: ${error.message}`,
    );
  }

  const season = ranking.season as {
    league: {
      slug: string;
    } | null;
  } | null;

  revalidatePath(
    `/admin/rankings/${rankingId}/posiciones`,
  );
  revalidateRankingPaths(season?.league?.slug);

  redirect(
    `/admin/rankings/${rankingId}/posiciones?created=1`,
  );
}

export async function updateRankingEntry(
  rankingId: string,
  entryId: string,
  formData: FormData,
) {
  const user = await requireEditorialUser();
  const errorPath =
    `/admin/rankings/${rankingId}/posiciones/${entryId}/editar`;

  const values = getRankingEntryFormValues(
    formData,
    errorPath,
  );

  const supabase = await createClient();

  const { data: ranking, error: rankingError } =
    await supabase
      .from("ranking_snapshots")
      .select(`
        season_id,
        season:league_seasons!ranking_snapshots_season_id_fkey (
          league:leagues!league_seasons_league_id_fkey (
            slug
          )
        )
      `)
      .eq("id", rankingId)
      .maybeSingle();

  if (rankingError) {
    redirectWithError(
      errorPath,
      `No fue posible consultar la clasificación: ${rankingError.message}`,
    );
  }

  if (!ranking) {
    redirectWithError(
      errorPath,
      "La clasificación no existe.",
    );
  }

  const { data: currentEntry, error: entryError } =
    await supabase
      .from("ranking_entries")
      .select("id, snapshot_id")
      .eq("id", entryId)
      .eq("snapshot_id", rankingId)
      .maybeSingle();

  if (entryError) {
    redirectWithError(
      errorPath,
      `No fue posible consultar la posición: ${entryError.message}`,
    );
  }

  if (!currentEntry) {
    redirectWithError(
      errorPath,
      "La posición no existe en esta clasificación.",
    );
  }

  const {
    data: participant,
    error: participantError,
  } = await supabase
    .from("league_season_participants")
    .select("id, season_id, is_active")
    .eq("id", values.participantId)
    .maybeSingle();

  if (participantError) {
    redirectWithError(
      errorPath,
      `No fue posible consultar el participante: ${participantError.message}`,
    );
  }

  if (
    !participant ||
    participant.season_id !== ranking.season_id ||
    !participant.is_active
  ) {
    redirectWithError(
      errorPath,
      "El participante no pertenece a esta temporada o está inactivo.",
    );
  }

  const { error } = await supabase
    .from("ranking_entries")
    .update({
      participant_id: values.participantId,
      ranking_group: values.rankingGroup,
      position: values.position,
      matches_played: values.matchesPlayed,
      battle_wins: values.battleWins,
      battle_wins_after_replica:
        values.battleWinsAfterReplica,
      battle_losses_after_replica:
        values.battleLossesAfterReplica,
      battle_losses: values.battleLosses,
      points: values.points,
      score_total: values.scoreTotal,
      penalty_points: values.penaltyPoints,
      mvp_count: values.mvpCount,
      updated_by: user.id,
    })
    .eq("id", entryId)
    .eq("snapshot_id", rankingId);

  if (error) {
    if (error.code === "23505") {
      redirectWithError(
        errorPath,
        "El participante o la posición ya están registrados en esta clasificación.",
      );
    }

    redirectWithError(
      errorPath,
      `No fue posible actualizar la posición: ${error.message}`,
    );
  }

  const season = ranking.season as {
    league: {
      slug: string;
    } | null;
  } | null;

  revalidatePath(
    `/admin/rankings/${rankingId}/posiciones`,
  );

  revalidatePath(errorPath);
  revalidateRankingPaths(season?.league?.slug);

  redirect(
    `/admin/rankings/${rankingId}/posiciones?updated=1`,
  );
}

export async function removeRankingEntry(
  rankingId: string,
  entryId: string,
) {
  await requireEditorialUser();

  const errorPath =
    `/admin/rankings/${rankingId}/posiciones`;

  const supabase = await createClient();

  const { data: ranking, error: rankingError } =
    await supabase
      .from("ranking_snapshots")
      .select(`
        id,
        season:league_seasons!ranking_snapshots_season_id_fkey (
          league:leagues!league_seasons_league_id_fkey (
            slug
          )
        )
      `)
      .eq("id", rankingId)
      .maybeSingle();

  if (rankingError) {
    redirectWithError(
      errorPath,
      `No fue posible consultar la clasificación: ${rankingError.message}`,
    );
  }

  if (!ranking) {
    redirectWithError(
      errorPath,
      "La clasificación no existe.",
    );
  }

  const { data: entry, error: entryError } =
    await supabase
      .from("ranking_entries")
      .select("id")
      .eq("id", entryId)
      .eq("snapshot_id", rankingId)
      .maybeSingle();

  if (entryError) {
    redirectWithError(
      errorPath,
      `No fue posible consultar la posición: ${entryError.message}`,
    );
  }

  if (!entry) {
    redirectWithError(
      errorPath,
      "La posición no existe en esta clasificación.",
    );
  }

  const { error } = await supabase
    .from("ranking_entries")
    .delete()
    .eq("id", entryId)
    .eq("snapshot_id", rankingId);

  if (error) {
    redirectWithError(
      errorPath,
      `No fue posible eliminar la posición: ${error.message}`,
    );
  }

  const season = ranking.season as {
    league: {
      slug: string;
    } | null;
  } | null;

  revalidatePath(errorPath);
  revalidateRankingPaths(season?.league?.slug);

  redirect(`${errorPath}?removed=1`);
}


export async function addSeasonParticipant(
  rankingId: string,
  formData: FormData,
) {
  const user = await requireEditorialUser();
  const errorPath = `/admin/rankings/${rankingId}/participantes`;
  const supabase = await createClient();

  const freestylerId = getRequiredString(
    formData,
    "freestylerId",
  );
  const seedValue = formData.get("seed");

  let seed: number | null = null;

  if (
    typeof seedValue === "string" &&
    seedValue.trim()
  ) {
    const parsedSeed = Number(seedValue);

    if (
      !Number.isInteger(parsedSeed) ||
      parsedSeed < 1
    ) {
      redirectWithError(
        errorPath,
        "El seed debe ser un número entero mayor que cero.",
      );
    }

    seed = parsedSeed;
  }

  if (!freestylerId) {
    redirectWithError(
      errorPath,
      "Selecciona un freestyler.",
    );
  }

  const { data: ranking, error: rankingError } =
    await supabase
      .from("ranking_snapshots")
      .select(`
        season_id,
        season:league_seasons!ranking_snapshots_season_id_fkey (
          league:leagues!league_seasons_league_id_fkey (
            slug
          )
        )
      `)
      .eq("id", rankingId)
      .maybeSingle();

  if (rankingError) {
    redirectWithError(
      errorPath,
      `No fue posible consultar la clasificación: ${rankingError.message}`,
    );
  }

  if (!ranking) {
    redirectWithError(
      errorPath,
      "La clasificación no existe.",
    );
  }

  const { data: freestyler, error: freestylerError } =
    await supabase
      .from("freestylers")
      .select("id, editorial_status")
      .eq("id", freestylerId)
      .maybeSingle();

  if (freestylerError) {
    redirectWithError(
      errorPath,
      `No fue posible consultar el freestyler: ${freestylerError.message}`,
    );
  }

  if (
    !freestyler ||
    freestyler.editorial_status === "archived"
  ) {
    redirectWithError(
      errorPath,
      "El freestyler no existe o está archivado.",
    );
  }

  const { error } = await supabase
    .from("league_season_participants")
    .insert({
      season_id: ranking.season_id,
      freestyler_id: freestylerId,
      seed,
      is_active: true,
      created_by: user.id,
      updated_by: user.id,
    });

  if (error) {
    if (error.code === "23505") {
      redirectWithError(
        errorPath,
        "El freestyler ya está inscrito en esta temporada.",
      );
    }

    redirectWithError(
      errorPath,
      `No fue posible inscribir al participante: ${error.message}`,
    );
  }

  const season = ranking.season as {
    league: {
      slug: string;
    } | null;
  } | null;

  revalidatePath(errorPath);
  revalidatePath(
    `/admin/rankings/${rankingId}/posiciones`,
  );
  revalidatePath(
    `/admin/rankings/${rankingId}/posiciones/nueva`,
  );
  revalidateRankingPaths(season?.league?.slug);

  redirect(`${errorPath}?added=1`);
}

export async function setSeasonParticipantActive(
  rankingId: string,
  participantId: string,
  isActive: boolean,
) {
  const user = await requireEditorialUser();
  const errorPath = `/admin/rankings/${rankingId}/participantes`;
  const supabase = await createClient();

  const { data: ranking, error: rankingError } =
    await supabase
      .from("ranking_snapshots")
      .select(`
        season_id,
        season:league_seasons!ranking_snapshots_season_id_fkey (
          league:leagues!league_seasons_league_id_fkey (
            slug
          )
        )
      `)
      .eq("id", rankingId)
      .maybeSingle();

  if (rankingError) {
    redirectWithError(
      errorPath,
      `No fue posible consultar la clasificación: ${rankingError.message}`,
    );
  }

  if (!ranking) {
    redirectWithError(
      errorPath,
      "La clasificación no existe.",
    );
  }

  const { data: participant, error: participantError } =
    await supabase
      .from("league_season_participants")
      .select("id, season_id")
      .eq("id", participantId)
      .maybeSingle();

  if (participantError) {
    redirectWithError(
      errorPath,
      `No fue posible consultar el participante: ${participantError.message}`,
    );
  }

  if (
    !participant ||
    participant.season_id !== ranking.season_id
  ) {
    redirectWithError(
      errorPath,
      "El participante no pertenece a esta temporada.",
    );
  }

  if (!isActive) {
    const { count, error: entryError } = await supabase
      .from("ranking_entries")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("snapshot_id", rankingId)
      .eq("participant_id", participantId);

    if (entryError) {
      redirectWithError(
        errorPath,
        `No fue posible consultar la posición: ${entryError.message}`,
      );
    }

    if ((count ?? 0) > 0) {
      redirectWithError(
        errorPath,
        "El participante tiene una posición registrada. Elimina primero su posición antes de desactivarlo.",
      );
    }
  }

  const { error } = await supabase
    .from("league_season_participants")
    .update({
      is_active: isActive,
      updated_by: user.id,
    })
    .eq("id", participantId);

  if (error) {
    redirectWithError(
      errorPath,
      `No fue posible actualizar al participante: ${error.message}`,
    );
  }

  const season = ranking.season as {
    league: {
      slug: string;
    } | null;
  } | null;

  revalidatePath(errorPath);
  revalidatePath(
    `/admin/rankings/${rankingId}/posiciones`,
  );
  revalidatePath(
    `/admin/rankings/${rankingId}/posiciones/nueva`,
  );
  revalidateRankingPaths(season?.league?.slug);

  redirect(`${errorPath}?updated=1`);
}