import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/auth/sign-in");
  }
  return <div className="min-h-screen bg-background">{children}</div>;
}

export default ProtectedLayout;
