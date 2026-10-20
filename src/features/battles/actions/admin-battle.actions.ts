"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  canAccessEditorialPanel,
  getCurrentUser,
} from "@/features/auth/services/auth.service";
import { createClient } from "@/lib/supabase/server";

import type {
  BattleDecisionType,
  BattleEditorialStatus,
  BattleFormat,
  BattleStage,
  BattleStatus,
} from "../types/battle.types";

const battleStages: BattleStage[] = [
  "group_stage",
  "play_in",
  "round_of_32",
  "round_of_16",
  "quarterfinal",
  "semifinal",
  "third_place",
  "final",
  "regular_round",
  "exhibition",
  "other",
];

const battleFormats: BattleFormat[] = [
  "one_vs_one",
  "two_vs_two",
  "three_vs_three",
  "crew",
  "other",
];

const battleStatuses: BattleStatus[] = [
  "scheduled",
  "live",
  "finished",
  "cancelled",
  "postponed",
];

const decisionTypes: BattleDecisionType[] = [
  "direct",
  "replica",
  "jury",
  "technical",
  "walkover",
  "draw",
];

const editorialStatuses: BattleEditorialStatus[] = [
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

function getOptionalString(
  formData: FormData,
  field: string,
) {
  const value = formData.get(field);

  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  return value.trim();
}

function getPositiveInteger(
  formData: FormData,
  field: string,
) {
  const value = getRequiredString(formData, field);

  if (!value) {
    return null;
  }

  const parsedValue = Number(value);

  if (
    !Number.isInteger(parsedValue) ||
    parsedValue < 1
  ) {
    return null;
  }

  return parsedValue;
}

function getOptionalPositiveInteger(
  formData: FormData,
  field: string,
) {
  const value = getOptionalString(formData, field);

  if (!value) {
    return null;
  }

  const parsedValue = Number(value);

  if (
    !Number.isInteger(parsedValue) ||
    parsedValue < 1
  ) {
    return null;
  }

  return parsedValue;
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );
  } catch {
    return false;
  }
}

