// Card visual de freestyler.
// Igual que EventCard, pero para perfiles.

import Link from "next/link";
import type { FreestylerItem } from "../types/freestyler.types";
import { Card } from "@/components/ui/Card";

type Props = {
  freestyler: FreestylerItem;
};

export function FreestylerCard({ freestyler }: Props) {
  return (
    <Link href={`/freestylers/${freestyler.slug}`} className="block">

      <Card>
        {/* Nombre */}
        <h3 className="text-xl font-bold">{freestyler.name}</h3>

        {/* País */}
        <p className="mt-2 text-sm text-gray-400">
          {freestyler.city}, {freestyler.country}
        </p>

      </Card>
    </Link>
  );
}