import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import { ensureUserInDatabase } from "@/lib/sync-user";

async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/auth/sign-in");
  }

  // Ensure user exists in database
  try {
    await ensureUserInDatabase();
  } catch (error) {
    console.error("Failed to sync user:", error);
    // Continue anyway - webhook will handle it
  }

  return <div className="min-h-screen bg-background">{children}</div>;
}

export default ProtectedLayout;