function redirectWithError(
  path: string,
  message: string,
): never {
  redirect(
    `${path}?error=${encodeURIComponent(message)}`,
  );
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

function getBattleFormValues(
  formData: FormData,
  errorPath: string,
) {
  const eventId = getRequiredString(
    formData,
    "eventId",
  );

  const seasonId = getOptionalString(
    formData,
    "seasonId",
  );

  const title = getRequiredString(
    formData,
    "title",
  );

  const slug = getRequiredString(
    formData,
    "slug",
  );

  const battleOrder = getPositiveInteger(
    formData,
    "battleOrder",
  );

  const stage = getRequiredString(
    formData,
    "stage",
  );

  const format = getRequiredString(
    formData,
    "format",
  );

  const status = getRequiredString(
    formData,
    "status",
  );

  const editorialStatus = getRequiredString(
    formData,
    "editorialStatus",
  );

  const winnerSide = getOptionalPositiveInteger(
    formData,
    "winnerSide",
  );

  const decisionType = getOptionalString(
    formData,
    "decisionType",
  );

  const sourceUrl = getRequiredString(
    formData,
    "sourceUrl",
  );

  const videoUrl = getOptionalString(
    formData,
    "videoUrl",
  );

  if (
    !eventId ||
    !title ||
    !slug ||
    battleOrder === null ||
    !stage ||
    !format ||
    !status ||
    !editorialStatus ||
    !sourceUrl
  ) {
    redirectWithError(
      errorPath,
      "Completa todos los campos obligatorios.",
    );
  }

  if (
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
  ) {
    redirectWithError(
      errorPath,
      "El slug solo puede contener letras minúsculas, números y guiones.",
    );
  }

  if (!battleStages.includes(stage as BattleStage)) {
    redirectWithError(
      errorPath,
      "La fase seleccionada no es válida.",
    );
  }

  if (!battleFormats.includes(format as BattleFormat)) {
    redirectWithError(
      errorPath,
      "El formato seleccionado no es válido.",
    );
  }

  if (!battleStatuses.includes(status as BattleStatus)) {
    redirectWithError(
      errorPath,
      "El estado de la batalla no es válido.",
    );
  }

  if (
    !editorialStatuses.includes(
      editorialStatus as BattleEditorialStatus,
    )
  ) {
    redirectWithError(
      errorPath,
      "El estado editorial no es válido.",
    );
  }

  if (
    decisionType &&
    !decisionTypes.includes(
      decisionType as BattleDecisionType,
    )
  ) {
    redirectWithError(
      errorPath,
      "El tipo de decisión no es válido.",
    );
  }

  if (!isHttpUrl(sourceUrl)) {
    redirectWithError(
      errorPath,
      "La URL de la fuente debe utilizar http o https.",
    );
  }

  if (videoUrl && !isHttpUrl(videoUrl)) {
    redirectWithError(
      errorPath,
      "La URL del video debe utilizar http o https.",
    );
  }

  if (
    status !== "finished" &&
    (winnerSide !== null || decisionType !== null)
  ) {
    redirectWithError(
      errorPath,
      "Solo una batalla finalizada puede tener un resultado.",
    );
  }

  if (status === "finished" && !decisionType) {
    redirectWithError(
      errorPath,
      "Selecciona el tipo de decisión de la batalla finalizada.",
    );
  }

  if (
    status === "finished" &&
    decisionType === "draw" &&
    winnerSide !== null
  ) {
    redirectWithError(
      errorPath,
      "Una batalla empatada no puede tener un lado ganador.",
    );
  }

  if (
    status === "finished" &&
    decisionType !== "draw" &&
    winnerSide === null
  ) {
    redirectWithError(
      errorPath,
      "Indica el lado ganador de la batalla.",
    );
  }

  return {
    eventId,
    seasonId,
    title,
    slug,
    battleOrder,
    stage: stage as BattleStage,
    format: format as BattleFormat,
    status: status as BattleStatus,
    editorialStatus:
      editorialStatus as BattleEditorialStatus,
    winnerSide,
    decisionType:
      decisionType as BattleDecisionType | null,
    sourceUrl,
    videoUrl,
  };
}

export async function createBattle(
  formData: FormData,
) {
  const user = await requireEditorialUser();
  const errorPath = "/admin/batallas/nueva";

  const values = getBattleFormValues(
    formData,
    errorPath,
  );

  const supabase = await createClient();

  const { data: event, error: eventError } =
    await supabase
      .from("events")
      .select("id")
      .eq("id", values.eventId)
      .neq("editorial_status", "archived")
      .maybeSingle();

  if (eventError) {
    redirectWithError(
      errorPath,
      `No fue posible consultar el evento: ${eventError.message}`,
    );
  }

  if (!event) {
    redirectWithError(
      errorPath,
      "El evento seleccionado no existe o está archivado.",
    );
  }

  if (values.seasonId) {
    const {
      data: eventSeason,
      error: eventSeasonError,
    } = await supabase
      .from("event_leagues")
      .select("event_id, season_id")
      .eq("event_id", values.eventId)
      .eq("season_id", values.seasonId)
      .maybeSingle();

    if (eventSeasonError) {
      redirectWithError(
        errorPath,
        `No fue posible validar la temporada: ${eventSeasonError.message}`,
      );
    }

    if (!eventSeason) {
      redirectWithError(
        errorPath,
        "La temporada seleccionada no pertenece al evento.",
      );
    }
  }

  const { error } = await supabase
    .from("battles")
    .insert({
      event_id: values.eventId,
      season_id: values.seasonId,
      title: values.title,
      slug: values.slug,
      battle_order: values.battleOrder,
      stage: values.stage,
      battle_format: values.format,
      battle_status: values.status,
      winner_side: values.winnerSide,
      decision_type: values.decisionType,
      video_url: values.videoUrl,
      source_url: values.sourceUrl,
      editorial_status: values.editorialStatus,
      published_at:
        values.editorialStatus === "published"
          ? new Date().toISOString()
          : null,
      created_by: user.id,
      updated_by: user.id,
    });

  if (error) {
    if (error.code === "23505") {
      redirectWithError(
        errorPath,
        "El slug ya está registrado o el orden ya está ocupado dentro del evento.",
      );
    }

    redirectWithError(
      errorPath,
      `No fue posible crear la batalla: ${error.message}`,
    );
  }

  revalidatePath("/");
  revalidatePath("/batallas");
  revalidatePath(`/batallas/${values.slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/batallas");

  redirect("/admin/batallas?created=1");
}