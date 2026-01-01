import React from "react";

export const dynamic = "force-dynamic";

export default function AdminRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
