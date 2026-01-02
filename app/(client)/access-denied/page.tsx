import AccessDeniedContent from "@/components/admin/AccessDeniedContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Access Denied - Admin Panel",
  description: "You don't have permission to access the admin panel",
};

export default function AccessDeniedPage() {
  return <AccessDeniedContent />;
}
