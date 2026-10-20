"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { BattleFormat } from "../types/battle.types";

import {
    canAccessEditorialPanel,
    getCurrentUser,
} from "@/features/auth/services/auth.service";
import { createClient } from "@/lib/supabase/server";

type ParticipantValues = {
    freestylerId: string;
    sideNumber: number;
    slotNumber: number;
    score: number | null;
};

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

function getOptionalNonNegativeNumber(
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

    if (
        !Number.isFinite(parsedValue) ||
        parsedValue < 0
    ) {
        return null;
    }

    return parsedValue;
}

function redirectWithError(
    battleId: string,
    message: string,
): never {
    redirect(
        `/admin/batallas/${battleId}/participantes?error=${encodeURIComponent(
            message,
        )}`,
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

function getParticipantValues(
    battleId: string,
    formData: FormData,
): ParticipantValues {
    const freestylerId = getRequiredString(
        formData,
        "freestylerId",
    );

    const sideNumber = getPositiveInteger(
        formData,
        "sideNumber",
    );

    const slotNumber = getPositiveInteger(
        formData,
        "slotNumber",
    );

    const scoreValue = formData.get("score");

    const score = getOptionalNonNegativeNumber(
        formData,
        "score",
    );

    if (
        !freestylerId ||
        sideNumber === null ||
        slotNumber === null
    ) {
        redirectWithError(
            battleId,
            "Selecciona un participante e indica un lado y posición válidos.",
        );
    }

    if (
        typeof scoreValue === "string" &&
        scoreValue.trim() &&
        score === null
    ) {
        redirectWithError(
            battleId,
            "La puntuación debe ser un número igual o mayor que cero.",
        );
    }

    return {
        freestylerId,
        sideNumber,
        slotNumber,
        score,
    };
}

function getDatabaseErrorMessage(error: {
    code?: string;
    message: string;
    details?: string | null;
}) {
    const description =
        `${error.message} ${error.details ?? ""}`;

    if (
        description.includes(
            "battle_participants_freestyler_unique",
        )
    ) {
        return "Ese freestyler ya participa en la batalla.";
    }

    if (
        description.includes(
            "battle_participants_side_slot_unique",
        )
    ) {
        return "Esa posición ya está ocupada dentro del lado seleccionado.";
    }

    if (
        description.includes(
            "Battle participant must be registered as an event competitor",
        )
    ) {
        return "El freestyler no está registrado como competidor del evento.";
    }

    if (
        description.includes(
            "Battle participant must be active in the selected league season",
        )
    ) {
        return "El freestyler no está activo en la temporada de esta batalla.";
    }

    return `No fue posible guardar el participante: ${error.message}`;
}

function validateParticipantPlacement(
    battleId: string,
    format: BattleFormat,
    sideNumber: number,
    slotNumber: number,
) {
    if (sideNumber > 2) {
        redirectWithError(
            battleId,
            "Una batalla solo puede tener los lados 1 y 2.",
        );
    }

    const maximumSlots: Partial<
        Record<BattleFormat, number>
    > = {
        one_vs_one: 1,
        two_vs_two: 2,
        three_vs_three: 3,
    };

    const maximumSlot = maximumSlots[format];

    if (
        maximumSlot !== undefined &&
        slotNumber > maximumSlot
    ) {
        redirectWithError(
            battleId,
            `El formato de esta batalla permite un máximo de ${maximumSlot} participante${maximumSlot === 1 ? "" : "s"
            } por lado.`,
        );
    }
}

async function getBattleContext(
    battleId: string,
) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("battles")
        .select("id, slug, winner_side, battle_format",)
        .eq("id", battleId)
        .maybeSingle();

    if (error) {
        redirectWithError(
            battleId,
            `No fue posible consultar la batalla: ${error.message}`,
        );
    }

    if (!data) {
        redirectWithError(
            battleId,
            "La batalla ya no existe.",
        );
    }

    return {
        supabase,
        battle: data,
    };
}

function revalidateBattlePaths(
    battleId: string,
    slug: string,
) {
    revalidatePath("/");
    revalidatePath("/batallas");
    revalidatePath(`/batallas/${slug}`);
    revalidatePath("/admin/batallas");
    revalidatePath(
        `/admin/batallas/${battleId}/participantes`,
    );
}

export async function addBattleParticipant(
    battleId: string,
    formData: FormData,
) {
    const user = await requireEditorialUser();

    const values = getParticipantValues(
        battleId,
        formData,
    );

    const { supabase, battle } =
        await getBattleContext(battleId);

    const { error } = await supabase
        .from("battle_participants")
        .insert({
            battle_id: battleId,
            freestyler_id: values.freestylerId,
            side_number: values.sideNumber,
            slot_number: values.slotNumber,
            score: values.score,
            created_by: user.id,
            updated_by: user.id,
        });


    validateParticipantPlacement(
        battleId,
        battle.battle_format,
        values.sideNumber,
        values.slotNumber,
    );

    if (error) {
        redirectWithError(
            battleId,
            getDatabaseErrorMessage(error),
        );
    }

    revalidateBattlePaths(battleId, battle.slug);

    redirect(
        `/admin/batallas/${battleId}/participantes?added=1`,
    );
}

export async function updateBattleParticipant(
    battleId: string,
    participantId: string,
    formData: FormData,
) {
    const user = await requireEditorialUser();

    const values = getParticipantValues(
        battleId,
        formData,
    );

    const { supabase, battle } =
        await getBattleContext(battleId);

    const {
        data: currentParticipant,
        error: currentParticipantError,
    } = await supabase
        .from("battle_participants")
        .select("id, side_number")
        .eq("id", participantId)
        .eq("battle_id", battleId)
        .maybeSingle();

    validateParticipantPlacement(
        battleId,
        battle.battle_format,
        values.sideNumber,
        values.slotNumber,
    );

    if (currentParticipantError) {
        redirectWithError(
            battleId,
            `No fue posible consultar el participante: ${currentParticipantError.message}`,
        );
    }

    if (!currentParticipant) {
        redirectWithError(
            battleId,
            "El participante ya no existe en esta batalla.",
        );
    }

    if (
        battle.winner_side !== null &&
        currentParticipant.side_number ===
        battle.winner_side &&
        values.sideNumber !== battle.winner_side
    ) {
        const {
            count,
            error: winnerParticipantsError,
        } = await supabase
            .from("battle_participants")
            .select("id", {
                count: "exact",
                head: true,
            })
            .eq("battle_id", battleId)
            .eq("side_number", battle.winner_side)
            .neq("id", participantId);

        if (winnerParticipantsError) {
            redirectWithError(
                battleId,
                `No fue posible validar el lado ganador: ${winnerParticipantsError.message}`,
            );
        }

        if ((count ?? 0) === 0) {
            redirectWithError(
                battleId,
                "No puedes mover al último participante del lado ganador. Modifica primero el resultado de la batalla.",
            );
        }
    }

    const { data: participant, error } =
        await supabase
            .from("battle_participants")
            .update({
                freestyler_id: values.freestylerId,
                side_number: values.sideNumber,
                slot_number: values.slotNumber,
                score: values.score,
                updated_by: user.id,
            })
            .eq("id", participantId)
            .eq("battle_id", battleId)
            .select("id")
            .maybeSingle();

    if (error) {
        redirectWithError(
            battleId,
            getDatabaseErrorMessage(error),
        );
    }

    if (!participant) {
        redirectWithError(
            battleId,
            "El participante ya no existe en esta batalla.",
        );
    }

    revalidateBattlePaths(battleId, battle.slug);

    redirect(
        `/admin/batallas/${battleId}/participantes?updated=1`,
    );
}

export async function removeBattleParticipant(
    battleId: string,
    participantId: string,
) {
    await requireEditorialUser();

    const { supabase, battle } =
        await getBattleContext(battleId);

    const {
        data: currentParticipant,
        error: currentParticipantError,
    } = await supabase
        .from("battle_participants")
        .select("id, side_number")
        .eq("id", participantId)
        .eq("battle_id", battleId)
        .maybeSingle();

    if (currentParticipantError) {
        redirectWithError(
            battleId,
            `No fue posible consultar el participante: ${currentParticipantError.message}`,
        );
    }

    if (!currentParticipant) {
        redirectWithError(
            battleId,
            "El participante ya no existe en esta batalla.",
        );
    }

    if (
        battle.winner_side !== null &&
        currentParticipant.side_number ===
        battle.winner_side
    ) {
        const {
            count,
            error: winnerParticipantsError,
        } = await supabase
            .from("battle_participants")
            .select("id", {
                count: "exact",
                head: true,
            })
            .eq("battle_id", battleId)
            .eq("side_number", battle.winner_side)
            .neq("id", participantId);

        if (winnerParticipantsError) {
            redirectWithError(
                battleId,
                `No fue posible validar el lado ganador: ${winnerParticipantsError.message}`,
            );
        }

        if ((count ?? 0) === 0) {
            redirectWithError(
                battleId,
                "No puedes retirar al último participante del lado ganador. Modifica primero el resultado de la batalla.",
            );
        }
    }

    const { data: participant, error } =
        await supabase
            .from("battle_participants")
            .delete()
            .eq("id", participantId)
            .eq("battle_id", battleId)
            .select("id")
            .maybeSingle();

    if (error) {
        redirectWithError(
            battleId,
            `No fue posible retirar al participante: ${error.message}`,
        );
    }

    if (!participant) {
        redirectWithError(
            battleId,
            "El participante ya no existe en esta batalla.",
        );
    }

    revalidateBattlePaths(battleId, battle.slug);

    redirect(
        `/admin/batallas/${battleId}/participantes?removed=1`,
    );
}