"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  canAccessEditorialPanel,
  getCurrentUser,
} from "@/features/auth/services/auth.service";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

type EventType = Database["public"]["Enums"]["event_type"];
type EventStatus = Database["public"]["Enums"]["event_status"];
type EditorialStatus =
  Database["public"]["Enums"]["editorial_status"];

const eventTypes: EventType[] = [
  "league_round",
  "qualifier",
  "regional",
  "national_final",
  "international_final",
  "tournament",
  "exhibition",
  "other",
];

const eventStatuses: EventStatus[] = [
  "scheduled",
  "live",
  "finished",
  "cancelled",
  "postponed",
];

const editorialStatuses: EditorialStatus[] = [
  "draft",
  "published",
  "archived",
];

function getRequiredString(formData: FormData, field: string) {
  const value = formData.get(field);

  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  return value.trim();
}

function getOptionalString(formData: FormData, field: string) {
  const value = formData.get(field);

  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  return value.trim();
}

function redirectWithError(path: string, message: string): never {
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

function getEventFormValues(
  formData: FormData,
  errorPath: string,
) {
  const title = getRequiredString(formData, "title");
  const slug = getRequiredString(formData, "slug");
  const countryId = getRequiredString(formData, "countryId");
  const city = getRequiredString(formData, "city");
  const startsAt = getRequiredString(formData, "startsAt");
  const timeZone = getRequiredString(formData, "timeZone");
  const eventType = getRequiredString(formData, "eventType");
  const eventStatus = getRequiredString(formData, "eventStatus");
  const editorialStatus = getRequiredString(
    formData,
    "editorialStatus",
  );

  if (
    !title ||
    !slug ||
    !countryId ||
    !city ||
    !startsAt ||
    !timeZone ||
    !eventType ||
    !eventStatus ||
    !editorialStatus
  ) {
    redirectWithError(
      errorPath,
      "Completa todos los campos obligatorios.",
    );
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    redirectWithError(
      errorPath,
      "El slug solo puede contener letras minúsculas, números y guiones.",
    );
  }

  if (!eventTypes.includes(eventType as EventType)) {
    redirectWithError(
      errorPath,
      "El tipo de evento no es válido.",
    );
  }

  if (!eventStatuses.includes(eventStatus as EventStatus)) {
    redirectWithError(
      errorPath,
      "El estado del evento no es válido.",
    );
  }

  if (
    !editorialStatuses.includes(
      editorialStatus as EditorialStatus,
    )
  ) {
    redirectWithError(
      errorPath,
      "El estado editorial no es válido.",
    );
  }

  const parsedStartsAt = new Date(startsAt);

  if (Number.isNaN(parsedStartsAt.getTime())) {
    redirectWithError(
      errorPath,
      "La fecha del evento no es válida.",
    );
  }

  return {
    title,
    slug,
    description: getOptionalString(formData, "description"),
    country_id: countryId,
    city,
    venue_name: getOptionalString(formData, "venueName"),
    starts_at: parsedStartsAt.toISOString(),
    time_zone: timeZone,
    event_type: eventType as EventType,
    event_status: eventStatus as EventStatus,
    editorial_status: editorialStatus as EditorialStatus,
    official_url: getOptionalString(formData, "officialUrl"),
  };
}

export async function createEvent(formData: FormData) {
  const user = await requireEditorialUser();
  const errorPath = "/admin/eventos/nuevo";
  const values = getEventFormValues(formData, errorPath);
  const supabase = await createClient();

  const { error } = await supabase.from("events").insert({
    ...values,
    created_by: user.id,
    updated_by: user.id,
    published_at:
      values.editorial_status === "published"
        ? new Date().toISOString()
        : null,
  });

  if (error) {
    if (error.code === "23505") {
      redirectWithError(
        errorPath,
        "Ya existe un evento con ese slug.",
      );
    }

    redirectWithError(
      errorPath,
      `No fue posible crear el evento: ${error.message}`,
    );
  }

  revalidatePath("/");
  revalidatePath("/eventos");
  revalidatePath("/admin/eventos");

  redirect("/admin/eventos?created=1");
}

export async function updateEvent(
  eventId: string,
  formData: FormData,
) {
  const user = await requireEditorialUser();
  const errorPath = `/admin/eventos/${eventId}/editar`;
  const values = getEventFormValues(formData, errorPath);
  const supabase = await createClient();

  const { data: currentEvent, error: currentEventError } =
    await supabase
      .from("events")
      .select("slug, published_at")
      .eq("id", eventId)
      .maybeSingle();

  if (currentEventError) {
    redirectWithError(
      errorPath,
      `No fue posible consultar el evento: ${currentEventError.message}`,
    );
  }

  if (!currentEvent) {
    redirectWithError(
      errorPath,
      "El evento ya no existe.",
    );
  }

  const { error } = await supabase
    .from("events")
    .update({
      ...values,
      updated_by: user.id,
      published_at:
        values.editorial_status === "published"
          ? currentEvent.published_at ??
            new Date().toISOString()
          : currentEvent.published_at,
    })
    .eq("id", eventId);

  if (error) {
    if (error.code === "23505") {
      redirectWithError(
        errorPath,
        "Ya existe otro evento con ese slug.",
      );
    }

    redirectWithError(
      errorPath,
      `No fue posible actualizar el evento: ${error.message}`,
    );
  }

  revalidatePath("/");
  revalidatePath("/eventos");
  revalidatePath(`/eventos/${currentEvent.slug}`);
  revalidatePath(`/eventos/${values.slug}`);
  revalidatePath("/admin/eventos");
  revalidatePath(errorPath);

  redirect("/admin/eventos?updated=1");
}

export async function archiveEvent(eventId: string) {
  const user = await requireEditorialUser();
  const errorPath = "/admin/eventos";
  const supabase = await createClient();

  const { data: event, error } = await supabase
    .from("events")
    .update({
      editorial_status: "archived",
      updated_by: user.id,
    })
    .eq("id", eventId)
    .select("slug")
    .maybeSingle();

  if (error) {
    redirectWithError(
      errorPath,
      `No fue posible archivar el evento: ${error.message}`,
    );
  }

  if (!event) {
    redirectWithError(
      errorPath,
      "El evento no existe o no tienes permisos para modificarlo.",
    );
  }

  revalidatePath("/");
  revalidatePath("/eventos");
  revalidatePath(`/eventos/${event.slug}`);
  revalidatePath("/admin/eventos");

  redirect("/admin/eventos?archived=1");
}