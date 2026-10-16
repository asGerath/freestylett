import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/services/auth.service";

type AuthLayoutProps = {
  children: ReactNode;
};

export default async function AuthLayout({
  children,
}: AuthLayoutProps) {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return children;
}