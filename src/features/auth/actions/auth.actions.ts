"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function getRequiredString(formData: FormData, field: string) {
  const value = formData.get(field);

  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  return value.trim();
}

export async function signUp(formData: FormData) {
  const displayName = getRequiredString(formData, "displayName");
  const email = getRequiredString(formData, "email");
  const password = getRequiredString(formData, "password");

  if (!displayName || !email || !password) {
    redirect(
      `/registro?error=${encodeURIComponent("Completa todos los campos.")}`,
    );
  }

  if (password.length < 8) {
    redirect(
      `/registro?error=${encodeURIComponent(
        "La contraseña debe tener al menos 8 caracteres.",
      )}`,
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });

  if (error) {
    redirect(`/registro?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");

  if (!data.session) {
    redirect(
      `/login?message=${encodeURIComponent(
        "Revisa tu correo para confirmar la cuenta.",
      )}`,
    );
  }

  redirect("/dashboard");
}

export async function signIn(formData: FormData) {
  const email = getRequiredString(formData, "email");
  const password = getRequiredString(formData, "password");

  if (!email || !password) {
    redirect(
      `/login?error=${encodeURIComponent("Ingresa tu correo y contraseña.")}`,
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(
      `/login?error=${encodeURIComponent("Correo o contraseña incorrectos.")}`,
    );
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/login");
}