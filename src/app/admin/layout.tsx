import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import {
  canAccessEditorialPanel,
  getCurrentUser,
} from "@/features/auth/services/auth.service";

export const metadata: Metadata = {
  title: "Administración",
  robots: {
    index: false,
    follow: false,
  },
};

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({
  children,
}: AdminLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!canAccessEditorialPanel(user)) {
    redirect("/dashboard");
  }

  return children;
}