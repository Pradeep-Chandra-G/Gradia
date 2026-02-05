import { auth } from "@clerk/nextjs/server";
import React from "react";

async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated) {
    return <div>Not authenticated!</div>;
  }
  return <div className="min-h-screen bg-background">{children}</div>;
}

export default ProtectedLayout;
