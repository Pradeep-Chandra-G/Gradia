import React from "react";

function PublicLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-amber-500">{children}</div>;
}

export default PublicLayout;
