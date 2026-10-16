import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("countries")
    .select("id, name, slug, iso_code")
    .eq("is_active", true)
    .order("display_order");

  if (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error.message,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    status: "ok",
    countries: data,
  });
}