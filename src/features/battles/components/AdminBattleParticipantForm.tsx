import type {
  AdminBattleParticipantItem,
  AdminBattleParticipantOption,
  BattleFormat,
} from "../types/battle.types";

type AdminBattleParticipantFormProps = {
  participants: AdminBattleParticipantOption[];
  format: BattleFormat;
  formAction: (
    formData: FormData,
  ) => void | Promise<void>;
  initialValues?: AdminBattleParticipantItem;
  submitLabel?: string;
};

const inputStyles =
  "mt-2 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--color-primary)]";

export function AdminBattleParticipantForm({
  participants,
  format,
  formAction,
  initialValues,
  submitLabel,
}: AdminBattleParticipantFormProps) {
  const isEditing = Boolean(initialValues);

  const maximumSlots: Partial<
    Record<BattleFormat, number>
  > = {
    one_vs_one: 1,
    two_vs_two: 2,
    three_vs_three: 3,
  };

  const maximumSlot = maximumSlots[format];

  return (
    <form
      action={formAction}
      className="grid gap-4 md:grid-cols-[minmax(220px,2fr)_minmax(100px,1fr)_minmax(100px,1fr)_minmax(120px,1fr)_auto] md:items-end"
    >
      <label className="block">
        <span className="text-sm font-bold">
          Freestyler *
        </span>

        <select
          name="freestylerId"
          required
          defaultValue={
            initialValues?.freestylerId ?? ""
          }
          className={inputStyles}
        >
          <option value="" disabled>
            Selecciona un participante
          </option>

          {participants.map((participant) => (
            <option
              key={participant.freestylerId}
              value={participant.freestylerId}
            >
              {participant.stageName}
              {participant.country
                ? ` — ${participant.country}`
                : ""}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-bold">
          Lado *
        </span>

        <input
          type="number"
          name="sideNumber"
          required
          min={1}
          max={2}
          step={1}
          defaultValue={
            initialValues?.sideNumber ?? 1
          }
          className={inputStyles}
        />

        <span className="mt-2 block text-xs text-[var(--color-muted)]">
          Solamente lados 1 y 2.
        </span>
      </label>

      <label className="block">
        <span className="text-sm font-bold">
          Posición *
        </span>

        <input
          type="number"
          name="slotNumber"
          required
          min={1}
          max={maximumSlot}
          step={1}
          defaultValue={
            initialValues?.slotNumber ?? 1
          }
          className={inputStyles}
        />

        {maximumSlot !== undefined && (
          <span className="mt-2 block text-xs text-[var(--color-muted)]">
            Máximo {maximumSlot} por lado.
          </span>
        )}
      </label>

      <label className="block">
        <span className="text-sm font-bold">
          Puntuación
        </span>

        <input
          type="number"
          name="score"
          min={0}
          step="0.01"
          defaultValue={
            initialValues?.score ?? undefined
          }
          className={inputStyles}
          placeholder="Opcional"
        />
      </label>

      <button
        type="submit"
        className="cursor-pointer rounded-full bg-[var(--color-primary)] px-5 py-3 font-bold text-white transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
      >
        {submitLabel ??
          (isEditing
            ? "Guardar"
            : "Agregar participante")}
      </button>
    </form>
  );
}